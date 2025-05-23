import { cn } from "@/lib/utils";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";


interface PaginationProps {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    fetchPrev: () => void;
    fetchNext: () => void;
    hasNext: boolean;
    hasPrev: boolean;
    className?: string;
}

export default function PaginationProvider(pagination: PaginationProps) {
    const { currentPage,  totalPages, fetchNext, fetchPrev, hasNext, hasPrev,className } = pagination;

    return (
        <Pagination
       className={cn(className)}
        >
            <PaginationContent>
                <PaginationItem
                    onClick={fetchPrev}
                >
                    <PaginationPrevious isActive={hasPrev}>
                        Previous
                    </PaginationPrevious>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink>
                        {currentPage} of {totalPages}
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem
                    onClick={fetchNext}
                    className="cursor-pointer"
                >
                    <PaginationNext isActive={hasNext}>
                        Next
                    </PaginationNext>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

