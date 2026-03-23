import { useState } from "react";
import { 
  Bell, 
  ShoppingBag, 
  Package, 
  Zap, 
  ShieldAlert, 
  Clock, 
  Calendar,
  Search,
  Filter,
  Trash2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

export default function ActivityLog() {
  const { notifications, clearNotifications, markAllAsRead } = useNotifications();
  const [search, setSearch] = useState("");

  const filteredLogs = notifications.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.message.toLowerCase().includes(search.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case "order": return <ShoppingBag className="h-4 w-4" />;
      case "stock": return <Package className="h-4 w-4" />;
      case "deal": return <Zap className="h-4 w-4" />;
      case "security": return <ShieldAlert className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "order": return "text-success bg-success/10 border-success/20";
      case "stock": return "text-warning bg-warning/10 border-warning/20";
      case "deal": return "text-primary bg-primary/10 border-primary/20";
      case "security": return "text-destructive bg-destructive/10 border-destructive/20";
      default: return "text-muted-foreground bg-muted border-muted-foreground/10";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Activity Log</h1>
          <p className="text-sm text-muted-foreground mt-1 text-xs uppercase font-black tracking-widest opacity-60">Master Audit Trail for LoopDeal Admin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            className="rounded-full font-black text-[10px] uppercase tracking-widest h-10 px-6 border-muted-foreground/10 hover:bg-muted/50"
          >
            <CheckCircle2 className="mr-2 h-4 w-4" /> Mark All Read
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={clearNotifications}
            className="rounded-full font-bold text-[10px] uppercase tracking-widest h-10 px-6 shadow-lg shadow-destructive/20"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear All
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search activity events..." 
          className="pl-9 h-11 bg-card border-muted-foreground/10 rounded-xl shadow-sm focus-visible:ring-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-3xl border bg-card shadow-sm overflow-hidden">
        <div className="divide-y divide-muted-foreground/5">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-30">
              <Clock className="h-16 w-16 mb-4 animate-pulse" />
              <p className="font-black uppercase tracking-widest text-xs">No activity records found</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log.id} className={cn(
                "flex gap-6 p-6 transition-all hover:bg-muted/30 group relative",
                !log.read && "bg-primary/[0.02]"
              )}>
                {!log.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />}
                
                <div className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm transition-transform group-hover:scale-110",
                  getColor(log.type)
                )}>
                  {getIcon(log.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-black italic tracking-tighter uppercase text-foreground">{log.title}</h3>
                    <span className="text-[10px] font-bold text-muted-foreground opacity-50 flex items-center gap-1.5 uppercase font-mono">
                      <Clock className="h-3 w-3" /> {log.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-2xl">{log.message}</p>
                  <div className="flex items-center gap-4 pt-2">
                    <Badge variant="outline" className="rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest border-muted-foreground/10 opacity-70">
                      ID: {log.id}
                    </Badge>
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary italic opacity-60">
                      System Event
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="text-center pt-6 opacity-30">
         <p className="text-[9px] font-black uppercase tracking-[0.3em] italic">Secure Audit Trail • Encrypted Persistence</p>
      </div>
    </div>
  );
}
