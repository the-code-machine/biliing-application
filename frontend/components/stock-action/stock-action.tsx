import { removeCompanyMutationHandler } from "@/action-handlers/mutation.handlers"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Stock } from "@/lib/types"
import { queryClient } from "@/providers/query.provider"
import { useMutation } from "@tanstack/react-query"
import { MoreVertical, Trash2 } from "lucide-react"

interface ActionDropdownProps {
  stock:Stock
}

export default function StockAction({ stock }: ActionDropdownProps) {
  const removeStockMutation=useMutation({
    mutationKey:["/stock/list"],
    mutationFn:removeCompanyMutationHandler,
    onSuccess:()=>{
      queryClient.invalidateQueries({
        queryKey:["/stock/list"]
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
        <DropdownMenuItem
        onClick={()=>removeStockMutation.mutate(stock.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

