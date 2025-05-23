import { NotificationProvider } from "@/hooks/use-notifications";
import { Plus } from "lucide-react";
import CashInvoiceInsertForm from "../cash-invoice-insert-form/cash-invoice-insert-form";
import InsertInvoiceForm from "../insert-invoice-form/insert-invoice-form";
import NotificationPopup from "../notification-popup/notification-popup";
import { Button } from "../ui/button";

export default function Navbar() {
    return (
        <nav className="bg-white w-[calc(100vw-15rem)] border-b p-4 flex items-center">
            <div className="ml-auto flex space-x-3">
                <InsertInvoiceForm
                className="max-w-full w-[60rem]"
                >
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>New Bill</span>
                </Button>
                </InsertInvoiceForm>
              <CashInvoiceInsertForm
              className="max-w-full w-[40rem]"
              >
              <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    <span>Cash Bill</span>
                </Button>
              </CashInvoiceInsertForm>
              <NotificationProvider>
               <NotificationPopup/>
              </NotificationProvider>
            </div>
        </nav>
    );
}
