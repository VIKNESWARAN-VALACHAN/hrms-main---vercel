// import React from 'react';

// export const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
//     const totalPages = Math.ceil(totalItems / itemsPerPage);

//     if (totalPages <= 1) {
//         return null;
//     }

//     const handlePageChange = (page) => {
//         if (page >= 1 && page <= totalPages) {
//             onPageChange(page);
//         }
//     };

//     const renderPageNumbers = () => {
//         const pageNumbers = [];
//         const maxPagesToShow = 5;
//         let startPage, endPage;

//         if (totalPages <= maxPagesToShow) {
//             startPage = 1;
//             endPage = totalPages;
//         } else {
//             if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
//                 startPage = 1;
//                 endPage = maxPagesToShow;
//             } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
//                 startPage = totalPages - maxPagesToShow + 1;
//                 endPage = totalPages;
//             } else {
//                 startPage = currentPage - Math.floor(maxPagesToShow / 2);
//                 endPage = currentPage + Math.floor(maxPagesToShow / 2);
//             }
//         }

//         for (let i = startPage; i <= endPage; i++) {
//             pageNumbers.push(
//                 <button 
//                     key={i} 
//                     className={`join-item btn ${i === currentPage ? 'btn-active' : ''}`}
//                     onClick={() => handlePageChange(i)}
//                 >
//                     {i}
//                 </button>
//             );
//         }
//         return pageNumbers;
//     };

//     return (
//         <div className="flex justify-center items-center mt-4">
//             <div className="join">
//                 <button 
//                     className="join-item btn"
//                     onClick={() => handlePageChange(1)}
//                     disabled={currentPage === 1}
//                 >
//                     «
//                 </button>
//                 <button 
//                     className="join-item btn"
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                 >
//                     ‹
//                 </button>
                
//                 {renderPageNumbers()}

//                 <button 
//                     className="join-item btn"
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                 >
//                     ›
//                 </button>
//                 <button 
//                     className="join-item btn"
//                     onClick={() => handlePageChange(totalPages)}
//                     disabled={currentPage === totalPages}
//                 >
//                     »
//                 </button>
//             </div>
//         </div>
//     );
// };

import React from 'react';

export type PaginationProps = {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  maxPagesToShow?: number; // optional, default 5
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxPagesToShow = 5,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = (): React.ReactNode[] => {
    const pageNumbers: React.ReactNode[] = [];
    let startPage: number;
    let endPage: number;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const half = Math.floor(maxPagesToShow / 2);

      if (currentPage <= Math.ceil(maxPagesToShow / 2)) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + half >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - half;
        endPage = currentPage + half;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`join-item btn ${i === currentPage ? 'btn-active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="join">
        <button
          className="join-item btn"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          «
        </button>
        <button
          className="join-item btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </button>

        {renderPageNumbers()}

        <button
          className="join-item btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          ›
        </button>
        <button
          className="join-item btn"
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </div>
  );
};
