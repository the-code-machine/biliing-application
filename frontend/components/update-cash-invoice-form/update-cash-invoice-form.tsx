import { updateCashInvoiceHandler } from "@/action-handlers/mutation.handlers";
import { cn } from "@/lib/utils";
import { queryClient } from "@/providers/query.provider";
import { CashInvoiceForm, CashInvoiceFormType } from "@/utils/form-types.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWRMutation from "swr/mutation";
import CustomerList from "../customer-list/customer-list";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { PhoneInput } from "../ui/phone-input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function CashInvoiceUpdateForm({
    children,
    className,
    invoiceData
}: {
    children: React.ReactNode,
    className?: string,
    invoiceData: CashInvoiceFormType & {id:number}
}) {
    const [isOpen,setIsOpen]=React.useState(false);
    const cashInvoiceForm = useForm<CashInvoiceFormType>({
        resolver: zodResolver(CashInvoiceForm),
        defaultValues: invoiceData
    });

    const updateHandlerMutation = useSWRMutation("/invoice/update", async (_, { arg }: { arg: CashInvoiceFormType }) => {    
        updateCashInvoiceHandler({id:invoiceData.id,...arg});
    }, {
        onSuccess: () => {
            toast.success("Cash Invoice updated");
            queryClient.invalidateQueries({ queryKey: ["/cash-invoice/list"] });
            setIsOpen(false)
        }
    });

    return (
        <Dialog open={isOpen} onOpenChange={(val)=>setIsOpen(val)} >
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className={cn(className)}>
                <Form {...cashInvoiceForm}>
                    <form
                        className="space-y-6"
                        onSubmit={cashInvoiceForm.handleSubmit((data) => updateHandlerMutation.trigger(data))}
                    >
                        <FormField
                            control={cashInvoiceForm.control}
                            name="customerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer</FormLabel>
                                    <div className="flex gap-2">
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline">
                                                        {field.value ? field.value?.name : "Select Customer"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <CustomerList onSelect={(customer) => field.onChange(customer)} />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <PhoneInput className="w-full" value={field.value?.mobileNumber} disabled />
                                        <Input disabled value={field.value?.address} />
                                    </div>
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-2">
                            <FormField
                                control={cashInvoiceForm.control}
                                name="dateFrom"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild className="block w-full">
                                                    <Button variant="outline">
                                                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <Calendar mode="single" selected={field.value} onSelect={(date) => field.onChange(date)} />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={cashInvoiceForm.control}
                                name="cashAmount"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Enter Amount" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex justify-between text-xl font-bold">
                            <span>Total Amount</span>
                            <span>{cashInvoiceForm.watch("cashAmount") || 0}</span>
                        </div>
                        <Button className="w-full">Update</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
