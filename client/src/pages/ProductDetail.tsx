import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, ShoppingCart, Heart, Share2, Minus, Plus, ArrowLeft, Loader2 } from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/models/Product';
import { Cart } from '@/types/api';
import { ApiResponse } from '@/models/ApiResponse'; 
// Mock reviews (à remplacer par l'API quand elle sera disponible)
const mockReviews = [
  {
    id: '1',
    productId: '1',
    userId: 'user1',
    userName: 'Sophie Martin',
    rating: 5,
    comment: 'Excellente qualité, très satisfaite de mon achat !',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    productId: '1',
    userId: 'user2',
    userName: 'Pierre Dubois',
    rating: 4,
    comment: 'Très bon produit, livraison rapide.',
    createdAt: '2024-01-10T14:20:00Z'
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);

  // Récupération du produit depuis l'API avec typage correct
  const { data: productResponse, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => apiClient.getProduct(Number(id)) as Promise<ApiResponse<Product>>,
    enabled: !!id,
  });

  const product = productResponse?.data;

  console.log('================PRODUCT==================',product);

// ProductDetail.tsx : Correction de addToCartMutation
const addToCartMutation = useMutation({
   mutationFn: async () => {
        let cartId = localStorage.getItem('cart_id');
        
        if (!cartId) {
            // Créer le panier et y ajouter le premier produit en UNE SEULE REQUÊTE
            const cartResponse = await apiClient.createCart(product!.id, quantity) as ApiResponse<Cart>;
            
            const newCartId = cartResponse.data?.id; 

            if (!newCartId) {
                // Si l'ID est null, lever une erreur (gestion du problème précédent)
                throw new Error("L'API n'a pas renvoyé l'ID du nouveau panier.");
            }
            
            cartId = newCartId.toString();
            localStorage.setItem('cart_id', cartId);
            
            // Pas besoin d'Étape 2 car c'est géré par createCart() sur le backend
        } else {
            // Ajouter au panier existant
            await apiClient.addToCart(cartId, Number(product!.id), quantity) as ApiResponse<Cart>;
        }
        
        return cartId;
    },
  
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    toast({
      title: "Produit ajouté !",
      description: `${quantity} x ${product!.name} ajouté(s) à votre panier`,
    });
  },
  onError: (error: any) => {
    toast({
      title: "Erreur",
      description: error.message || "Impossible d'ajouter au panier",
      variant: "destructive",
    });
  }
});

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addToCartMutation.mutate();
  };

  const handleWishlist = () => {
    setIsWishlist(!isWishlist);
    toast({
      title: isWishlist ? "Retiré des favoris" : "Ajouté aux favoris",
      description: isWishlist 
        ? `${product!.name} a été retiré de vos favoris`
        : `${product!.name} a été ajouté à vos favoris`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product!.name,
        text: product!.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié !",
        description: "Le lien du produit a été copié dans le presse-papier",
      });
    }
  };

  // Formatage du prix en FCFA
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  // Utiliser les avis mockés en attendant que l'API fournisse les avis via product.data.reviews
  const reviews = mockReviews.filter((r) => r.productId === id);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              Produit non trouvé
            </h2>
            <p className="text-muted-foreground mb-6">
              Le produit que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
            <Button onClick={() => navigate('/products')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux produits
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          {/* Bouton retour skeleton */}
          <Skeleton className="h-10 w-32 mb-6" />
          
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Image skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-square rounded-xl" />
            </div>

            {/* Contenu skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-12 w-32" />
              <div className="flex gap-4">
                <Skeleton className="h-12 flex-1" />
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-12 w-12" />
              </div>
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-10 w-96" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-8">
        {/* Bouton retour */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/products')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux produits
        </Button>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Galerie d'images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {/* Miniatures supplémentaires (à remplacer par les images réelles du produit) */}
              {[1, 2, 3, 4].map((index) => (
                <div key={index} className="aspect-square rounded-md overflow-hidden bg-muted cursor-pointer opacity-50">
                  <img 
                    src={product.imageUrl} 
                    alt={`${product.name} ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.categoryResponseDTO?.name}
              </Badge>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({reviews.length} avis)
                </span>
              </div>

              <p className="text-3xl font-bold text-primary mb-6">
                {formatPrice(product.priceCents)} FCFA
              </p>

              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                {product.description}
              </p>

              {product.stock > 0 ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ✓ En stock ({product.stock} disponibles)
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  ✗ Rupture de stock
                </Badge>
              )}
            </div>

            {/* Sélecteur de quantité */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantité :</span>
              <div className="flex items-center border rounded-lg">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 font-medium min-w-[60px] text-center">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                Sous-total : <span className="font-semibold text-primary">
                  {formatPrice(product.priceCents * quantity)} FCFA
                </span>
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button 
                variant="hero" 
                size="lg" 
                className="flex-1" 
                disabled={product.stock === 0 || addToCartMutation.isPending}
                onClick={handleAddToCart}
              >
                {addToCartMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Ajouter au panier
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleWishlist}
              >
                <Heart className={`h-5 w-5 ${isWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Livraison rapide */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-green-600 font-semibold">✓ Livraison rapide</span>
                <span className="text-muted-foreground">
                  Recevez-le sous 2-3 jours ouvrés
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Détails supplémentaires */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="reviews">Avis ({reviews.length})</TabsTrigger>
            <TabsTrigger value="shipping">Livraison & Retours</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Description détaillée</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p className="leading-relaxed">
                    {product.description}
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Caractéristiques</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Catégorie : {product.categoryResponseDTO?.name}</li>
                        <li>• Marque : {product.shopId || "Notre marque"}</li>
                        <li>• Note moyenne : {product.rating}/5</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Disponibilité</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Stock : {product.stock} unités</li>
                        <li>• Livraison : 2-3 jours ouvrés</li>
                        <li>• Retours : 30 jours</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {/* Résumé des notes */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary">{product.rating}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {reviews.length} avis
                      </div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center gap-2">
                          <span className="text-sm w-8">{stars} étoiles</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ 
                                width: `${(reviews.filter(r => r.rating === stars).length / reviews.length) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">
                            {reviews.filter(r => r.rating === stars).length}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Liste des avis */}
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.userName}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                      Aucun avis pour ce produit. Soyez le premier à donner votre avis !
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Livraison & Retours</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Options de livraison</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Livraison standard : 2-3 jours ouvrés
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Livraison express : 24h
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Livraison gratuite dès 50 000 FCFA
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Point relais disponible
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Politique de retours</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Retours gratuits sous 30 jours
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Remboursement intégral
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Échange possible
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-600">✓</span>
                        Support client 7j/7
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Produits similaires (section à implémenter) */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
          <div className="text-center py-8 text-muted-foreground">
            <p>D'autres produits de la même catégorie vous attendent !</p>
            <Link to="/products">
              <Button variant="outline" className="mt-4">
                Voir tous les produits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;