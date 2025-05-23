import CashInvoiceInsertForm from "@/components/cash-invoice-insert-form/cash-invoice-insert-form";
import { CashInvoiceTable } from "@/components/cash-invoice-table/cash-invoice-table";
import InsertCustomerForm from "@/components/insert-customer-form/insert-customer-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, UserPlus } from "lucide-react";
import React from "react";


export default function CashInvoicePage() {
    const [searchKey,setSearchKey]=React.useState<string>("");
    return (
        <div className="h-full" >
            <h1 className="text-3xl font-bold mb-6">Cash Invoice</h1>
            <Card
                className="h-full"
            >
                <CardHeader className="flex flex-row justify-between" >
                    <Input 
                    value={searchKey}
                    onChange={(e)=>setSearchKey(e.target.value)}
                    placeholder="Search Cash Invoice" className="w-48"  />
                   <div
                   className="space-x-2"
                   >
                   <InsertCustomerForm>
                        <Button
                            variant="outline"
                            size="icon"
                        >
                            <UserPlus className="h-4 w-4" />
                        </Button>
                    </InsertCustomerForm>
                    <CashInvoiceInsertForm>
                        <Button
                            variant="outline"
                            size="icon"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </CashInvoiceInsertForm>
                   </div>
                </CardHeader>
                <CardContent
                className="h-full"
                > 
                  <CashInvoiceTable searchkey={searchKey}  />
                </CardContent>
            </Card>
        </div>
    );
}