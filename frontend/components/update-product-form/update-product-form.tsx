import { updateProductMutationHandler } from "@/action-handlers/mutation.handlers";
import { InsertCompanyHandler, Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { queryClient } from "@/providers/query.provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-hot-toast';
import useSWRMutation from "swr/mutation";
import { ProductFormType, UpdateProductFormSchema, UpdateProductFormType } from "../../utils/form-types.utils";
import CompanyList from "../company-list/company-list";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export default function UpdateProductForm({
    children,
    className,
    defaultValues
}: InsertCompanyHandler & {
    defaultValues: Product
}) {
    const [dialogStatus, setDialogStatus] = React.useState(false);
    const productForm = useForm<UpdateProductFormType>({
        resolver: zodResolver(UpdateProductFormSchema)
    })
    const submiitMutation = useSWRMutation({
        page: 1,
        pageSize: 10
    },
        async (_, { arg }: {
            arg: ProductFormType
        }) => {
            updateProductMutationHandler({id:defaultValues.id,...arg,});
        }, {
        onSuccess: () => {
            toast.success("Product Created")
            setDialogStatus(false);
            queryClient.invalidateQueries({
                queryKey: ["/product/list"]
            })
        },
        onError: (err) => {
            console.log(err);
            toast.error("something went wrong");
        }
    });
    React.useEffect(() => {
        productForm.setValue("name", defaultValues.name)
        productForm.setValue("companyId", defaultValues.company);
        productForm.setValue("description", defaultValues.description || "");
        productForm.setValue("measurement", defaultValues.measurement);
    }, [defaultValues])
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
                <Form {...productForm} >
                    <form
                        onSubmit={productForm.handleSubmit((data) => submiitMutation.trigger(data))}
                        className="space-y-4" >
                        <FormField
                            control={productForm.control}
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
                        <div
                            className="flex gap-2"
                        >
                            <FormField
                                control={productForm.control}
                                name="companyId"
                                render={({ field }) => (
                                    <FormItem
                                        className="flex-1"
                                    >
                                        <FormLabel>Company</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger
                                                    className="block w-full"
                                                    asChild >
                                                    <Button
                                                        variant="outline"
                                                    >
                                                        {field.value?.name ? field.value?.name : " Select Company"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <CompanyList onSelect={(company) => field.onChange({
                                                        id: company.id,
                                                        name: company.name
                                                    })} />
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div
                            className="flex gap-2"
                        >
                            <FormField
                                control={productForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem
                                        className="flex-1"
                                    >
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={productForm.control}
                                name="measurement"
                                render={({ field }) => (
                                    <FormItem
                                        className="flex-1"
                                    >
                                        <FormLabel>Measurement</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter measurement" {...field} />
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