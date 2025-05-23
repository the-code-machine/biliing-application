import { updateProductMutationHandler } from "@/action-handlers/mutation.handlers"
import { productListPaginationQueryHandler } from "@/action-handlers/query.handler"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Product } from "@/lib/types"
import { queryClient } from "@/providers/query.provider"
import { useInfiniteQuery } from "@tanstack/react-query"
import React from "react"
import useSWRMutation from "swr/mutation"
import PaginationProvider from "../paginationprovider/paginationprovider"
import ProductAction from "../product-action/product-action"
import { Switch } from "../ui/switch"


export function ProductTable({
  searchKey
}: {
  searchKey?: string
}) {
  const productListQuery = useInfiniteQuery({
    queryKey: ["/product/list"],
    queryFn: productListPaginationQueryHandler,
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

  const updateProductMutation = useSWRMutation("/product/list", async (_, { arg }: { arg: Product }) => {
    updateProductMutationHandler({ ...arg, status: !arg.status, description: arg.description as string, companyId: arg.company });
  })
  const pagination = React.useMemo(() => {
    const pagination = productListQuery.data?.pages.map((page) => page.pagination);
    if (!pagination)
      return null;
    return pagination[pagination?.length - 1];
  }, [productListQuery.data]);

  const products = React.useMemo(() => {
    const list: Product[] = productListQuery.data ? productListQuery.data.pages.flatMap((product) => product.data) : [];
    const startIndex = (pagination?.currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return list.slice(startIndex, endIndex).filter((product) => product?.name?.toLowerCase().includes(searchKey?.toLocaleLowerCase() || "") || product?.company?.name?.toLowerCase().includes(searchKey?.toLowerCase() || ""))
  }, [productListQuery.data, searchKey, pagination]);
  return (
    <div className="min-h-96 flex flex-col justify-between" >
      <Table
      >
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Product Name</TableHead>
            <TableHead className="font-semibold">Company</TableHead>
            <TableHead className="font-semibold">Quantity</TableHead>
            <TableHead className="font-semibold">Measurement</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody
        >
          {products?.map((product: Product) => (
            <TableRow key={`company-list-${product.id}-${product.name}`}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="font-medium">{product.company.name}</TableCell>
              <TableCell className="font-medium">{product.stock}</TableCell>
              <TableCell className="font-medium">{product.measurement}</TableCell>
              <TableCell>
                <Switch
                  onCheckedChange={(status) => updateProductMutation.trigger({ ...product, status: status })}
                  checked={product.status}
                  defaultChecked={true}
                  />
              </TableCell>
              <TableCell className="text-right">
                <ProductAction product={product} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationProvider {...pagination}
        fetchNext={() => productListQuery.fetchNextPage()}
        fetchPrev={() => queryClient.setQueriesData({
          queryKey: ["/product/list"]
        }, (data: any) => ({ pages: data?.pages.slice(0, 1) ?? [], pageParams: data?.pageParams.slice(0, 1) ?? [] }))}
        hasNext={productListQuery.hasNextPage}
        hasPrev={productListQuery.hasPreviousPage}
        className="justify-end"
      />
    </div>
  )
}

