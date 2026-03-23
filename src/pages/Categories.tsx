import { useState } from "react";
import { Tag, Package, Search, Plus, Pencil, Trash2, TrendingUp, TrendingDown, Camera, Shield, Monitor, Laptop, Wifi, HardDrive, Printer, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useStore } from "@/contexts/StoreContext";

const iconMap: Record<string, any> = {
  "CCTV Cameras": Camera,
  "NVR & DVR": Shield,
  "Network": Wifi,
  "Desktops": Monitor,
  "Laptops & Tablets": Laptop,
  "Refurbished Hardware": Package,
  "Storage (HDD/SSD)": HardDrive,
  "Printers": Printer,
  "UPS & Power": Zap,
};

export default function Categories() {
  const { categories, addCategory, deleteCategory, products } = useStore();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "" });

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setFormData({ name: "" });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    
    addCategory(formData.name);
    toast.success("Category added and synced");
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">LoopDeal Segments</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage technical hardware families in real-time</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAdd} className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-full font-bold px-6">
              <Plus className="mr-2 h-4 w-4" /> New Segment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-bold">Register New Tech Segment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Segment Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Wireless Audio"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" className="rounded-full">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSave} className="bg-primary text-white rounded-full px-6">Launch Segment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Filter segments..." 
          className="pl-9 bg-card shadow-sm border-muted-foreground/10 rounded-xl" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((cat) => {
          const Icon = iconMap[cat.name] || Tag;
          const productCount = products.filter(p => p.category === cat.name).length;
          
          return (
            <div key={cat.id} className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:rotate-12 group-hover:scale-110 shadow-inner">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-end">
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase text-success tracking-widest">
                    <TrendingUp className="h-3 w-3" /> Real-time
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-30">Status</span>
                </div>
              </div>

              <h3 className="text-xl font-black tracking-tighter text-foreground italic uppercase">{cat.name}</h3>
              
              <div className="mt-4 flex items-center justify-between bg-muted/30 p-4 rounded-xl border border-muted-foreground/5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter opacity-70">Catalog Assets</span>
                  <span className="text-lg font-black text-foreground italic tracking-tighter">{productCount} SKUs</span>
                </div>
                <div className="h-8 w-[1px] bg-muted-foreground/10" />
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter opacity-70">Visibility</span>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">Global</span>
                </div>
              </div>

              <div className="mt-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 rounded-xl border-destructive/20 hover:bg-destructive/5 hover:text-destructive transition-colors text-xs font-black uppercase tracking-widest"
                  onClick={() => deleteCategory(cat.id)}
                >
                   Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
