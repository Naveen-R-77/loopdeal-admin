import { Users, Package, ShoppingCart, IndianRupee } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { formatCurrency } from "@/lib/utils";
import { useStore } from "@/contexts/StoreContext";
import { salesData } from "@/data/mock-data";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = [
  "hsl(239,84%,67%)", "hsl(160,84%,39%)", "hsl(38,92%,50%)",
  "hsl(0,84%,60%)", "hsl(280,68%,60%)", "hsl(200,80%,50%)",
  "hsl(140,70%,50%)", "hsl(320,70%,60%)", "hsl(45,90%,45%)"
];

export default function Dashboard() {
  const { products, orders, categories, totalRevenue } = useStore();

  // Create real data for the pie chart based on total units (stock) per category
  const activeCategoryData = categories.map((cat, idx) => ({
    name: cat.name,
    value: products
      .filter(p => p.category === cat.name)
      .reduce((acc, current) => acc + current.stock, 0),
    fill: COLORS[idx % COLORS.length]
  })).filter(c => c.value > 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>

      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Users" 
          value="5" 
          icon={Users} 
          gradient="bg-gradient-to-br from-primary to-[hsl(260,80%,60%)]" 
        />
        <StatsCard 
          title="Total Products" 
          value={String(products.length)} 
          icon={Package} 
          gradient="bg-gradient-to-br from-success to-[hsl(170,70%,45%)]" 
        />
        <StatsCard 
          title="Total Orders" 
          value={String(orders.length)} 
          icon={ShoppingCart} 
          gradient="bg-gradient-to-br from-warning to-[hsl(25,90%,55%)]" 
        />
        <StatsCard 
          title="Revenue" 
          value={formatCurrency(totalRevenue)} 
          icon={IndianRupee} 
          gradient="bg-gradient-to-br from-destructive to-[hsl(330,70%,55%)]" 
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <div className="rounded-lg border bg-card p-5">
          <h2 className="mb-4 text-base font-semibold text-foreground">Sales Over Time</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: 13,
                }}
              />
              <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Chart */}
        <div className="rounded-lg border bg-card p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Package className="h-20 w-20" />
          </div>
          <h2 className="mb-4 text-base font-semibold text-foreground">Live Inventory Distribution</h2>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={activeCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {activeCategoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full lg:w-48 flex flex-col justify-center space-y-3">
              <h3 className="text-[10px] font-black tracking-widest uppercase opacity-40 mb-2">Detailed Inventory</h3>
              {activeCategoryData.map((cat, i) => (
                <div key={i} className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.fill }} />
                    <span className="text-xs font-medium text-foreground/80 group-hover/item:text-foreground transition-colors truncate max-w-[100px]">{cat.name}</span>
                  </div>
                  <span className="text-xs font-black opacity-40">{cat.value} Units</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
