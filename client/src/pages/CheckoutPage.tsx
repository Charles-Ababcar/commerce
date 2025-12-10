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

// 🚨 Numéro de l'entreprise pour WhatsApp (sans + ni espaces)
const WHATSAPP_NUMBER = "221776562121";

// Schéma de validation avec Zod
const checkoutSchema = z.object({
  name: z.string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(100, { message: "Le nom ne doit pas dépasser 100 caractères" }),
  
  // 🚨 CORRECTION : Email facultatif (accepte un email valide ou une chaîne vide)
  email: z.string()
    .email({ message: "Veuillez entrer une adresse email valide si fournie" })
    .optional()
    .or(z.literal('')),
  
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

// -----------------------------------------------------
// 🚨 FONCTIONS UTILITAIRES DE CALCULS (TVA = 0)
// -----------------------------------------------------
  const calculateSubtotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((sum, item) => sum + (item.totalCents || 0), 0);
  };

  // TVA à 0 pour les calculs front-end (PaD/simplicité)
  const calculateTax = () => {
    return 0; 
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    // Frais de livraison au Sénégal
    if (subtotal > 50000) return 0; 
    if (subtotal > 25000) return 1500; 
    return 2500; 
  };

  // Total = Subtotal + Shipping
  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const formatPrice = (cents: number) => {
    return cents.toLocaleString("fr-FR") + " FCFA";
  };
// -----------------------------------------------------


// -----------------------------------------------------
// 🚨 NOUVELLE FONCTION : Gestion de la confirmation WhatsApp (PaD)
// -----------------------------------------------------
const handleWhatsAppOrder = (data: CheckoutFormData) => {
    const total = formatPrice(calculateTotal());
    
    // Message pré-rempli pour l'entreprise
    const message = encodeURIComponent(
        `Bonjour, je souhaite confirmer ma commande. Voici mes informations :\n\n` +
        `👤 Nom: ${data.name}\n` +
        `📞 Téléphone: ${data.phoneNumber}\n` +
        `🏠 Adresse: ${data.address}\n` +
        `💰 Montant Total: ${total} (PaD)\n\n` +
        `Mon ID panier temporaire est : ${cartId}.\n` +
        `Veuillez confirmer l'expédition. Merci.`
    );

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
        title: "Chat WhatsApp ouvert",
        description: "Veuillez envoyer le message pré-rempli pour confirmer votre commande. Vous serez recontacté(e) rapidement.",
        duration: 8000,
    });
};
// -----------------------------------------------------

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
   email: data.email || '',
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
                              <FormLabel>Email (Facultatif)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                  <Input 
                                    type="email" 
                                    placeholder="moussa@exemple.sn" 
                                    className="pl-10" 
                                    disabled={isSubmitting}
                                    {...field} 
                                        value={field.value ?? ''}
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

                      {/* ⭐️ CONTENEUR DES BOUTONS ⭐️ */}
                    <div className="space-y-3">
                      
                        {/* 1. Bouton "Finaliser" (Appel API Standard) */}
                      <Button 
                        // Appel de handleFinalizeOrder via form.handleSubmit pour le bouton API
                        onClick={form.handleSubmit(handleFinalizeOrder)} 
                        type="button" 
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
                            Finaliser la Commande (Paiement API)
                          </>
                        )}
                      </Button>

                        {/* 2. Bouton "Confirmer via WhatsApp" (Option PaD) */}
                      <Button
                        type="button"
                        variant="default"
                        className="w-full py-4 text-lg font-semibold bg-green-500 hover:bg-green-600 transition-all shadow-lg"
                        // Utilise handleSubmit pour valider les données AVANT d'ouvrir WhatsApp
                        onClick={form.handleSubmit(handleWhatsAppOrder)} 
                        disabled={isSubmitting || !form.formState.isValid || !cartData?.items?.length}
                      >
                        <svg className="mr-2 h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.4C339.4 56.6 283.6 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.3 77.2 30.6 110.8L4.3 490.1c-1.9 6.8-.7 14.9 3.2 20.6s10 9 17.5 7.3l126.8-32.9c32.7 17.8 69.3 27 106.9 27c122.4 0 222-99.6 222-222c0-59.8-24.1-115.6-65-157.1zm-157 325.2c-23.7 0-46.7-7.6-67-21.7L100.9 387l-41.9 10.9L108 340.5c-14.2-20.3-21.7-43.3-21.7-67c0-99.8 81-180.8 180.8-180.8c50.2 0 97.3 19.6 133.4 55.6c36 36 55.6 83.1 55.6 133.4c0 99.8-81 180.8-180.8 180.8zm119.5-121.7c-5.7-2.8-33.8-16.5-39.1-18.4s-9-2.8-12.8 2.8c-3.8 5.7-14.7 18.4-18 22.2c-3.3 3.8-6.7 4.2-12.4 1.4c-47-23.6-77.9-58.8-109.9-106.6c-5.7-9.9 5.2-9.2 14.7-9.2c12.7 0 16.2 0 22.2 0c5.9 0 9.1-1.9 12.8-5.7c3.7-3.8 5-9.9 7.6-14.9c2.6-5 1.3-9.5-.6-13.3c-1.9-3.8-17-40.4-23.3-55.5c-6.2-15-12.7-13-17.5-13.2c-4.8-.2-10.2-.4-15.6-.4s-13.5 1.9-20.6 9.5c-7 7.6-26.9 26.2-26.9 63.8c0 37.6 27.6 74.3 31.3 79.9c3.8 5.7 54.4 87.7 132.8 120.7c18.9 7.8 33.7 12.5 45.2 16c14.9 4.6 28.3 3.9 38.6 2.4c11.3-1.6 33.8-13.8 38.6-27.1c4.8-13.3 4.8-24.6 3.4-27.1c-1.4-2.5-5.2-3.9-11-6.9z"/></svg>
                        Confirmer via WhatsApp
                      </Button>
                    </div>
                      {/* <Button 
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
                      </Button> */}
                      
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
                 
                    
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(calculateTotal())}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Montant final (hors paiement par l'application)
                    </p>
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