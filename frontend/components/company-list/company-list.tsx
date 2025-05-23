import { companyListQueryHandler } from '@/action-handlers/query.handler';
import { Company } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CheckIcon } from 'lucide-react';
import React from 'react';
import { InView } from 'react-intersection-observer';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
export default function CompanyList({
    className,
    onSelect
}: {
    className?: string,
    onSelect: (company: Company) => void
}) {
    const [selectedCustomer, setSelectedCustomer] = React.useState<Company>()
    const customerListQuery = useInfiniteQuery({
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
    });

    const companys = React.useMemo(() => {
        return customerListQuery.data ? customerListQuery.data.pages.flatMap((page) => page.data) : [];
    }, [customerListQuery.data])
    return (
        <Command
            className={cn(className)}
        >
            <CommandInput placeholder="Search Customer..." />
            <CommandGroup>
                <CommandList>
                    {
                        companys?.map((company: Company) => (
                            <CommandItem
                                disabled={!company.status}
                                className='cursor-pointer flex justify-between'
                                onSelect={() => {
                                    onSelect(company)
                                    setSelectedCustomer(company);
                                }}
                            >
                                <p>{company.name}</p>
                                {company.id == selectedCustomer?.id && <CheckIcon className='h-4 w-4' />}
                            </CommandItem>
                        ))
                    }
                </CommandList>
            </CommandGroup>
            <InView
                className='text-center text-xs'
                as="div"
                onChange={(val) => customerListQuery.hasNextPage && customerListQuery.fetchNextPage()}
            >
                {customerListQuery.isLoading ? "Loading More" : "No More Company(s)"}
            </InView>
        </Command>
    );
}