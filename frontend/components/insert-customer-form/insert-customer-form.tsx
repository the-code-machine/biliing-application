import { insertCustomerMutationHandler } from "@/action-handlers/mutation.handlers";
import { InsertCompanyHandler } from "@/lib/types";
import { cn } from "@/lib/utils";
import { queryClient } from "@/providers/query.provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-hot-toast';
import useSWRMutation from "swr/mutation";
import { CustomerFrom, CustomerFromType, } from "../../utils/form-types.utils";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { PhoneInput } from "../ui/phone-input";
import { Textarea } from "../ui/textarea";

export default function InsertCustomerForm({
    children,
    className
}: InsertCompanyHandler) {
    const [dialogStatus, setDialogStatus] = React.useState(false);
    const customerForm = useForm<CustomerFromType>({
        resolver: zodResolver(CustomerFrom)
    })
    const submiitMutation = useSWRMutation("/api/customer",
        async (_, { arg }: {
            arg: CustomerFromType
        }) => {
            insertCustomerMutationHandler(arg);
        }, {
        onSuccess: () => {
            toast.success("Customer Created");
            queryClient.invalidateQueries({
                queryKey: ["/customer/list"]
            })
            customerForm.reset();
            setDialogStatus(false);
        },
        onError: (err) => {
            console.log(err);
            toast.error("something went wrong");
        }
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
                <Form {...customerForm} >
                    <form
                        onSubmit={customerForm.handleSubmit((data) => submiitMutation.trigger(data))}
                        className="space-y-4" >
                        <FormField
                            control={customerForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                            <FormField
                                control={customerForm.control}
                                name="mobileNumber"
                                render={({ field }) => (
                                    <FormItem
                                        className="flex-1"
                                    >
                                        <FormLabel>Company</FormLabel>
                                        <FormControl>
                                           <PhoneInput defaultCountry="IN" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={customerForm.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem
                                        className="flex-1"
                                    >
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                           <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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