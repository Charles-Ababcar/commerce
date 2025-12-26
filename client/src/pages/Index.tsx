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
  Filter,
  ShoppingBag,
  Package,
  Shield,
  Truck,
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
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Shop } from "@/types/api";

const Index = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

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

  // Images hero simplifiées
  const heroSlides = [
    {
      id: 1,
      imageUrl: heroBanner,
      title: "Nouvelle Collection",
      description: "Découvrez nos dernières tendances",
      link: "/products",
      color: "from-pink-500/20 to-orange-500/20",
    },
    {
      id: 2,
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      title: "Promotions",
      description: "Jusqu'à -50% sur une sélection",
      link: "/products?promo=true",
      color: "from-blue-500/20 to-purple-500/20",
    },
    {
      id: 3,
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
      title: "Nouveautés",
      description: "Les dernières arrivées",
      link: "/products?sort=newest",
      color: "from-green-500/20 to-teal-500/20",
    },
  ];

  // Données transformées
  const categories = categoriesData?.data?.content ? categoriesData.data.content.slice(0, 8) : [];
  const products = productsData?.data?.content || [];
  const shops = shopsData?.data?.content?.slice(0, 6) || [];

  // Auto-rotation du carousel hero
  useEffect(() => {
    if (!autoScrollEnabled) return;
    
    const interval = setInterval(() => {
      const carousel = document.querySelector('[data-carousel]');
      const nextBtn = carousel?.querySelector('[data-carousel-next]');
      if (nextBtn instanceof HTMLElement) {
        nextBtn.click();
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [autoScrollEnabled]);

  // Gestion du hover pour arrêter l'auto-scroll
  const handleCarouselHover = (isHovering: boolean) => {
    setAutoScrollEnabled(!isHovering);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Carousel Auto-défilant */}
      <section 
        className="relative overflow-hidden"
        onMouseEnter={() => handleCarouselHover(true)}
        onMouseLeave={() => handleCarouselHover(false)}
      >
        <Carousel 
          opts={{ 
            loop: true, 
            align: "start",
            duration: 20,
          }}
          className="w-full"
          data-carousel
        >
          <CarouselContent>
            {heroSlides.map((slide) => (
              <CarouselItem key={slide.id} className="pl-0">
                <div className={`relative min-h-[500px] bg-gradient-to-br ${slide.color}`}>
                  <div className="container relative py-12 md:py-20">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                      <div className="space-y-4">
                        <Badge className="mb-2 bg-white text-primary">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Nouveau
                        </Badge>
                        
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
                          {slide.title}
                        </h1>
                        
                        <p className="text-gray-600 text-lg">
                          {slide.description}
                        </p>
                        
                        <Link to={slide.link}>
                          <Button size="lg" className="mt-4 gap-2">
                            Découvrir
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                      
                      <div className="relative">
                        <img 
                          src={slide.imageUrl} 
                          alt={slide.title} 
                          className="w-full rounded-2xl shadow-xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>

      {/* Catégories Simplifiées */}
      <section className="py-12 border-y">
        <div className="container">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Catégories</h2>
            <p className="text-gray-600">Parcourez par catégorie</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedCategoryId === null ? "default" : "outline"}
              onClick={() => setSelectedCategoryId(null)}
              className="rounded-full"
              size="sm"
            >
              Tous
            </Button>
            {categories.slice(0, 6).map((category) => (
              <Button
                key={category.id}
                variant={selectedCategoryId === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategoryId(category.id)}
                className="rounded-full"
                size="sm"
              >
                <Tag className="h-3 w-3 mr-1" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Produits */}
      <section className="py-12">
        <div className="container">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">
                {selectedCategoryId 
                  ? categories.find(c => c.id === selectedCategoryId)?.name 
                  : "Produits populaires"}
              </h2>
            </div>
          </div>

          {isLoadingProducts ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-full rounded-xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Aucun produit trouvé</p>
            </div>
          )}

          {products.length > 0 && (
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link to="/products">
                  Voir plus de produits
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Boutiques */}
      {shops.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Boutiques populaires</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {shops.map((shop) => (
                <Link key={shop.id} to={`/shops/${shop.id}`} className="group">
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="aspect-square overflow-hidden rounded-lg mb-2">
                        <img 
                          src={shop.imageUrl || "/api/placeholder/200/200"} 
                          alt={shop.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <h3 className="font-medium text-sm truncate">{shop.name}</h3>
                      <div className="flex items-center mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Avantages */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-8">Pourquoi choisir Minane</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: "Livraison Rapide", desc: "24-48h" },
              { icon: Shield, title: "Paiement Sécurisé", desc: "100% safe" },
              { icon: Package, title: "Qualité Garantie", desc: "30 jours retour" },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-3">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4">Commencez à shopper</h2>
          <p className="mb-6">Rejoignez notre communauté</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" asChild>
              <Link to="/products">Voir les produits</Link>
            </Button>
            <Button variant="outline" className="text-white border-white" asChild>
              <Link to="/register">Créer un compte</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Simplifié */}
      <footer className="py-8 bg-gray-50 border-t">
        <div className="container">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">© {new Date().getFullYear()} Minane. Tous droits réservés.</p>
            <div className="flex justify-center gap-4">
              <Link to="/contact" className="hover:text-primary">Contact</Link>
              <Link to="/privacy" className="hover:text-primary">Confidentialité</Link>
              <Link to="/terms" className="hover:text-primary">CGV</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;