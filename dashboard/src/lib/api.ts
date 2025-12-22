import { CategoryRequestDTO } from "@/models/CategoryRequestDTO";
import { CategoryResponseDTO } from "@/models/CategoryResponseDTO";
import { LoginResponse, LoginResponseData } from "@/models/LoginResponse";
import { UpdatePasswordAdminDTO, UpdatePasswordSelfDTO } from "@/models/UpdatePasswordDTO";
import { UserRequestDTO } from "@/models/UsersDTO";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://77.37.125.11:8080/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

    private handleLogout() {
    this.setToken(null);
    // Redirection vers la page login
    window.location.href = "/auth";
  }

   // ⬇⬇⬇ AJOUTER ICI : vérification expiration JWT
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000; // exp en millisecondes
      return Date.now() > exp;
    } catch (e) {
      return true; // token cassé → on considère expiré
    }
  }

  // Méthode API principale
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const method = options.method || "GET";
    const url = `${this.baseURL}${endpoint}`;

    const headers: HeadersInit = {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    };

    if (this.token) {
      // Check expiration client-side
      if (this.isTokenExpired(this.token)) {
        console.warn("Token expiré côté client → logout automatique");
        this.handleLogout();
        throw new Error("Token expiré");
      }

      headers["Authorization"] = `Bearer ${this.token}`;
    }

    console.log("%c[API REQUEST] → " + method + " " + url, "color:#0ea5e9;font-weight:bold");

    const start = performance.now();

    try {
      const response = await fetch(url, { ...options, headers });

      if (response.status === 401) {
        console.warn("Token expiré côté serveur → logout automatique");
        this.handleLogout();
        throw new Error("Token expiré (serveur)");
      }

      const contentType = response.headers.get("content-type");
      const isJson = contentType?.includes("application/json");
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        throw new Error(data?.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error("API ERROR:", error.message);
      throw error;
    }
  }





  // ---------- Auth ----------
  async login(username: string, password: string): Promise<LoginResponseData> {
    const response = await this.request<LoginResponse>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return response.data;
  }

  async register(data: any) {
    return this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }



 ///Shop///////////////

  // Fichier : src/lib/api.ts

async createShop(data: any, image?: File) {
    const formData = new FormData();

    // ⭐️ CORRECTION : Ajouter chaque champ du DTO comme un paramètre de formulaire simple
    // Ceci permet à @ModelAttribute de fonctionner correctement.
    for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
            // Convertir les booléens et nombres en chaîne pour FormData
            formData.append(key, String(data[key]));
        }
    }

    if (image) {
        formData.append("image", image); // Le nom 'image' correspond à @RequestParam("image")
    }
    
    return this.request<any>("/shops/create", {
        method: "POST",
        body: formData,
    });
}

    async getShop(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request<any>(`/shops/list?${query}`);
  }



// (FormData est difficile à inspecter directement)
 logFormData(formData: FormData) {
    const data: { [key: string]: string | { type: string, size: number, name: string } } = {};
    
    // Convertir FormData en un objet loggeable
    formData.forEach((value, key) => {
        if (value instanceof Blob) {
            // Pour les fichiers (Blob/File)
            data[key] = {
                type: value.type,
                size: value.size,
                name: (value as File).name || 'Blob/JSON Data'
            };
        } else {
            // Pour les champs texte (y compris le JSON 'shop')
            data[key] = value.toString();
        }
    });

    console.log("📦 [UPDATE SHOP] Contenu de FormData envoyé au serveur:", data);
}


async updateShop(id: string, data: any, image?: File) {
    // 1. Log des données du DTO entrant
    console.log(`➡️ [UPDATE SHOP] Tentative de mise à jour ID: ${id}`);
    console.log("   [UPDATE SHOP] DTO (JSON à sérialiser):", data);

    const formData = new FormData();

    // DTO sérialisé en JSON
    const shopBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
    
    formData.append(
      "shop",
      shopBlob
    );

    if (image) {
      formData.append("image", image);
      console.log(`   [UPDATE SHOP] Fichier Image détecté: ${image.name} (${(image.size / 1024).toFixed(2)} KB)`);
    }

    // 2. Log du contenu final de FormData
    this.logFormData(formData);

    return this.request<any>(`/shops/${id}`, {
      method: "PUT",
      body: formData,
    });
}

  async deleteShop(id: Number) {
    return this.request<any>(`/shops/${id}`, {
      method: "DELETE",
    });
  }

  async getShopById(id: string) {
    return this.request<any>(`/shops/${id}`);
  }
//Fin 


  // ---------- Products ----------
async createProduct(data: any, image?: File) {
  console.log("🚀 API CLIENT - Données reçues pour create:", data);
  
  const formData = new FormData();
  
  // 🔥 CORRECTION : Ajouter TOUS les champs de manière EXPLICITE
  formData.append('name', data.name || '');
  formData.append('description', data.description || '');
  formData.append('priceCents', String(data.priceCents || 0));
  formData.append('stock', String(data.stock || 0));
  
  // Champs optionnels - gérés correctement
  if (data.shopId !== undefined && data.shopId !== null) {
    formData.append('shopId', String(data.shopId));
  }
  
  if (data.categoryId !== undefined && data.categoryId !== null) {
    formData.append('categoryId', String(data.categoryId));
  }
  
  // Image
  if (image) {
    formData.append('image', image);
  }

  // 🔍 Debug: Vérifier le FormData
  console.log("📦 FormData créé pour CREATE:");
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value, typeof value);
  }

  return this.request(`/products/create`, { 
    method: "POST", 
    body: formData 
  });
}

async updateProduct(id: string, data: any, image?: File) {
  console.log("🚀 API CLIENT - Données reçues pour update:", data);
  
  const formData = new FormData();
  
  // 🔥 MÊME structure que createProduct
  formData.append('name', data.name || '');
  formData.append('description', data.description || '');
  formData.append('priceCents', String(data.priceCents || 0));
  formData.append('stock', String(data.stock || 0));
  
  // Champs optionnels
  if (data.shopId !== undefined && data.shopId !== null) {
    formData.append('shopId', String(data.shopId));
  }
  
  if (data.categoryId !== undefined && data.categoryId !== null) {
    formData.append('categoryId', String(data.categoryId));
  }
  
  // Image
  if (image) {
    formData.append('image', image);
  }

  console.log("📦 FormData créé pour UPDATE:");
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value, typeof value);
  }

  return this.request(`/products/${id}`, { 
    method: "PUT", 
    body: formData 
  });
}

async getProducts(params: any = {}) {
  const query = this.buildQuery(params);
  return this.request(`/products/all${query ? `?${query}` : ""}`);
}
/////////////////

  async deleteProduct(id: number) {
    return this.request<any>(`/products/${id}`, {
      method: 'DELETE',
    });
  }



  // ---------- Orders ----------
  async createOrder(data: any) {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }


  async getOrders(params: any = {}) {
    const query = new URLSearchParams(params).toString();
    // Utilisation de la query string complète pour la méthode request
    return this.request<any>(`/orders${query ? `?${query}` : ''}`); 
  }

  

  async getUserOrders(userId: string) {
    return this.request<any>(`/orders/user/${userId}`);
  }

  async getOrder(id: string) {
    return this.request<any>(`/orders/${id}`);
  }


   async cancelOrder(orderId: number | string) {
    // Appel de l'endpoint DELETE que nous avons défini
    return this.request(`/orders/${orderId}/cancel`, {
        method: 'DELETE'
    });
}
  async updateOrderStatus(id: number, status: string) {
    return this.request<any>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ---------- Users ----------
 
  async getProfile() {
    return this.request<any>('/auth/profile');
  }

  async updateProfile(data: any) {
    return this.request<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUserProfile(id: string) {
    return this.request<any>(`/users/${id}/profile`);
  }

  // Dans apiClient.ts
async updatePasswordSelf(id: number, data: UpdatePasswordSelfDTO) {
  return this.request(`/users/${id}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

async updatePasswordByAdmin(id: number, data: UpdatePasswordAdminDTO) {
  return this.request(`/users/${id}/password/admin`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

  // Users methods
async getUsers(params?: { page?: number; size?: number; search?: string }) {
  const queryParams = new URLSearchParams();
  if (params?.page !== undefined) queryParams.append('page', params.page.toString());
  if (params?.size !== undefined) queryParams.append('size', params.size.toString());
  if (params?.search) queryParams.append('search', params.search);
  
  const queryString = queryParams.toString();
  const url = `/users/all${queryString ? `?${queryString}` : ''}`;
  
  return this.request<any>(url);
}

async createUser(data: UserRequestDTO) {
  console.log("🚀 API CLIENT - Création utilisateur:", data);
  return this.request('/users/create-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

async updateUser(id: string, data: UserRequestDTO) {
  console.log("🚀 API CLIENT - Modification utilisateur:", data);
  return this.request(`/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

async deleteUser(id: number) {
  return this.request(`/users/${id}`, {
    method: 'DELETE',
  });
}

//Fin Users
  // ---------- Reviews ----------
  async createReview(data: any) {
    return this.request<any>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getReviews(productId: string) {
    return this.request<any>(`/reviews/product/${productId}`);
  }

  // ---------- Gemini ----------
  async chatWithGemini(prompt: string) {
    return this.request<any>('/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: prompt,
    });
  }

  async chatWithGeminiWithImage(prompt: string, file: File) {
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('file', file);
    return this.request<any>('/gemini/chat-with-image', {
      method: 'POST',
      body: formData,
    });
  }

  // ---------- Dashboard ----------
  // Méthode utilitaire pour créer une query string
private buildQuery(params: Record<string, any>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof Date) {
        query.append(key, value.toISOString().split('T')[0]); // format YYYY-MM-DD
      } else {
        query.append(key, value.toString());
      }
    }
  });
  return query.toString();
}

 formatDateForAPI = (date?: Date): string | undefined => {
  if (!date) return undefined;
  return date.toISOString().split('T')[0]; // Format YYYY-MM-DD
};

// Méthodes dashboard avec paramètres
async getGeneralDashboard(params: {
  startDate?: Date;
  endDate?: Date;
} = {}) {
  const query = this.buildQuery(params);
  return this.request<any>(`/dashboard/general${query ? `?${query}` : ''}`);
}

async getSalesTrends(params: {
  type: string;
  startDate?: Date;
  endDate?: Date;
}) {
  const query = this.buildQuery(params);
  return this.request<any>(`/dashboard/sales/trends?${query}`);
}

async getTopProducts(params: {
  page?: number;
  size?: number;
  startDate?: Date;
  endDate?: Date;
} = {}) {
  const query = this.buildQuery(params);
  return this.request<any>(`/dashboard/products/top?${query}`);
}

async getRecentOrders(params: {
  page?: number;
  size?: number;
} = {}) {
  const query = this.buildQuery(params);
  return this.request<any>(`/dashboard/orders/recent?${query}`);
}

async getRecentCustomers(params: {
  page?: number;
  size?: number;
} = {}) {
  const query = this.buildQuery(params);
  return this.request<any>(`/dashboard/customers/recent?${query}`);
}

async getProductStatistics(id: string) {
  return this.request<any>(`/dashboard/products/${id}/statistics`);
}

async getAbandonedCartRate(params: {
  startDate?: Date;
  endDate?: Date;
} = {}) {
  const query = this.buildQuery(params);
  return this.request<any>(`/dashboard/carts/abandoned-rate${query ? `?${query}` : ''}`);
}

async getConversionRate(params: {
  startDate?: Date;
  endDate?: Date;
} = {}) {
  const query = this.buildQuery(params);
  return this.request<any>(`/dashboard/conversion-rate${query ? `?${query}` : ''}`);
}

async getRevenueByCategory(params: {
  startDate?: Date;
  endDate?: Date;
} = {}) {
  const query = this.buildQuery(params);
  return this.request<any>(`/dashboard/revenue-by-category${query ? `?${query}` : ''}`);
}

async getPerformanceComparison(params: {
  currentStart: Date;
  currentEnd: Date;
  previousStart: Date;
  previousEnd: Date;
}) {
  const query = this.buildQuery(params);
  return this.request<any>(`/dashboard/performance-comparison?${query}`);
}


// ---------- Categories ----------


// GET ALL
async getCategories(params: any = {}) {
  const query = this.buildQuery(params);
  return this.request<any>(`/categories${query ? `?${query}` : ""}`);
}

// GET BY ID
async getCategoryById(id: number) {
  return this.request<any>(`/categories/${id}`);
}

// CREATE
async createCategory(dto: CategoryRequestDTO) {
  return this.request<any>("/categories", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

// UPDATE
async updateCategory(id: number, dto: CategoryRequestDTO) {
  return this.request<any>(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

// DELETE
async deleteCategory(id: number) {
  return this.request<any>(`/categories/${id}`, {
    method: "DELETE",
  });
}

// ---------- Delivery Zones ----------

async getDeliveryZones() {
  return this.request<any>('/delivery-zones');
}

async createDeliveryZone(data: { name: string; areas: string; price: number }) {
  return this.request<any>('/delivery-zones', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

async updateDeliveryZone(id: number, data: { name: string; areas: string; price: number }) {
  return this.request<any>(`/delivery-zones/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

async deleteDeliveryZone(id: number) {
  return this.request<any>(`/delivery-zones/${id}`, {
    method: 'DELETE',
  });
}

}

export const apiClient = new ApiClient(API_BASE_URL);
