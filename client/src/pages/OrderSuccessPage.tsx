import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Package, Mail, Home, Calendar, ArrowRight, Phone, MapPin, Loader2, Truck, Shield, Gift, Clock, CheckSquare, MessageCircle, Share2, Download, ShoppingBag } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { OrderDetails } from "@/types/api";



const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [orderData, setOrderData] = useState<OrderDetails | null>(null);
  const [shareButtonText, setShareButtonText] = useState("Partager");
  
  // Récupérer l'ID de commande depuis la navigation ou depuis l'URL
  const passedOrderId = location.state?.orderId;
  const { orderId: urlOrderId } = useParams<{ orderId: string }>();
  const orderId = passedOrderId || urlOrderId;

  // Si on a les données passées directement
  const passedData = location.state;
  const isDataComplete = passedData && passedData.items;

 
  const { data: apiOrderData, isLoading, error } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => apiClient.getOrderDetails(Number(orderId)),
    enabled: !!orderId && !isDataComplete, 
});

  console.log('=================PASSED COMMANDE================',apiOrderData);
  

 // Mettre à jour les données de commande
useEffect(() => {
    // 1. Si les données COMPLÈTES sont passées via la navigation (CheckoutPage)
    if (isDataComplete) {
        setOrderData({
            orderId: passedData.orderId,
            orderNumber: passedData.orderNumber,
            customerName: passedData.customerName,
            customerEmail: passedData.customerEmail,
            totalAmount: passedData.totalAmount, // Déjà en centimes
            items: passedData.items.map((item: any) => ({ // Mappage pour assurer le format OrderDetails
                id: item.productId, // Utiliser le productId comme ID d'item
                productName: item.productName,
                quantity: item.quantity,
                price: item.priceCents,
                imageUrl: item.imageUrl,
            })),
            status: passedData.status || "PLACED",
            orderDate: new Date().toLocaleDateString("fr-FR"),
            deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR"),
        });
    } 
    // 2. Si les données sont chargées depuis l'API (rechargement de page)
    else if (apiOrderData?.data) {
        const data = apiOrderData.data;
        setOrderData({
            orderId: data.id,
            orderNumber: data.orderNumber,
            customerName: data.client?.name,
            customerEmail: data.client?.email,
            totalAmount: data.totalCents,
            items: data.items?.map((item: any) => ({
                id: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                price: item.priceCents,
                imageUrl: item.imageUrl,
            })),
            status: data.status,
            orderDate: new Date(data.createdAt).toLocaleDateString("fr-FR"),
            deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR"),
        });
    }
}, [isDataComplete, passedData, apiOrderData]);

  // Fonction pour partager la commande
  const handleShareOrder = async () => {
    const shareText = `J'ai fait un achat sur Minane B ! 🛍️\nNuméro de commande: ${orderData?.orderNumber}\nMontant: ${formatPrice(orderData?.totalAmount || 0)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ma commande Minane Business',
          text: shareText,
          url: window.location.href,
        });
        setShareButtonText("Partagé !");
      } catch (error) {
        console.log('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      setShareButtonText("Copié !");
      setTimeout(() => setShareButtonText("Partager"), 2000);
      toast({
        title: "Texte copié",
        description: "Les détails de votre commande ont été copiés",
      });
    }
  };

  // Télécharger un produit
  const handleDownloadProduct = (downloadUrl: string, productName: string) => {
    // Simulation de téléchargement
    toast({
      title: "Téléchargement",
      description: `Le produit "${productName}" est en cours de téléchargement`,
    });
    // Dans une vraie implémentation, vous téléchargeriez le fichier ici
    window.open(downloadUrl, '_blank');
  };

  // Si pas d'ID de commande
  if (!orderId && !passedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-100">
        <Header />
        <div className="container py-12 px-4 max-w-3xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Commande introuvable</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Nous n'avons pas pu trouver les détails de votre commande.
              </p>
              <Button 
                onClick={() => navigate("/")}
                className="px-8 py-6 text-lg bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Formatage du prix en FCFA
  const formatPrice = (cents: number) => {
    if (!cents) return "0 FCFA";
    return cents.toLocaleString("fr-FR") + " FCFA";
  };

  const handleTrackOrder = () => {
    navigate(`/orders`);
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleViewOrderDetails = () => {
    if (orderData?.orderId) {
      navigate(`/orders/${orderData.orderId}`);
    }
  };

  // Animation de confettis
  useEffect(() => {
    if (orderData) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }
  }, [orderData]);

  if (isLoading && !passedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-100">
        <Header />
        <div className="container py-12 px-4 max-w-3xl mx-auto flex flex-col justify-center items-center space-y-6">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-xl"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Chargement de votre commande</h3>
            <p className="text-gray-500">Préparation des détails...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !passedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-100">
        <Header />
        <div className="container py-12 px-4 max-w-3xl mx-auto">
          <Card className="shadow-xl border-0">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Alert className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Erreur de chargement</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Nous n'avons pas pu charger les détails de votre commande.
              </p>
              <Button 
                onClick={() => navigate("/")}
                className="px-8 py-6 text-lg bg-gradient-to-r from-primary to-secondary shadow-lg hover:shadow-xl"
              >
                Retour à l'accueil
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/20 to-gray-100">
      {/* Animation de confettis */}
      <div className="confetti-animation"></div>
      
      <Header />
      
      <div className="container py-8 px-4 max-w-6xl mx-auto">
        {/* En-tête avec animation */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center h-24 w-24 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full mb-4 shadow-lg">
            <CheckCircle className="h-12 w-12 text-green-600 animate-scale-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent mb-2">
            Commande Confirmée !
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Jërejëf, <span className="font-semibold text-gray-800">{orderData?.customerName || "Client"} !</span>
          </p>
          <p className="text-gray-500">
            Votre commande est maintenant confirmée
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Carte de succès principale */}
            <Card className="shadow-xl border-0 overflow-hidden bg-gradient-to-br from-white to-gray-50">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-500 via-primary to-emerald-500"></div>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-gray-800">Votre commande est validée</CardTitle>
                    <CardDescription className="text-gray-500">
                      Numéro: <span className="font-mono font-bold text-primary">{orderData?.orderNumber || orderData?.orderId}</span>
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-4 py-2 text-sm">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Confirmée
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Timeline simplifiée */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    Statut de votre commande
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Commande reçue</span>
                      <span>Validée</span>
                      <span>Terminée</span>
                    </div>
                    <Progress value={100} className="h-2 bg-green-500" />
                    <div className="flex justify-between">
                      <div className="text-center">
                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
                          <ShoppingBag className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-xs text-gray-600">Aujourd'hui</p>
                      </div>
                      <div className="text-center">
                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-xs text-gray-600">Maintenant</p>
                      </div>
                      <div className="text-center">
                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
                          <CheckSquare className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-xs text-gray-600">Terminée</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations de commande */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      Détails de la commande
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date de commande</span>
                        <span className="font-medium">{orderData?.orderDate || new Date().toLocaleDateString("fr-FR")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Statut</span>
                        <span className="font-medium text-green-600">Confirmée</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                    <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                      <Mail className="h-5 w-5 text-purple-500" />
                      Contact
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Email de confirmation</p>
                        <p className="font-medium truncate">{orderData?.customerEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Montant total */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600">Montant total</p>
                      <p className="text-3xl font-bold text-gray-800">{formatPrice(orderData?.totalAmount || 0)}</p>
                    </div>
                    <Badge variant="outline" className="text-lg py-2 px-4 border-primary text-primary">
                      {orderData?.items?.length || 1} {orderData?.items?.length === 1 ? 'produit' : 'produits'}
                    </Badge>
                  </div>
                </div>

                {/* Articles commandés */}
                {orderData?.items && orderData.items.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h3 className="font-semibold text-gray-700 mb-4">Produits commandés</h3>
                    <div className="space-y-4">
                      {orderData.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.productName}
                              className="w-16 h-16 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-500" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{item.productName}</h4>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm text-gray-600">Quantité: {item.quantity}</span>
                              <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                            {item.downloadUrl && (
                              <Button
                                onClick={() => handleDownloadProduct(item.downloadUrl!, item.productName)}
                                className="mt-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                                size="sm"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Télécharger
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prochaines étapes */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Ce qui se passe maintenant</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Email de confirmation</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Un récapitulatif détaillé a été envoyé à votre adresse email. 
                          Consultez votre boîte de réception pour retrouver tous les détails de votre commande.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Accès aux produits</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Vos produits sont disponibles immédiatement. Vous pouvez y accéder depuis votre compte 
                          ou utiliser les liens de téléchargement fournis.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">Gestion de vos achats</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Vous pouvez gérer tous vos achats depuis votre espace client. 
                          Retrouvez l'historique de vos commandes et vos produits téléchargés.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-8">
            {/* Actions rapides */}
            <Card className="shadow-xl border-0 bg-gradient-to-b from-white to-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleTrackOrder}
                  className="w-full py-6 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingBag className="mr-3 h-5 w-5" />
                  Voir mes commandes
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleShareOrder}
                  className="w-full py-6 text-lg border-2"
                >
                  <Share2 className="mr-3 h-5 w-5" />
                  {shareButtonText}
                </Button>
                
                <Button 
                  variant="ghost"
                  onClick={handleContinueShopping}
                  className="w-full py-6 text-lg"
                >
                  <Gift className="mr-3 h-5 w-5" />
                  Continuer mes achats
                </Button>
              </CardContent>
            </Card>

            {/* Garanties */}
            <Card className="shadow-xl border-0 bg-gradient-to-b from-white to-blue-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  Vos avantages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Produits disponibles</h4>
                    <p className="text-sm text-gray-600">Accès immédiat après achat</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Download className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Téléchargements illimités</h4>
                    <p className="text-sm text-gray-600">Accédez à vos produits à tout moment</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Support 24h/24</h4>
                    <p className="text-sm text-gray-600">Assistance disponible en permanence</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="shadow-xl border-0 bg-gradient-to-b from-white to-amber-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-amber-600" />
                  Besoin d'aide ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">support@minane-b.sn</span>
                  </div>
                  <p className="text-sm text-gray-600">Réponse sous 24h maximum</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                  onClick={() => navigate("/contact")}
                >
                  Contacter le support
                </Button>
              </CardContent>
            </Card>

            {/* Cadeau bonus */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl p-6 border border-primary/30 text-center">
              <Gift className="h-12 w-12 text-primary mx-auto mb-3" />
              <h4 className="font-bold text-gray-800 mb-2">Remerciement spécial !</h4>
              <p className="text-sm text-gray-600 mb-4">
                Merci pour votre confiance. Profitez de 15% de réduction sur votre prochaine commande :
              </p>
              <div className="bg-white rounded-lg p-3 border-2 border-dashed border-primary">
                <p className="font-mono font-bold text-lg text-primary">MERCI15</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informations importantes */}
        <Alert className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
          <AlertDescription className="text-center text-green-700">
            <strong>🎉 Félicitations !</strong> Votre commande a été validée avec succès. 
            Consultez votre email pour les détails complets et les accès à vos produits.
          </AlertDescription>
        </Alert>

        {/* CSS pour les animations */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes scalePulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out;
          }
          
          .animate-scale-pulse {
            animation: scalePulse 2s infinite;
          }
          
          .confetti-animation {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            background-image: radial-gradient(circle at 25% 25%, rgba(34, 197, 94, 0.1) 0%, transparent 55%),
                            radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 55%);
          }
        `}</style>
      </div>
    </div>
  );
};

export default OrderSuccessPage;