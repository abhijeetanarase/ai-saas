import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Show max 5 page numbers, with ... if needed
  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);
  if (currentPage <= 2) end = Math.min(5, totalPages);
  if (currentPage >= totalPages - 1) start = Math.max(1, totalPages - 4);

  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="flex items-center justify-center gap-2 mt-6 select-none">
      <button
        className="px-3 py-1 rounded-lg border bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {start > 1 && (
        <button
          className="px-3 py-1 rounded-lg border bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 cursor-default"
          disabled
        >
          ...
        </button>
      )}
      {pages.map((page) => (
        <button
          key={page}
          className={`px-3 py-1 rounded-lg border ${
            page === currentPage
              ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
              : 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700'
          }`}
          onClick={() => onPageChange(page)}
          disabled={page === currentPage}
        >
          {page}
        </button>
      ))}
      {end < totalPages && (
        <button
          className="px-3 py-1 rounded-lg border bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700 cursor-default"
          disabled
        >
          ...
        </button>
      )}
      <button
        className="px-3 py-1 rounded-lg border bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-gray-200 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
}; 