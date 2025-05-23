import InsertCustomerForm from "@/components/insert-customer-form/insert-customer-form";
import InsertInvoiceForm from "@/components/insert-invoice-form/insert-invoice-form";
import { InvoiceTable } from "@/components/invoice-table/invoice-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, UserPlus } from "lucide-react";
import { useState } from "react";

export default function InvoicePage() {
  const [activeTab, setActiveTab] = useState<"success" | "hold">("success");

  return (
    <div className="h-full">
      <h1 className="text-3xl font-bold mb-6">Invoice</h1>
      <Card className="h-full">
        <CardHeader className="flex flex-row justify-between">
          <Input className="w-40" placeholder="Search Invoice" />
          <div className="flex gap-2">
            <InsertCustomerForm>
              <Button variant="outline" size="icon">
                <UserPlus className="h-4 w-4" />
              </Button>
            </InsertCustomerForm>
            <InsertInvoiceForm className="max-w-full w-[60rem]">
              <Button
                size="icon"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </InsertInvoiceForm>
            <Button
              variant={activeTab === "success" ? "default" : "outline"}
              onClick={() => setActiveTab("success")}
            >
              All Invoices
            </Button>
            <Button
              variant={activeTab === "hold" ? "default" : "outline"}
              onClick={() => setActiveTab("hold")}
            >
              Drafts
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <InvoiceTable status={activeTab} />
        </CardContent>
      </Card>
    </div>
  );
}
