export interface Product {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string;
  priceCents: number;
  stock: number;
  categoryResponseDTO: {
    id: number;
    name: string;
    description: string;
    createdAt: string | null;
    updatedAt: string;
  } | null;
  cshopResponseDTO: {
    id: number;
    name: string;
    description: string;
    address: string;
    phoneNumber: string;
    email: string;
    imageUrl: string | null;
    isActive: boolean | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  content: Product[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface ApiResponse {
  message: string;
  data: PaginationData;
}