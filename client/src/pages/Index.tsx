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
  // Récupération des produits en vedette
  const {
    data: featuredProductsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["featured-products"],
    queryFn: () =>
      apiClient.getProducts(0, 12) as Promise<
        ApiResponse<PageResponse<Product>>
      >,
    staleTime: 1000 * 60 * 10,
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

  // Images de bannière statiques par défaut
  const heroImages = [
    {
      id: 1,
      imageUrl: heroBanner,
      title: "Collection Printemps-Été",
      description: "Découvrez nos nouveautés",
      buttonText: "Voir la collection",
      link: "/products?collection=spring",
    },

    {
      id: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
      title: "Promotions exclusives",
      description: "Jusqu'à -50% sur une sélection",
      buttonText: "Profiter des promos",
      link: "/products?promo=true",
    },
    {
      id: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
      title: "Nouveautés",
      description: "Les derniers produits ajoutés",
      buttonText: "Découvrir",
      link: "/products?sort=newest",
    },
  ];

  // Validation des données
  const categories = Array.isArray(categoriesData?.data?.content)
    ? categoriesData.data?.content.slice(0, 6)
    : [];
  const featuredProducts = Array.isArray(featuredProductsData?.data?.content)
    ? featuredProductsData.data.content.slice(0, 8)
    : [];
  const shops = Array.isArray(shopsData?.data?.content)
    ? shopsData.data.content.slice(0, 6)
    : [];

  // Catégories par défaut
  const defaultCategories = [
    {
      id: 1,
      name: "Électronique",
      productCount: 45,
      color: "bg-blue-100 text-blue-800",
    },
    {
      id: 2,
      name: "Mode",
      productCount: 32,
      color: "bg-pink-100 text-pink-800",
    },
    {
      id: 3,
      name: "Maison",
      productCount: 28,
      color: "bg-green-100 text-green-800",
    },
    {
      id: 4,
      name: "Beauté",
      productCount: 24,
      color: "bg-purple-100 text-purple-800",
    },
    {
      id: 5,
      name: "Sport",
      productCount: 19,
      color: "bg-orange-100 text-orange-800",
    },
    {
      id: 6,
      name: "Loisirs",
      productCount: 22,
      color: "bg-indigo-100 text-indigo-800",
    },
  ];

  const displayCategories =
    categories.length > 0 ? categories : defaultCategories;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50/30 dark:to-gray-900/10">
      <Header />

      {/* Hero Carousel - Dynamique si API, sinon statique */}
      <section className="relative overflow-hidden">
        <Carousel
          opts={{
            loop: true,
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {heroImages.map((slide) => (
              <CarouselItem key={slide.id} className="pl-0">
                <div className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-primary/10 dark:via-gray-900 dark:to-secondary/10">
                  <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:20px_20px]" />

                  <div className="container relative py-16 md:py-24 lg:py-28">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
                          <Sparkles className="h-4 w-4" />
                          <span className="text-sm font-medium">Nouveauté</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                          {slide.title}
                          <span className="block text-primary">simplifiés</span>
                        </h1>

                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                          {slide.description} Découvrez une sélection exclusive
                          de produits de qualité.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Link to={slide.link}>
                            <Button
                              size="lg"
                              className="gap-3 px-8 py-6 text-base shadow-lg"
                            >
                              {slide.buttonText}
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                          </Link>

                          <Link to="/shops">
                            <Button
                              variant="outline"
                              size="lg"
                              className="gap-3 px-8 py-6 border-2"
                            >
                              {" "}
                              Découvrir les boutiques
                            </Button>
                          </Link>
                        </div>
                      </div>

                      <div className="relative lg:pl-8">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white dark:border-gray-800">
                          <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="w-full h-auto object-cover aspect-video lg:aspect-square"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Custom navigation buttons */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                className="w-2 h-2 rounded-full bg-gray-300 hover:bg-primary transition-colors"
                aria-label={`Aller à la slide ${index + 1}`}
              />
            ))}
          </div>

          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 backdrop-blur-sm border-none shadow-lg hover:bg-white">
            <ChevronLeft className="h-5 w-5" />
          </CarouselPrevious>
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 backdrop-blur-sm border-none shadow-lg hover:bg-white">
            <ChevronRight className="h-5 w-5" />
          </CarouselNext>
        </Carousel>
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-gray-900/50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Une expérience shopping complète et sécurisée
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: "Livraison Express",
                description:
                  "Livraison gratuite pour les commandes de plus de 50 000 FCFA",
                color: "bg-blue-100 dark:bg-blue-900/30",
                iconColor: "text-blue-600 dark:text-blue-400",
              },
              {
                icon: Shield,
                title: "Paiement Sécurisé",
                description: "Transactions protégées par cryptage SSL avancé",
                color: "bg-green-100 dark:bg-green-900/30",
                iconColor: "text-green-600 dark:text-green-400",
              },
              {
                icon: Award,
                title: "Qualité Garantie",
                description:
                  "Produits vérifiés par nos équipes de contrôle qualité",
                color: "bg-purple-100 dark:bg-purple-900/30",
                iconColor: "text-purple-600 dark:text-purple-400",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`inline-flex p-3 rounded-xl ${feature.color} mb-4`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="font-bold text-xl mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catégories Carousel */}
      <section className="py-16 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Catégories populaires
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Parcourez nos univers préférés
              </p>
            </div>
            {categories.length > 0 && (
              <Link to="/categories">
                <Button variant="ghost" className="gap-2">
                  Voir toutes
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {isLoadingCategories ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square bg-white dark:bg-gray-800 rounded-xl border p-4 flex flex-col items-center justify-center"
                >
                  <Skeleton className="w-12 h-12 rounded-lg mb-3" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <Carousel
              opts={{
                slidesToScroll: "auto",
                containScroll: "trimSnaps",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {displayCategories.map((category) => (
                  <CarouselItem
                    key={category.id}
                    className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/6"
                  >
                    <Link
                      to={`/products?category=${category.id}`}
                      className="group block"
                    >
                      <div className="aspect-square bg-white dark:bg-gray-800 rounded-xl border p-4 flex flex-col items-center justify-center hover:border-primary hover:shadow-lg transition-all duration-300">
                        <div
                          className={`w-12 h-12 rounded-lg ${
                            category.color?.split(" ")[0] || "bg-primary/10"
                          } flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                        >
                          <Tag className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-center text-gray-900 dark:text-white">
                          {category.name}
                        </span>
                        {category.productCount && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {category.productCount} produits
                          </span>
                        )}
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 h-8 w-8" />
              <CarouselNext className="-right-4 h-8 w-8" />
            </Carousel>
          )}
        </div>
      </section>

      {/* Produits vedettes Carousel */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Produits en vedette
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Nos meilleures ventes et nouveautés
              </p>
            </div>
            {featuredProducts.length > 0 && (
              <Link to="/products">
                <Button variant="outline" className="gap-2 group">
                  Tout voir
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}
          </div>

          {isLoadingProducts ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-4">
                  <Skeleton className="h-[200px] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              ))}
            </div>
          ) : productsError ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Erreur de chargement
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                Impossible de charger les produits vedettes
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="gap-2"
              >
                <Loader2 className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            </div>
          ) : featuredProducts.length > 0 ? (
            <Carousel
              opts={{
                slidesToScroll: "auto",
                containScroll: "trimSnaps",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {featuredProducts.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Aucun produit disponible
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Revenez bientôt pour découvrir nos nouveaux produits
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Boutiques populaires Carousel (dynamique si API disponible) */}
      {shops.length > 0 && (
        <section className="py-16 bg-primary/5 dark:bg-primary/10">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Boutiques populaires
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Découvrez nos boutiques partenaires
                </p>
              </div>
              <Link to="/shops">
                <Button variant="ghost" className="gap-2">
                  Voir toutes
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <Carousel
              opts={{
                slidesToScroll: "auto",
                containScroll: "trimSnaps",
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {shops.map((shop) => (
                  <CarouselItem
                    key={shop.id}
                    className="pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <Link to={`/shops/${shop.id}`} className="group block">
                      <div className="bg-white dark:bg-gray-800 rounded-xl border p-4 hover:border-primary hover:shadow-lg transition-all duration-300">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 mb-3">
                          <img
                            src={shop.imageUrl || "/api/placeholder/200/200"}
                            alt={shop.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">
                          {shop.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span>{shop.rating || "4.5"}/5</span>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>
        </section>
      )}

      {/* Promotions Carousel (statique par défaut) */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Promotions du moment
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Les meilleures offres à ne pas manquer
              </p>
            </div>
          </div>

          <Carousel
            opts={{
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {[
                {
                  id: 1,
                  title: "Black Friday",
                  discount: "-50%",
                  description: "Sur toute la collection d'hiver",
                  image:
                    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=400&fit=crop",
                  color: "bg-red-500",
                },
                {
                  id: 2,
                  title: "Cyber Monday",
                  discount: "-40%",
                  description: "Électronique et high-tech",
                  image:
                    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
                  color: "bg-blue-500",
                },
                {
                  id: 3,
                  title: "Soldes d'été",
                  discount: "-30%",
                  description: "Mode et accessoires",
                  image:
                    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop",
                  color: "bg-green-500",
                },
              ].map((promo) => (
                <CarouselItem key={promo.id}>
                  <div className="relative rounded-2xl overflow-hidden">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-center">
                      <div className="max-w-xl">
                        <Badge
                          className={`${promo.color} text-white border-none mb-4`}
                        >
                          {promo.discount} OFF
                        </Badge>
                        <h3 className="text-3xl font-bold text-white mb-2">
                          {promo.title}
                        </h3>
                        <p className="text-gray-200 mb-6">
                          {promo.description}
                        </p>
                        <Button className="bg-white text-gray-900 hover:bg-gray-100">
                          Profiter de l'offre
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 h-10 w-10 bg-white/80 backdrop-blur-sm border-none shadow-lg hover:bg-white" />
            <CarouselNext className="right-4 h-10 w-10 bg-white/80 backdrop-blur-sm border-none shadow-lg hover:bg-white" />
          </Carousel>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary/5 dark:bg-primary/10">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">
                {featuredProductsData?.data?.totalElements || 0}+
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Produits disponibles
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <p className="text-gray-600 dark:text-gray-300">
                Satisfaction client
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">24h</div>
              <p className="text-gray-600 dark:text-gray-300">
                Livraison express
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <p className="text-gray-600 dark:text-gray-300">Sécurisé</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 text-center border">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Prêt à faire vos premiers achats ?
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Inscrivez-vous dès maintenant et bénéficiez de 10% de réduction
                sur votre première commande.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth">
                  <Button size="lg" className="gap-3 px-8">
                    Créer un compte
                    <Gift className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="outline" size="lg">
                    Explorer sans compte
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="container px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Logo et description */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-secondary shadow-lg transform hover:scale-105 transition-transform duration-300" />
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Minane B
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                    Shopping premium
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md leading-relaxed">
                Votre destination shopping premium en ligne. Découvrez des
                produits exclusifs et des collections limitées pour un style
                unique.
              </p>

              {/* Newsletter */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Inscrivez-vous à notre newsletter
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="flex-grow px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                  <button className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/25 transform hover:-translate-y-0.5 transition-all duration-300">
                    S'inscrire
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-800 text-lg">
                Navigation
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary group transition-colors duration-300"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 mr-3 transition-opacity duration-300"></span>
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary group transition-colors duration-300"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 mr-3 transition-opacity duration-300"></span>
                    Produits
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shops"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary group transition-colors duration-300"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 mr-3 transition-opacity duration-300"></span>
                    Boutiques
                  </Link>
                </li>
                <li>
                  <Link
                    to="/collections"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary group transition-colors duration-300"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 mr-3 transition-opacity duration-300"></span>
                    Collections
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-800 text-lg">
                Support
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/contact"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary group transition-colors duration-300"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 mr-3 transition-opacity duration-300"></span>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary group transition-colors duration-300"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 mr-3 transition-opacity duration-300"></span>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary group transition-colors duration-300"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 mr-3 transition-opacity duration-300"></span>
                    Livraison
                  </Link>
                </li>
                <li>
                  <Link
                    to="/returns"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary group transition-colors duration-300"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 mr-3 transition-opacity duration-300"></span>
                    Retours
                  </Link>
                </li>
              </ul>
            </div>

            {/* Légal & Réseaux sociaux */}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-6 pb-2 border-b border-gray-200 dark:border-gray-800 text-lg">
                Légal
              </h3>
              <ul className="space-y-4 mb-8">
                <li>
                  <Link
                    to="/privacy"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary group transition-colors duration-300"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 mr-3 transition-opacity duration-300"></span>
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary group transition-colors duration-300"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 mr-3 transition-opacity duration-300"></span>
                    CGV
                  </Link>
                </li>
                <li>
                  <Link
                    to="/cookies"
                    className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary group transition-colors duration-300"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 mr-3 transition-opacity duration-300"></span>
                    Cookies
                  </Link>
                </li>
              </ul>

              {/* Réseaux sociaux */}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">
                  Suivez-nous
                </p>
                <div className="flex gap-4">
                  {["instagram", "facebook", "twitter", "pinterest"].map(
                    (social) => (
                      <a
                        key={social}
                        href="#"
                        className="h-10 w-10 flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transform hover:-translate-y-1 transition-all duration-300"
                        aria-label={`Suivez-nous sur ${social}`}
                      >
                        <div className="h-5 w-5 bg-gradient-to-r from-primary to-secondary opacity-70 hover:opacity-100" />
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Séparateur */}
          <div className="my-8 border-t border-gray-200 dark:border-gray-800"></div>

          {/* Copyright et mentions légales */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Minane B. Tous droits réservés.
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/sitemap"
                className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-300"
              >
                Plan du site
              </Link>
              <Link
                to="/legal"
                className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-300"
              >
                Mentions légales
              </Link>
              <div className="flex items-center gap-2 text-gray-500">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>En ligne</span>
              </div>
            </div>
          </div>

          {/* Badge de sécurité */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <span className="text-xs font-medium">Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">↻</span>
              </div>
              <span className="text-xs font-medium">Retours sous 30 jours</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">✉</span>
              </div>
              <span className="text-xs font-medium">Support 7j/7</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
