import { generatePDFInoviceHandler, insertCashInvoiceHandler } from "@/action-handlers/mutation.handlers";
import { cn } from "@/lib/utils";
import { queryClient } from "@/providers/query.provider";
import CashInvoiceContentGenerator from "@/utils/cash-invoice-content-generator";
import { CashInvoiceForm, CashInvoiceFormType } from "@/utils/form-types.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Sanscript from "@indic-transliteration/sanscript";
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


export default function CashInvoiceInsertForm({
    children,
    className
}: {
    children: React.ReactNode,
    className?: string,
}) {
    const [isSucess, setIsSucess] = React.useState(false);
    const cashInvoiceFrom = useForm<CashInvoiceFormType>({
        resolver: zodResolver(CashInvoiceForm)
    })
    const submitHandlerMutation = useSWRMutation("/invoice/list", async (_, { arg }: { arg: CashInvoiceFormType }) => {    
        insertCashInvoiceHandler(arg);
    }, {
        onSuccess: () => {
            toast.success("invoice created");
            queryClient.invalidateQueries({
                queryKey: ["/cash-invoice/list"]
            })
            setIsSucess(true);
        }
    })

    const printCashBillMutation = useSWRMutation("/generate-invoice", async () => {
        const content = CashInvoiceContentGenerator({
            customer: { ...cashInvoiceFrom.getValues("customerId"), status: true,name: Sanscript.t(cashInvoiceFrom.getValues("customerId.name"), 'itrans', 'devanagari'), address: Sanscript.t(cashInvoiceFrom.getValues("customerId.address"), 'itrans', 'devanagari') },
            amount: cashInvoiceFrom.getValues("cashAmount"),
            invoiceDate: cashInvoiceFrom.getValues("dateFrom"),
        })
        generatePDFInoviceHandler(content)
    },{
        onSuccess:()=>{
            setIsSucess(false);
            cashInvoiceFrom.reset();
        }
    })

    if (isSucess)
        return (
            <Dialog>
                <DialogTrigger asChild >
                    {children}
                </DialogTrigger>
                <DialogContent>
                    <p>Your Invoice is created sucessfully</p>
                    <Button
                        disabled={printCashBillMutation.isMutating}
                        onClick={() => printCashBillMutation.trigger()}
                    >
                        Print Cash Bill
                    </Button>
                </DialogContent>
            </Dialog>
        )

    return (
        <Dialog>
            <DialogTrigger asChild >
                {children}
            </DialogTrigger>
            <DialogContent
                className={cn(className)}
            >
                <Form {...cashInvoiceFrom} >
                    <form
                        className="space-y-6"
                        onSubmit={cashInvoiceFrom.handleSubmit((data) => submitHandlerMutation.trigger(data))}
                    >
                        <FormField
                            control={cashInvoiceFrom.control}
                            name="customerId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer</FormLabel>
                                    <div
                                        className="flex gap-2"
                                    >
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild >
                                                    <Button
                                                        variant="outline"
                                                    >
                                                        {field.value ? field.value?.name : " Select Customer"}
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
                        <div
                            className="flex gap-2"
                        >
                            <FormField
                                control={cashInvoiceFrom.control}
                                name="dateFrom"
                                render={({ field }) => (
                                    <FormItem className="flex-1" >
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
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={cashInvoiceFrom.control}
                                name="cashAmount"
                                render={({ field }) => (
                                    <FormItem className="flex-1" >
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="Enter Amount" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div
                            className="flex justify-between text-xl font-bold"
                        >
                            <span
                            >
                                Total Amount
                            </span>
                            <span>
                                {cashInvoiceFrom.watch("cashAmount") || 0}
                            </span>
                        </div>
                        <Button
                            className="w-full"
                        >Save</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}