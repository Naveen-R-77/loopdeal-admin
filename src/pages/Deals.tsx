import { useState } from "react";
import { Zap, Percent, Clock, Plus, Pencil, Trash2, Calendar, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/contexts/NotificationContext";

interface Deal {
  id: string;
  name: string;
  discount: string;
  ends: string;
  status: "Active" | "Upcoming" | "Ended";
  type: string;
}

const LOOPDEAL_DEALS: Deal[] = [
  { id: "1", name: "CCTV Camera System Flash Sale", discount: "35%", ends: "10h 45m", status: "Active", type: "Security System" },
  { id: "2", name: "High Speed 4G / 5G Router Deal", discount: "25%", ends: "2d 12h", status: "Upcoming", type: "Networking" },
  { id: "3", name: "Summer Sale DVR & NVR Hubs", discount: "50%", ends: "Expired", status: "Ended", type: "Surveillance" },
  { id: "4", name: "CP PLUS ezyKam+ Limited Offer", discount: "30%", ends: "5h 20m", status: "Active", type: "Smart Home" },
];

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>(LOOPDEAL_DEALS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    name: "",
    discount: "",
    duration: "",
    status: "Upcoming" as Deal["status"],
    type: "Flash Sale"
  });

  const handleOpenAdd = () => {
    setEditingDeal(null);
    setFormData({
      name: "",
      discount: "",
      duration: "",
      status: "Upcoming",
      type: "Flash Sale"
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      name: deal.name,
      discount: deal.discount.replace('%', ''),
      duration: deal.ends,
      status: deal.status,
      type: deal.type
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.discount) {
      toast.error("Name and discount are required");
      return;
    }

    const savedDeal: Deal = {
      id: editingDeal?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      discount: formData.discount.includes('%') ? formData.discount : `${formData.discount}%`,
      ends: formData.duration || "24h",
      status: formData.status,
      type: formData.type,
    };

    if (editingDeal) {
      setDeals((prev) => prev.map((d) => (d.id === editingDeal.id ? savedDeal : d)));
      toast.success("Deal updated successfully");
      addNotification("Deal Updated", `"${savedDeal.name}" campaign has been modified.`, "deal");
    } else {
      setDeals((prev) => [savedDeal, ...prev]);
      toast.success("New deal created successfully");
      addNotification("New Deal Launched", `"${savedDeal.name}" offer with ${savedDeal.discount} discount is now configured.`, "deal");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the "${name}" deal?`)) {
      setDeals((prev) => prev.filter((d) => d.id !== id));
      toast.success("Deal removed");
      addNotification("Deal Deleted", `"${name}" campaign successfully removed.`, "deal");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground italic tracking-tighter decoration-primary/20 underline">Deals of the Day</h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium opacity-70">Manage your promotional store campaigns in real-time.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAdd} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-full h-11 px-6 font-black tracking-widest text-xs">
              <Plus className="mr-2 h-4 w-4" /> CREATE CAMPAIGN
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-black text-2xl uppercase tracking-tighter italic">Launch Promo</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="deal-name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Deal Name</Label>
                <Input
                  id="deal-name"
                  placeholder="e.g. CP PLUS Flash Sale"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border-muted-foreground/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="discount" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    placeholder="30"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="rounded-xl border-muted-foreground/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Campaign Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(v: Deal["status"]) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger id="status" className="rounded-xl border-muted-foreground/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="duration" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Duration Hub / Ends in</Label>
                <Input
                  id="duration"
                  placeholder="e.g. 10h 30m or 2d 1h"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="rounded-xl border-muted-foreground/20"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">Promotion Type</Label>
                <Input
                  id="type"
                  placeholder="e.g. Security, Network"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="rounded-xl border-muted-foreground/20"
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button variant="outline" className="rounded-full h-11 px-8 border-muted-foreground/20 text-xs font-black uppercase tracking-widest">CANCEL</Button>
              </DialogClose>
              <Button onClick={handleSave} className="bg-primary text-white rounded-full h-11 px-8 shadow-lg shadow-primary/20 text-xs font-black uppercase tracking-widest italic tracking-tighter">
                {editingDeal ? "SYNC CHANGES" : "FIRE PROMO"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {deals.map((deal) => (
          <div key={deal.id} className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
            <div className={cn(
              "absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-60",
              deal.status === "Active" ? "bg-success" : 
              deal.status === "Upcoming" ? "bg-primary" : "bg-muted"
            )} />

            <div className="mb-4 flex items-center justify-between">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl transition-all group-hover:scale-110",
                deal.status === "Active" ? "bg-success/10 text-success shadow-inner" : 
                deal.status === "Upcoming" ? "bg-primary/10 text-primary shadow-inner" : 
                "bg-muted/10 text-muted-foreground"
              )}>
                <Zap className={cn("h-6 w-6", deal.status === "Active" && "fill-success/20 animate-pulse")} />
              </div>
              <Badge variant="outline" className={cn(
                "rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest transition-all",
                deal.status === "Active" ? "bg-success text-white border-transparent shadow-lg shadow-success/20" :
                deal.status === "Upcoming" ? "bg-primary/10 text-primary border-primary/20" :
                "bg-muted text-muted-foreground border-muted-foreground/20"
              )}>
                {deal.status}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter opacity-50 italic">{deal.type}</span>
              <h3 className="text-xl font-black leading-tight text-foreground line-clamp-1 italic tracking-tighter">{deal.name}</h3>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-lg bg-orange-600/10 px-2.5 py-1 text-orange-600 ring-1 ring-orange-600/20">
                <Percent className="h-4 w-4" />
                <span className="text-xl font-black italic tracking-tighter">{deal.discount}</span>
              </div>
              <div className="text-[10px] font-black text-muted-foreground leading-tight italic opacity-60 tracking-tighter">
                MEGA STORE<br/>DISCOUNT
              </div>
            </div>
            
            <div className="mt-8 flex items-center justify-between border-t border-dashed border-muted-foreground/20 pt-4">
              <div className="flex items-center gap-2 text-xs font-black italic tracking-tighter text-muted-foreground uppercase opacity-80">
                <Clock className="h-4 w-4" /> {deal.ends}
              </div>
              <div className="flex gap-2.5 opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0">
                <Button 
                  size="icon" 
                  variant="outline" 
                   className="h-9 w-9 rounded-xl border-primary/20 text-primary hover:bg-primary/5 shadow-sm group/btn p-0"
                  onClick={() => handleOpenEdit(deal)}
                >
                  <Pencil className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                </Button>
                <Button 
                  size="icon" 
                  variant="outline" 
                  className="h-9 w-9 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/5 shadow-sm group/btn p-0"
                  onClick={() => handleDelete(deal.id, deal.name)}
                >
                  <Trash2 className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
