import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ChevronRight, ChevronDown, BarChart3, Tag, PlusCircle, List, ClipboardList, FileText, Settings, Bot } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  {
    title: "Inventory",
    url: "/products",
    icon: Package,
    items: [
      { title: "All Products", url: "/products", icon: List },
      { title: "Add Product", url: "/products?add=true", icon: PlusCircle },
      { title: "Categories", url: "/categories", icon: Tag },
      { title: "Deals of the Day", url: "/deals", icon: Tag },
    ],
  },
  {
    title: "Sales & Orders",
    url: "/orders",
    icon: BarChart3,
    items: [
      { title: "All Orders", url: "/orders", icon: ShoppingCart },
      { title: "Order Status", url: "/order-status", icon: ClipboardList },
      { title: "Invoices", url: "/invoices", icon: FileText },
    ],
  },
  { title: "LoopDeal AI Agent", url: "/ai-agent", icon: Bot },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { logout } = useAuth();
  const location = useLocation();

  const isGroupActive = (item: any) => {
    if (item.url === "/" && location.pathname === "/") return true;
    if (item.url !== "/" && location.pathname.startsWith(item.url)) return true;
    if (item.items?.some((sub: any) => location.pathname === sub.url)) return true;
    return false;
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarContent className="bg-sidebar">
        <SidebarGroup>
          <div className="mb-8 mt-6 flex items-center gap-3 px-3">
            <div className="flex h-12 w-32 items-center justify-start overflow-hidden">
              <img src="/logo.png" alt="LoopDeal Logo" className="h-auto w-full object-contain" />
            </div>
            {!collapsed && <span className="text-xs font-black text-white/40 tracking-[0.3em] uppercase -ml-4 mt-4">ADMIN</span>}
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = isGroupActive(item);
                
                if (item.items) {
                  return (
                    <Collapsible key={item.title} defaultOpen={active} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton 
                            className={cn(
                              "relative h-11 w-full justify-start gap-4 rounded-r-none pl-4 pr-4 transition-all duration-200 hover:bg-white/10 text-white hover:text-white",
                              active && "bg-white text-sidebar-primary hover:bg-white hover:text-sidebar-primary rounded-l-full"
                            )}
                          >
                            <item.icon className={cn("h-5 w-5 shrink-0", active ? "text-sidebar-primary" : "text-white")} />
                            {!collapsed && (
                              <div className="flex w-full items-center justify-between">
                                <span className="font-semibold">{item.title}</span>
                                {active ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4 opacity-70" />}
                              </div>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-4 mt-1 border-l-0 pl-6 space-y-1">
                            {item.items.map((sub) => {
                              const subActive = location.pathname === sub.url;
                              return (
                                <SidebarMenuSubItem key={sub.title}>
                                  <SidebarMenuSubButton asChild>
                                    <NavLink 
                                      to={sub.url}
                                      className={cn(
                                        "h-9 w-full justify-start rounded-md px-2 text-white/80 transition-colors hover:text-white hover:bg-white/5",
                                        subActive && "text-white font-medium bg-white/10"
                                      )}
                                    >
                                      <span>{sub.title}</span>
                                    </NavLink>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={cn(
                          "relative h-11 w-full justify-start gap-4 rounded-r-none pl-4 pr-4 transition-all duration-200 hover:bg-white/10 text-white hover:text-white",
                          active && "bg-white text-sidebar-primary hover:bg-white hover:text-sidebar-primary rounded-l-full"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5 shrink-0", active ? "text-sidebar-primary" : "text-white")} />
                        {!collapsed && (
                          <div className="flex w-full items-center justify-between">
                            <span className="font-semibold">{item.title}</span>
                            <ChevronRight className={cn("h-4 w-4 opacity-70", active && "opacity-0")} />
                          </div>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/users"
                    className={cn(
                      "relative h-11 w-full justify-start gap-4 rounded-r-none pl-4 pr-4 transition-all duration-200 hover:bg-white/10 text-white hover:text-white",
                      location.pathname === "/users" && "bg-white text-sidebar-primary hover:bg-white hover:text-sidebar-primary rounded-l-full"
                    )}
                  >
                    <Users className={cn("h-5 w-5 shrink-0", location.pathname === "/users" ? "text-sidebar-primary" : "text-white")} />
                    {!collapsed && (
                      <div className="flex w-full items-center justify-between">
                        <span className="font-semibold">Users</span>
                        <ChevronRight className={cn("h-4 w-4 opacity-70", location.pathname === "/users" && "opacity-0")} />
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/settings"
                    className={cn(
                      "relative h-11 w-full justify-start gap-4 rounded-r-none pl-4 pr-4 transition-all duration-200 hover:bg-white/10 text-white hover:text-white",
                      location.pathname === "/settings" && "bg-white text-sidebar-primary hover:bg-white hover:text-sidebar-primary rounded-l-full"
                    )}
                  >
                    <Settings className={cn("h-5 w-5 shrink-0", location.pathname === "/settings" ? "text-sidebar-primary" : "text-white")} />
                    {!collapsed && (
                      <div className="flex w-full items-center justify-between">
                        <span className="font-semibold">Settings</span>
                        <ChevronRight className={cn("h-4 w-4 opacity-70", location.pathname === "/settings" && "opacity-0")} />
                      </div>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-sidebar pt-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="h-10 w-full justify-start gap-4 rounded-md bg-white/10 px-4 text-white hover:bg-white/20 transition-all cursor-pointer"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="font-medium">Logout Admin</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

