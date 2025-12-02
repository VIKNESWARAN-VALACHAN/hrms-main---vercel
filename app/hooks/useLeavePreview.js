import { useState } from 'react';
import { API_BASE_URL } from '../config';

/**
 * @typedef {Object} CalculationBreakdown
 * @property {number} total_work_days
 * @property {number} holidays_excluded
 * @property {number} actual_working_days
 */

/**
 * @typedef {Object} Calculation
 * @property {number} duration
 * @property {CalculationBreakdown} [breakdown]
 */

/**
 * @typedef {Object} Balance
 * @property {number} available
 * @property {boolean} sufficient
 */

/**
 * @typedef {Object} Validation
 * @property {boolean} has_sufficient_balance
 * @property {boolean} has_overlapping_leaves
 * @property {boolean} requires_documentation
 */

/**
 * @typedef {Object} LeavePreviewResponse
 * @property {Calculation} [calculation]
 * @property {Balance} [balance]
 * @property {Validation} [validation]
 * @property {boolean} can_proceed
 */

/**
 * @typedef {Object} PreviewRequestData
 * @property {number} employee_id
 * @property {number} leave_type_id
 * @property {string} start_date
 * @property {string} end_date
 * @property {boolean} is_half_day
 * @property {number} [exclude_leave_id]
 */

/**
 * Custom hook for leave preview calculations
 * @returns {{
 *   previewData: LeavePreviewResponse | null,
 *   isLoadingPreview: boolean,
 *   previewError: string | null,
 *   calculateLeavePreview: (data: PreviewRequestData) => Promise<LeavePreviewResponse | null>,
 *   clearPreview: () => void
 * }}
 */
export const useLeavePreview = () => {
    /** @type {[LeavePreviewResponse | null, Function]} */
    const [previewData, setPreviewData] = useState(null);
    /** @type {[boolean, Function]} */
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);
    /** @type {[string | null, Function]} */
    const [previewError, setPreviewError] = useState(null);

    /**
     * Calculate leave preview
     * @param {PreviewRequestData} previewData
     * @returns {Promise<LeavePreviewResponse | null>}
     */
    // const calculateLeavePreview = async (previewData) => {
    //     setIsLoadingPreview(true);
    //     setPreviewError(null);
        
    //     try {
    //         const response = await fetch(`${API_BASE_URL}/api/v1/leaves/preview-calculation`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(previewData),
    //         });

    //         const result = await response.json();

    //         if (result.success) {
    //             setPreviewData(result.data);
    //             return result.data;
    //         } else {
    //             setPreviewError(result.error);
    //             return null;
    //         }
    //     } catch (error) {
    //         setPreviewError('Failed to calculate leave preview');
    //         console.error('Error calculating leave preview:', error);
    //         return null;
    //     } finally {
    //         setIsLoadingPreview(false);
    //     }
    // };

const calculateLeavePreview = async (previewData) => {
  setIsLoadingPreview(true);
  setPreviewError(null);
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/leaves/preview-calculation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(previewData),
    });

    const result = await response.json();

    if (result.success) {
      setPreviewData(result.data);
      return result.data;
    } else {
      setPreviewError(result.error);
      return null;
    }
  } catch (error) {
    setPreviewError('Failed to calculate leave preview');
    console.error('Error calculating leave preview:', error);
    return null;
  } finally {
    setIsLoadingPreview(false);
  }
};

    const clearPreview = () => {
        setPreviewData(null);
        setPreviewError(null);
    };

    return {
        previewData,
        isLoadingPreview,
        previewError,
        calculateLeavePreview,
        clearPreview
    };
};
