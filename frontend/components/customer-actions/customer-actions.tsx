import { removeCustomerMutationHandler } from "@/action-handlers/mutation.handlers"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Customer } from "@/lib/types"
import { queryClient } from "@/providers/query.provider"
import { useMutation } from "@tanstack/react-query"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import UpdateCustomerForm from "../update-customer-form/update-customer-form"

interface ActionDropdownProps {
    customer: Customer
}

export default function CustomerActions({ customer }: ActionDropdownProps) {
    const removeCustomerMutation = useMutation({
        mutationKey: ["/customer/list"],
        mutationFn: removeCustomerMutationHandler,
        onSuccess: () => {
            toast.success("customer removed");
            queryClient.invalidateQueries({
                queryKey: ["/customer/list"]

            })
        }
    })
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <UpdateCustomerForm defaultValues={customer} >
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                </UpdateCustomerForm>
                <DropdownMenuItem
                    onClick={() => removeCustomerMutation.mutate({
                        id:customer.id
                    })}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

