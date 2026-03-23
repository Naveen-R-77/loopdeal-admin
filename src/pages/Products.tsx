import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Product } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, cn } from "@/lib/utils";
import { useStore } from "@/contexts/StoreContext";

const PAGE_SIZE = 6;

export default function Products() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();

  // Form state
  const [editProductState, setEditProductState] = useState<Product | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", category: "CCTV Cameras", stock: "", image: "" });

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setSearch(query);
      setPage(1);
    }
    if (searchParams.get("add") === "true") {
      openAdd();
    }
  }, [searchParams]);

  // Defensive filtering check
  const filtered = (products || []).filter((p) => {
    if (!p) return false;
    const matchSearch = 
      (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setEditProductState(null);
    setForm({ name: "", price: "", category: categories?.[0]?.name || "CCTV Cameras", stock: "", image: "" });
    setFormOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditProductState(p);
    setForm({ name: p.name, price: String(p.price), category: p.category, stock: String(p.stock), image: p.image });
    setFormOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) {
      toast.error("Name and price are required");
      return;
    }
    if (editProductState) {
      updateProduct({ 
        ...editProductState, 
        name: form.name, 
        price: Number(form.price), 
        category: form.category, 
        stock: Number(form.stock), 
        image: form.image 
      });
      toast.success("Product updated");
    } else {
      const newProduct: Product = {
        id: `p${Date.now()}`,
        name: form.name,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        image: form.image || "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=100&h=100&fit=crop",
      };
      addProduct(newProduct);
      toast.success("Product added");
    }
    setFormOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      toast.success("Product deleted");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">LoopDeal Inventory</h1>
        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd} className="bg-primary text-white hover:bg-primary/90 font-bold px-6 rounded-full"><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-bold">{editProductState ? "Edit Product" : "Launch New Hardware"}</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-1"><Label>Product Name</Label><Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. CP PLUS 4K Camera" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} /></div>
                <div className="space-y-1"><Label>Stock Units</Label><Input type="number" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} /></div>
              </div>
              <div className="space-y-1">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{(categories || []).map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Image URL (Optional)</Label><Input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://..." /></div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleSave} className="bg-primary text-white">{editProductState ? "Update Hardware" : "Sync to Store"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search LoopDeal stock..." className="pl-9 bg-card" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[180px] bg-card"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {(categories || []).map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-16">Stock</TableHead>
              <TableHead>Hardware Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">In Stock</TableHead>
              <TableHead className="text-right w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((p) => (
              <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                <TableCell><img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover border shadow-sm" /></TableCell>
                <TableCell className="font-bold max-w-[200px] truncate text-foreground">{p.name || "Unnamed Product"}</TableCell>
                <TableCell className="text-muted-foreground font-medium">{p.category || "Uncategorized"}</TableCell>
                <TableCell className="text-right font-black text-foreground">{formatCurrency(p.price)}</TableCell>
                <TableCell className="text-right">
                   <span className={cn(
                     "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                     (p.stock || 0) < 10 ? "bg-red-100 text-red-600" : "bg-success/10 text-success"
                   )}>
                     {p.stock || 0} Units
                   </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)} className="h-8 w-8 hover:text-primary hover:bg-primary/5 transition-colors"><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/5 transition-colors" onClick={() => handleDeleteClick(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground italic">No technical hardware found in this segment.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="outline" size="sm" className="rounded-full px-4" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" className="rounded-full px-4" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
