import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DOTS, usePagination } from "@/hooks/usePagination";

interface PaginationProps {
  onPageChange: (pageNumber: number) => void;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  siblingCount?: number;
}

const PaginationPoducts: React.FC<PaginationProps> = ({
  onPageChange,
  totalCount,
  currentPage,
  pageSize,
  siblingCount = 1,
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // Ensure paginationRange is defined before proceeding
  if (!paginationRange || currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  // const lastPage = paginationRange[paginationRange.length - 1];
  // console.log(paginationRange, "paginationRange");

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={onPrevious} />
        </PaginationItem>

        {paginationRange.map((pageNumber, idx) => (
          <PaginationItem key={idx}>
            {pageNumber === DOTS ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={() => onPageChange(+pageNumber)}
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext href="#" onClick={onNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationPoducts;
