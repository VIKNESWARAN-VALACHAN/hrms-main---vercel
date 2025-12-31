// import React from 'react';

// const TableSkeleton = ({ columns, rows = 5 }: { columns: { header: string }[]; rows?: number }) => (
//     <>
//         {[...Array(rows)].map((_, i) => (
//             <tr key={i} className="animate-pulse">
//                 {columns.map((col, j) => (
//                     <td key={j} className="px-4 py-3">
//                         <div className="h-4 bg-base-300 rounded w-3/4"></div>
//                     </td>
//                 ))}
//             </tr>
//         ))}
//     </>
// );

// export const Table = ({ columns, data, isLoading }) => {
//     const getCellValue = (row, accessor) => {
//         if (typeof accessor === 'function') {
//             return accessor(row);
//         }
//         return accessor.split('.').reduce((obj, key) => (obj ? obj[key] : null), row);
//     };

//     return (
//         <table className="table table-zebra w-full">
//             <thead>
//                 <tr>
//                     {columns.map((col, index) => (
//                         <th key={index}>{col.header}</th>
//                     ))}
//                 </tr>
//             </thead>
//             <tbody>
//                 {isLoading ? (
//                     <TableSkeleton columns={columns} />
//                 ) : (
//                     data.map((row, rowIndex) => (
//                         <tr key={row.id || rowIndex}>
//                             {columns.map((col, colIndex) => (
//                                 <td key={colIndex}>
//                                     {col.cell ? col.cell(getCellValue(row, col.accessor)) : getCellValue(row, col.accessor)}
//                                 </td>
//                             ))}
//                         </tr>
//                     ))
//                 )}
//             </tbody>
//         </table>
//     );
// };

'use client';

import React from 'react';

type AccessorFn<T> = (row: T) => unknown;

export type ColumnDef<T extends Record<string, unknown>> = {
  header: string;
  accessor: keyof T | string | AccessorFn<T>;
  cell?: (value: unknown, row: T) => React.ReactNode;
  className?: string;
};

type TableSkeletonProps = {
  columns: { header: string }[];
  rows?: number;
};

const TableSkeleton: React.FC<TableSkeletonProps> = ({ columns, rows = 5 }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i} className="animate-pulse">
        {columns.map((_, j) => (
          <td key={j} className="px-4 py-3">
            <div className="h-4 bg-base-300 rounded w-3/4" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export type TableProps<T extends Record<string, unknown>> = {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  skeletonRows?: number;
  rowKey?: (row: T, index: number) => React.Key;
};

function getByPath(obj: unknown, path: string): unknown {
  if (!obj || typeof obj !== 'object') return null;

  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return null;
  }, obj);
}

export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading = false,
  skeletonRows = 5,
  rowKey,
}: TableProps<T>) {
  const getCellValue = (row: T, accessor: ColumnDef<T>['accessor']): unknown => {
    if (typeof accessor === 'function') return accessor(row);
    if (typeof accessor === 'string') {
      // supports "a.b.c" paths or simple keys
      return accessor.includes('.') ? getByPath(row, accessor) : (row as Record<string, unknown>)[accessor];
    }
    // keyof T
    return row[accessor] as unknown;
  };

  return (
    <table className="table table-zebra w-full">
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col.header}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {isLoading ? (
          <TableSkeleton columns={columns} rows={skeletonRows} />
        ) : (
          data.map((row, rowIndex) => (
            <tr key={rowKey ? rowKey(row, rowIndex) : ((row as { id?: React.Key }).id ?? rowIndex)}>
              {columns.map((col, colIndex) => {
                const value = getCellValue(row, col.accessor);
                return (
                  <td key={colIndex} className={col.className}>
                    {col.cell ? col.cell(value, row) : String(value ?? '')}
                  </td>
                );
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
