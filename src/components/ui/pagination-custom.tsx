import React from "react";
import { ButtonCustom } from "./button-custom";

interface PaginationCustomProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  showItemsPerPage?: boolean;
  className?: string;
}

export const PaginationCustom: React.FC<PaginationCustomProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
  showItemsPerPage = true,
  className = "",
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {showItemsPerPage && (
        <div className="text-sm text-gray-600">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <ButtonCustom
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </ButtonCustom>

        <div className="flex items-center gap-1">
          {currentPage > 3 && (
            <>
              <ButtonCustom
                variant={currentPage === 1 ? "primary" : "outline"}
                size="sm"
                onClick={() => onPageChange(1)}
              >
                1
              </ButtonCustom>
              {currentPage > 4 && (
                <span className="px-2 text-gray-500">...</span>
              )}
            </>
          )}

          {getPageNumbers().map((page) => (
            <ButtonCustom
              key={page}
              variant={currentPage === page ? "primary" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </ButtonCustom>
          ))}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              <ButtonCustom
                variant={currentPage === totalPages ? "primary" : "outline"}
                size="sm"
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </ButtonCustom>
            </>
          )}
        </div>

        <ButtonCustom
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </ButtonCustom>
      </div>
    </div>
  );
};
