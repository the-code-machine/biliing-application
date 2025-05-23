import { generatePDFInoviceHandler, removeCashInvoiceMutationHandler } from "@/action-handlers/mutation.handlers"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CashInvoice } from "@/lib/types"
import { queryClient } from "@/providers/query.provider"
import CashInvoiceContentGenerator from "@/utils/cash-invoice-content-generator"
import Sanscript from "@indic-transliteration/sanscript"
import { MoreVertical, Pencil } from "lucide-react"
import toast from "react-hot-toast"
import useSWRMutation from "swr/mutation"
import CashInvoiceUpdateForm from "../update-cash-invoice-form/update-cash-invoice-form"

interface ActionDropdownProps {
    cashInvoice: CashInvoice
}

export default function CashInvoiceAction({ cashInvoice }: ActionDropdownProps) {
    const printCashBillMutation = useSWRMutation("/generate-invoice", async () => {
        const content = CashInvoiceContentGenerator({
            customer: { ...cashInvoice.customer, status: true, name: Sanscript.t(cashInvoice.customer.name, 'itrans', 'devanagari'), address: Sanscript.t(cashInvoice.customer.address, 'itrans', 'devanagari') },
            amount: cashInvoice.amount,
            invoiceDate: new Date(cashInvoice.date)
        })
        generatePDFInoviceHandler(content)
    });
    const removeCashBillMutation = useSWRMutation("/cash-invoice/list", async () => {
        return removeCashInvoiceMutationHandler({
            id: cashInvoice.id
        })
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['/cash-invoice/list']
            });
            toast.success("Cash Invoice Removed")
        }
    })

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent

                align="end">
                <CashInvoiceUpdateForm invoiceData={{
                    cashAmount: cashInvoice.amount,
                    customerId: cashInvoice.customer,
                    dateFrom: new Date(cashInvoice.date),
                    id:cashInvoice.id
                }} >
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                    >
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                </CashInvoiceUpdateForm>
                <DropdownMenuItem
                    onClick={() => printCashBillMutation.trigger()}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Print Bill
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => removeCashBillMutation.trigger()}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

