import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserStats } from "@/components/user-stats/user-stats"


export default function DashboardPage() {
    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
            <Tabs defaultValue="analytics" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                <TabsContent value="analytics">
                 <UserStats />
                </TabsContent>
                <TabsContent value="recent-invoices">
                </TabsContent>
                <TabsContent value="recent-invoices">
                </TabsContent>
            </Tabs>
        </div>
    )
}

