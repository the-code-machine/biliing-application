import { cashInvoicePaginationQueryHandler } from "@/action-handlers/query.handler"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CashInvoice } from "@/lib/types"
import { queryClient } from "@/providers/query.provider"
import { useInfiniteQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import React from "react"
import CashInvoiceAction from "../cash-invoice-actions/cash-invoice-actions"
import PaginationProvider from "../paginationprovider/paginationprovider"


export function CashInvoiceTable({
    searchkey
}: {
    searchkey?: string
}) {

    const cashInvoiceListQuery = useInfiniteQuery({
        queryKey: ["/cash-invoice/list"],
        queryFn: cashInvoicePaginationQueryHandler,
        getNextPageParam: (lastPage, pages) => {
            return lastPage.pagination.totalPages > pages.length
                ? pages.length + 1
                : undefined;
        },
        getPreviousPageParam: (firstPage, pages) => {
            return pages.length > 1 ? pages.length - 1 : undefined;
          },
        initialPageParam: 1
    });
    const pagination = React.useMemo(() => {
        const pagination = cashInvoiceListQuery.data?.pages.map((page) => page.pagination);
        if (!pagination)
            return null;
        return pagination[pagination?.length - 1];
    }, [cashInvoiceListQuery.data]);
    
    const cashInvoiceList = React.useMemo(() => {
        const list: CashInvoice[] = cashInvoiceListQuery.data ? cashInvoiceListQuery.data.pages.flatMap((page) => page.invoices) : [];
        const startIndex = (pagination?.currentPage - 1) * 10;
        const endIndex = startIndex + 10;
        return list.slice(startIndex, endIndex).filter((cashInvoice) => cashInvoice?.customer?.name?.toLocaleLowerCase().includes(searchkey?.toLocaleLowerCase() || ""));
    }, [cashInvoiceListQuery.data, searchkey])
    return (
        <div className="min-h-96 flex flex-col justify-between" >
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
                    {cashInvoiceList?.map((cashInvoice: CashInvoice) => (
                        <TableRow key={`cash-invoice-list-${cashInvoice.id}`}>
                            <TableCell className="font-medium">{cashInvoice.id}</TableCell>
                            <TableCell className="font-medium">{cashInvoice?.customer?.name}</TableCell>
                            <TableCell className="font-medium">{format(cashInvoice.date, "PPP")}</TableCell>
                            <TableCell>
                                {cashInvoice?.customer?.mobileNumber}
                            </TableCell>
                            <TableCell>
                                {cashInvoice?.customer?.address}
                            </TableCell>
                            <TableCell className="text-right">
                                 <CashInvoiceAction cashInvoice={cashInvoice} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <PaginationProvider {...pagination}
                fetchNext={() => cashInvoiceListQuery.fetchNextPage()}
                fetchPrev={() => queryClient.setQueriesData({
                    queryKey: ["/cash-invoice/list"]
                }, (data: any) => ({ pages: data?.pages.slice(0, 1) ?? [], pageParams: data?.pageParams.slice(0, 1) ?? [] }))}
                hasNext={cashInvoiceListQuery.hasNextPage}
                hasPrev={cashInvoiceListQuery.hasPreviousPage}
                className="justify-end"
            />
        </div>
    )
}

