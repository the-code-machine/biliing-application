import { insertStockMutationHandler } from "@/action-handlers/mutation.handlers";
import { InsertCompanyHandler } from "@/lib/types";
import { cn } from "@/lib/utils";
import { queryClient } from "@/providers/query.provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import useSWRMutation from "swr/mutation";
import { StockForm, StockFormType } from "../../utils/form-types.utils";
import ProductList from "../product-list/product-list";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function InsertStockForm({
    children,
    className
}: InsertCompanyHandler) {
    const [dialogStatus, setDialogStatus] = React.useState(false);
    const stockForm = useForm<StockFormType>({
        resolver: zodResolver(StockForm)
    })
    const submiitMutation = useSWRMutation("/stock/list",
        async (_, { arg }: {
            arg: StockFormType
        }) => {
            insertStockMutationHandler(arg);
        }, {
        onSuccess: () => {
            toast.success("Stock Created")
            queryClient.invalidateQueries({
                queryKey:['/stock/list']
            })
            setDialogStatus(false);
        },
        onError: (err) => toast.error(err)
    });
    return (
        <Dialog
            open={dialogStatus}
            onOpenChange={(val) => setDialogStatus(val)}
        >
            <DialogTrigger asChild >
                {children}
            </DialogTrigger>
            <DialogContent
                className={cn(className)}
            >
                <Form {...stockForm} >
                    <form
                        onSubmit={stockForm.handleSubmit((data) => submiitMutation.trigger(data))}
                        className="space-y-4" >
                        <div
                            className="flex gap-2"
                        >
                            <FormField
                                control={stockForm.control}
                                name="product"
                                render={({ field }) => (
                                    <FormItem
                                        className="flex-1"
                                    >
                                        <FormLabel>Product</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger
                                                    className="block w-full"
                                                    asChild>
                                                    <Button variant="outline">
                                                        {(field.value && field.value?.name) || 'Select Product'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                className="w-96"
                                                >
                                                    <ProductList
                                                        onSelect={(product) =>{
                                                            console.log(product)
                                                            field.onChange({
                                                                ...product,
                                                                measurement: product.measurement,
                                                            });
                                                        }}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={stockForm.control}
                                name="product"
                                render={({ field }) => (
                                    <FormItem
                                        className="flex-1"
                                    >
                                        <FormLabel>Measurement</FormLabel>
                                        <FormControl>
                                            <Input disabled placeholder="Measurement" value={field.value?.measurement} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={stockForm.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem
                                    className="flex-1"
                                >
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild
                                                className="block w-full" >
                                                <Button
                                                    variant="outline"
                                                >
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent>
                                                <Calendar mode="single" selected={field.value} onSelect={(date) => field.onChange(date)} />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div
                            className="flex gap-2"
                        >
                            <FormField
                                control={stockForm.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem
                                        className="flex-1"
                                    >
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Enter Quantity" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={stockForm.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem
                                        className="flex-1"
                                    >
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Enter Price" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button
                            disabled={submiitMutation.isMutating}
                            className="w-full mt-2"
                        >
                            {!submiitMutation.isMutating ? "Save" : <LoaderCircle className="h-4 w-4 animate-spin" />}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}