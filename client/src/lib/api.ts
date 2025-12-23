import { ApiResponse, PageResponse, PaginationParams, PlaceOrderRequest, PlaceOrderResponse, ProductResponseDTO, ShopDTO } from "@/types/api";

// lib/api.ts
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // private isTokenExpired(token: string): boolean {
  //   try {
  //     const payload = JSON.parse(atob(token.split('.')[1]));
  //     return payload.exp * 1000 < Date.now();
  //   } catch {
  //     return false;
  //   }
  // }

  private handleLogout() {
    this.clearToken();
    window.location.href = '/login';
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const method = options.method || "GET";
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    };

    // if (this.token) {
    //   if (this.isTokenExpired(this.token)) {
    //     console.warn("Token expiré côté client → logout automatique");
    //     this.handleLogout();
    //     throw new Error("Token expiré");
    //   }
    //   headers["Authorization"] = `Bearer ${this.token}`;
    // }

    console.log("%c[API REQUEST] → " + method + " " + url, "color:#0ea5e9;font-weight:bold");

    const start = performance.now();

    try {
      const response = await fetch(url, { ...options, headers });

      // if (response.status === 401) {
      //   console.warn("Token expiré côté serveur → logout automatique");
      //   this.handleLogout();
      //   throw new Error("Token expiré (serveur)");
      // }

      const contentType = response.headers.get("content-type");
      const isJson = contentType?.includes("application/json");
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw new Error(data?.message || `HTTP ${response.status}`);
      }

      const duration = performance.now() - start;
      console.log(`%c[API RESPONSE] → ${method} ${url} (${duration.toFixed(2)}ms)`, "color:#10b981;font-weight:bold");

      return data;
    } catch (error: any) {
      console.error("API ERROR:", error.message);
      throw error;
    }
  }

  // ==================== BOUTIQUES ====================
  async getShops(page: number = 0, size: number = 12, search: string = "") {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(search && { search })
    });
    return this.request(`/shops/list-frontend?${params}`);
  }

  async getShopById(id: number):Promise<ApiResponse<any>> {
    return this.request(`/shops/by/${id}`);
  }



async getProductsByShopId(id: number, params: PaginationParams = {}):Promise<ApiResponse<any>>  {
    const query = new URLSearchParams(params).toString();
    return this.request(`/products/shop/${id}?${query}`);
}

  // ==================== PRODUITS ====================
  async getProducts(page: number = 0, size: number = 12, shopId?: string, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(shopId && { shopId }),
      ...(search && { search })
    });
    return this.request(`/products/all-frontend?${params}`);
  }

  async getProduct(id: number) {
    return this.request(`/products/by/${id}`);
  }

  async getProductsByCategory(categoryId: number, page: number = 0, size: number = 12) {
  return this.request<any>(`/products/category/${categoryId}?page=${page}&size=${size}`);
}

  // ==================== PANIER ====================
  async getCart(id: string) {
    return this.request(`/carts/${id}`);
  }

  


// Créer un panier et ajouter un produit
async createCart(productId?: number | any , quantity?: number) {
  // Si aucun produit, on envoie un body vide ou avec null
  const body = JSON.stringify(
    productId !== undefined && quantity !== undefined
      ? { productId, quantity }
      : {}
  );

  console.log(
    '%c[CREATE CART BODY]',
    'color:#f59e0b;font-weight:bold',
    { productId, quantity }
  );

  return this.request(`/carts`, {
    method: 'POST',
    body,
  });
}
// async createCart(): Promise<ApiResponse<Cart>> {
//   // ⚠️ Assurez-vous que l'endpoint correspond à la méthode createEmptyCart
//   return this.request(`/carts/new`, { method: 'POST' }); 
// }

  // Ajouter un produit à un panier existant
  async addToCart(cartId?: number | any , productId?: number, quantity?: number) {
    const body = JSON.stringify({ productId, quantity });
    console.log('%c[ADD TO CART BODY]', 'color:#6366f1;font-weight:bold', { cartId, productId, quantity });

    return this.request(`/carts/${cartId}/items`, {
      method: 'POST',
      body,
    });
  }

  async updateCartItem(cartId: number | any, itemId: number, quantity: number) {
    return this.request(`/carts/${cartId}/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
  }

  async removeFromCart(cartId: number | any, itemId: number | any) {
    return this.request(`/carts/${cartId}/items/${itemId}`, {
      method: 'DELETE'
    });
  }

  // 🆕 NOUVELLE MÉTHODE : Vider complètement le panier
async clearCart(cartId: number | any) {
  // Ceci appelle l'endpoint que nous avons défini : DELETE /api/carts/{cartId}/clear
  return this.request(`/carts/${cartId}/clear`, {
    method: 'DELETE'
  });
}

  // ==================== COMMANDES ====================
  // async createOrder(cartId: string) {
  //   return this.request('/orders/place', {
  //     method: 'POST',
  //     body: JSON.stringify({ cartId })
  //   });
  // }

   // Méthode pour créer une commande
  async createOrder(orderRequest: PlaceOrderRequest): Promise<PlaceOrderResponse> {
    return this.request('/orders/place', {
      method: 'POST',
      body: JSON.stringify(orderRequest)
    });
  }

   async getOrderDetails(orderId: number):Promise<PlaceOrderResponse> {
    const response = this.request(`/orders/get/${orderId}`);
   
    return response;
  }


  async getOrders(page: number = 0, size: number = 10) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });
    return this.request(`/orders?${params}`);
  }

  async getOrder(id: string) {
    return this.request(`/orders/${id}`);
  }


 

  async getCategories():Promise<any>{
    return this.request(`/categories/all`)
  }

  // ==================== AUTH ====================
  async login(email: string, password: string) {
    const response = await this.request<{ accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(response.accessToken);
    return response;
  }

  async register(email: string, password: string, firstName: string, lastName: string) {
    return this.request('/clients', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName })
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async refreshToken() {
    const response = await this.request<{ accessToken: string }>('/auth/refresh');
    this.setToken(response.accessToken);
    return response;
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' });
    this.handleLogout();
  }


  // ==================== LIVRAISON ====================
async getDeliveryZones(): Promise<ApiResponse<any>> {
  return this.request(`/delivery-zones/client`);
}


}

export const apiClient = new ApiClient();