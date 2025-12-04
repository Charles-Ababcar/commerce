import { Product } from "@/models/Product";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: number | string;
  quantity: number;
  totalCents: number;
  product: {
    id: number;
    name: string;
    imageUrl: string;
    priceCents: number;
    stock: number;
    category:  {id: number; name: string; address: string | null };
    shop: { id: number; name: string; address: string | null };
  };
}


export interface Cart {
  id?: string;
  userId?: string;
  items?: CartItem[];
  subtotal?: number;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
  productId?:number;
  quantity?:number;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}


// Dans src/lib/api.ts (ou src/types/api.ts)

 // Interface pour la requête de commande
  export interface PlaceOrderRequest {
    client: {
      name: string;
      email: string;
      address: string;
      phoneNumber: string;
    };
    orderItems: Array<{
      productId: number;
      quantity: number;
    }>;
  }

  // Interface pour la réponse
  export interface PlaceOrderResponse {
    data?: {
      orderId?: number;
      [key: string]: any;
    };
    message?: string;
    status?: number;
  }


  // Fichier : src/types/api.ts (ou similaire)

/**
 * Interface pour le DTO de la Boutique (Shop)
 * Correspond à l'objet retourné dans 'data' par l'API pour une boutique.
 */
export interface ShopDTO {
    id: number;
    name: string;
    // Ajout des champs si le backend les renvoie (ils n'étaient pas visibles dans le code d'origine)
    // description: string; 
    // imageUrl: string; 
    // rating: number; 
}


// Fichier : src/types/api.ts

/**
 * Interface pour le DTO de la Catégorie (simplifié)
 */
export interface CategoryDTO {
    id: number;
    name: string;
}

/**
 * Interface pour le DTO détaillé d'un Produit
 * Correspond au ProductResponseDTO du backend.
 */
export interface ProductResponseDTO {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    priceCents: number;
    stock: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    
    // ⭐️ Important : Le rating que vous avez mis dans l'entité/DTO backend
    rating: number; 
    
    // Relations imbriquées
    shop: ShopDTO; // Réutilise le DTO de la boutique
    category: CategoryDTO;
}


// Fichier : src/types/api.ts

/**
 * Structure de pagination standard (correspond à PageResponse<T> du backend)
 */
export interface PageResponse<T> {
    content: T[]; // ⬅️ Contient la liste des ProductResponseDTO
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}

/**
 * Structure de réponse enveloppée (correspond à ApiResponse<T> du backend)
 */
export interface ApiResponse<T> {
    message: string;
    data: T; // ⬅️ Le champ qui causait l'erreur "unknown"
    content?:T;
    totalPages?:number;
    totalElements?:number;
    statusCode: number;
}

export interface PaginationParams {
    page?: number;
    size?: number;
    sort?: string; // Ex: 'createdAt,desc'
    [key: string]: any; // Permet d'autres paramètres optionnels (recherche, filtre, etc.)
}


// Interface pour les données de commande
export interface OrderDetails {
  orderId?: string | number;
  orderNumber?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  totalAmount?: number;
  items?: Array<{
    id: number;
    productName: string;
    quantity: number;
    price: number;
    imageUrl?: string;
    downloadUrl?: string;
  }>;
  status?: string;
  orderDate?: string;
  deliveryDate?: string;
}