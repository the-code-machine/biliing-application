import {
  invoiceListQueryHandler,
  draftInvoiceListQueryHandler,
} from "@/action-handlers/query.handler";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/lib/types";
import { queryClient } from "@/providers/query.provider";
import { useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React from "react";
import InvoiceAction from "../invoice-actions/invoice-actions";
import PaginationProvider from "../paginationprovider/paginationprovider";

export function InvoiceTable({
  paginationStatus = true,
  status = "success", // default to "success"
}: {
  paginationStatus?: boolean;
  status?: "success" | "hold";
}) {
  const queryFn =
    status === "hold" ? draftInvoiceListQueryHandler : invoiceListQueryHandler;

  const customerListQuery = useInfiniteQuery({
    queryKey: ["/invoice/list", status],
    queryFn,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.pagination.totalPages > pages.length
        ? pages.length + 1
        : undefined;
    },
    getPreviousPageParam: (firstPage, pages) => {
      return pages.length > 1 ? pages.length - 1 : undefined;
    },
    initialPageParam: 1,
  });

  const pagination = React.useMemo(() => {
    const pagination = customerListQuery.data?.pages.map(
      (page) => page.pagination
    );
    if (!pagination) return null;
    return pagination[pagination?.length - 1];
  }, [customerListQuery.data]);

  const invoices = React.useMemo(() => {
    const list = customerListQuery.data
      ? customerListQuery.data.pages.flatMap((page) => page.data)
      : [];
    const startIndex = (pagination?.currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return list.slice(startIndex, endIndex);
  }, [customerListQuery.data]);

  return (
    <div className="min-h-96 flex flex-col justify-between">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Id</TableHead>
            <TableHead className="font-semibold">Customer</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Mobile Number</TableHead>
            <TableHead className="font-semibold">Address</TableHead>
            <TableHead className="font-semibold text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices?.map((invoice: Invoice) => (
            <TableRow key={`invoice-list-${invoice.id}`}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell className="font-medium">
                {invoice?.customer?.name}
              </TableCell>
              <TableCell className="font-medium">
                {format(invoice.createdAt, "PPP")}
              </TableCell>
              <TableCell>{invoice?.customer?.mobileNumber}</TableCell>
              <TableCell>{invoice?.customer?.address}</TableCell>
              <TableCell>
                <InvoiceAction invoice={invoice} status={status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {paginationStatus && (
        <PaginationProvider
          {...pagination}
          fetchNext={() => customerListQuery.fetchNextPage()}
          fetchPrev={() =>
            queryClient.setQueriesData(
              {
                queryKey: ["/invoice/list", status],
              },
              (data: any) => ({
                pages: data?.pages.slice(0, 1) ?? [],
                pageParams: data?.pageParams.slice(0, 1) ?? [],
              })
            )
          }
          hasNext={customerListQuery.hasNextPage}
          hasPrev={customerListQuery.hasPreviousPage}
          className="justify-end"
        />
      )}
    </div>
  );
}
