import { useState, useEffect } from "react";
import { FileText, Search, Download, ExternalLink, Calendar, Loader2, CheckCircle, Printer, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
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

// Extracted purely for bullet-proof, fail-safe printing.
const InvoiceTemplate = ({ invoice, logoUrl, isDialog = false }: { invoice: any, logoUrl: string, isDialog?: boolean }) => {
  if (!invoice) return null;
  return (
    <div className={cn("bg-white text-black w-full mx-auto print-template", isDialog ? "max-w-[800px]" : "max-w-[800px] mb-20")}>
      <div className="print-header bg-primary p-12 text-white relative overflow-hidden w-full">
        <div className="flex justify-between items-start mb-12 relative z-10 w-full">
          <div className="space-y-6">
            <img src={logoUrl} alt="LoopDeal" className="h-12 w-auto object-contain filter brightness-0 invert print-logo" />
            <div>
               <h2 className="text-xs font-black tracking-[0.3em] opacity-60 uppercase mb-4 print-dark-text">Official Payment Record</h2>
               <div className="text-[10px] font-black uppercase opacity-60 space-y-1 print-dark-text">
                 <p>LoopDeal Technical Services India</p>
                 <p>Industrial Hub, Sector 45</p>
                 <p>GSTIN: 27AABCU1234F1Z5</p>
               </div>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 print-dark-text">Bill #</span>
            <p className="text-5xl font-black italic tracking-tighter print-dark-text">#{invoice.id}</p>
            <Badge className="bg-white text-primary rounded-full mt-4 font-black italic text-[10px] px-4 print-badge">
              {invoice.status}
            </Badge>
          </div>
        </div>

        <div className="flex justify-between border-t border-white/10 pt-10 relative z-10 print-border w-full">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 print-dark-text">Customer Bill-To</span>
            <p className="text-3xl font-black italic tracking-tighter mt-1 uppercase print-dark-text">{invoice.customer}</p>
          </div>
          <div className="text-right max-w-[200px]">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 print-dark-text">Financial Date</span>
            <p className="text-2xl font-black tracking-tighter italic mt-1 print-dark-text">{invoice.date}</p>
            <p className="text-[10px] font-bold opacity-40 mt-1 uppercase tracking-widest print-dark-text">Order Reference: {invoice.orderId}</p>
          </div>
        </div>
      </div>

      <div className="p-12 w-full">
        <table className="w-full text-left border-collapse border-b-2 border-primary/5 pb-8 print-table-border">
          <thead>
            <tr className="border-b-2 border-primary/5 print-table-border">
              <th className="py-3 text-[11px] font-black uppercase tracking-widest text-primary/40 italic print-th">Hardware Description</th>
              <th className="py-3 text-[11px] font-black uppercase tracking-widest text-primary/40 italic text-right print-th">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item: any, i: number) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                <td className="py-6 pr-4 align-top w-[70%]">
                  <div className="text-base font-black italic tracking-tighter uppercase text-slate-900 leading-tight mb-1" style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
                     {item.productName}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     Unit: {formatCurrency(item.price)} • Qty: {item.quantity}
                  </div>
                </td>
                <td className="py-6 text-right align-top w-[30%]">
                  <span className="font-black text-2xl text-slate-900 italic tracking-tighter">{formatCurrency(item.price * item.quantity)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-10 mb-10 flex justify-between items-end w-full">
           <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Generated Authentically</span>
              <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-emerald-600 uppercase italic print-verified">Verified Transaction</span>
              </div>
           </div>
           <div className="text-right">
              <span className="text-[11px] font-black uppercase tracking-widest text-primary mb-1 block print-net-label">Net Amount Due</span>
              <span className="text-5xl font-black italic tracking-tighter text-slate-900">
                {formatCurrency(invoice.amount || 0)}
              </span>
           </div>
        </div>

        {isDialog && (
          <div className="flex gap-4 no-print">
            <Button onClick={() => window.print()} className="flex-1 rounded-full h-14 bg-secondary text-foreground font-black tracking-widest text-[11px] uppercase shadow-lg shadow-black/5 hover:scale-[1.02] transition-transform">
              <Printer className="mr-2 h-5 w-5 opacity-60" /> Print as PDF
            </Button>
          </div>
        )}
        
        <p className="mt-8 text-center text-[9px] font-black text-slate-300 uppercase tracking-widest italic print-footer">End of Official LoopDeal Transaction Document</p>
      </div>
    </div>
  );
};

export default function Invoices() {
  const { orders, updateOrderStatus, logoUrl } = useStore();
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isPrintingAll, setIsPrintingAll] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

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
    setIsPrintingAll(true);
    toast.loading("Compiling Master Billing Report...", {
      id: "export-report",
      description: "Gathering all store transaction records for PDF generation.",
    });

    setTimeout(() => {
      setIsExporting(false);
      toast.success("Ready for Print", {
        id: "export-report",
        description: `Exported ${invoices.length} invoices successfully.`,
      });
      // Small delay to ensure the DOM is completely flushed for all invoices
      setTimeout(() => {
        window.print();
        // Reset state after print dialog opens
        setTimeout(() => setIsPrintingAll(false), 2000);
      }, 500);
    }, 1500);
  };

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
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
      {/* STANDARD UI - hidden during multi print */}
      <div className={cn("transition-opacity", isPrintingAll && "opacity-0 absolute pointer-events-none")}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
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

        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search by Invoice ID, Order or Name..." 
            className="pl-9 h-11 bg-card border-muted-foreground/10 rounded-xl shadow-sm focus-visible:ring-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="rounded-2xl border bg-card shadow-sm overflow-hidden screen-only-table">
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
      </div>

      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl rounded-[2.5rem] overflow-hidden p-0 border-0 shadow-2xl single-print-dialog bg-white">
          <InvoiceTemplate invoice={selectedInvoice} logoUrl={logoUrl} isDialog={true} />
        </DialogContent>
      </Dialog>

      {/* MULTIPLE INVOICES PRINT CONTAINER (Hidden normally) */}
      {isPrintingAll && (
        <div className="all-invoices-print-container">
          {filteredInvoices.map((inv) => (
             <div key={inv.id} className="page-break-container">
                <InvoiceTemplate invoice={inv} logoUrl={logoUrl} isDialog={false} />
             </div>
          ))}
        </div>
      )}

      {/* GLOBAL CSS PRINT OVERRIDES FOR BULLETPROOF PDFs */}
      <style>{`
        /* Hide all invoices container on actual screen (except when triggered before print) */
        .all-invoices-print-container { display: none; }
        
        @media print {
          @page { size: auto; margin: 10mm; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print, [data-sonner-toaster], [data-sonner-toast] { display: none !important; }
          aside, header, button, [data-sidebar], .screen-only-table { display: none !important; }
          body, html, main { background: white !important; padding: 0 !important; margin: 0 !important; width: 100% !important; height: auto !important; overflow: visible !important; }
          
          ${selectedInvoice ? `
            /* SINGLE INVOICE PRINTING */
            body * { visibility: hidden; }
            .single-print-dialog, .single-print-dialog * { visibility: visible; }
            .single-print-dialog { 
              position: absolute !important; 
              left: 0 !important; 
              top: 0 !important; 
              width: 100% !important; 
              max-width: 100% !important;
              box-shadow: none !important; 
              transform: none !important;
              margin: 0 !important;
            }
          ` : isPrintingAll ? `
            /* MULTIPLE INVOICE PRINTING */
            body * { visibility: hidden; }
            .all-invoices-print-container, .all-invoices-print-container * { visibility: visible; }
            .all-invoices-print-container { 
               display: block !important; 
               position: absolute !important; 
               left: 0 !important; 
               top: 0 !important; 
               width: 100% !important; 
               max-width: 100% !important;
               transform: none !important;
               margin: 0 !important;
            }
            .page-break-container { page-break-after: always !important; page-break-inside: avoid !important; break-after: page !important; margin: 0 !important; padding: 0 !important; }
          ` : `
            /* Fallback generic print */
          `}

          /* CORE BLACK & WHITE GUARANTEE FOR INVOICES */
          .print-header { background: white !important; color: black !important; padding: 1rem !important; border-bottom: 3px solid #000 !important; }
          .print-dark-text, .print-dark-text * { color: black !important; opacity: 1 !important; text-shadow: none !important; }
          .print-logo { filter: none !important; }
          .print-border { border-top-color: #000 !important; }
          .print-badge { background: black !important; color: white !important; border: 1px solid black !important; }
          .print-table-border { border-color: black !important; }
          .print-th { color: black !important; opacity: 1 !important; border-bottom: 2px solid black !important; }
          .print-verified { color: black !important; }
          .print-net-label { color: black !important; }
          .print-footer { color: black !important; opacity: 0.5 !important; }
        }
      `}</style>
    </div>
  );
}
