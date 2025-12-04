// Fichier : src/pages/CartPage.tsx

import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api";
import { Cart, CartItem } from "@/types/api";

const CartPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cartId, setCartId] = useState<string | null>(
    localStorage.getItem("cart_id")
  );

  // Récupération du panier
  const { data: cartData, isLoading } = useQuery<Cart, Error>({
    queryKey: ["cart", cartId],
    queryFn: () => apiClient.getCart(cartId!),
    enabled: !!cartId,
    staleTime: 1000 * 60 * 5,
  });

  // Mutations
  const updateQuantityMutation = useMutation({
    mutationFn: ({
      itemId,
      quantity,
    }: {
      itemId: number;
      quantity: number;
    }) => {
      if (quantity === 0) return apiClient.removeFromCart(cartId!, itemId);
      return apiClient.updateCartItem(cartId!, itemId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour de la quantité",
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId: number) => apiClient.removeFromCart(cartId!, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
      
      toast({
        title: "Article retiré",
        description: "Le produit a été retiré de votre panier.",
      });
      
      // Vérifier si le panier est vide après suppression
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] }).then(() => {
        const currentCart = queryClient.getQueryData<Cart>(["cart", cartId]);
        if (!currentCart?.items || currentCart.items.length === 0) {
          localStorage.removeItem("cart_id");
          setCartId(null);
        }
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du retrait de l'article.",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => apiClient.clearCart(cartId!),
    onSuccess: () => {
      localStorage.removeItem("cart_id");
      setCartId(null);
      queryClient.invalidateQueries({ queryKey: ["cart", cartId] });

      toast({
        title: "Panier vidé",
        description: "Tous les articles ont été retirés du panier.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la suppression du panier.",
        variant: "destructive",
      });
    },
  });

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    updateQuantityMutation.mutate({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: number) => {
    removeItemMutation.mutate(itemId);
  };

  const handleClearCart = () => {
    if (!cartData?.items || cartData.items.length === 0) {
      toast({
        title: "Panier déjà vide",
        description: "Il n'y a aucun article à supprimer.",
      });
      return;
    }
    clearCartMutation.mutate();
  };

  const handleCheckout = () => {
    if (!cartData?.items || cartData.items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des produits avant de passer commande",
        variant: "destructive",
      });
      return;
    }

    if (cartId) {
      navigate(`/checkout/${cartId}`);
    } else {
      toast({
        title: "Erreur",
        description: "Impossible de trouver l'ID du panier.",
        variant: "destructive",
      });
    }
  };

  // Gestion du chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  // Gestion du panier vide
  if (!cartId || !cartData?.items || cartData.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16">
          <Card className="max-w-md mx-auto text-center p-12">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-6">
              Ajoutez des produits pour commencer vos achats
            </p>
            <Link to="/products">
              <Button variant="hero">Découvrir les produits</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // Calcul des totaux
  const subtotal = cartData.items.reduce((sum, item) => sum + (item.totalCents || 0), 0);
  const total = subtotal;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Mon Panier</h1>
          <Button
            variant="destructive"
            onClick={handleClearCart}
            disabled={clearCartMutation.isPending || cartData.items.length === 0}
          >
            {clearCartMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Vider le panier
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {cartData.items.map((item: CartItem) => (
              <Card key={item.id}>
                <CardContent className="p-6 flex gap-4">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <Link to={`/products/${item.product.id}`}>
                      <h3 className="font-semibold mb-1 hover:text-primary">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.product.category.name}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Shop: {item.product.shop.name}
                    </p>
                    <p className="font-bold text-primary">
                      {item.totalCents.toLocaleString("fr-FR")} FCFA
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.product.priceCents.toLocaleString("fr-FR")} FCFA ×{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(Number(item.id))}
                      disabled={removeItemMutation.isPending}
                    >
                      {removeItemMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(
                            Number(item.id),
                            item.quantity - 1
                          )
                        }
                        disabled={
                          item.quantity <= 1 || 
                          updateQuantityMutation.isPending
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 font-medium min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(
                            Number(item.id),
                            item.quantity + 1
                          )
                        }
                        disabled={
                          item.quantity >= item.product.stock ||
                          updateQuantityMutation.isPending
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Résumé de la commande */}
          <div>
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Résumé</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nombre d'articles</span>
                    <span>{cartData.items.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      {total.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                </div>
                <Button
                  variant="hero"
                  className="w-full mt-6"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={cartData.items.length === 0}
                >
                  Passer la commande
                </Button>
                <Link to="/products">
                  <Button variant="ghost" className="w-full mt-2">
                    Continuer mes achats
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;