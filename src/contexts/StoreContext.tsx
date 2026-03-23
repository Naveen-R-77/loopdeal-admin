import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mockProducts as initialProducts, mockOrders as initialOrders, Product, Order } from "@/data/mock-data";
import { API_BASE_URL } from "@/config";

export interface Category {
  id: string;
  name: string;
  count: number;
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  categories: Category[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  addCategory: (name: string) => void;
  deleteCategory: (id: string) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
  totalRevenue: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "CCTV Cameras", count: 0 },
    { id: "2", name: "NVR & DVR", count: 0 },
    { id: "3", name: "Network", count: 0 },
    { id: "4", name: "Desktops", count: 0 },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (response.ok) {
          const data = await response.json();
          // Map MongoDB _id to id if necessary
          const mapped = data.map((p: any) => ({ ...p, id: p._id }));
          setProducts(mapped);

          // Update category counts based on fetched products
          setCategories(prev => prev.map(cat => ({
            ...cat,
            count: mapped.filter((p: any) => p.category === cat.name).length
          })));
        }
      } catch (err) {
        console.error("Failed to fetch products from MongoDB:", err);
      }
    };
    fetchProducts();
  }, []);

  // Derive category counts and total stats
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const addProduct = (p: Product) => {
    setProducts(prev => [p, ...prev]);
    // Update category count
    setCategories(prev => prev.map(cat => 
      cat.name === p.category ? { ...cat, count: cat.count + 1 } : cat
    ));
  };

  const updateProduct = (p: Product) => {
    setProducts(prev => prev.map(old => old.id === p.id ? p : old));
  };

  const deleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (product) {
      setCategories(prev => prev.map(cat => 
        cat.name === product.category ? { ...cat, count: Math.max(0, cat.count - 1) } : cat
      ));
    }
  };

  const addCategory = (name: string) => {
    setCategories(prev => [...prev, { id: Date.now().toString(), name, count: 0 }]);
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const updateOrderStatus = (id: string, status: Order["status"]) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <StoreContext.Provider value={{ 
      products, 
      orders, 
      categories, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      addCategory, 
      deleteCategory,
      updateOrderStatus,
      totalRevenue
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
