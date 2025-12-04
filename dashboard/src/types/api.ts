// Fichier : src/types/api.ts

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface Order {
  id: number;  // Changé de string à number selon votre API
  totalCents: number;
  orderNumber:string;
  status: 'PLACED' | 'PENDING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  client: ClientDTO;
  shop: ShopDTO;
  items: OrderItemResponseDTO[];  // Utilisez OrderItemResponseDTO ici
}

export interface ClientDTO {
  id: number;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ShopDTO {
  id: number;
  name: string;
}

export interface OrderItemResponseDTO {
  productId: number;
  productName: string;
  quantity: number;
  priceCents: number;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
}

// Supprimez ou commentez l'ancienne interface OrderItem si elle existe
/*
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}
*/



export interface DashboardStats {
  data?:any
 totalRevenue: number; // En FCFA
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  newCustomers: number;
  conversionRate: number;
  averageOrderValue: number; // En FCFA
  trends?: {
    revenueGrowth: number;
    orderGrowth: number;
    customerGrowth: number;
    conversionGrowth: number;
  };
}

export interface SalesTrend {
  date: string; // ISO string
  revenue: number;
  sales: number;
  customers: number;
}

export interface TopProduct {
 productId: number;
  productName: string;
  categoryName?: string;
  imageUrl?: string;
  totalSold: number;
  totalRevenue: number; // En FCFA
}

export interface RecentOrder {
 orderId: number;
  orderNumber?: string;
  total: number; // En FCFA
  status: string;
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  shopName?: string;
}