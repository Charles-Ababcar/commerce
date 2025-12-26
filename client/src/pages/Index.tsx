import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Star,
  Tag,
  ShoppingBag,
  Package,
  Shield,
  Truck,
  Clock,
  CheckCircle,
  Gift,
  Heart,
  Zap,
  Users,
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Produits
  const {
    data: productsData,
    isLoading: isLoadingProducts,
  } = useQuery<ApiResponse<PageResponse<Product>>>({
    queryKey: ["products-display", selectedCategoryId],
    queryFn: () =>
      selectedCategoryId
        ? apiClient.getProductsByCategory(selectedCategoryId, 0, 8)
        : apiClient.getProducts(0, 8),
    staleTime: 1000 * 60 * 5,
  });

  // Catégories
  const { data: categoriesData } = useQuery<ApiResponse<PageResponse<any>>>({
    queryKey: ["categories"],
    queryFn: () => apiClient.getCategories(),
  });

  // Boutiques
  const { data: shopsData } = useQuery({
    queryKey: ["popular-shops"],
    queryFn: () =>
      apiClient.getShops(0, 6) as Promise<ApiResponse<PageResponse<Shop>>>,
  });

  // Images hero avec design amélioré
  const heroSlides = [
    {
      id: 1,
      imageUrl: heroBanner,
      title: "Collection Premium",
      description: "Découvrez l'excellence dans chaque détail",
      link: "/products",
      badge: "Exclusif",
      color: "from-purple-600/20 to-pink-600/20",
      accentColor: "bg-purple-500",
    },
    {
      id: 2,
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      title: "Promotions Flash",
      description: "Économisez jusqu'à 60% sur les meilleures marques",
      link: "/products?promo=true",
      badge: "Économie",
      color: "from-blue-600/20 to-cyan-500/20",
      accentColor: "bg-blue-500",
    },
    {
      id: 3,
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
      title: "Nouveautés",
      description: "Soyez le premier à découvrir les dernières tendances",
      link: "/products?sort=newest",
      badge: "Tendance",
      color: "from-emerald-600/20 to-teal-500/20",
      accentColor: "bg-emerald-500",
    },
    {
      id: 4,
      imageUrl: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&h=600&fit=crop",
      title: "Livraison Express",
      description: "Recevez vos achats en 24h, partout en France",
      link: "/shipping",
      badge: "Rapidité",
      color: "from-orange-600/20 to-red-500/20",
      accentColor: "bg-orange-500",
    },
  ];

  // Données transformées
  const categories = categoriesData?.data?.content ? categoriesData.data.content.slice(0, 8) : [];
  const products = productsData?.data?.content || [];
  const shops = shopsData?.data?.content?.slice(0, 6) || [];

  // Auto-rotation du carousel hero - 1 seconde !
  useEffect(() => {
    if (isHovering) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 1000); // Changé de 4000ms à 1000ms
    
    return () => clearInterval(interval);
  }, [isHovering, heroSlides.length]);

  // Mise à jour du carousel manuel
  useEffect(() => {
    const carousel = document.querySelector('[data-carousel]');
    const items = carousel?.querySelectorAll('[data-carousel-item]');
    
    if (items && items.length > 0) {
      items.forEach((item, index) => {
        if (index === currentSlide) {
          (item as HTMLElement).style.opacity = '1';
          (item as HTMLElement).style.transform = 'translateX(0)';
        } else {
          (item as HTMLElement).style.opacity = '0';
          (item as HTMLElement).style.transform = 'translateX(100%)';
        }
      });
    }
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <Header />

      {/* Hero Carousel Auto-défilant - 1 seconde ! */}
      <section 
        className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-black"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="relative h-[600px]">
          <div className="absolute inset-0">
            {heroSlides.map((slide, index) => (
              <div
                key={slide.id}
                data-carousel-item
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  transform: `translateX(${(index - currentSlide) * 100}%)`,
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${slide.color}`}>
                  <div className="absolute inset-0 bg-black/40" />
                  <img 
                    src={slide.imageUrl} 
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                </div>
                
                <div className="container relative h-full flex items-center">
                  <div className="max-w-2xl text-white space-y-6">
                    <Badge className={`${slide.accentColor} text-white border-0 px-4 py-2 text-sm`}>
                      <Sparkles className="h-3 w-3 mr-2" />
                      {slide.badge}
                    </Badge>
                    
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                      {slide.title}
                    </h1>
                    
                    <p className="text-xl text-gray-200">
                      {slide.description}
                    </p>
                    
                    <Link to={slide.link}>
                      <Button 
                        size="lg" 
                        className={`${slide.accentColor} hover:opacity-90 text-white gap-3 px-8 py-6 text-lg font-semibold`}
                      >
                        Découvrir maintenant
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicateurs de slide */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'bg-white w-8' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Aller au slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Boutons de navigation */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all z-10"
            aria-label="Slide précédent"
          >
            <ArrowRight className="h-6 w-6 rotate-180" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-sm transition-all z-10"
            aria-label="Slide suivant"
          >
            <ArrowRight className="h-6 w-6" />
          </button>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explorez nos univers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Parcourez nos catégories soigneusement sélectionnées pour vous
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <Button 
              variant={selectedCategoryId === null ? "default" : "outline"}
              onClick={() => setSelectedCategoryId(null)}
              className="h-24 flex-col gap-2 rounded-xl"
            >
              <Sparkles className="h-6 w-6" />
              <span className="text-sm">Tous</span>
            </Button>
            
            {categories.slice(0, 7).map((category) => (
              <Button
                key={category.id}
                variant={selectedCategoryId === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategoryId(category.id)}
                className="h-24 flex-col gap-2 rounded-xl hover:scale-105 transition-transform"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Tag className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Produits */}
      <section className="py-16 bg-gray-50/50">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {selectedCategoryId 
                  ? categories.find(c => c.id === selectedCategoryId)?.name 
                  : "Produits populaires"}
              </h2>
              <p className="text-gray-600">
                {selectedCategoryId 
                  ? "Découvrez notre sélection dans cette catégorie"
                  : "Les meilleures ventes du moment"}
              </p>
            </div>
            <Link to="/products">
              <Button variant="ghost" className="gap-2">
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoadingProducts ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="hover:scale-[1.02] transition-transform duration-300">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Aucun produit trouvé dans cette catégorie</p>
            </div>
          )}
        </div>
      </section>

      {/* Boutiques */}
      {shops.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Nos partenaires
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Boutiques populaires</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Découvrez nos boutiques partenaires d'exception
              </p>
            </div>

            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {shops.map((shop) => (
                  <CarouselItem key={shop.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Link to={`/shops/${shop.id}`}>
                      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                        <CardContent className="p-0">
                          <div className="aspect-video overflow-hidden">
                            <img 
                              src={shop.imageUrl || "/api/placeholder/400/300"} 
                              alt={shop.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-bold text-lg">{shop.name}</h3>
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold">4.9</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                              Boutique premium • Livraison gratuite
                            </p>
                            <Button variant="outline" className="w-full">
                              Visiter la boutique
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </section>
      )}

      {/* Section "Pourquoi choisir Minane" - Design amélioré */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-6 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white border-0 text-base">
              <Zap className="h-4 w-4 mr-2" />
              L'expérience Minane
            </Badge>
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Pourquoi choisir Minane ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une expérience shopping réinventée pour votre plus grand plaisir
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: "Livraison Éclair",
                description: "Recevez vos achats en 24h maximum",
                color: "from-blue-500 to-cyan-500",
                features: ["Suivi en temps réel", "Livraison gratuite dès 50€", "Emballage premium"],
                delay: "0"
              },
              {
                icon: Shield,
                title: "Sécurité Totale",
                description: "Paiements 100% sécurisés",
                color: "from-emerald-500 to-teal-500",
                features: ["Cryptage bancaire", "3D Secure", "Garantie anti-fraude"],
                delay: "100"
              },
              {
                icon: Gift,
                title: "Avantages Exclusifs",
                description: "Offres réservées aux membres",
                color: "from-purple-500 to-pink-500",
                features: ["Réductions personnalisées", "Accès anticipé", "Cadeaux surprises"],
                delay: "200"
              },
              {
                icon: Users,
                title: "Communauté Premium",
                description: "Rejoignez notre cercle privilégié",
                color: "from-orange-500 to-red-500",
                features: ["Conseils personnalisés", "Événements VIP", "Support prioritaire"],
                delay: "300"
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative"
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                {/* Carte principale */}
                <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                  {/* Effet de fond gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Décoration supérieure */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}`} />
                  
                  <CardContent className="p-8 relative z-10">
                    {/* Icône animée */}
                    <div className={`mb-6 inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    
                    {/* Titre et description */}
                    <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-gray-800 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {feature.description}
                    </p>
                    
                    {/* Liste des avantages */}
                    <ul className="space-y-3">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm">
                          <div className={`p-1 rounded-full bg-gradient-to-br ${feature.color} bg-opacity-20`}>
                            <CheckCircle className="h-4 w-4" style={{ color: `var(--color-${feature.color.split('-')[1]})` }} />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Badge en bas */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                      <Badge variant="secondary" className={`bg-gradient-to-r ${feature.color} bg-opacity-10 text-gray-700 border-0`}>
                        <Heart className="h-3 w-3 mr-2" />
                        Inclus pour tous
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Effet de lueur au hover */}
                <div className={`absolute -inset-0.5 bg-gradient-to-br ${feature.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10`} />
              </div>
            ))}
          </div>

          {/* Statistiques impressionnantes */}
          <div className="mt-20 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "50K+", label: "Clients satisfaits", icon: Users },
                { value: "10K+", label: "Produits premium", icon: Package },
                { value: "500+", label: "Boutiques partenaires", icon: ShoppingBag },
                { value: "99%", label: "Taux de satisfaction", icon: Star },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-gray-100 to-white shadow-md group-hover:shadow-lg transition-shadow mb-4">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative py-24 overflow-hidden">
        {/* Arrière-plan décoratif */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-primary/5" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl" />
        
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6 px-6 py-3 bg-white text-primary border-0 shadow-lg">
              <Zap className="h-4 w-4 mr-2" />
              Rejoignez-nous aujourd'hui
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
              Prêt à vivre l'expérience <span className="text-primary">Minane</span> ?
            </h2>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Rejoignez notre communauté d'amateurs de shopping et profitez d'avantages exclusifs dès maintenant.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="px-10 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                asChild
              >
                <Link to="/register">
                  <Sparkles className="mr-3 h-5 w-5" />
                  Commencer gratuitement
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="px-10 py-6 text-lg rounded-full border-2 border-primary/20 hover:border-primary/40 bg-white/80 backdrop-blur-sm"
                asChild
              >
                <Link to="/products">
                  <ShoppingBag className="mr-3 h-5 w-5" />
                  Explorer les produits
                </Link>
              </Button>
            </div>
            
            <p className="mt-8 text-sm text-gray-500">
              Aucun engagement • 30 jours d'essai • Support 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary rounded-lg">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold">Minane</span>
              </div>
              <p className="text-gray-400 text-sm">
                Votre destination shopping premium. Excellence, sécurité et plaisir.
              </p>
            </div>
            
            {[
              { title: "Navigation", links: ["Accueil", "Produits", "Catégories", "Boutiques"] },
              { title: "Support", links: ["Aide", "Contact", "FAQ", "Livraison"] },
              { title: "Légal", links: ["Confidentialité", "CGV", "Cookies", "Mentions"] },
            ].map((section, idx) => (
              <div key={idx}>
                <h4 className="font-bold mb-4">{section.title}</h4>
                <ul className="space-y-3 text-gray-400 text-sm">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link to="/" className="hover:text-white transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Minane. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;