// import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "@/lib/api";
// import { ApiResponse } from "@/models/ApiResponse";
// import { Cart } from "@/types/api";

// export const useCartCount = () => {
//   const cartId = localStorage.getItem("cart_id");

//   const { data } = useQuery({
//     queryKey: ["cart", cartId],
//     queryFn: async () => {
//       if (!cartId) return null;
//       const response = await apiClient.getCart(cartId) as ApiResponse<Cart>;
//       return response.data;
//     },
//   });

//   if (!data?.items) return 0;

//   return data.items.reduce((sum, item) => sum + item.quantity, 0);
// };



// Fichier : src/hooks/useCart.ts (version adaptée à votre API)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { ApiResponse } from "@/models/ApiResponse";
import { Cart } from "@/types/api";
import { toast } from "sonner";

// Hook personnalisé pour le panier
export const useCart = () => {
  const queryClient = useQueryClient();
  
  const getCartId = () => {
    return localStorage.getItem("cart_id");
  };

  // Récupérer le panier
  const { data: cartData, isLoading, error } = useQuery({
    queryKey: ["cart", getCartId()],
    queryFn: async () => {
      const cartId = getCartId();
      if (!cartId) return null;
      const response = await apiClient.getCart(cartId) as ApiResponse<Cart>;
      return response.data;
    },
    enabled: !!getCartId(),
  });

  // Mutation pour créer un panier
  const createCartMutation = useMutation({
    mutationFn: async (productId: number) => {
      const response = await apiClient.createCart(productId, 1) as ApiResponse<Cart>;
      if (response.data?.id) {
        localStorage.setItem("cart_id", response.data.id.toString());
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Mutation pour ajouter au panier
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity = 1 }: { productId: number; quantity?: number }) => {
      const cartId = getCartId();
      if (!cartId) {
        // Si pas de panier, on en crée un
        const cartResponse = await apiClient.createCart(productId, quantity) as ApiResponse<Cart>;
        if (cartResponse.data?.id) {
          localStorage.setItem("cart_id", cartResponse.data.id.toString());
        }
        return cartResponse.data;
      } else {
        // Si panier existe, on ajoute l'article
        await apiClient.addToCart(cartId, productId, quantity);
        const response = await apiClient.getCart(cartId) as ApiResponse<Cart>;
        return response.data;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Produit ajouté", {
        description: "Le produit a été ajouté à votre panier",
      });
    },
    onError: (error: any) => {
      toast.error("Erreur", {
        description: error?.message || "Impossible d'ajouter au panier",
      });
    },
  });

  // Mutation pour retirer du panier
  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: number) => {
      const cartId = getCartId();
      if (!cartId) throw new Error("Pas de panier");
      await apiClient.removeFromCart(cartId, itemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Produit retiré", {
        description: "Le produit a été retiré de votre panier",
      });
    },
  });

  // Mutation pour mettre à jour la quantité
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const cartId = getCartId();
      if (!cartId) throw new Error("Pas de panier");
      await apiClient.updateCartItem(cartId, itemId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Calculer le total
  const getTotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((total, item) => {
      return total + (item.product.priceCents || 0) * item.quantity;
    }, 0);
  };

  // Calculer le nombre d'articles
  const getItemCount = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    cart: cartData,
    isLoading,
    error,
    addToCart: (productId: number, quantity?: number) => 
      addToCartMutation.mutateAsync({ productId, quantity }),
    removeFromCart: removeFromCartMutation.mutateAsync,
    updateQuantity: updateQuantityMutation.mutateAsync,
    getTotal,
    getItemCount,
    clearCart: () => {
      localStorage.removeItem("cart_id");
      queryClient.setQueryData(["cart"], null);
    },
  };
};

// Hook pour le nombre d'articles dans le panier (optimisé)
export const useCartCount = () => {
  const { getItemCount } = useCart();
  return getItemCount();
};

// Hook pour le total du panier
export const useCartTotal = () => {
  const { getTotal } = useCart();
  return getTotal();
};