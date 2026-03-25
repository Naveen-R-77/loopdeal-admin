import { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Store, 
  Bell, 
  Shield, 
  Save, 
  Globe, 
  Mail, 
  Lock, 
  Smartphone, 
  MapPin, 
  CreditCard,
  Palette,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useStore } from "@/contexts/StoreContext";

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const { logoUrl, updateLogo } = useStore();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateLogo(event.target.result as string);
          toast.success("Branding Asset Updated", {
            description: "The store logo has been updated and synchronized in real-time."
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Enterprise Configuration Synced", {
        description: "Your LoopDeal store settings have been updated and propagated."
      });
    }, 1200);
  };

  return (
    <div className="max-w-5xl space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground uppercase italic tracking-tighter italic">Enterprise Configuration</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Manage your global store identity, regional compliance, and operational security.</p>
        </div>
        <Badge variant="outline" className="rounded-full px-4 py-1 font-black text-[10px] uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">
           Production Environment
        </Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Store Identity */}
          <div className="rounded-[2.5rem] border bg-card shadow-sm overflow-hidden border-muted-foreground/10">
            <div className="border-b bg-muted/20 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                   <Store className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black italic tracking-tighter uppercase">Store Identity</h2>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="store-name" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-2">
                    <Globe className="h-3 w-3" /> Trading Name
                  </Label>
                  <Input id="store-name" defaultValue="LOOPDEAL STORE" className="h-12 rounded-xl bg-muted/30 border-0 font-bold tracking-tight" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="store-email" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Official Support Email
                  </Label>
                  <Input id="store-email" type="email" defaultValue="support@loopdeal.in" className="h-12 rounded-xl bg-muted/30 border-0 font-bold tracking-tight" />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="store-phone" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-2">
                    <Smartphone className="h-3 w-3" /> Business Contact
                  </Label>
                  <Input id="store-phone" defaultValue="+91 98765 43210" className="h-12 rounded-xl bg-muted/30 border-0 font-bold tracking-tight" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="store-gst" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-2">
                    <CreditCard className="h-3 w-3" /> Regional GSTIN
                  </Label>
                  <Input id="store-gst" defaultValue="27AABCU1234F1Z5" className="h-12 rounded-xl bg-muted/30 border-0 font-bold tracking-tight uppercase" />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="store-address" className="text-[10px] uppercase font-black tracking-widest text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> Physical Dispatch Address
                </Label>
                <Input id="store-address" defaultValue="Hub Technical Park, Tower 4, Level 15, Bangalore - 560001" className="h-12 rounded-xl bg-muted/30 border-0 font-bold tracking-tight" />
              </div>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="rounded-[2.5rem] border bg-card shadow-sm overflow-hidden border-muted-foreground/10">
            <div className="border-b bg-muted/20 px-8 py-6 flex items-center gap-4">
               <div className="h-10 w-10 rounded-2xl bg-success/10 flex items-center justify-center text-success shadow-inner">
                  <Globe className="h-5 w-5" />
               </div>
               <h2 className="text-lg font-black italic tracking-tighter uppercase text-foreground">Logistics & Region</h2>
            </div>
            <div className="p-8 space-y-6">
               <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Operational Timezone</Label>
                    <Select defaultValue="ist">
                      <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-0 font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="ist" className="font-bold">(GMT+05:30) IST, India</SelectItem>
                        <SelectItem value="gmt" className="font-bold">(GMT+00:00) UTC, London</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Base Trade Currency</Label>
                    <Input defaultValue="Indian Rupee (₹)" disabled className="h-12 rounded-xl bg-muted/50 border-0 font-black italic text-primary" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Branding Sidebar */}
           <div className="rounded-[2.5rem] border bg-card shadow-sm overflow-hidden border-muted-foreground/10">
              <div className="p-8 space-y-6">
                 <div className="flex items-center gap-3 mb-2">
                    <Palette className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-black italic tracking-tighter uppercase">Branding Hub</h3>
                 </div>
                  <div className="p-6 rounded-[2rem] bg-slate-950 flex flex-col items-center justify-center gap-6 shadow-2xl relative group cursor-pointer">
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-white/20 text-white hover:bg-white/30"><Eye className="h-4 w-4" /></Button>
                    </div>
                    <img src={logoUrl} alt="Current Logo" className="h-10 w-auto object-contain" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">Active Store Logo</span>
                 </div>
                 <div className="relative">
                   <input type="file" id="logo-upload" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleLogoUpload} />
                   <Button variant="outline" className="w-full rounded-2xl h-11 text-[10px] font-black uppercase tracking-widest border-muted-foreground/10 pointer-events-none">
                      Upload New Asset
                   </Button>
                 </div>
              </div>
           </div>

           {/* Security Quick View */}
           <div className="rounded-[2.5rem] border bg-card shadow-sm overflow-hidden border-muted-foreground/10">
              <div className="p-8 space-y-6">
                 <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-destructive" />
                    <h3 className="text-sm font-black italic tracking-tighter uppercase font-foreground">System Security</h3>
                 </div>
                 <Separator className="opacity-50" />
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-[11px] font-bold text-muted-foreground uppercase">2FA Auth</span>
                       <Badge variant="secondary" className="bg-destructive/10 text-destructive text-[9px] uppercase font-black tracking-tighter italic border-0">Disabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-[11px] font-bold text-muted-foreground uppercase">Cloud Sync</span>
                       <Badge variant="secondary" className="bg-success/10 text-success text-[9px] uppercase font-black tracking-tighter italic border-0">Active</Badge>
                    </div>
                 </div>
                 <Button className="w-full rounded-2xl h-11 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20">
                    <Lock className="mr-2 h-4 w-4" /> Hard Reset Auth
                 </Button>
              </div>
           </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-muted-foreground/10">
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-primary text-white font-black italic tracking-tighter uppercase h-14 px-12 rounded-full shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all text-base"
        >
          {loading ? (
             <><Save className="mr-3 h-5 w-5 animate-spin" /> DISPATCHING UPDATES...</>
          ) : (
             <><Save className="mr-3 h-5 w-5" /> SYNC ALL ENTERPRISE DATA</>
          )}
        </Button>
      </div>
    </div>
  );
}
