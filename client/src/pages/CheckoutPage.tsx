// import { Header } from "@/components/Header";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { useToast } from "@/components/ui/use-toast";
// import { 
//   Loader2, 
//   User, 
//   Mail, 
//   Home, 
//   Phone, 
//   CheckCircle, 
//   ShoppingBag,
//   Truck,
//   ShieldCheck,
//   MapPin,
//   Info,
//   MessageCircle
// } from "lucide-react";
// import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { apiClient } from "@/lib/api";
// import { Cart, PlaceOrderRequest } from "@/types/api";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// const WHATSAPP_NUMBER = "221776562121";

// const checkoutSchema = z.object({
//   name: z.string()
//     .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
//     .max(100, { message: "Le nom ne doit pas dépasser 100 caractères" }),
  
//   email: z.string()
//     .email({ message: "Email invalide" })
//     .optional()
//     .or(z.literal('')), 
  
//   address: z.string()
//     .min(3, { message: "L'adresse doit contenir au moins 3 caractères" }),
    
//   phoneNumber: z.string()
//     .min(7, { message: "Le numéro doit contenir au moins 7 chiffres" })
//     .regex(/^[0-9+\-\s()]*$/, { message: "Format de numéro invalide" }),
    
//   deliveryZoneId: z.string().min(1, "Veuillez choisir une zone de livraison"),
//   deliveryAddressDetail: z.string().optional(), 
// });

// type CheckoutFormData = z.infer<typeof checkoutSchema>;

// const CheckoutPage = () => {
//   const { cartId } = useParams<{ cartId: string }>();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
  
//   const [formValues, setFormValues] = useState<Partial<CheckoutFormData>>({});

//   const { data: zonesData, isLoading: isZonesLoading } = useQuery({
//     queryKey: ["delivery-zones"],
//     queryFn: () => apiClient.getDeliveryZones(),
//   });
  
//   const { data: cartData, isLoading: isCartLoading } = useQuery<Cart, Error>({
//     queryKey: ["cart", cartId],
//     queryFn: () => apiClient.getCart(cartId!),
//     enabled: !!cartId,
//   });

//   const form = useForm<CheckoutFormData>({
//     resolver: zodResolver(checkoutSchema),
//     defaultValues: {
//       name: '', email: '', address: '', phoneNumber: '',
//       deliveryZoneId: '', deliveryAddressDetail: ''
//     },
//     mode: "onTouched",
//   });

//   useEffect(() => {
//     const subscription = form.watch((value) => {
//       setFormValues(value as CheckoutFormData);
//     });
//     return () => subscription.unsubscribe();
//   }, [form.watch]);

//   const calculateSubtotal = () => {
//     if (!cartData?.items) return 0;
//     return cartData.items.reduce((sum, item) => sum + (item.totalCents || 0), 0);
//   };

//   const selectedZone = (zonesData?.data || []).find((z: any) => z.id.toString() === formValues.deliveryZoneId);

//   const getSelectedZonePrice = () => {
//     return selectedZone ? selectedZone.price : 0;
//   };

//   const calculateTotal = () => calculateSubtotal() + getSelectedZonePrice();

//   const formatPrice = (cents: number) => cents.toLocaleString("fr-FR") + " FCFA";

//   const buildWhatsAppMessage = (orderNumber?: string) => {
//     let message = `Bonjour, je souhaite confirmer ma commande. 🛒\n\n`;
//     message += "*📋 INFOS LIVRAISON:*\n";
//     message += `• Nom: ${formValues.name}\n`;
//     message += `• Tél: ${formValues.phoneNumber}\n`;
//     message += `• Email: ${formValues.email || 'Non fourni'}\n`;
//     message += `• Zone: ${selectedZone?.name || 'N/A'}\n`;
//     message += `• Quartier: ${formValues.deliveryAddressDetail || 'Non précisé'}\n\n`;
    
//     message += "*📦 PRODUITS:*\n";
//     cartData?.items?.forEach((item, i) => {
//       message += `${i+1}. ${item.product.name} (x${item.quantity}) - ${formatPrice(item.totalCents)}\n`;
//     });
    
//     message += `\n*TOTAL: ${formatPrice(calculateTotal())}*`;
//     if (orderNumber) message += `\n\n🆔 *Commande: #${orderNumber}*`;
//     return encodeURIComponent(message);
//   };

//   const createOrderMutation = useMutation({
//     mutationFn: (orderRequest: PlaceOrderRequest) => apiClient.createOrder(orderRequest),
//     onSuccess: (data) => {
//       localStorage.removeItem("cart_id");
//       queryClient.removeQueries({ queryKey: ["cart"] });
//       toast({ title: "Commande créée ! 🎉" });
//       navigate("/order-success", { 
//         state: { 
//           orderId: data.data?.orderId,
//           orderNumber: data.data?.orderNumber,
//           customerName: form.getValues().name,
//           total: calculateTotal()
//         }
//       });
//     },
//     onError: (error: any) => {
//       toast({ title: "Erreur", description: error.message, variant: "destructive" });
//     }
//   });

//   const handleFinalizeOrder = async (data: CheckoutFormData) => {
//     if (!cartData?.items?.length) return;
//     const orderRequest: PlaceOrderRequest = {
//       cartId: cartId!,
//       client: { name: data.name, email: data.email || '', address: data.address, phoneNumber: data.phoneNumber },
//       orderItems: cartData.items.map(item => ({ productId: item.product.id, quantity: item.quantity })),
//       deliveryZoneId: parseInt(data.deliveryZoneId),
//       deliveryAddressDetail: data.deliveryAddressDetail || '',
//       channel: "WEB"
//     };
//     createOrderMutation.mutate(orderRequest);
//   };

//   const handleWhatsAppOnly = async () => {
//     const isValid = await form.trigger();
//     if (isValid) {
//       const data = form.getValues();
//       const orderRequest: PlaceOrderRequest = {
//         cartId: cartId!,
//         client: { name: data.name, email: data.email || '', address: data.address, phoneNumber: data.phoneNumber },
//         orderItems: cartData!.items.map(item => ({ productId: item.product.id, quantity: item.quantity })),
//         deliveryZoneId: parseInt(data.deliveryZoneId),
//         deliveryAddressDetail: data.deliveryAddressDetail || '',
//         channel: "WHATSAPP" 
//       };

//       createOrderMutation.mutate(orderRequest, {
//         onSuccess: (response) => {
//           const orderNumber = response.data?.orderNumber || response.data?.orderId;
//           const message = buildWhatsAppMessage(orderNumber);
//           window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
//         }
//       });
//     }
//   };

//   if (isCartLoading || isZonesLoading) {
//     return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50"><Loader2 className="h-10 w-10 animate-spin text-primary mb-4" /><p>Chargement de votre commande...</p></div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <div className="container py-8 px-4 max-w-6xl mx-auto">
//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="lg:w-2/3 space-y-6">
//             <Card className="shadow-lg border-2">
//               <CardHeader className="bg-primary/5 border-b">
//                 <CardTitle className="text-2xl flex items-center gap-2"><ShoppingBag className="text-primary" /> Finaliser ma commande</CardTitle>
//                 <CardDescription>Renseignez vos coordonnées pour la livraison à domicile</CardDescription>
//               </CardHeader>
//               <CardContent className="pt-6">
//                 <Form {...form}>
//                   {/* Utilisation de form.handleSubmit pour le premier bouton */}
//                   <form onSubmit={form.handleSubmit(handleFinalizeOrder)} className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <FormField control={form.control} name="name" render={({ field }) => (
//                         <FormItem><FormLabel>Nom complet *</FormLabel><FormControl><div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-gray-400"/><Input className="pl-10" placeholder="Moussa Diop" {...field} /></div></FormControl><FormMessage /></FormItem>
//                       )} />
//                       <FormField control={form.control} name="phoneNumber" render={({ field }) => (
//                         <FormItem><FormLabel>Téléphone *</FormLabel><FormControl><div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400"/><Input className="pl-10" placeholder="77XXXXXXX" {...field} /></div></FormControl><FormMessage /></FormItem>
//                       )} />
//                     </div>

//                     <FormField control={form.control} name="email" render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Email (Optionnel)</FormLabel>
//                         <FormControl><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400"/><Input className="pl-10" placeholder="exemple@mail.com" {...field} /></div></FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )} />

//                     <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4">
//                       <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2 uppercase tracking-wider">
//                         <Truck size={16} /> Mode de Livraison
//                       </h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <FormField control={form.control} name="deliveryZoneId" render={({ field }) => (
//                           <FormItem>
//                             <FormLabel className="text-blue-900">Zone de livraison *</FormLabel>
//                             <Select onValueChange={field.onChange} defaultValue={field.value}>
//                               <FormControl><SelectTrigger className="bg-white border-blue-200"><SelectValue placeholder="Sélectionner votre zone" /></SelectTrigger></FormControl>
//                               <SelectContent>
//                                 {(zonesData?.data || []).map((zone: any) => (
//                                   <SelectItem key={zone.id} value={zone.id.toString()}>{zone.name} (+{formatPrice(zone.price)})</SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select><FormMessage />
//                           </FormItem>
//                         )} />
//                         <FormField control={form.control} name="deliveryAddressDetail" render={({ field }) => (
//                           <FormItem>
//                             <FormLabel className="text-blue-900">Quartier / Précision (Optionnel)</FormLabel>
//                             <FormControl><div className="relative"><MapPin className="absolute left-3 top-3 h-4 w-4 text-blue-400"/><Input className="pl-10 bg-white border-blue-200" placeholder="Ex: Derrière la boulangerie" {...field} /></div></FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         )} />
//                       </div>

//                       {selectedZone && (
//                         <Alert className="bg-white/80 border-blue-200 animate-in fade-in slide-in-from-top-1">
//                           <Info className="h-4 w-4 text-blue-600" />
//                           <AlertDescription className="text-blue-700 text-xs leading-relaxed">
//                             <span className="font-bold">Quartiers couverts : </span>
//                             {selectedZone.areas}
//                           </AlertDescription>
//                         </Alert>
//                       )}
//                     </div>

//                     <FormField control={form.control} name="address" render={({ field }) => (
//                       <FormItem><FormLabel>Adresse de résidence actuelle *</FormLabel><FormControl><div className="relative"><Home className="absolute left-3 top-3 h-4 w-4 text-gray-400"/><Input className="pl-10" placeholder="Ville, Rue, Porte..." {...field} /></div></FormControl><FormMessage /></FormItem>
//                     )} />

//                     <div className="space-y-4 pt-4 border-t">
//                       {/* BOUTON 1: TYPE SUBMIT (Appelle onSubmit du form) */}
//                       <Button 
//                         type="submit" 
//                         className="w-full py-7 text-lg font-bold shadow-lg" 
//                         disabled={createOrderMutation.isPending}
//                       >
//                         {createOrderMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2" />} 
//                         Confirmer la commande
//                       </Button>

//                       {/* BOUTON 2: TYPE BUTTON (N'appelle PAS la soumission automatique) */}
//                       <Button 
//                         type="button" 
//                         variant="outline" 
//                         className="w-full py-7 text-lg font-bold border-green-500 text-green-600 hover:bg-green-50" 
//                         onClick={(e) => {
//                           e.preventDefault(); // Sécurité supplémentaire
//                           handleWhatsAppOnly();
//                         }}
//                       >
//                         <MessageCircle className="mr-2" /> Commander via WhatsApp
//                       </Button>
//                     </div>
//                   </form>
//                 </Form>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="lg:w-1/3">
//             <Card className="sticky top-8 shadow-xl border-primary/10 overflow-hidden">
//               <CardHeader className="bg-gray-50 border-b">
//                 <CardTitle className="text-lg flex items-center gap-2"><Truck size={18}/> Récapitulatif</CardTitle>
//               </CardHeader>
//               <CardContent className="pt-6 space-y-4">
//                 <div className="max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
//                   {(cartData?.items || []).map((item) => (
//                     <div key={item.id} className="flex justify-between text-sm border-b border-dashed pb-2">
//                       <span className="flex-1 pr-2 line-clamp-1">{item.product.name} <span className="text-muted-foreground text-xs">x{item.quantity}</span></span>
//                       <span className="font-medium whitespace-nowrap">{formatPrice(item.totalCents)}</span>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="pt-4 space-y-3">
//                   <div className="flex justify-between text-gray-600 text-sm"><span>Sous-total</span><span>{formatPrice(calculateSubtotal())}</span></div>
//                   <div className="flex justify-between text-blue-600 text-sm font-medium">
//                     <span>Livraison ({selectedZone?.name || "Non choisie"})</span>
//                     <span>{formValues.deliveryZoneId ? `+ ${formatPrice(getSelectedZonePrice())}` : "---"}</span>
//                   </div>
//                   <div className="flex justify-between text-xl font-bold border-t pt-4 text-primary">
//                     <span>Total à payer</span>
//                     <span>{formatPrice(calculateTotal())}</span>
//                   </div>
//                 </div>
//                 <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-start gap-3 mt-4">
//                    <ShieldCheck className="text-green-600 shrink-0" size={20}/>
//                    <div>
//                      <p className="text-[10px] font-bold text-green-800 uppercase">Paiement Sécurisé</p>
//                      <p className="text-[10px] text-green-700">Réglez en espèces ou par mobile money lors de la livraison.</p>
//                    </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;


import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Loader2, 
  User, 
  Mail, 
  Home, 
  Phone, 
  CheckCircle, 
  ShoppingBag,
  Truck,
  ShieldCheck,
  MapPin,
  Info,
  MessageCircle,
  CreditCard
} from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Cart, PlaceOrderRequest } from "@/types/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WHATSAPP_NUMBER = "221776562121";

const checkoutSchema = z.object({
  name: z.string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(100, { message: "Le nom ne doit pas dépasser 100 caractères" }),
  
  email: z.string()
    .email({ message: "Email invalide" })
    .optional()
    .or(z.literal('')), 
  
  address: z.string()
    .min(3, { message: "L'adresse doit contenir au moins 3 caractères" }),
    
  phoneNumber: z.string()
    .min(7, { message: "Le numéro doit contenir au moins 7 chiffres" })
    .regex(/^[0-9+\-\s()]*$/, { message: "Format de numéro invalide" }),
    
  deliveryZoneId: z.string().min(1, "Veuillez choisir une zone de livraison"),
  deliveryAddressDetail: z.string().optional(), 
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const { cartId } = useParams<{ cartId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formValues, setFormValues] = useState<Partial<CheckoutFormData>>({});

  const { data: zonesData, isLoading: isZonesLoading } = useQuery({
    queryKey: ["delivery-zones"],
    queryFn: () => apiClient.getDeliveryZones(),
  });
  
  const { data: cartData, isLoading: isCartLoading } = useQuery<Cart, Error>({
    queryKey: ["cart", cartId],
    queryFn: () => apiClient.getCart(cartId!),
    enabled: !!cartId,
  });

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '', email: '', address: '', phoneNumber: '',
      deliveryZoneId: '', deliveryAddressDetail: ''
    },
    mode: "onTouched",
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormValues(value as CheckoutFormData);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const calculateSubtotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((sum, item) => sum + (item.totalCents || 0), 0);
  };

  const selectedZone = (zonesData?.data || []).find((z: any) => z.id.toString() === formValues.deliveryZoneId);

  const getSelectedZonePrice = () => {
    return selectedZone ? selectedZone.price : 0;
  };

  const calculateTotal = () => calculateSubtotal() + getSelectedZonePrice();

  const formatPrice = (cents: number) => cents.toLocaleString("fr-FR") + " FCFA";

  const buildWhatsAppMessage = (orderNumber?: string) => {
    let message = `Bonjour, je souhaite confirmer ma commande. 🛒\n\n`;
    message += "*📋 INFOS LIVRAISON:*\n";
    message += `• Nom: ${formValues.name}\n`;
    message += `• Tél: ${formValues.phoneNumber}\n`;
    message += `• Email: ${formValues.email || 'Non fourni'}\n`;
    message += `• Zone: ${selectedZone?.name || 'N/A'}\n`;
    message += `• Quartier: ${formValues.deliveryAddressDetail || 'Non précisé'}\n\n`;
    
    message += "*📦 PRODUITS:*\n";
    cartData?.items?.forEach((item, i) => {
      message += `${i+1}. ${item.product.name} (x${item.quantity}) - ${formatPrice(item.totalCents)}\n`;
    });
    
    message += `\n*TOTAL: ${formatPrice(calculateTotal())}*`;
    if (orderNumber) message += `\n\n🆔 *Commande: #${orderNumber}*`;
    return encodeURIComponent(message);
  };

  const createOrderMutation = useMutation({
    mutationFn: (orderRequest: PlaceOrderRequest) => apiClient.createOrder(orderRequest),
    onSuccess: (data) => {
      localStorage.removeItem("cart_id");
      queryClient.removeQueries({ queryKey: ["cart"] });
      toast({ title: "Commande créée ! 🎉" });
      navigate("/order-success", { 
        state: { 
          orderId: data.data?.orderId,
          orderNumber: data.data?.orderNumber,
          customerName: form.getValues().name,
          total: calculateTotal()
        }
      });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    }
  });

  const handleFinalizeOrder = async (data: CheckoutFormData) => {
    if (!cartData?.items?.length) return;
    const orderRequest: PlaceOrderRequest = {
      cartId: cartId!,
      client: { name: data.name, email: data.email || '', address: data.address, phoneNumber: data.phoneNumber },
      orderItems: cartData.items.map(item => ({ productId: item.product.id, quantity: item.quantity })),
      deliveryZoneId: parseInt(data.deliveryZoneId),
      deliveryAddressDetail: data.deliveryAddressDetail || '',
      channel: "WEB"
    };
    createOrderMutation.mutate(orderRequest);
  };

  const handleWhatsAppOnly = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    const data = form.getValues();
    const orderRequest: PlaceOrderRequest = {
      cartId: cartId!,
      client: { name: data.name, email: data.email || '', address: data.address, phoneNumber: data.phoneNumber },
      orderItems: cartData!.items.map(item => ({ productId: item.product.id, quantity: item.quantity })),
      deliveryZoneId: parseInt(data.deliveryZoneId),
      deliveryAddressDetail: data.deliveryAddressDetail || '',
      channel: "WHATSAPP" 
    };

    createOrderMutation.mutate(orderRequest, {
      onSuccess: (response) => {
        const orderNumber = response.data?.orderNumber || response.data?.orderId;
        const message = buildWhatsAppMessage(orderNumber);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
      }
    });
  };

  if (isCartLoading || isZonesLoading) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50"><Loader2 className="h-10 w-10 animate-spin text-primary mb-4" /><p>Chargement de votre commande...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-8 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-6">
            <Card className="shadow-lg border-2">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-2xl flex items-center gap-2"><ShoppingBag className="text-primary" /> Finaliser ma commande</CardTitle>
                <CardDescription>Renseignez vos coordonnées pour la livraison à domicile</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleFinalizeOrder)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                              <Input className="pl-10" placeholder="Moussa Diop" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      
                      <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                              <Input className="pl-10" placeholder="77XXXXXXX" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optionnel)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                            <Input className="pl-10" placeholder="exemple@mail.com" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-4">
                      <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2 uppercase tracking-wider">
                        <Truck size={16} /> Mode de Livraison
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField control={form.control} name="deliveryZoneId" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-900">Zone de livraison *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white border-blue-200">
                                  <SelectValue placeholder="Sélectionner votre zone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {(zonesData?.data || []).map((zone: any) => (
                                  <SelectItem key={zone.id} value={zone.id.toString()}>
                                    {zone.name} (+{formatPrice(zone.price)})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        
                        <FormField control={form.control} name="deliveryAddressDetail" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-900">Quartier / Précision (Optionnel)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-4 w-4 text-blue-400"/>
                                <Input className="pl-10 bg-white border-blue-200" placeholder="Ex: Derrière la boulangerie" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      {selectedZone && (
                        <Alert className="bg-white/80 border-blue-200 animate-in fade-in slide-in-from-top-1">
                          <Info className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-700 text-xs leading-relaxed">
                            <span className="font-bold">Quartiers couverts : </span>
                            {selectedZone.areas}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>

                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse de résidence actuelle *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                            <Input className="pl-10" placeholder="Ville, Rue, Porte..." {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {/* SECTION DES BOUTONS AVEC DESIGN AMÉLIORÉ */}
                    <div className="space-y-4 pt-4 border-t">
                      {/* BOUTON 1: COMMANDE STANDARD */}
                      <Button 
                        type="submit" 
                        className="standard-button-hover-effect w-full py-7 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-primary to-primary/90 hover:from-primary hover:to-primary/80" 
                        disabled={createOrderMutation.isPending}
                      >
                        {createOrderMutation.isPending ? (
                          <>
                            <Loader2 className="animate-spin mr-2" /> 
                            Traitement en cours...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2" /> 
                            Commander maintenant
                          </>
                        )}
                      </Button>

                      {/* SÉPARATEUR "OU" */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-white text-gray-500 uppercase text-xs font-medium">
                            ou
                          </span>
                        </div>
                      </div>

                      {/* BOUTON 2: WHATSAPP - DESIGN AMÉLIORÉ */}
                      <Button 
                        type="button" 
                        variant="outline"
                        className="whatsapp-button-hover-effect w-full py-7 text-lg font-bold border-2 transition-all duration-200 bg-gradient-to-r from-green-50 to-white hover:from-green-100 hover:to-green-50 hover:border-green-600 group relative overflow-hidden"
                        onClick={(e) => {
                          e.preventDefault();
                          handleWhatsAppOnly();
                        }}
                        disabled={createOrderMutation.isPending}
                      >
                        {/* Effet de fond animé */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        
                        <div className="relative flex items-center justify-center gap-3">
                          <div className="relative">
                            <div className="bg-green-100 p-2 rounded-full">
                              <MessageCircle className="h-6 w-6 text-green-600 group-hover:animate-bounce transition-transform duration-300" />
                            </div>
                            <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] rounded-full w-6 h-6 flex items-center justify-center animate-pulse border-2 border-white">
                              <span className="text-xs">💬</span>
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-green-700 group-hover:text-green-800 text-lg">
                              Commander via WhatsApp
                            </div>
                            <div className="text-sm text-green-600 font-normal">
                              Confirmation immédiate
                            </div>
                          </div>
                        </div>
                      </Button>

                      {/* INFORMATIONS COMPLÉMENTAIRES */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-blue-800">Commande standard</p>
                              <p className="text-xs text-blue-700 mt-1">
                                Suivi en ligne • Email de confirmation • Support dédié
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                          <div className="flex items-start gap-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <MessageCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-green-800">Via WhatsApp</p>
                              <p className="text-xs text-green-700 mt-1">
                                Chat direct • Réponses rapides • Support personnalisé
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-1/3">
            <Card className="sticky top-8 shadow-xl border-primary/10 overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck size={18}/> Récapitulatif
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {(cartData?.items || []).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm border-b border-dashed pb-2">
                      <span className="flex-1 pr-2 line-clamp-1">
                        {item.product.name} <span className="text-muted-foreground text-xs">x{item.quantity}</span>
                      </span>
                      <span className="font-medium whitespace-nowrap">{formatPrice(item.totalCents)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Sous-total</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-blue-600 text-sm font-medium">
                    <span>Livraison ({selectedZone?.name || "Non choisie"})</span>
                    <span>{formValues.deliveryZoneId ? `+ ${formatPrice(getSelectedZonePrice())}` : "---"}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-4 text-primary">
                    <span>Total à payer</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-start gap-3 mt-4">
                   <ShieldCheck className="text-green-600 shrink-0" size={20}/>
                   <div>
                     <p className="text-[10px] font-bold text-green-800 uppercase">Paiement Sécurisé</p>
                     <p className="text-[10px] text-green-700">Réglez en espèces ou par mobile money lors de la livraison.</p>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Ajoutez ces styles CSS dans votre fichier global (globals.css) */}
      <style>{`
        .standard-button-hover-effect {
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(37, 99, 235, 0.1);
        }
        
        .standard-button-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(37, 99, 235, 0.2);
        }
        
        .whatsapp-button-hover-effect {
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(72, 187, 120, 0.1);
        }
        
        .whatsapp-button-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(72, 187, 120, 0.2);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default CheckoutPage;