import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Truck,
  ShieldCheck,
  MapPin,
  Info
} from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Cart, CartItem } from "@/types/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 🚨 Numéro de l'entreprise pour WhatsApp
const WHATSAPP_NUMBER = "221776562121";

// 🚨 Schéma de validation complet
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
  deliveryAddressDetail: z.string().min(2, "Précisez votre quartier ou point de repère"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface PlaceOrderRequest {
  cartId: string;
  client: {
    name: string;
    email: string;
    address: string;
    phoneNumber: string;
  };
  orderItems: Array<{ productId: number; quantity: number }>;
  deliveryZoneId: number;
  deliveryAddressDetail: string;
}

const CheckoutPage = () => {
  const { cartId } = useParams<{ cartId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formValues, setFormValues] = useState<Partial<CheckoutFormData>>({});

  // 1️⃣ RÉCUPÉRATION DES DONNÉES (ZONES + PANIER)
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

  // Surveillance des changements pour calculs en temps réel
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormValues(value as CheckoutFormData);
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  // 2️⃣ LOGIQUE DE CALCULS FINANCIERS
  const calculateSubtotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce((sum, item) => sum + (item.totalCents || 0), 0);
  };

  const getSelectedZonePrice = () => {
    const zone = (zonesData?.data || []).find((z: any) => z.id.toString() === formValues.deliveryZoneId);
    return zone ? zone.price : 0;
  };

  const calculateTotal = () => calculateSubtotal() + getSelectedZonePrice();

  const formatPrice = (cents: number) => cents.toLocaleString("fr-FR") + " FCFA";

  // 3️⃣ WHATSAPP FORMATTING
  const buildWhatsAppMessage = (orderNumber?: string) => {
    const zone = (zonesData?.data || []).find((z: any) => z.id.toString() === formValues.deliveryZoneId);
    const subtotal = formatPrice(calculateSubtotal());
    const shipping = getSelectedZonePrice() === 0 ? 'À confirmer' : formatPrice(getSelectedZonePrice());
    
    let message = `Bonjour, je souhaite confirmer ma commande. 🛒\n\n`;
    message += "*📋 INFOS LIVRAISON:*\n";
    message += `• Nom: ${formValues.name}\n`;
    message += `• Tél: ${formValues.phoneNumber}\n`;
    message += `• Zone: ${zone?.name || 'N/A'}\n`;
    message += `• Quartier: ${formValues.deliveryAddressDetail}\n\n`;
    
    message += "*📦 PRODUITS:*\n";
    cartData?.items?.forEach((item, i) => {
      message += `${i+1}. ${item.product.name} (x${item.quantity}) - ${formatPrice(item.totalCents)}\n`;
    });
    
    message += `\n*💰 RÉCAPITULATIF:*`;
    message += `\n• Sous-total: ${subtotal}`;
    message += `\n• Livraison: ${shipping}`;
    message += `\n• *TOTAL: ${formatPrice(calculateTotal())}*`;
    
    if (orderNumber) message += `\n\n🆔 *Commande: #${orderNumber}*`;
    return encodeURIComponent(message);
  };

  // 4️⃣ GESTION DE LA COMMANDE (MUTATION)
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
      deliveryAddressDetail: data.deliveryAddressDetail
    };
    createOrderMutation.mutate(orderRequest);
  };

  const handleWhatsAppOnly = () => {
    form.trigger().then((isValid) => {
      if (isValid) {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`, '_blank');
      } else {
        toast({ title: "Veuillez remplir les champs obligatoires", variant: "destructive" });
      }
    });
  };

  if (isCartLoading || isZonesLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium">Chargement de votre panier...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-8 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* COLONNE GAUCHE - FORMULAIRE */}
          <div className="lg:w-2/3 space-y-6">
            <Card className="shadow-lg border-2">
              <CardHeader className="bg-primary/5 border-b">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <ShoppingBag className="text-primary" /> Finaliser ma commande
                </CardTitle>
                <CardDescription>Renseignez vos coordonnées pour la livraison à domicile</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet *</FormLabel>
                          <FormControl><div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-gray-400"/><Input className="pl-10" placeholder="Moussa Diop" {...field} /></div></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone *</FormLabel>
                          <FormControl><div className="relative"><Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400"/><Input className="pl-10" placeholder="77XXXXXXX" {...field} /></div></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/30 p-4 rounded-xl border border-blue-100/50">
                      <FormField control={form.control} name="deliveryZoneId" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-blue-800">Zone de livraison *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white"><SelectValue placeholder="Où livrer ?" /></SelectTrigger>
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
                          <FormLabel className="text-blue-800">Quartier / Précision *</FormLabel>
                          <FormControl><div className="relative"><MapPin className="absolute left-3 top-3 h-4 w-4 text-blue-400"/><Input className="pl-10 bg-white" placeholder="Ex: Cité Keur Gorgui" {...field} /></div></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      {formValues.deliveryZoneId && (
                        <div className="col-span-1 md:col-span-2 mt-2">
                          <Alert className="bg-white border-blue-100">
                            <Info className="h-4 w-4 text-blue-500" />
                            <AlertDescription className="text-xs text-blue-600">
                              Quartiers couverts : {(zonesData?.data || []).find((z:any) => z.id.toString() === formValues.deliveryZoneId)?.areas}
                            </AlertDescription>
                          </Alert>
                        </div>
                      )}
                    </div>

                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adresse de résidence (Optionnel)</FormLabel>
                        <FormControl><div className="relative"><Home className="absolute left-3 top-3 h-4 w-4 text-gray-400"/><Input className="pl-10" placeholder="Votre adresse habituelle" {...field} /></div></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="space-y-4 pt-4 border-t">
                      <Button 
                        type="button" 
                        className="w-full py-7 text-lg font-bold shadow-lg" 
                        disabled={createOrderMutation.isPending}
                        onClick={form.handleSubmit(handleFinalizeOrder)}
                      >
                        {createOrderMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle className="mr-2" />} 
                        Confirmer la commande
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full py-7 text-lg font-bold border-green-500 text-green-600 hover:bg-green-50" 
                        onClick={handleWhatsAppOnly}
                      >
                        Commander via WhatsApp
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* COLONNE DROITE - RÉSUMÉ */}
          <div className="lg:w-1/3">
            <Card className="sticky top-8 shadow-xl border-primary/10">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg flex items-center gap-2"><Truck size={18}/> Récapitulatif</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {(cartData?.items || []).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm border-b border-dashed pb-2">
                      <span className="flex-1 pr-2 line-clamp-1">{item.product.name} <span className="text-muted-foreground text-xs">x{item.quantity}</span></span>
                      <span className="font-medium whitespace-nowrap">{formatPrice(item.totalCents)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-blue-600 font-medium">
                    <span>Livraison</span>
                    <span>{formValues.deliveryZoneId ? `+ ${formatPrice(getSelectedZonePrice())}` : "Choisir une zone"}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-4 text-primary">
                    <span>Total à payer</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-start gap-3 mt-4">
                   <ShieldCheck className="text-green-600 shrink-0" size={20}/>
                   <div className="space-y-1">
                     <p className="text-xs text-green-800 font-bold uppercase tracking-wider">Paiement Sécurisé</p>
                     <p className="text-[10px] text-green-700">Réglez vos achats en toute sérénité au moment de la livraison.</p>
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