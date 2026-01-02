
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  fetchAttendanceRecords,
  fetchAmendRecords,
  fetchAppealRecords,
  fetchOverviewStats,
  fetchFilterOptions,

  type AttendanceTab,
  type Filters,
  type ApiResponse,

  type PaginationParams,
  type FilterOptions
} from '../utils/attendanceApi';

interface UseAttendanceDataOptions {
  skip?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

interface UseAttendanceDataReturn<T> {
  data: T[] | null;
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Stable stringify (sorted keys) so object identity changes don't trigger re-fetch loops.
 * Also handles nested objects/arrays.
 */
function stableStringify(value: any): string {
  const seen = new WeakSet();

  const sortRec = (v: any): any => {
    if (v === null || v === undefined) return v;
    if (typeof v !== 'object') return v;

    if (seen.has(v)) {
      // Prevent circular reference crash
      return '[Circular]';
    }
    seen.add(v);

    if (Array.isArray(v)) return v.map(sortRec);

    const keys = Object.keys(v).sort();
    const out: any = {};
    for (const k of keys) out[k] = sortRec(v[k]);
    return out;
  };

  return JSON.stringify(sortRec(value));
}

/**
 * Hook to fetch attendance data for a specific tab
 */
export function useAttendanceData<T = any>(
  tab: AttendanceTab,
  filters: Filters = {},
  page: number = 1,
  limit: number = 20,
  options: UseAttendanceDataOptions = {}
): UseAttendanceDataReturn<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);
  const requestSeqRef = useRef(0);

  const { skip = false, retryCount = 3, retryDelay = 1000 } = options;

  // Key that only changes when filters content changes (not object identity)
  const filtersKey = useMemo(() => stableStringify(filters), [filters]);

  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const abortInFlight = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const fetchData = useCallback(async () => {
    if (skip) return;

    // New fetch cycle: cancel previous request and pending retries
    clearRetryTimer();
    abortInFlight();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Sequence number to ignore late responses
    const seq = ++requestSeqRef.current;

    setIsFetching(true);
    setIsError(false);
    setError(null);

    try {
      let result: ApiResponse<T>;

      // Pass AbortController signal to API layer (must be supported there)
      const reqOptions = { page, limit, signal: controller.signal };

      switch (tab) {
        case 'attendance':
          result = await fetchAttendanceRecords(filters, reqOptions);
          break;
        case 'amend':
          result = await fetchAmendRecords(filters, reqOptions);
          break;
        case 'appeal':
          result = await fetchAppealRecords(filters, reqOptions);
          break;
        case 'overview':
          result = await fetchOverviewStats(filters, reqOptions);
          break;
        default:
          throw new Error(`Unknown tab: ${tab}`);
      }

      // If another request started after this one, ignore this result
      if (!isMountedRef.current || seq !== requestSeqRef.current) return;

      if (result.success) {
        setData(result.data || []);
        setTotal(result.total || 0);
        retryCountRef.current = 0;
      } else {
        throw new Error(result.error || 'Failed to fetch data');
      }
    } catch (err: any) {
      // Abort: do not set error and do not retry
      if (err?.name === 'AbortError') return;
      if (!isMountedRef.current) return;

      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      setIsError(true);

      // Retry logic (exponential backoff), but do not stack retries
      if (retryCountRef.current < retryCount) {
        retryCountRef.current += 1;

        const delay = retryDelay * Math.pow(2, retryCountRef.current - 1);
        retryTimerRef.current = setTimeout(() => {
          // Only retry if still mounted and not skipped
          if (isMountedRef.current && !skip) {
            fetchData();
          }
        }, delay);
      }
    } finally {
      // Only end fetching if still mounted and this is the latest request
      if (!isMountedRef.current) return;
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [
    tab,
    page,
    limit,
    skip,
    retryCount,
    retryDelay,
    filtersKey // important: stable key, not filters object identity
  ]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    return () => {
      isMountedRef.current = false;
      clearRetryTimer();
      abortInFlight();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    retryCountRef.current = 0;
    await fetchData();
  }, [fetchData]);

  return {
    data,
    total,
    isLoading,
    isFetching,
    isError,
    error,
    refetch
  };
}

/**
 * Hook to fetch filter options with caching
 */
export function useFilterOptions(
  type: string = 'all',
  companyId?: number | string,
  skip: boolean = false
) {
  const [options, setOptions] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const cacheRef = useRef<Map<string, { data: any; timestamp: number }>>(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  useEffect(() => {
    if (skip) return;

    let cancelled = false;

    const fetchOptions = async () => {
      try {
        const cacheKey = `${type}:${companyId || 'all'}`;
        const cached = cacheRef.current.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          if (!cancelled) {
            setOptions(cached.data);
            setIsLoading(false);
          }
          return;
        }

        if (!cancelled) setIsLoading(true);

        const { fetchFilterOptions } = await import('../utils/attendanceApi');
        const result = await fetchFilterOptions(type, companyId);

        if (!cancelled) {
          setOptions(result);
          cacheRef.current.set(cacheKey, { data: result, timestamp: Date.now() });
          setError(null);
        }
      } catch (err) {
        if (cancelled) return;
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        setOptions(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchOptions();

    return () => {
      cancelled = true;
    };
  }, [type, companyId, skip]);

  return { options, isLoading, error };
}
