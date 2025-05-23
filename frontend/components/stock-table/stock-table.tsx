import { stockPaginationQueryHandler } from "@/action-handlers/query.handler"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Stock } from "@/lib/types"
import { queryClient } from "@/providers/query.provider"
import { useInfiniteQuery } from "@tanstack/react-query"
import Image from "next/image"
import React from "react"
import PaginationProvider from "../paginationprovider/paginationprovider"
import StockAction from "../stock-action/stock-action"


export function StockTable({
    searchKey
}: {
    searchKey?: string
}) {
    const stockListQuery = useInfiniteQuery({
        queryKey: ["/stock/list"],
        queryFn: stockPaginationQueryHandler,
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
        const pagination = stockListQuery.data?.pages.map((page) => page.pagination);
        if (!pagination)
            return null;
        return pagination[pagination?.length - 1];
    }, [stockListQuery.data]);

    const stocks = React.useMemo(() => {
        const list: Stock[] = stockListQuery.data ? stockListQuery.data.pages.flatMap((product) => product.data) : [];
        console.log(list)
        return list.filter((stock) => stock?.product?.name?.toLowerCase().includes(searchKey?.toLocaleLowerCase() || ""))
    }, [stockListQuery.data, searchKey])
    return (
        <div className="min-h-96 flex flex-col justify-between"  >
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="font-semibold">Id</TableHead>
                        <TableHead className="font-semibold">Company</TableHead>
                        <TableHead className="font-semibold">Product Name</TableHead>
                        <TableHead className="font-semibold">Measurement</TableHead>
                        <TableHead className="font-semibold">Price</TableHead>
                        <TableHead className="font-semibold">Quantity</TableHead>
                        <TableHead className="font-semibold">Image</TableHead>
                        <TableHead className="font-semibold">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stocks?.map((stock) => (
                        <TableRow key={`stock-list-${stock.id}`}>
                            <TableCell className="font-medium">{stock.id}</TableCell>
                            <TableCell className="font-medium">{stock.product.company.name}</TableCell>
                            <TableCell className="font-medium">{stock.product.name}</TableCell>
                            <TableCell className="font-medium">{stock.product.measurement}</TableCell>
                            <TableCell className="font-medium">{stock.purchasePrice}</TableCell>
                            <TableCell className="font-medium">{stock.quantity}</TableCell>
                            <TableCell className="font-medium">
                                <Image
                                    src={`file://${stock.product.image.replace(/\\/g, '/')}`}
                                    alt={`Product-image-${stock.product.name}`}
                                    height={200}
                                    width={400}
                                    className="h-16 w-20 object-contain"
                                />
                            </TableCell>
                            <TableCell className="font-medium">
                                <StockAction stock={stock} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <PaginationProvider
                {...pagination}
                fetchNext={() => stockListQuery.fetchNextPage()}
                fetchPrev={() => queryClient.setQueriesData({
                    queryKey: ["/stock/list"]
                }, (data: any) => ({ pages: data?.pages.slice(0, 1) ?? [], pageParams: data?.pageParams.slice(0, 1) ?? [] }))}
                hasNext={stockListQuery.hasNextPage}
                hasPrev={stockListQuery.hasPreviousPage}
                className="justify-end"
            />
        </div>
    )
}

