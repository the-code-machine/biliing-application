import { customerListQueryHandler } from "@/action-handlers/query.handler"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Customer } from "@/lib/types"
import { queryClient } from "@/providers/query.provider"
import { useInfiniteQuery } from "@tanstack/react-query"
import React from "react"
import CustomerActions from "../customer-actions/customer-actions"
import PaginationProvider from "../paginationprovider/paginationprovider"


export function CustomerTable({
    searchKey
}: {
    searchKey: string
}) {
    const customerListQuery = useInfiniteQuery({
        queryKey: ["/customer/list"],
        queryFn: customerListQueryHandler,
        getNextPageParam: (lastPage, pages) => {
            return lastPage.pagination.totalPages > pages.length
                ? pages.length + 1
                : undefined;
        },
        initialPageParam: 1
    });

    const pagination = React.useMemo(() => {
        const pagination = customerListQuery.data?.pages.map((page) => page.pagination);
        if (!pagination)
            return null;
        return pagination[pagination?.length - 1];
    }, [customerListQuery.data]);

    const customers = React.useMemo(() => {
        const list = customerListQuery.data ? customerListQuery.data.pages.flatMap((page) => page.data) : [];
        return list.filter((customer: Customer) => customer.name.includes(searchKey) || customer.mobileNumber.includes(searchKey))
    }, [customerListQuery.data, searchKey])
    return (
        <div  className="min-h-96 flex flex-col justify-between" >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Phone Number</TableHead>
                        <TableHead className="font-semibold">Address</TableHead>
                        <TableHead className="font-semibold text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {customers?.map((customer: Customer) => (
                        <TableRow key={`customer-list-${customer.id}-${customer.name}`}>
                            <TableCell className="font-medium">{customer.name}</TableCell>
                            <TableCell>
                                {customer.mobileNumber}
                            </TableCell>
                            <TableCell>
                                {customer.address}
                            </TableCell>
                            <TableCell className="text-right">
                                <CustomerActions customer={customer} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <PaginationProvider {...pagination}
                fetchNext={() => customerListQuery.fetchNextPage()}
                fetchPrev={() => queryClient.setQueriesData({
                    queryKey: ["/customer/list"]
                }, (data: any) => ({ pages: data?.pages.slice(0, 1) ?? [], pageParams: data?.pageParams.slice(0, 1) ?? [] }))}
                hasNext={customerListQuery.hasNextPage}
                hasPrev={customerListQuery.hasPreviousPage}
                className="justify-end"
            />
        </div>
    )
}

