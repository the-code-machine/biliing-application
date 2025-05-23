import InsertProductForm from "@/components/insert-product-form/insert-product-form";
import { ProductTable } from "@/components/product-table/product-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import React from "react";


export default function ProductPage() {
    const [searchKey, setSearchKey] = React.useState<string>("");
    return (
        <div className="h-full" >
            <h1 className="text-3xl font-bold mb-6">Products</h1>
            <Card
                className="h-full"
            >
                <CardHeader className="flex flex-row justify-between" >
                    <Input
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                        placeholder="Search Proudct" className="w-48" />
                    <InsertProductForm>
                        <Button
                            variant="outline"
                            size="icon"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </InsertProductForm>
                </CardHeader>
                <CardContent className="min-h-[60vh]" >
                    <ProductTable searchKey={searchKey} />
                </CardContent>
            </Card>
        </div>
    );
}