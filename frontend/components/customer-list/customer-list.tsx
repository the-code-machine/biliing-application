import { customerListQueryHandler } from '@/action-handlers/query.handler';
import { Customer } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CheckIcon } from 'lucide-react';
import React from 'react';
import { InView } from 'react-intersection-observer';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

export default function CustomerList({
    className,
    onSelect
}: {
    className?: string,
    onSelect: (customer: Customer) => void
}) {
    const [selectedCustomer, setSelectedCustomer] = React.useState<Customer>();
    const [searchTerm, setSearchTerm] = React.useState("");

    const customerListQuery = useInfiniteQuery({
        queryKey: ["/customer/list"],
        queryFn: customerListQueryHandler,
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

    const customers = React.useMemo(() => {
        const allCustomers = customerListQuery.data
            ? customerListQuery.data.pages.flatMap((page) => page.data)
            : [];

        return allCustomers.filter((customer: Customer) =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.mobileNumber.includes(searchTerm)
        );
    }, [customerListQuery.data, searchTerm]);

    return (
        <Command className={cn(className)}>
            <CommandInput
                placeholder="Search Customer by name or mobile..."
                value={searchTerm}
                onValueChange={setSearchTerm}
            />
            <CommandGroup>
                <CommandList>
                    {customers.length > 0 ? (
                        customers.map((customer: Customer) => (
                            <CommandItem
                                key={customer.id}
                                className="cursor-pointer flex justify-between"
                                onSelect={() => {
                                    onSelect(customer);
                                    setSelectedCustomer(customer);
                                }}
                            >
                                <p>{customer.name} ({customer.mobileNumber})</p>
                                {customer.id === selectedCustomer?.id && <CheckIcon className="h-4 w-4" />}
                            </CommandItem>
                        ))
                    ) : (
                        <p className="p-2 text-sm text-gray-500">No customers found</p>
                    )}
                </CommandList>
            </CommandGroup>
            <InView
                className="text-center text-xs"
                as="div"
                onChange={(val) => customerListQuery.hasNextPage && customerListQuery.fetchNextPage()}
            >
                {customerListQuery.isLoading ? "Loading More" : "No More Customers"}
            </InView>
        </Command>
    );
}
