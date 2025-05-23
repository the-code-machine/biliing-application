import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Calendar, Home, Inbox, LogOut, Package, Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  {
    title: "Dashboard",
    url: "/?auth=true",
    icon: Home,
    slug:"/"
  },
  {
    title: "Company",
    url: "/company",
    icon: Inbox,
  },
  {
    title: "Product",
    url: "/product",
    icon: Package,
  },
  {
    title: "Cash Invoice",
    url: "/cash-invoice",
    icon: Search,
  },
  {
    title: "Invoice",
    url: "/invoice",
    icon: Calendar,
  },
  {
    title: "Stocks and Inventory",
    url: "/stock-and-inventery",
    icon: Package,
  },
  {
    title: "Customers",
    url: "/customer",
    icon: Package,
  },
  {
    title:"Logout",
    url:"/logout",
    icon:LogOut
  }
]

export default function AppSidebar() {
  const pathName=usePathname();
  console.log(pathName)
  return (
    <Sidebar className="w-60 border-r border-gray-200 bg-white">
      <SidebarHeader className="h-16 border-b border-gray-200 flex items-center justify-center">
        <h1 className="text-xl font-bold text-primary">Invoice Generator</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="py-4 space-y-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn("w-full flex items-center gap-3 px-4 py-4 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors rounded-md",(item.url==pathName || item.slug == pathName ) && "bg-[#F2F7FF] text-primary")}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

