export type PaginationRangeItem = number | "ellipsis";

export const getPaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): PaginationRangeItem[] => {
  const safeTotalPages = Math.max(totalPages, 1);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);
  const totalVisibleNumbers = siblingCount * 2 + 5;

  if (safeTotalPages <= totalVisibleNumbers) {
    return Array.from({ length: safeTotalPages }, (_, index) => index + 1);
  }

  const leftSibling = Math.max(safeCurrentPage - siblingCount, 1);
  const rightSibling = Math.min(safeCurrentPage + siblingCount, safeTotalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < safeTotalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftItems = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, index) => index + 1
    );
    return [...leftItems, "ellipsis", safeTotalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightItems = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, index) => safeTotalPages - (3 + siblingCount * 2) + 1 + index
    );
    return [1, "ellipsis", ...rightItems];
  }

  const middleItems = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, index) => leftSibling + index
  );

  return [1, "ellipsis", ...middleItems, "ellipsis", safeTotalPages];
};
