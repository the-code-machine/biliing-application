import { productListPaginationQueryHandler } from '@/action-handlers/query.handler';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { CheckIcon } from 'lucide-react';
import React from 'react';
import { InView } from 'react-intersection-observer';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";

export default function ProductList({
    className,
    onSelect,
    disabled=false
}: {
    className?: string,
    onSelect: (product: Product) => void,
    disabled?:boolean
}) {
    const [selectedProduct, setSelectedProduct] = React.useState<Product>()
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

    const products = React.useMemo(() => {
        const list = productListQuery.data ? productListQuery.data.pages.flatMap((product) => product.data) : [];
        return list;
    }, [productListQuery.data])
    return (
        <Command
            className={cn(className)}
        >
            <CommandInput placeholder="Search Customer..." />
            <CommandGroup>
                <CommandList>
                    {
                        products?.map((product: Product) => (
                            <CommandItem
                                disabled={product.stock == 0 && disabled}
                                className='cursor-pointer flex justify-between'
                                onSelect={() => {
                                    onSelect(product)
                                    setSelectedProduct(product);
                                }}
                            >
                                <div className='flex gap-4'>
                                    <div>
                                        <label className='text-sm font-medium text-nowrap'>Product Name:</label>
                                        <span className='ml-2'>{product?.name}</span>
                                    </div>
                                    <div>
                                        <label className='text-sm font-medium text-nowrap'>Company Name:</label>
                                        <span className='ml-2 text-xs'>{product.company?.name}</span>
                                    </div>
                                </div>
                                {product.id == selectedProduct?.id && <CheckIcon className='h-4 w-4' />}
                            </CommandItem>
                        ))
                    }
                </CommandList>
            </CommandGroup>
            <InView
                className='text-center text-xs'
                as="div"
                onChange={(val) => productListQuery.hasNextPage && productListQuery.fetchNextPage()}
            >
                {productListQuery.isLoading ? "Loading More" : "No More Products"}
            </InView>
        </Command>
    );
}