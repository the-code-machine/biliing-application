"use client"
import { useNotifications } from "@/hooks/use-notifications";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";

export default function NotificationPopup() {
    const { notifications } = useNotifications();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {notifications.length > 0 && (
                        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                            {notifications.length}
                        </span>
                    )}
                    <span className="sr-only">Open notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[380px] md:w-[450px]">
                <ScrollArea className="h-[300px] px-4">
                    {notifications.length === 0 ? (
                        <div className="flex h-[120px] items-center justify-center">
                            <p className="text-sm text-muted-foreground">No new notifications</p>
                        </div>
                    ) : (
                        <div className="space-y-4 py-4">
                            {notifications.map((notification, index) => (
                                <div key={index} className="rounded-lg border p-4 hover:bg-muted/50">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">Low Stock For Product {notification.name}</p>
                                            <p className="text-sm text-muted-foreground line-clamp-2">Product Id {notification.productId}</p>
                                        </div>
                                        {/* <p className="text-xs text-muted-foreground whitespace-nowrap">
                                            Remaning Stock  {notification.remaining}
                                        </p> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}