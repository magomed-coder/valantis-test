import { useMemo } from "react";

interface UsePaginationProps {
  totalCount: number;
  pageSize: number;
  siblingCount?: number;
  currentPage: number;
}

type PaginationRange = (number | typeof DOTS)[];

export const DOTS: string = "....";

export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage,
}: UsePaginationProps): PaginationRange => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      Case 1:
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]

      Scenario 1: Total Page Numbers Less Than or Equal to Displayed Page Numbers
      Total pages: 7
      Displayed page numbers: 10
      Output: [1, 2, 3, 4, 5, 6, 7]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    /*
    	Calculate left and right sibling index and make sure they are within range 1 and totalPageCount
    */
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not show dots just when there is just one page number to be inserted between the extremes of sibling and the page limits i.e 1 and totalPageCount. Hence we are using leftSiblingIndex > 2 and rightSiblingIndex < totalPageCount - 2
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    /*
    	Case 2: No left dots to show, but rights dots to be shown

      Scenario 2: No Left Dots, but Right Dots to be Shown
      When the number of total pages is greater than the desired display, and there are no dots on the left side, but dots are needed on the right side.

      Total pages: 20
      Displayed page numbers: 10
      Current page: 5
      Output: [1, 2, 3, 4, 5, "...", 20]
    */
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 1 * siblingCount;
      const leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    /*
    	Case 3: No right dots to show, but left dots to be shown
      Scenario 3: No Right Dots, but Left Dots to be Shown
      Similar to Scenario 2, but no dots on the right side, and dots needed on the left side.

      Total pages: 20
      Displayed page numbers: 10
      Current page: 16
      Output: [1, "...", 16, 17, 18, 19, 20]
    */
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 1 * siblingCount;
      const rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    /*
    	Case 4: Both left and right dots to be shown
      Scenario 4: Both Left and Right Dots to be Shown
      When both left and right dots are needed to represent the pagination range.

      Total pages: 20
      Displayed page numbers: 10
      Current page: 8
      Output: [1, "...", 6, 7, 8, 9, 10, "...", 20]
    */
    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    /*
      Case 5: Fallback - return an empty array when no condition is met
    */
    return [];
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};

const range = (start: number, end: number): number[] => {
  const length = end - start + 1;
  /*
  	Create an array of certain length and set the elements within it from
    start value to end value.
  */
  return Array.from({ length }, (_, idx) => idx + start);
};
