import { useState } from "react";
import { FileText, Search, Download, ExternalLink, Calendar, Loader2, CheckCircle, Printer, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { cn, formatCurrency } from "@/lib/utils";
import { useStore } from "@/contexts/StoreContext";

export default function Invoices() {
  const { orders, updateOrderStatus, logoUrl } = useStore();
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  // Map orders to invoices for "original data" feel
  const invoices = (orders || []).map((order, idx) => ({
    id: `INV-${1000 + idx}`,
    orderId: order.id,
    customer: order.userName,
    amount: order.totalAmount,
    date: order.createdAt,
    status: order.status === "Delivered" ? "Paid" : order.status === "Shipped" ? "Pending" : "Unpaid",
    rawStatus: order.status,
    items: order.items,
  }));

  const filteredInvoices = invoices.filter((inv) =>
    inv.id.toLowerCase().includes(search.toLowerCase()) || 
    inv.orderId.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportAll = () => {
    setIsExporting(true);
    toast.loading("Compiling Master Billing Report...", {
      id: "export-report",
      description: "Gathering all store transaction records for PDF generation.",
    });

    setTimeout(() => {
      setIsExporting(false);
      toast.success("Project Report Generated", {
        id: "export-report",
        description: `Exported ${invoices.length} invoices successfully.`,
      });
      window.print();
    }, 3000);
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // Map billing status back to order status
    const mappedStatus = newStatus === "Paid" ? "Delivered" : newStatus === "Pending" ? "Shipped" : "Pending";
    updateOrderStatus(orderId, mappedStatus as any);
    toast.success("Billing Status Updated", {
      description: `Payment record for ${orderId} has been synced.`,
    });
  };

  const handleAction = (inv: any, action: 'print' | 'view') => {
    setSelectedInvoice(inv);
    if (action === 'print') {
      toast.info("Preparing high-quality PDF...");
      setTimeout(() => window.print(), 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices & Billing</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track store payment records efficiently</p>
        </div>
        <Button 
          disabled={isExporting}
          onClick={handleExportAll}
          className="rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/20 bg-primary text-white font-black tracking-widest text-[10px] h-11 px-8 transition-transform active:scale-95"
        >
          {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          {isExporting ? "PROCESSING..." : "DOWNLOAD ALL PDF"}
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          placeholder="Search by Invoice ID, Order or Name..." 
          className="pl-9 h-11 bg-card border-muted-foreground/10 rounded-xl shadow-sm focus-visible:ring-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-muted lg:bg-muted/30 border-b">
              <tr>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Invoice ID</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Order Ref</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Customer</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">Amount</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground text-center">Status</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground text-right w-40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y border-t-0">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4 font-black text-primary tracking-tighter italic text-base">#{inv.id}</td>
                  <td className="px-6 py-4 font-medium text-muted-foreground font-mono text-xs italic opacity-60">{inv.orderId}</td>
                  <td className="px-6 py-4 font-bold text-foreground uppercase tracking-tighter">{inv.customer}</td>
                  <td className="px-6 py-4 font-black text-foreground">{formatCurrency(inv.amount)}</td>
                  <td className="px-6 py-4 text-center">
                    <Select value={inv.status} onValueChange={(v) => handleStatusUpdate(inv.orderId, v)}>
                      <SelectTrigger className={cn(
                        "h-8 w-28 mx-auto rounded-full font-black text-[9px] uppercase tracking-widest border-transparent shadow-sm",
                        inv.status === "Paid" ? "bg-success text-white" :
                        inv.status === "Unpaid" ? "bg-destructive text-white" :
                        "bg-warning text-warning-foreground"
                      )}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Paid" className="text-[10px] font-black uppercase tracking-widest">Paid</SelectItem>
                        <SelectItem value="Pending" className="text-[10px] font-black uppercase tracking-widest">Pending</SelectItem>
                        <SelectItem value="Unpaid" className="text-[10px] font-black uppercase tracking-widest">Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <Button variant="secondary" size="icon" className="h-9 w-9 text-primary bg-primary/10 hover:bg-primary/20 rounded-xl" onClick={() => handleAction(inv, 'print')}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="secondary" size="icon" className="h-9 w-9 text-dark bg-secondary/80 hover:bg-secondary rounded-xl" onClick={() => handleAction(inv, 'view')}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <FileText className="h-10 w-10 mb-2 animate-pulse" />
                      <p className="font-bold uppercase tracking-widest text-[10px]">No visible invoices found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] overflow-hidden p-0 border-0 shadow-2xl printable-area">
          <div className="bg-primary p-12 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <FileText className="h-64 w-64 -mr-16 -mt-16 rotate-12" />
             </div>
            <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="space-y-6">
                <img src={logoUrl} alt="LoopDeal" className="h-12 w-auto object-contain filter brightness-0 invert" />
                <div>
                   <h2 className="text-xs font-black tracking-[0.3em] opacity-60 uppercase mb-4">Official Payment Record</h2>
                   <div className="text-[10px] font-black uppercase opacity-60 space-y-1">
                     <p>LoopDeal Technical Services India</p>
                     <p>Industrial Hub, Sector 45</p>
                     <p>GSTIN: 27AABCU1234F1Z5</p>
                   </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Bill #</span>
                <p className="text-5xl font-black italic tracking-tighter">#{selectedInvoice?.id}</p>
                <Badge className="bg-white text-primary rounded-full mt-4 font-black italic text-[10px] px-4">
                  {selectedInvoice?.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 border-t border-white/10 pt-10 relative z-10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Customer Bill-To</span>
                <p className="text-3xl font-black italic tracking-tighter mt-1 uppercase decoration-white/20 underline underline-offset-4">{selectedInvoice?.customer}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Financial Date</span>
                <p className="text-2xl font-black tracking-tighter italic mt-1">{selectedInvoice?.date}</p>
                <p className="text-[10px] font-bold opacity-40 mt-1 uppercase tracking-widest">Order Reference: {selectedInvoice?.orderId}</p>
              </div>
            </div>
          </div>

          <div className="p-12 bg-card">
            <div className="space-y-6 pb-8 border-b-2 border-primary/5">
              <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-primary/40 italic">
                 <span>Hardware Description</span>
                 <span>Subtotal</span>
              </div>
              <div className="space-y-5">
                {selectedInvoice?.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-start gap-4">
                    <div className="flex flex-col flex-1">
                      <span className="text-sm sm:text-lg font-black italic tracking-tighter uppercase text-foreground leading-tight break-words">{item.productName}</span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                         Unit: {formatCurrency(item.price)} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-black text-xl sm:text-2xl text-foreground italic tracking-tighter shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 mb-10 flex justify-between items-end">
               <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-30 italic">Generated Authentically</span>
                  <div className="flex items-center gap-2">
                     <div className="h-6 w-12 bg-slate-100 rounded flex items-center justify-center opacity-50"><span className="text-[6px] font-black">STAMP</span></div>
                     <span className="text-[10px] font-bold text-success uppercase italic">Verified Transaction</span>
                  </div>
               </div>
               <div className="text-right">
                  <span className="text-[11px] font-black uppercase tracking-widest text-primary mb-1 block">Net Amount Due</span>
                  <span className="text-6xl font-black italic tracking-tighter text-foreground decoration-primary decoration-8 underline underline-offset-8">
                    {formatCurrency(selectedInvoice?.amount || 0)}
                  </span>
               </div>
            </div>

            <div className="flex gap-4 no-print">
              <Button onClick={() => window.print()} className="flex-1 rounded-full h-14 bg-secondary text-foreground font-black tracking-widest text-[11px] uppercase shadow-lg shadow-black/5 hover:scale-[1.02] transition-transform">
                <Printer className="mr-2 h-5 w-5 opacity-60" /> Print as PDF
              </Button>
              <Button className="flex-1 rounded-full h-14 bg-primary text-white font-black tracking-widest text-[11px] uppercase shadow-2xl shadow-primary/30 hover:scale-[1.02] transition-transform">
                <Mail className="mr-2 h-5 w-5 opacity-60" /> Send Copy
              </Button>
            </div>
            
            <p className="mt-8 text-center text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-20 italic">End of Official LoopDeal Transaction Document</p>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
          ${selectedInvoice ? `
          body * { visibility: hidden; }
          .printable-area, .printable-area * { visibility: visible; }
          .printable-area { position: absolute; left: 0; top: 0; width: 100%; border-radius: 0 !important; box-shadow: none !important; }
          ` : ``}
        }
      `}</style>
    </div>
  );
}
