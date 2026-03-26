// Mock data for the e-commerce admin dashboard oriented towards loopdeal.in

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  image: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  totalAmount: number;
  status: "Pending" | "Shipped" | "Delivered" | "Delayed";
  createdAt: string;
}

export const mockUsers: User[] = [
  { id: "u1", name: "Thirumalai", email: "karthik@example.com", role: "user", createdAt: "2025-11-15" },
  { id: "u2", name: "Elango", email: "vignesh@example.com", role: "user", createdAt: "2025-12-01" },
  { id: "u3", name: "Senthamizh", email: "muthu@example.com", role: "user", createdAt: "2026-01-10" },
  { id: "u4", name: "Naveen Ramesh", email: "naveen@loopdeal.in", role: "admin", createdAt: "2025-10-20" },
  { id: "u5", name: "Kayalvizhi", email: "priya@example.com", role: "user", createdAt: "2026-02-05" },
];

export const mockProducts: Product[] = [
  { id: "p1", name: "COFE 4G / 5G SIM Card Wi-Fi 6 Router", price: 1800, category: "Network", stock: 45, image: "https://loopdeal.in/wp-content/uploads/2020/10/COFE_ROUTER_U.jpg" },
  { id: "p2", name: "CP PLUS ezyKam+ Smart Wi-Fi Camera", price: 2499, category: "CCTV Cameras", stock: 120, image: "https://loopdeal.in/wp-content/uploads/2020/10/cp_E45A_1.jpg" },
  { id: "p3", name: "CP PLUS 2.4 MP Full HD IR Bullet Camera", price: 1599, category: "CCTV Cameras", stock: 200, image: "https://loopdeal.in/wp-content/uploads/2020/10/Bullet_2mp_BW_u-1.jpg" },
  { id: "p4", name: "CP PLUS 2.4 MP Full HD IR DOME Camera", price: 1499, category: "CCTV Cameras", stock: 30, image: "https://loopdeal.in/wp-content/uploads/2020/10/CP-PLUS-DOME-U.jpg" },
  { id: "p5", name: "CP PLUS 4-Channel DVR Special Edition", price: 3499, category: "NVR & DVR", stock: 18, image: "https://loopdeal.in/wp-content/uploads/2020/10/Product_Source_Image_temp.jpg" },
  { id: "p6", name: "CP PLUS 4G SIM Card Wi-Fi 6 Router", price: 2299, category: "Network", stock: 55, image: "https://loopdeal.in/wp-content/uploads/2020/10/COFE_ROUTER_U.jpg" },
  { id: "p7", name: "CP PLUS 8-Channel High Performance DVR", price: 4599, category: "NVR & DVR", stock: 80, image: "https://loopdeal.in/wp-content/uploads/2020/10/Product_Source_Image_temp.jpg" },
  { id: "p8", name: "DAHUA 4 Channel Smart NVR", price: 3700, category: "NVR & DVR", stock: 65, image: "https://loopdeal.in/wp-content/uploads/2020/10/DAHUA_NVR_U-1.jpg" },
  { id: "p9", name: "HIKVISION 4 Channel Professional NVR", price: 3800, category: "NVR & DVR", stock: 40, image: "https://loopdeal.in/wp-content/uploads/2020/10/HIKVISION_4c_NVR_U.jpg" },
  { id: "p10", name: "LENOVO THINKCENTRE M73 TINY PC", price: 14000, category: "Desktops", stock: 15, image: "https://loopdeal.in/wp-content/uploads/2024/12/PRODUCT_TEMPLATE_U-1.jpg" },
  { id: "p11", name: "MASTEL Wireless 4G High Speed Router", price: 2148, category: "Network", stock: 90, image: "https://loopdeal.in/wp-content/uploads/2020/10/MASTEL_U.jpg" },
  { id: "p12", name: "PRAMA 4-Channel Professional DVR", price: 2899, category: "NVR & DVR", stock: 110, image: "https://loopdeal.in/wp-content/uploads/2020/10/PRAMA_DVR.jpg" },
];

export const mockOrders: Order[] = [
  { id: "ORD-001", userId: "u1", userName: "Thirumalai", items: [{ productId: "p2", productName: "CP PLUS ezyKam+ Smart Wi-Fi Camera", quantity: 1, price: 2499 }], totalAmount: 2499, status: "Delivered", createdAt: "2026-03-01" },
  { id: "ORD-002", userId: "u2", userName: "Elango", items: [{ productId: "p10", productName: "LENOVO THINKCENTRE M73 TINY PC", quantity: 1, price: 14000 }], totalAmount: 14000, status: "Shipped", createdAt: "2026-03-05" },
  { id: "ORD-003", userId: "u3", userName: "Senthamizh", items: [{ productId: "p1", productName: "COFE 4G / 5G SIM Card Wi-Fi 6 Router", quantity: 2, price: 1800 }], totalAmount: 3600, status: "Pending", createdAt: "2026-03-10" },
  { id: "ORD-004", userId: "u5", userName: "Kayalvizhi", items: [{ productId: "p5", productName: "CP PLUS 4G SIM Card Wi-Fi 6 Router", quantity: 1, price: 2299 }], totalAmount: 2299, status: "Delayed", createdAt: "2026-03-12" },
];

export interface Transaction {
  id: string;
  orderId: string;
  userId: string;
  userName: string;
  amount: number;
  paymentMethod: "UPI" | "Credit Card" | "Debit Card" | "Net Banking";
  status: "Success" | "Pending" | "Failed";
  date: string;
}

export const mockTransactions: Transaction[] = [
  { id: "TXN-1001", orderId: "ORD-001", userId: "u1", userName: "Thirumalai", amount: 2499, paymentMethod: "UPI", status: "Success", date: "2026-03-01T10:30:00Z" },
  { id: "TXN-1002", orderId: "ORD-002", userId: "u2", userName: "Elango", amount: 14000, paymentMethod: "Credit Card", status: "Success", date: "2026-03-05T14:15:00Z" },
  { id: "TXN-1003", orderId: "ORD-003", userId: "u3", userName: "Senthamizh", amount: 3600, paymentMethod: "UPI", status: "Pending", date: "2026-03-10T09:45:00Z" },
  { id: "TXN-1004", orderId: "ORD-004", userId: "u5", userName: "Kayalvizhi", amount: 2299, paymentMethod: "Debit Card", status: "Success", date: "2026-03-12T16:20:00Z" },
  { id: "TXN-1005", orderId: "ORD-005", userId: "u1", userName: "Thirumalai", amount: 1599, paymentMethod: "UPI", status: "Failed", date: "2026-03-14T11:00:00Z" },
];

// Sales data for line chart
export const salesData = [
  { month: "Oct", sales: 42000 },
  { month: "Nov", sales: 58000 },
  { month: "Dec", sales: 82000 },
  { month: "Jan", sales: 61000 },
  { month: "Feb", sales: 74000 },
  { month: "Mar", sales: 98000 },
];

// Category data for pie chart based on LoopDeal tech categories
export const categoryData = [
  { name: "CCTV Cameras", value: 3, fill: "hsl(var(--chart-1))" },
  { name: "NVR & DVR", value: 5, fill: "hsl(var(--chart-2))" },
  { name: "Network", value: 3, fill: "hsl(var(--chart-3))" },
  { name: "Desktops", value: 1, fill: "hsl(var(--chart-4))" },
];
