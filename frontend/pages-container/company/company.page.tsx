import { CompanyTable } from "@/components/company-table/company-table";
import InsertCompanyForm from "@/components/insert-company-form/insert-company-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React from "react";


export default function CompanyPage() {
    const [searchKey,setSearchKey]=React.useState<string>("");
    return (
        <div className="h-full" >
            <h1 className="text-3xl font-bold mb-6">Company</h1>
            <Card
                className="h-full"
            >
                <CardHeader className="flex flex-row justify-between" >
                    <Input placeholder="Search Company" className="w-78" value={searchKey} onChange={(e)=>setSearchKey(e.target.value)} />
                    <InsertCompanyForm>
                        <Button
                            variant="outline"
                            size="icon"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </InsertCompanyForm>
                </CardHeader>
                <CardContent>
                    <CompanyTable searchKey={searchKey} />
                </CardContent>
            </Card>
        </div>
    );
}