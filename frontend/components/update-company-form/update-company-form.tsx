import { updateCompanyMutationHandler } from "@/action-handlers/mutation.handlers";
import { UpdateCompanyHandler } from "@/lib/types";
import { cn } from "@/lib/utils";
import { queryClient } from "@/providers/query.provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from 'react-hot-toast';
import useSWRMutation from "swr/mutation";
import { CompanyForm, CompanyFormType } from "../../utils/form-types.utils";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

export default function UpdateCompanyForm({
    children,
    className,
    defaultValues
}: UpdateCompanyHandler) {
    const [dialogStatus,setDialogStatus]=React.useState(false);
    const companyForm = useForm<CompanyFormType>({
        resolver: zodResolver(CompanyForm)
    })
    const submiitMutation = useSWRMutation("/company/list",
        async (_, { arg }: {
            arg: CompanyFormType
        }) => {
            updateCompanyMutationHandler({...defaultValues,...arg,status:true})
        }, {
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:["/company/list"]
            })
            toast.success("Company Updated")
            setDialogStatus(false);
        },
        onError: (err) => toast.error(err)
    });

    React.useEffect(()=>{
     companyForm.setValue("name",defaultValues.name)
     companyForm.setValue("description",defaultValues.description || "");
    },[])
    return (
        <Dialog
        open={dialogStatus}
        onOpenChange={(val)=>setDialogStatus(val)}
        >
            <DialogTrigger asChild >
                {children}
            </DialogTrigger>
            <DialogContent
                className={cn(className)}
            >
                <Form {...companyForm} >
                    <form
                    onSubmit={companyForm.handleSubmit((data)=>submiitMutation.trigger(data))}
                    className="space-y-4" >
                        <FormField
                            control={companyForm.control}
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
                            control={companyForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            disabled={submiitMutation.isMutating}
                            className="w-full mt-2"
                        >
                           {!submiitMutation.isMutating?"Save":<LoaderCircle className="h-4 w-4 animate-spin" />}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}