import { CustomerTable } from "@/components/customer-table/customer-table";
import InsertCustomerForm from "@/components/insert-customer-form/insert-customer-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React from "react";


export default function CustomerPage() {
    const [searchKey,setSearchKey]=React.useState<string>("");
    return (
        <div className="h-full" >
            <h1 className="text-3xl font-bold mb-6">Customer</h1>
            <Card
                className="h-full"
            >
                <CardHeader className="flex flex-row justify-between" >
                    <Input placeholder="Search Customer" className="w-78" value={searchKey} onChange={(e)=>setSearchKey(e.target.value)} />
                    <InsertCustomerForm>
                        <Button
                            variant="outline"
                            size="icon"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </InsertCustomerForm>
                </CardHeader>
                <CardContent>
                    <CustomerTable searchKey={searchKey} />
                </CardContent>
            </Card>
        </div>
    );
}