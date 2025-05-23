import { removeProductMutationHandler } from "@/action-handlers/mutation.handlers"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Product } from "@/lib/types"
import { queryClient } from "@/providers/query.provider"
import { useMutation } from "@tanstack/react-query"
import { MoreVertical, Pencil, Trash2 } from "lucide-react"
import UpdateProductForm from "../update-product-form/update-product-form"

interface ActionDropdownProps {
  product: Product
}

export default function ProductAction({ product }: ActionDropdownProps) {
  const removeProductMutation = useMutation({
    mutationFn: removeProductMutationHandler,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/product/list"]
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
        <UpdateProductForm defaultValues={product} >
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </UpdateProductForm>
        <DropdownMenuItem
          onClick={() => removeProductMutation.mutate(product.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

