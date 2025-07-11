import {
  generatePDFInoviceHandler,
  removeInvoiceMutationHandler,
  updateInvoiceStatusMutation,
} from "@/action-handlers/mutation.handlers";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Invoice } from "@/lib/types";
import { queryClient } from "@/providers/query.provider";
import InvoiceChallanContentGenerator from "@/utils/invoice-challan-content-generator";
import InvoiceEstimationContentGenerator from "@/utils/invoice-estimation-content-generator";
import { useMutation } from "@tanstack/react-query";
import { Check, MoreVertical, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import useSWRMutation from "swr/mutation";
import UpdateInvoiceForm from "../update-invoice-form/update-invoice-form";

export async function translate(text: string): Promise<string> {
  try {
    const response = global.api.sendSync("translate-text", text);

    if (response?.statusCode === 200) {
      return response.data; // Translated text
    } else {
      console.warn("Translation error:", response?.message);
      return text; // fallback to original text
    }
  } catch (err) {
    console.error("IPC translation failed:", err);
    return text; // fallback
  }
}

interface ActionDropdownProps {
  invoice: Invoice;
  status: string;
}

export default function InvoiceAction({
  invoice,
  status,
}: ActionDropdownProps) {
  const total = invoice.invoiceProducts?.reduce((total: number, product) => {
    const productAmount =
      product.InvoiceProduct.quantity * product.InvoiceProduct.price;
    return total + productAmount;
  }, 0);
  const printChallanBillMutation = useSWRMutation(
    "/generate-invoice",
    async () => {
      const translatedName = await translate(invoice.customer.name);
      const translatedAddress = await translate(invoice.customer.address);
      const translatedRemark = await translate(invoice.remark || "");

      const content = InvoiceChallanContentGenerator({
        customer: {
          ...invoice.customer,
          name: translatedName,
          address: translatedAddress,
          status: true,
          mobileNumber: invoice.customer.mobileNumber,
        },
        remark: translatedRemark,
        products: invoice.invoiceProducts.map((product) => ({
          measurement: product.measurement,
          name: product.name,
          qty: product.InvoiceProduct.quantity,
          rate: product.InvoiceProduct.price,
          units: product.InvoiceProduct.units,
        })),
        cash: invoice.castAmount,
        invoiceDate: new Date(invoice.date),
        total: total,
      });

      generatePDFInoviceHandler(content);
    }
  );

  const printEstimateBillMutation = useSWRMutation(
    "/generate-invoice",
    async () => {
      // Resolve translations first
      const translatedName = await translate(invoice.customer.name);
      const translatedAddress = await translate(invoice.customer.address);
      const translatedRemark = await translate(invoice.remark || "");

      const content = InvoiceEstimationContentGenerator({
        customer: {
          ...invoice.customer,
          status: true,
          mobileNumber: invoice.customer.mobileNumber,
          name: translatedName,
          address: translatedAddress,
        },
        remark: translatedRemark,
        products: invoice.invoiceProducts.map((product) => ({
          measurement: product.measurement,
          name: product.name, // optional: translate(product.name) if needed
          qty: product.InvoiceProduct.quantity,
          rate: product.InvoiceProduct.price,
          units: product.InvoiceProduct.units,
        })),
        cash: invoice.castAmount,
        invoiceDate: new Date(invoice.date),
        total: total + invoice.freight + invoice.hammali,
        fright: invoice.freight,
        hamamli: invoice.hammali,
      });

      generatePDFInoviceHandler(content);
    }
  );

  const updateSucessMutation = useMutation({
    mutationFn: updateInvoiceStatusMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/invoice/list"],
      });
    },
  });
  const removeCashBillMutation = useSWRMutation(
    "/invoice/list",
    async () => {
      return removeInvoiceMutationHandler({
        id: invoice.id,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["/invoice/list"],
        });
        toast.success("Cash Invoice Removed");
      },
    }
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status === "hold" ? null : (
          <>
            <DropdownMenuItem
              onClick={() => printEstimateBillMutation.trigger()}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Print Estimation
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => printChallanBillMutation.trigger()}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Print Challan
            </DropdownMenuItem>{" "}
          </>
        )}
        <UpdateInvoiceForm className="max-w-full w-[60rem]" invoice={invoice}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        </UpdateInvoiceForm>
        <DropdownMenuItem onClick={() => removeCashBillMutation.trigger()}>
          <Pencil className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
        {invoice.status == "hold" && (
          <DropdownMenuItem
            onClick={() => updateSucessMutation.mutate(invoice.id)}
          >
            <Check className="mr-2 h-4 w-4" />
            Success
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
