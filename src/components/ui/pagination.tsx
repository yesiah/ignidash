import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';

import { Button } from '@/components/catalyst/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: PaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <nav aria-label="Pagination" className="mx-4 my-2 flex items-center justify-between">
      <div className="hidden sm:block">
        <p className="text-muted-foreground text-sm">
          Showing <span className="font-extrabold">{startItem}</span> to <span className="font-extrabold">{endItem}</span> of{' '}
          <span className="font-extrabold">{totalItems}</span> results
        </p>
      </div>
      <div className="flex flex-1 items-center justify-between sm:justify-end sm:gap-2">
        <Button onClick={() => onPageChange(currentPage - 1)} plain disabled={currentPage === 1}>
          <ArrowLongLeftIcon className="h-5 w-5" />
          Previous
        </Button>
        <div className="block sm:hidden">
          <p className="text-muted-foreground text-sm whitespace-nowrap">
            <span className="font-extrabold" aria-hidden="true">
              {currentPage}
            </span>
            <span className="mx-1" aria-hidden="true">
              |
            </span>
            <span className="font-extrabold" aria-hidden="true">
              {totalPages}
            </span>
            <span className="sr-only">
              Page {currentPage} of {totalPages}
            </span>
          </p>
        </div>
        <Button onClick={() => onPageChange(currentPage + 1)} plain disabled={currentPage === totalPages}>
          Next
          <ArrowLongRightIcon className="h-5 w-5" />
        </Button>
      </div>
    </nav>
  );
}
