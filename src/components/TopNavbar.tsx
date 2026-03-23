import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Bell, Check, Trash2, ShoppingBag, Package, Zap, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TopNavbar() {
  const { adminName } = useAuth();
  const { notifications, unreadCount, markAllAsRead, clearNotifications } = useNotifications();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-4 bg-[#C41E22] px-8 shadow-2xl rounded-b-[3rem] border-b border-white/5 backdrop-blur-md">
      <SidebarTrigger className="shrink-0 text-white hover:bg-white/10 h-10 w-10 rounded-full" />

      <form 
        onSubmit={handleSearch}
        className="relative flex-1 max-w-xl group"
      >
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70 group-focus-within:text-white transition-colors" />
        <Input
          placeholder="Search Products, Categories, Stock..."
          className="pl-11 h-11 bg-white/10 border-0 focus-visible:ring-1 text-white placeholder:text-white/50 rounded-full font-medium transition-all focus:bg-white/20"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-9 px-6 bg-white text-[#C41E22] rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/90 active:scale-95 transition-all shadow-lg hidden md:block"
        >
           Search
        </button>
      </form>

      <div className="ml-auto flex items-center gap-6">
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative rounded-full p-2.5 text-white hover:bg-white/10 transition-colors shadow-inner">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-white ring-2 ring-[#C41E22] animate-pulse" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 mr-4 mt-4 shadow-2xl rounded-3xl border-muted-foreground/10 overflow-hidden" align="end">
            <div className="flex items-center justify-between border-b bg-muted/30 px-6 py-4">
              <span className="text-xs font-black uppercase tracking-widest text-foreground">Notifications</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={markAllAsRead}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-destructive" onClick={clearNotifications}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto divide-y divide-muted-foreground/5 bg-card">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
                  <Bell className="h-10 w-10 mb-2" />
                  <p className="text-xs font-bold">No activity yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n.id} className={cn(
                    "relative flex gap-4 p-5 hover:bg-muted/30 transition-colors cursor-default",
                    !n.read && "bg-primary/[0.03]"
                  )}>
                    {!n.read && <div className="absolute top-5 right-5 h-2 w-2 rounded-full bg-primary" />}
                    <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      n.type === "order" ? "bg-success/10 text-success" :
                      n.type === "stock" ? "bg-warning/10 text-warning" :
                      n.type === "deal" ? "bg-primary/10 text-primary" : "bg-muted"
                    )}>
                      {n.type === "order" && <ShoppingBag className="h-4 w-4" />}
                      {n.type === "stock" && <Package className="h-4 w-4" />}
                      {n.type === "deal" && <Zap className="h-4 w-4" />}
                      {n.type === "security" && <ShieldAlert className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-black italic tracking-tighter uppercase leading-none">{n.title}</p>
                      <p className="text-xs text-muted-foreground font-medium leading-snug">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1 font-bold">{n.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {notifications.length > 0 && (
              <div className="border-t bg-muted/10 p-3 text-center">
                <Button 
                  variant="ghost" 
                  className="w-full text-[10px] font-black uppercase text-primary py-2 h-auto hover:bg-transparent tracking-widest"
                  onClick={() => window.location.href = "/activity-log"}
                >
                  VIEW MASTER AUDIT LOG
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => window.location.href = "/settings"}
        >
          <Avatar className="h-10 w-10 ring-2 ring-white/20 transition-transform group-hover:scale-110 shadow-lg">
            <AvatarFallback className="bg-white text-[#C41E22] text-[11px] font-black tracking-tighter italic">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex flex-col items-start leading-none transition-opacity group-hover:opacity-80">
            <span className="text-sm font-black text-white tracking-tighter italic">{adminName}</span>
            <span className="text-[9px] text-white/50 uppercase font-black tracking-widest mt-1">Master Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
