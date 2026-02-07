import { useState, useEffect, useMemo } from "react";

export function usePagination(items, itemsPerPage = 6) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex],
  );

  useEffect(() => {
    // Only reset to page 1 if the items array length significantly changes (e.g. filtering)
    // to avoid resetting when just navigating or minor updates occur?
    // For now, consistent behavior: length change -> reset.
    // This assumes specific use case of filtering.
    setCurrentPage(1);
  }, [items.length]);

  const goToPage = (page) => {
    setCurrentPage((prev) => {
      const pageNumber = typeof page === "function" ? page(prev) : page;
      return Math.max(1, Math.min(pageNumber, totalPages));
    });
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    startIndex,
    endIndex,
    setCurrentPage: goToPage,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
