import { useState } from "react"; // 🆕 Import de useState
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
  Clock,
  CreditCard,
  Gift,
  Tag,
  ChevronLeft,
  ChevronRight,
  Filter, // 🆕 Nouvelle icône
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
import { Shop } from "@/types/api";

const Index = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["products-display", selectedCategoryId], 
    queryFn: () =>
      selectedCategoryId 
        ? apiClient.getProductsByCategory(selectedCategoryId, 0, 8) 
        : apiClient.getProducts(0, 12),
    staleTime: 1000 * 60 * 5,
  });

  // Récupération des catégories
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.getCategories(),
  });

  // Récupération des boutiques populaires
  const { data: shopsData, isLoading: isLoadingShops } = useQuery({
    queryKey: ["popular-shops"],
    queryFn: () =>
      apiClient.getShops(0, 8) as Promise<ApiResponse<PageResponse<Shop>>>,
  });

  // --- LOGIQUE DE DONNÉES (Maintenue) ---
  const heroImages = [
    { id: 1, imageUrl: heroBanner, title: "Collection Printemps-Été", description: "Découvrez nos nouveautés", buttonText: "Voir la collection", link: "/products?collection=spring" },
    { id: 2, imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop", title: "Promotions exclusives", description: "Jusqu'à -50% sur une sélection", buttonText: "Profiter des promos", link: "/products?promo=true" },
    { id: 3, imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop", title: "Nouveautés", description: "Les derniers produits ajoutés", buttonText: "Découvrir", link: "/products?sort=newest" },
  ];

  const categories = Array.isArray(categoriesData?.data?.content) ? categoriesData.data?.content.slice(0, 10) : [];
  const displayProducts = Array.isArray(productsData?.data?.content) ? productsData.data.content : [];
  const shops = Array.isArray(shopsData?.data?.content) ? shopsData.data.content.slice(0, 6) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50/30 dark:to-gray-900/10">
      <Header />

      {/* Hero Carousel (Maintenu) */}
      <section className="relative overflow-hidden">
        <Carousel opts={{ loop: true, align: "start" }} className="w-full">
          <CarouselContent>
            {heroImages.map((slide) => (
              <CarouselItem key={slide.id} className="pl-0">
                <div className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-primary/10 dark:via-gray-900 dark:to-secondary/10">
                  <div className="container relative py-16 md:py-24">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20"><Sparkles className="h-4 w-4" /><span className="text-sm font-medium">Nouveauté</span></div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">{slide.title} <span className="block text-primary">simplifiés</span></h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">{slide.description}</p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Link to={slide.link}><Button size="lg" className="gap-3 px-8 py-6 shadow-lg">{slide.buttonText}<ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
                          <Link to="/shops"><Button variant="outline" size="lg" className="gap-3 px-8 py-6 border-2">Découvrir les boutiques</Button></Link>
                        </div>
                      </div>
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white dark:border-gray-800">
                        <img src={slide.imageUrl} alt={slide.title} className="w-full h-auto object-cover aspect-video lg:aspect-square" />
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4" /><CarouselNext className="absolute right-4" />
        </Carousel>
      </section>

      {/* Features (Maintenu) */}
      <section className="py-16 bg-white dark:bg-gray-900/50">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {[{ icon: Truck, title: "Livraison Express", color: "bg-blue-100", text: "text-blue-600" }, { icon: Shield, title: "Paiement Sécurisé", color: "bg-green-100", text: "text-green-600" }, { icon: Award, title: "Qualité Garantie", color: "bg-purple-100", text: "text-purple-600" }].map((f, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border hover:shadow-xl transition-all">
                <div className={`inline-flex p-3 rounded-xl ${f.color} mb-4`}><f.icon className={`h-6 w-6 ${f.text}`} /></div>
                <h3 className="font-bold text-xl mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Service premium pour votre confort.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🆕 Catégories Interactives (Appel par ID) */}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-900/30 border-y">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Nos Univers</h2>
              <p className="text-gray-600">Cliquez sur une catégorie pour filtrer les produits ci-dessous</p>
            </div>
            {selectedCategoryId && (
              <Button variant="ghost" onClick={() => setSelectedCategoryId(null)} className="text-primary hover:underline">
                Réinitialiser les filtres
              </Button>
            )}
          </div>

          {isLoadingCategories ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-32 rounded-full shrink-0" />)}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {/* Bouton "Tous" */}
              <Button 
                variant={selectedCategoryId === null ? "default" : "outline"}
                onClick={() => setSelectedCategoryId(null)}
                className="rounded-full px-6"
              >
                Tout voir
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategoryId === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategoryId(category.id)}
                  className={`rounded-full px-6 transition-all ${selectedCategoryId === category.id ? "shadow-md scale-105" : ""}`}
                >
                  <Tag className="h-4 w-4 mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 🆕 Produits (Filtrés dynamiquement) */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary"><TrendingUp className="h-6 w-6" /></div>
              <h2 className="text-3xl font-bold">
                {selectedCategoryId 
                  ? `Produits : ${categories.find(c => c.id === selectedCategoryId)?.name}` 
                  : "Produits en vedette"}
              </h2>
            </div>
          </div>

          {isLoadingProducts ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[200px] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : productsError ? (
            <div className="text-center py-12"><Button onClick={() => window.location.reload()} variant="outline">Réessayer</Button></div>
          ) : displayProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <div key={product.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg text-gray-500">Aucun produit trouvé dans cette catégorie.</p>
              <Button variant="link" onClick={() => setSelectedCategoryId(null)}>Voir tous les produits</Button>
            </div>
          )}
        </div>
      </section>

      {/* Boutiques populaires (Maintenu) */}
      {shops.length > 0 && (
        <section className="py-16 bg-primary/5">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Boutiques populaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {shops.map((shop) => (
                <Link key={shop.id} to={`/shops/${shop.id}`} className="group block bg-white dark:bg-gray-800 p-4 rounded-2xl border hover:shadow-lg transition-all">
                  <div className="aspect-square rounded-xl overflow-hidden mb-3">
                    <img src={shop.imageUrl || "/api/placeholder/200/200"} alt={shop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="font-bold text-sm truncate">{shop.name}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer (Maintenu) */}
      <footer className="bg-gray-50 dark:bg-gray-950 border-t py-12">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold text-primary mb-4">Minane B</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-sm">Votre destination shopping premium en ligne. Qualité et sécurité garanties.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Livraison</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Légal</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <li><Link to="/privacy">Confidentialité</Link></li>
              <li><Link to="/terms">CGV</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;