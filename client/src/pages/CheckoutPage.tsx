import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Loader2, 
  Package, 
  User, 
  Mail, 
  Home, 
  Phone, 
  CheckCircle, 
  ShoppingBag,
  CreditCard,
  Truck,
  ShieldCheck,
  Banknote
} from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Cart, CartItem } from "@/types/api";

// Schéma de validation avec Zod
const checkoutSchema = z.object({
  name: z.string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(100, { message: "Le nom ne doit pas dépasser 100 caractères" }),
  email: z.string()
    .email({ message: "Veuillez entrer une adresse email valide" }),
  address: z.string()
    .min(5, { message: "L'adresse doit contenir au moins 5 caractères" })
    .max(200, { message: "L'adresse ne doit pas dépasser 200 caractères" }),
  phoneNumber: z.string()
    .regex(/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,15}$/, { 
      message: "Veuillez entrer un numéro de téléphone valide" 
    }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Interface pour la requête de commande
interface PlaceOrderRequest {
  cartId: string;   // <-- AJOUT OBLIGATOIRE
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

const CheckoutPage = () => {
  const { cartId } = useParams<{ cartId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  // Récupération du panier
  const { data: cartData, isLoading: isCartLoading } = useQuery<Cart, Error>({
    queryKey: ["cart", cartId],
    queryFn: () => apiClient.getCart(cartId!),
    enabled: !!cartId,
  });

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      phoneNumber: '',
    },
  });



// Mutation pour créer la commande
const createOrderMutation = useMutation({
  mutationFn: (orderRequest: PlaceOrderRequest) => {
    return apiClient.createOrder(orderRequest);
  },
 onSuccess: (data) => {
  console.log("🧹 Suppression panier côté FRONT (localStorage + cache)");

  // 1. Supprimer le cart_id
  localStorage.removeItem("cart_id");

  // 2. Invalider le cache du panier
  queryClient.removeQueries({ queryKey: ["cart"] });
  
  // Tu peux aussi forcer un reset complet :
  // queryClient.clear();

  console.log("🎉 Commande envoyée avec succès", data);
console.log("🧹 Suppression du panier...");


  toast({
    title: "Commande créée ! 🎉",
    description: data.message,
  });

  navigate("/order-success", { 
    state: { 
      orderId: data.data?.orderId || `CMD-${Date.now()}`,
      customerName: form.getValues().name,
      customerEmail: form.getValues().email,
      total: calculateTotal()
    }
  });
},

  onError: (error: any) => {
    toast({
      title: "Erreur",
      description: error.message || "Erreur lors de la création de la commande",
      variant: "destructive",
    });
  },
});



  if (!cartId) {
    toast({ 
      title: "Erreur", 
      description: "Panier manquant. Retour aux achats.",
      variant: "destructive"
    });
    navigate('/cart');
    return null;
  }

  // Calculer les totaux en FCFA
  const calculateSubtotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((sum, item) => sum + (item.totalCents || 0), 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return Math.round(subtotal * 0.18); // TVA 18% au Sénégal
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    // Frais de livraison au Sénégal
    if (subtotal > 50000) return 0; // Livraison gratuite au-dessus de 50.000 FCFA
    if (subtotal > 25000) return 1500; // 1.500 FCFA
    return 2500; // 2.500 FCFA
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const formatPrice = (cents: number) => {
    return cents.toLocaleString("fr-FR") + " FCFA";
  };

  const handleFinalizeOrder = async (data: CheckoutFormData) => {
    console.log("🛒 Panier envoyé dans la commande :", cartData);

    if (!cartData?.items || cartData.items.length === 0) {
      toast({
        title: "Panier vide",
        description: "Votre panier est vide",
        variant: "destructive"
      });
      return;
    }

    // Préparer la requête pour l'API
   const orderRequest: PlaceOrderRequest = {
  cartId: cartId!,   // <-- AJOUT IMPORTANT
  client: {
    name: data.name,
    email: data.email,
    address: data.address,
    phoneNumber: data.phoneNumber
  },
  orderItems: cartData.items.map((item: CartItem) => ({
    productId: item.product.id,
    quantity: item.quantity
  }))
};


    // Exécuter la mutation
    createOrderMutation.mutate(orderRequest);
  };

  const isSubmitting = createOrderMutation.isPending;

  if (isCartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />
        <div className="container py-8 px-4 max-w-4xl mx-auto flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <div className="container py-8 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Formulaire de finalisation */}
          <div className="lg:w-2/3">
            <Card className="border-2 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-2xl">Finaliser Votre Commande</CardTitle>
                    <CardDescription className="text-base mt-1">
                      Renseignez vos informations pour finaliser votre achat
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <Alert className="bg-blue-50 border-blue-200 mb-6">
                  <AlertDescription className="text-blue-700">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Étape finale !</strong> Une fois vos informations validées, 
                        vous recevrez un email de confirmation avec les détails de votre commande.
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleFinalizeOrder)} className="space-y-6">
                    {/* Informations personnelles */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Vos coordonnées
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom complet *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input 
                                    placeholder="Moussa Diop" 
                                    className="pl-10" 
                                    disabled={isSubmitting}
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input 
                                    type="email" 
                                    placeholder="moussa@exemple.sn" 
                                    className="pl-10" 
                                    disabled={isSubmitting}
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Adresse de livraison */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        Adresse de livraison
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Adresse complète *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                  placeholder="Rue 10 x Rue 11, Dakar Plateau" 
                                  className="pl-10" 
                                  disabled={isSubmitting}
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Contact
                      </h3>
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input 
                                  type="tel" 
                                  placeholder="+221 77 123 45 67" 
                                  className="pl-10" 
                                  disabled={isSubmitting}
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {createOrderMutation.isError && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertDescription>
                          {createOrderMutation.error?.message || "Une erreur est survenue"}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Alert className="bg-gray-50 border-gray-200">
                      <AlertDescription className="text-gray-700">
                        <p className="text-sm">
                          <strong>Note :</strong> Le paiement ne sera pas demandé à cette étape. 
                          Vous recevrez les instructions de paiement par email après validation de la commande.
                        </p>
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary transition-all shadow-lg"
                        disabled={isSubmitting || !form.formState.isValid || !cartData?.items?.length}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Création de votre commande...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Finaliser la Commande
                          </>
                        )}
                      </Button>
                      
                      <div className="flex gap-3">
                        <Button 
                          variant="outline" 
                          type="button" 
                          className="flex-1"
                          onClick={() => navigate('/cart')}
                          disabled={isSubmitting}
                        >
                          Retour au panier
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          type="button" 
                          className="flex-1"
                          onClick={() => navigate('/')}
                          disabled={isSubmitting}
                        >
                          Continuer les achats
                        </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:w-1/3">
            <Card className="border-2 shadow-lg sticky top-8">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Votre Commande
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Articles */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">Articles ({cartData?.items?.length || 0})</h4>
                    
                    {cartData?.items && cartData.items.length > 0 ? (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {cartData.items.map((item: CartItem) => (
                          <div key={item.id} className="flex justify-between items-start pb-3 border-b">
                            <div className="flex-1">
                              <div className="flex items-start gap-3">
                                <img 
                                  src={item.product.imageUrl} 
                                  alt={item.product.name}
                                  className="w-12 h-12 object-cover rounded-lg"
                                />
                                <div>
                                  <p className="font-medium text-sm line-clamp-2">{item.product.name}</p>
                                  <p className="text-xs text-gray-500">Quantité: {item.quantity}</p>
                                  <p className="text-xs text-gray-500">Shop: {item.product.shop.name}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatPrice(item.totalCents)}</p>
                              <p className="text-xs text-gray-500">
                                {formatPrice(item.product.priceCents)} × {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Aucun article dans le panier</p>
                    )}
                  </div>
                  
                  {/* Totaux */}
                  <div className="space-y-3 border-t pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Livraison</span>
                      <span className={`font-medium ${calculateShipping() === 0 ? 'text-green-600' : ''}`}>
                        {calculateShipping() === 0 ? 'Gratuite' : formatPrice(calculateShipping())}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">TVA (18%)</span>
                      <span className="font-medium">{formatPrice(calculateTax())}</span>
                    </div>
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(calculateTotal())}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">TVA incluse</p>
                    </div>
                  </div>
                  
                  {/* Informations importantes */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <div className="flex items-center gap-2 mb-2">
                        <Truck className="h-4 w-4 text-gray-600" />
                        <h4 className="font-medium text-gray-700">Livraison au Sénégal</h4>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Expédition sous 24-48h</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Livraison dans tout le Sénégal</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Suivi par SMS</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Banknote className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium text-blue-800">Paiement au Sénégal</h4>
                      </div>
                      <p className="text-sm text-blue-700">
                        Paiement accepté : Wave, Orange Money, Free Money, Carte bancaire
                      </p>
                    </div>
                    
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        <h4 className="font-medium text-green-800">Sécurité</h4>
                      </div>
                      <p className="text-sm text-green-700">
                        Vos informations sont sécurisées. Aucun paiement sur ce site.
                      </p>
                    </div>
                    
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="h-4 w-4 text-amber-600" />
                        <h4 className="font-medium text-amber-800">ID Panier</h4>
                      </div>
                      <p className="text-sm text-amber-700 font-mono break-all">
                        {cartId}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;