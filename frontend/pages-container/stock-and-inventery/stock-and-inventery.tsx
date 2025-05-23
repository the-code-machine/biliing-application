import InsertStockForm from "@/components/insert-stock-form/insert-stock-form";
import { StockTable } from "@/components/stock-table/stock-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React from "react";


export default function StockAndInventeryPage() {
    const [searchKey, setSearchKey] = React.useState<string>("");
    return (
        <div className="h-full" >
            <h1 className="text-3xl font-bold mb-6">Stock And Inventery</h1>
            <Card
                className="h-full"
            >
                <CardHeader className="flex flex-row justify-between" >
                    <Input
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                        placeholder="Search Inventery" className="w-48" />
                    <InsertStockForm>
                        <Button
                            variant="outline"
                            size="icon"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </InsertStockForm>
            
                </CardHeader>
                <CardContent>
                    <StockTable searchKey={searchKey} />
                </CardContent>
            </Card>
        </div>
    );
}