import { updateCompanyMutationHandler } from "@/action-handlers/mutation.handlers"
import { companyListQueryHandler } from "@/action-handlers/query.handler"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Company } from "@/lib/types"
import { queryClient } from "@/providers/query.provider"
import { useInfiniteQuery } from "@tanstack/react-query"
import React from "react"
import useSWRMutation from "swr/mutation"
import CompanyAction from "../company-action/company-action"
import PaginationProvider from "../paginationprovider/paginationprovider"
import { Switch } from "../ui/switch"


export function CompanyTable({
  searchKey
}: {
  searchKey: string
}) {
  const companyListQuery = useInfiniteQuery({
    queryKey: ["/company/list"],
    queryFn: companyListQueryHandler,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.pagination.totalPages > pages.length
        ? pages.length + 1
        : undefined;
    },
    getPreviousPageParam: (firstPage, pages) => {
      return pages.length > 1 ? pages.length - 1 : undefined;
    },
    initialPageParam: 1

  })
  const updateCompanyMutation = useSWRMutation("/company/list", async (_, { arg }: { arg: Company }) => {
    updateCompanyMutationHandler(arg)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/company/list"]
      })
    }
  })
  const pagination = React.useMemo(() => {
    const pagination = companyListQuery.data?.pages.map((page) => page.pagination);
    if (!pagination)
      return null;
    return pagination[pagination?.length - 1];
  }, [companyListQuery.data]);

  const companys = React.useMemo(() => {
    const list = companyListQuery.data ? companyListQuery.data.pages.flatMap((page) => page.data) : [];
    const startIndex = (pagination?.currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    return list.slice(startIndex, endIndex)?.filter((company) => company?.name?.toLowerCase().includes(searchKey.toLowerCase() || ""))
  }, [companyListQuery.data, searchKey])
  return (
    <div className="min-h-96 h-full flex flex-col justify-between" >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companys.map((company:Company) => (
            <TableRow key={`company-list-${company.id}-${company.name}`}>
              <TableCell className="font-medium">{company.name}</TableCell>
              <TableCell>
                <Switch
                  onCheckedChange={(status) => updateCompanyMutation.trigger({ ...company, status: status })}
                  checked={company.status} />
              </TableCell>
              <TableCell className="text-right">
                <CompanyAction
                  company={company}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationProvider {...pagination}
        fetchNext={() => companyListQuery.fetchNextPage()}
        fetchPrev={() => queryClient.setQueriesData({
          queryKey: ["/company/list"]
        }, (data: any) => ({ pages: data?.pages.slice(0, 1) ?? [], pageParams: data?.pageParams.slice(0, 1) ?? [] }))}
        hasNext={companyListQuery.hasNextPage}
        hasPrev={companyListQuery.hasPreviousPage}
        className="justify-end"
      />
    </div>
  )
}

