import { removeCompanyMutationHandler } from "@/action-handlers/mutation.handlers"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Company } from "@/lib/types"
import { queryClient } from "@/providers/query.provider"
import { useMutation } from "@tanstack/react-query"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import UpdateCompanyForm from "../update-company-form/update-company-form"

interface ActionDropdownProps {
  company:Company
}

export default function CompanyAction({ company }: ActionDropdownProps) {
  const removeCompanyMutation=useMutation({
    mutationKey:["/company/list"],
    mutationFn:removeCompanyMutationHandler,
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey:["/company/list"]
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
        <UpdateCompanyForm
        defaultValues={company}
        >
        <DropdownMenuItem
        onSelect={(e)=>e.preventDefault()}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        </UpdateCompanyForm>
        <DropdownMenuItem
        onClick={()=>removeCompanyMutation.mutate(company.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

