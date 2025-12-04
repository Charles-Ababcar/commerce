import { Shop } from "@/types/api";

export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  categoryResponseDTO?: CategoryResponseDTO;
  stock: number;
  rating: number;
  shopId: string;
  cshopResponseDTO?:Shop
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryResponseDTO {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}
