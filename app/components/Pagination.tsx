import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-4 flex justify-between">
      <button
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`p-2 rounded ${currentPage <= 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
      >
        ⬅ Prev
      </button>

      <span className="p-2">Page {currentPage} / {totalPages}</span>

      <button
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`p-2 rounded ${currentPage >= totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
      >
        Next ➡
      </button>
    </div>
  );
};

export default Pagination;
