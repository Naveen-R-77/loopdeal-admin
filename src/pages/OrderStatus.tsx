import { useState } from "react";
import { ClipboardList, Search, Truck, Package, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useStore } from "@/contexts/StoreContext";
import { toast } from "sonner";

export default function OrderStatus() {
  const { orders, updateOrderStatus } = useStore();
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter((o) => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.userName.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { label: "Pending", count: orders.filter(o => o.status === "Pending").length, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "In Transit", count: orders.filter(o => o.status === "Shipped").length, icon: Truck, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Delivered", count: orders.filter(o => o.status === "Delivered").length, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
    { label: "Delayed", count: orders.filter(o => o.status === "Delayed").length, icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  const handleStatusChange = (id: string, status: string) => {
    // Map "In Transit" selection back to "Shipped" internal status
    const internalStatus = status === "In Transit" ? "Shipped" : status;
    updateOrderStatus(id, internalStatus as any);
    toast.success(`Logistics Updated`, {
      description: `Order #${id} has been moved to ${status}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">LoopDeal Logistics</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage real-time shipment progress and logistics status</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-2xl opacity-10", stat.color.replace('text-', 'bg-'))} />
            <div className="flex items-center justify-between font-black uppercase tracking-widest text-[10px] text-muted-foreground mb-4">
              <span>{stat.label}</span>
              <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg shadow-inner", stat.bg, stat.color)}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-black italic tracking-tighter text-foreground decoration-primary/20 underline underline-offset-4 decoration-2">{stat.count}</div>
            <div className="mt-1 text-[10px] font-bold text-muted-foreground opacity-50 uppercase tracking-tighter">Current Count</div>
          </div>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Filter by Order ID or Client Name..." 
          className="pl-9 h-11 bg-card border-muted-foreground/10 rounded-xl shadow-sm focus-visible:ring-1" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted lg:bg-muted/30 border-b">
              <tr>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Order Ref</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Tracking Client</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Live Update Status</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Processing Date</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground text-right">Logistics Center</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.map((order) => {
                const currentDisplayStatus = order.status === "Shipped" ? "In Transit" : order.status;
                const location = order.status === "Delivered" ? "Final Destination" : order.status === "Shipped" ? "In Transit (Hub)" : "Sorting Center";
                
                return (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-black text-primary tracking-tighter italic text-base">#{order.id}</td>
                    <td className="px-6 py-4 font-bold text-foreground uppercase tracking-tighter">{order.userName}</td>
                    <td className="px-6 py-4">
                      <Select 
                        value={currentDisplayStatus} 
                        onValueChange={(v) => handleStatusChange(order.id, v)}
                      >
                        <SelectTrigger className={cn(
                          "h-9 w-36 rounded-full font-black text-[9px] uppercase tracking-widest border-transparent",
                          order.status === "Delivered" ? "bg-success text-white" :
                          order.status === "Pending" ? "bg-orange-500 text-white" :
                          order.status === "Delayed" ? "bg-destructive text-white shadow-lg shadow-destructive/20 animate-pulse" :
                          "bg-blue-500 text-white"
                        )}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-muted-foreground/10">
                          <SelectItem value="Pending" className="text-[10px] font-black uppercase tracking-widest">Pending</SelectItem>
                          <SelectItem value="In Transit" className="text-[10px] font-black uppercase tracking-widest">In Transit</SelectItem>
                          <SelectItem value="Delivered" className="text-[10px] font-black uppercase tracking-widest">Delivered</SelectItem>
                          <SelectItem value="Delayed" className="text-[10px] font-black uppercase tracking-widest text-destructive">Delayed</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{order.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full animate-pulse",
                          order.status === "Delivered" ? "bg-success" : "bg-primary"
                        )} />
                        <span className="text-[10px] font-black uppercase tracking-tighter italic text-muted-foreground opacity-70">{location}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <ClipboardList className="h-12 w-12 mb-2" />
                      <p className="font-black uppercase tracking-widest text-xs">No active shipments found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
