import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import {
  ArrowRight,
  Package,
  Shield,
  Truck,
  Loader2,
  Sparkles,
  Award,
  CheckCircle,
  Zap,
  TrendingUp,
  Star,
  Tag,
  Filter,
  ShoppingBag,
  Heart,
  Users,
  Rocket,
  MapPin,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/models/Product";
import { ApiResponse, PageResponse } from "@/models/ApiResponse";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shop } from "@/types/api";

const Index = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  // Récupération des produits avec typage
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery<ApiResponse<PageResponse<Product>>>({
    queryKey: ["products-display", selectedCategoryId],
    queryFn: () =>
      selectedCategoryId
        ? apiClient.getProductsByCategory(selectedCategoryId, 0, 8)
        : apiClient.getProducts(0, 12),
    staleTime: 1000 * 60 * 5,
  });

  // Récupération des catégories avec typage
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery<
    ApiResponse<PageResponse<any>>
  >({
    queryKey: ["categories"],
    queryFn: () => apiClient.getCategories(),
  });

 

  const { data: shopsData, isLoading: isLoadingShops } = useQuery({
    queryKey: ["popular-shops"],
    queryFn: () =>
      apiClient.getShops(0, 8) as Promise<ApiResponse<PageResponse<Shop>>>,
  });

  

  // Images hero
  const heroImages = [
    {
      id: 1,
      imageUrl: heroBanner,
      title: "Collection Printemps-Été",
      description: "Découvrez nos nouveautés aux couleurs vibrantes",
      buttonText: "Explorer la collection",
      link: "/products?collection=spring",
      badge: "Nouveau",
      color: "from-pink-500/20 to-orange-500/20",
    },
    {
      id: 2,
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      title: "Promotions Exclusives",
      description: "Jusqu'à -50% sur une sélection d'articles premium",
      buttonText: "Voir les offres",
      link: "/products?promo=true",
      badge: "Promo",
      color: "from-blue-500/20 to-purple-500/20",
    },
    {
      id: 3,
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
      title: "Nouveautés Arrivées",
      description: "Les dernières tendances directement chez vous",
      buttonText: "Découvrir",
      link: "/products?sort=newest",
      badge: "Trending",
      color: "from-green-500/20 to-teal-500/20",
    },
  ];

  // Stats pour la section hero
  const stats = [
    { value: "10K+", label: "Produits", icon: Package },
    { value: "500+", label: "Boutiques", icon: ShoppingBag },
    { value: "98%", label: "Satisfaction", icon: Heart },
    { value: "24h", label: "Livraison Express", icon: Rocket },
  ];

  // Transformation sécurisée des données
  const categories = categoriesData?.data?.content ? categoriesData.data.content.slice(0, 10) : [];
  const displayProducts = productsData?.data?.content ? productsData.data.content : [];
  const shops = shopsData?.data?.content ? shopsData.data.content.slice(0, 6) : [];

  // Auto-rotation du carousel hero
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50/30 dark:to-gray-900/10">
      <Header />

      {/* Hero Carousel */}
      <section className="relative overflow-hidden">
        <Carousel 
          opts={{ loop: true, align: "start" }} 
          className="w-full"
        >
          <CarouselContent>
            {heroImages.map((slide, index) => (
              <CarouselItem key={slide.id} className="pl-0">
                <div className={`relative bg-gradient-to-br ${slide.color} transition-all duration-500`}>
                  <div className="container relative py-16 md:py-24 lg:py-28">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm font-semibold text-gray-800">
                            {slide.badge}
                          </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
                          {slide.title}{" "}
                          <span className="block text-primary">simplifiés</span>
                        </h1>
                        
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                          {slide.description}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Link to={slide.link}>
                            <Button 
                              size="lg" 
                              className="gap-3 px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                              {slide.buttonText}
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                          </Link>
                          <Link to="/shops">
                            <Button 
                              variant="outline" 
                              size="lg" 
                              className="gap-3 px-8 py-6 border-2 border-primary text-primary hover:bg-primary/5 transition-all"
                            >
                              <Users className="h-5 w-5" />
                              Découvrir les boutiques
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white dark:border-gray-800">
                          <img 
                            src={slide.imageUrl} 
                            alt={slide.title} 
                            className="w-full h-auto object-cover aspect-video lg:aspect-square hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
        </Carousel>

        {/* Stats overlay */}
        <div className="container relative -mt-8 z-10">
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-white/20 shadow-xl rounded-2xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="text-center group hover:scale-105 transition-transform duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-gray-900/50">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 py-2 px-4 text-sm">
              <Zap className="h-3 w-3 mr-2" />
              Pourquoi nous choisir
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Une expérience shopping exceptionnelle
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour un shopping en ligne sécurisé et agréable
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Truck, 
                title: "Livraison Express", 
                description: "Recevez vos achats en 24-48h, partout en France",
                color: "bg-blue-100",
                textColor: "text-blue-600"
              },
              { 
                icon: Shield, 
                title: "Paiement Sécurisé", 
                description: "Transactions 100% sécurisées avec cryptage bancaire",
                color: "bg-green-100",
                textColor: "text-green-600"
              },
              { 
                icon: Award, 
                title: "Qualité Garantie", 
                description: "Tous nos produits sont vérifiés et certifiés",
                color: "bg-purple-100",
                textColor: "text-purple-600"
              }
            ].map((feature, index) => (
              <Card 
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.textColor}`} />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {feature.title === "Livraison Express" && (
                      <>
                        <li className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Suivi en temps réel
                        </li>
                        <li className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Livraison gratuite dès 50€
                        </li>
                      </>
                    )}
                    {feature.title === "Paiement Sécurisé" && (
                      <>
                        <li className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          3D Secure
                        </li>
                        <li className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Paiement en 4x sans frais
                        </li>
                      </>
                    )}
                    {feature.title === "Qualité Garantie" && (
                      <>
                        <li className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Authenticité garantie
                        </li>
                        <li className="flex items-center text-sm text-gray-500">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Retour sous 30 jours
                        </li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Catégories Interactives */}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-900/30 border-y">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
            <div>
              <Badge className="mb-4 py-2 px-4 bg-primary/10 text-primary border-0">
                <Tag className="h-3 w-3 mr-2" />
                Explorez nos catégories
              </Badge>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Nos Univers
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Cliquez sur une catégorie pour filtrer les produits ci-dessous
              </p>
            </div>
            {selectedCategoryId && (
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCategoryId(null)}
                className="text-primary hover:underline"
              >
                <Filter className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            )}
          </div>

          {isLoadingCategories ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-32 rounded-full shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button 
                variant={selectedCategoryId === null ? "default" : "outline"}
                onClick={() => setSelectedCategoryId(null)}
                className="rounded-full px-6 hover:scale-105 transition-transform"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Tout voir
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategoryId === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`rounded-full px-6 transition-all duration-300 ${
                    selectedCategoryId === category.id 
                      ? "shadow-md scale-105" 
                      : "hover:scale-105"
                  }`}
                >
                  <Tag className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>
          )}

          {/* Indicateur de catégorie active */}
          {selectedCategoryId && (
            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Affichage des produits de la catégorie :{" "}
                  <span className="text-primary font-semibold">
                    {categories.find(c => c.id === selectedCategoryId)?.name}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Produits */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {selectedCategoryId 
                    ? `Produits : ${categories.find(c => c.id === selectedCategoryId)?.name}` 
                    : "Produits en vedette"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedCategoryId 
                    ? "Découvrez notre sélection dans cette catégorie"
                    : "Les produits les plus populaires du moment"}
                </p>
              </div>
            </div>
          </div>

          {isLoadingProducts ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : productsError ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-20 text-center">
                <div className="max-w-md mx-auto">
                  <Package className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                  <h3 className="text-xl font-bold mb-3">Oups ! Une erreur est survenue</h3>
                  <p className="text-gray-600 mb-6">
                    Nous n'avons pas pu charger les produits. Veuillez réessayer.
                  </p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="default"
                    className="gap-3"
                  >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Réessayer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-in fade-in slide-in-from-bottom-2 duration-500 hover:shadow-lg hover:-translate-y-1 transition-all rounded-xl overflow-hidden"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed border-gray-200 dark:border-gray-800">
              <CardContent className="py-20 text-center">
                <div className="max-w-md mx-auto">
                  <Package className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Cette catégorie est actuellement vide. Découvrez nos autres collections.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      variant="default" 
                      onClick={() => setSelectedCategoryId(null)}
                      className="gap-3"
                    >
                      <Sparkles className="h-4 w-4" />
                      Voir tous les produits
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/categories">
                        Explorer les catégories
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {displayProducts.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="px-8 py-6 rounded-full"
              >
                <Link to="/products">
                  Voir tous les produits
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Boutiques populaires */}
      {shops.length > 0 && (
        <section className="py-16 bg-primary/5">
          <div className="container">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
              <div>
                <Badge className="mb-4 py-2 px-4 bg-primary/10 text-primary border-0">
                  <ShoppingBag className="h-3 w-3 mr-2" />
                  Nos partenaires
                </Badge>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Boutiques populaires
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Découvrez nos boutiques partenaires qui vous réservent les meilleures offres
                </p>
              </div>
              
              <Link to="/shops">
                <Button variant="ghost" className="gap-2 text-primary">
                  Voir toutes les boutiques
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {shops.map((shop) => (
                <Link 
                  key={shop.id} 
                  to={`/shops/${shop.id}`}
                  className="group block"
                >
                  <Card className="overflow-hidden border-0 bg-white dark:bg-gray-800 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="p-0">
                      <div className="aspect-square overflow-hidden">
                        <img 
                          src={shop.imageUrl || "/api/placeholder/200/200"} 
                          alt={shop.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold text-sm truncate text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {shop.name}
                        </h3>
                        <div className="flex items-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className="h-3 w-3 fill-yellow-400 text-yellow-400" 
                            />
                          ))}
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            (4.9)
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à découvrir l'expérience <span className="text-white">Minane</span> ?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Rejoignez des milliers de clients satisfaits et profitez de nos offres exclusives
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link to="/register">
                  <Sparkles className="mr-3 h-5 w-5" />
                  Créer un compte
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="px-10 py-6 text-lg rounded-full border-2  hover:text-primary"
                asChild
              >
                <Link to="/products">
                  <ShoppingBag className="mr-3 h-5 w-5" />
                  Explorer les produits
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-950 border-t py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary">Minane Business</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 max-w-sm mb-6">
                Votre destination shopping premium en ligne. Nous connectons les meilleures boutiques 
                avec une communauté passionnée de shopping.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-full border-gray-400 dark:border-gray-700">
                  <span className="sr-only">Facebook</span>
                  <div className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-gray-400 dark:border-gray-700">
                  <span className="sr-only">Instagram</span>
                  <div className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-gray-400 dark:border-gray-700">
                  <span className="sr-only">Twitter</span>
                  <div className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Navigation</h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
                <li><Link to="/" className="hover:text-primary transition-colors">Accueil</Link></li>
                <li><Link to="/products" className="hover:text-primary transition-colors">Produits</Link></li>
                <li><Link to="/categories" className="hover:text-primary transition-colors">Catégories</Link></li>
                <li><Link to="/shops" className="hover:text-primary transition-colors">Boutiques</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Support</h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link to="/shipping" className="hover:text-primary transition-colors">Livraison</Link></li>
                <li><Link to="/returns" className="hover:text-primary transition-colors">Retours</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Légal</h4>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
                <li><Link to="/privacy" className="hover:text-primary transition-colors">Confidentialité</Link></li>
                <li><Link to="/terms" className="hover:text-primary transition-colors">CGV</Link></li>
                <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link></li>
                <li><Link to="/legal" className="hover:text-primary transition-colors">Mentions légales</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Minane Business. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;