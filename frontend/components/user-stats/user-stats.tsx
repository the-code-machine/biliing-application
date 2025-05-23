import { analyticsQueryHandler } from "@/action-handlers/query.handler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";
import { InvoiceTable } from "../invoice-table/invoice-table";



export function UserStats() {
  const analyticsQuery = useSWR("/analytics/list", analyticsQueryHandler);
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cash Invoice Generated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyticsQuery.data?.cashInvoiceCount}</div>

        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Invoice Generated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyticsQuery.data?.invoiceCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Cash Recived</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyticsQuery.data?.totalCashReceived || 0}</div>
        </CardContent>
      </Card>
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceTable paginationStatus={false} />
        </CardContent>
      </Card>
    </div>
  )
}

