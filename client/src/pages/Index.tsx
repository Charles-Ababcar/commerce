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
  Coffee,
  Gem,
  Music,
  PaintBucket,
  Scissors,
  Palette,
  Camera,
  BookOpen,
  ChevronRight,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  // Récupération des données
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

  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.getCategories(),
  });

  // Images du Sénégal pour le carousel hero
  const heroImages = [
    {
      id: 1,
      imageUrl: "https://images.unsplash.com/photo-1593693399744-1a0d1c6aaf35?w=1200&h=600&fit=crop&q=80",
      title: "Artisanat Sénégalais",
      description: "Découvrez l'authenticité de l'artisanat local, créé avec passion par nos artisans",
      buttonText: "Explorer l'artisanat",
      link: "/products?category=artisanat",
      badge: "Made in Senegal",
      color: "from-amber-500/20 to-orange-500/20",
      location: "Dakar, Sénégal"
    },
    {
      id: 2,
      imageUrl: "https://images.unsplash.com/photo-1565962688292-90c3255fef97?w=1200&h=600&fit=crop&q=80",
      title: "Mode Africaine",
      description: "Tissus wax et créations uniques qui célèbrent la culture africaine",
      buttonText: "Voir la collection",
      link: "/products?category=mode",
      badge: "Nouveauté",
      color: "from-purple-500/20 to-pink-500/20",
      location: "Saint-Louis, Sénégal"
    },
    {
      id: 3,
      imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=600&fit=crop&q=80",
      title: "Produits Locaux",
      description: "Des produits 100% naturels issus de notre terroir sénégalais",
      buttonText: "Découvrir",
      link: "/products?category=local",
      badge: "Produit Local",
      color: "from-green-500/20 to-teal-500/20",
      location: "Casamance, Sénégal"
    },
  ];

  // Catégories artisanales sénégalaises
  const artisanCategories = [
    { id: 1, name: "Tissus & Wax", icon: Palette, color: "bg-purple-100 text-purple-600" },
    { id: 2, name: "Bijoux", icon: Gem, color: "bg-amber-100 text-amber-600" },
    { id: 3, name: "Sculpture", icon: Scissors, color: "bg-emerald-100 text-emerald-600" },
    { id: 4, name: "Peinture", icon: PaintBucket, color: "bg-blue-100 text-blue-600" },
    { id: 5, name: "Musique", icon: Music, color: "bg-red-100 text-red-600" },
    { id: 6, name: "Cuisine", icon: Coffee, color: "bg-orange-100 text-orange-600" },
    { id: 7, name: "Photographie", icon: Camera, color: "bg-cyan-100 text-cyan-600" },
    { id: 8, name: "Littérature", icon: BookOpen, color: "bg-indigo-100 text-indigo-600" },
  ];

  // Témoignages
  const testimonials = [
    {
      id: 1,
      name: "Aminata Diop",
      role: "Artisane à Dakar",
      content: "Minane m'a permis de faire connaître mes créations au niveau national. Une vraie révolution pour mon entreprise!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c113a1c0?w=100&h=100&fit=crop&q=80"
    },
    {
      id: 2,
      name: "Moussa Sarr",
      role: "Client régulier",
      content: "Je trouve toujours des produits authentiques et de qualité. La livraison est rapide et le service impeccable.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80"
    },
    {
      id: 3,
      name: "Fatou Ndiaye",
      role: "Boutiquière à Thiès",
      content: "Grâce à Minane, j'ai doublé mes ventes en ligne. La plateforme est intuitive et sécurisée.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80"
    }
  ];

  // Régions du Sénégal
  const regions = [
    { name: "Dakar", products: "2,500+", color: "from-blue-500 to-cyan-500" },
    { name: "Thiès", products: "1,800+", color: "from-green-500 to-emerald-500" },
    { name: "Saint-Louis", products: "1,200+", color: "from-purple-500 to-pink-500" },
    { name: "Ziguinchor", products: "900+", color: "from-orange-500 to-red-500" },
  ];

  const categories = Array.isArray(categoriesData?.data?.content) ? categoriesData.data?.content.slice(0, 10) : [];
  const displayProducts = Array.isArray(productsData?.data?.content) ? productsData.data.content : [];

  // Auto-rotation du carousel hero
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/20 via-white to-gray-50/30">
      <Header />

      {/* Hero Section avec images du Sénégal */}
      <section className="relative overflow-hidden">
        <Carousel 
          opts={{ loop: true, align: "start" }} 
          className="w-full"
        >
          <CarouselContent>
            {heroImages.map((slide, index) => (
              <CarouselItem key={slide.id} className="pl-0">
                <div className={`relative bg-gradient-to-br ${slide.color} transition-all duration-500`}>
                  <div className="container relative py-16 md:py-24 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                      <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 shadow-lg">
                            <Sparkles className="h-4 w-4 text-amber-600" />
                            <span className="text-sm font-semibold text-gray-800">
                              {slide.badge}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/10 backdrop-blur-sm">
                            <MapPin className="h-3 w-3 text-white" />
                            <span className="text-xs text-white">{slide.location}</span>
                          </div>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                          {slide.title}
                          <span className="block bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mt-2">
                            Made in Senegal
                          </span>
                        </h1>
                        
                        <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                          {slide.description}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Link to={slide.link}>
                            <Button 
                              size="lg" 
                              className="gap-3 px-10 py-7 bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                            >
                              {slide.buttonText}
                              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                          <Link to="/categories">
                            <Button 
                              variant="outline" 
                              size="lg" 
                              className="gap-3 px-10 py-7 border-2 border-amber-600 text-amber-600 hover:bg-amber-50 transition-all"
                            >
                              <Globe className="h-5 w-5" />
                              Explorer toutes les catégories
                            </Button>
                          </Link>
                        </div>
                      </div>
                      
                      <div className="relative animate-in fade-in slide-in-from-right-8 duration-700">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white rotate-3 hover:rotate-0 transition-transform duration-500">
                          <img 
                            src={slide.imageUrl} 
                            alt={slide.title} 
                            className="w-full h-auto object-cover aspect-video lg:aspect-square hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:bg-white" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:bg-white" />
        </Carousel>

        {/* Stats overlay */}
        <div className="container relative -mt-10 z-10">
          <Card className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: "5K+", label: "Artisans", icon: Users, color: "text-amber-600" },
                  { value: "15K+", label: "Produits", icon: Package, color: "text-orange-600" },
                  { value: "98%", label: "Satisfaction", icon: Heart, color: "text-red-600" },
                  { value: "14", label: "Régions", icon: MapPin, color: "text-green-600" },
                ].map((stat, index) => (
                  <div 
                    key={index}
                    className="text-center group hover:scale-105 transition-transform duration-300"
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 ${stat.color} mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Présentation du Sénégal */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="mb-4 py-2 px-4 bg-amber-100 text-amber-700 border-0">
                <Globe className="h-3 w-3 mr-2" />
                À propos de nous
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900">
                Valoriser l'artisanat <span className="text-amber-600">sénégalais</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Minane Business est une plateforme dédiée à la promotion de l'artisanat et des produits locaux sénégalais. 
                Nous connectons les artisans talentueux avec des clients passionnés à travers le pays.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { label: "Artisans accompagnés", value: "5,000+" },
                  { label: "Communautés soutenues", value: "200+" },
                  { label: "Villes couvertes", value: "14" },
                  { label: "Formations dispensées", value: "150+" },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-white rounded-xl border">
                    <div className="text-2xl font-bold text-amber-600">{item.value}</div>
                    <div className="text-sm text-gray-600">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1586771107445-d3ca888129fc?w=600&h=600&fit=crop&q=80" 
                  alt="Artisanat Sénégalais" 
                  className="rounded-2xl shadow-lg"
                />
                <img 
                  src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w-600&h=800&fit=crop&q=80" 
                  alt="Produits Locaux" 
                  className="rounded-2xl shadow-lg mt-8"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Qualité Garantie</div>
                    <div className="text-sm text-gray-600">Tous nos produits sont certifiés</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories artisanales */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 py-2 px-4 text-sm">
              <Tag className="h-3 w-3 mr-2" />
              Nos spécialités
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explorez l'artisanat <span className="text-amber-600">sénégalais</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez la richesse de notre patrimoine culturel à travers ces catégories artisanales
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {artisanCategories.map((category) => (
              <Link 
                key={category.id}
                to={`/products?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <Card className="border-2 border-transparent hover:border-amber-200 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-4 rounded-2xl ${category.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Régions du Sénégal */}
      <section className="py-20 bg-gradient-to-b from-amber-50/50 to-white">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 py-2 px-4 bg-amber-100 text-amber-700 border-0">
              <MapPin className="h-3 w-3 mr-2" />
              Nos régions
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Découvrez nos artisans par <span className="text-amber-600">région</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explorez la diversité de l'artisanat à travers les différentes régions du Sénégal
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regions.map((region) => (
              <div key={region.name} className="group">
                <div className={`relative h-48 rounded-2xl bg-gradient-to-br ${region.color} overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white mb-2">{region.name}</div>
                      <div className="text-white/90">{region.products} produits</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Link 
                    to={`/products?region=${region.name.toLowerCase()}`}
                    className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Explorer les produits
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produits en vedette */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
            <div>
              <Badge className="mb-4 py-2 px-4 bg-amber-100 text-amber-700 border-0">
                <TrendingUp className="h-3 w-3 mr-2" />
                Tendances du moment
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                {selectedCategoryId 
                  ? `Produits sélectionnés` 
                  : "Produits en vedette"}
              </h2>
              <p className="text-gray-600">
                {selectedCategoryId 
                  ? "Découvrez notre sélection dans cette catégorie"
                  : "Les produits les plus appréciés par notre communauté"}
              </p>
            </div>
            
            <Tabs defaultValue="grid" className="w-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="grid">Grille</TabsTrigger>
                <TabsTrigger value="list">Liste</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoadingProducts ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden border-0 shadow-lg">
                  <CardContent className="p-0">
                    <Skeleton className="h-60 w-full" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full mt-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : productsError ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-20 text-center">
                <div className="max-w-md mx-auto">
                  <Package className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                  <h3 className="text-xl font-bold mb-3">Oups ! Une erreur est survenue</h3>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {displayProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-4 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-2xl overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed border-gray-200">
              <CardContent className="py-20 text-center">
                <div className="max-w-md mx-auto">
                  <Package className="h-16 w-16 mx-auto text-gray-400 mb-6" />
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">
                    Aucun produit trouvé
                  </h3>
                  <Button 
                    variant="default" 
                    onClick={() => setSelectedCategoryId(null)}
                    className="gap-3"
                  >
                    <Sparkles className="h-4 w-4" />
                    Voir tous les produits
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {displayProducts.length > 0 && (
            <div className="text-center mt-16">
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="px-12 py-6 text-base rounded-full border-amber-600 text-amber-600 hover:bg-amber-50"
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

      {/* Témoignages */}
      <section className="py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="mb-4 py-2 px-4 bg-amber-100 text-amber-700 border-0">
              <Users className="h-3 w-3 mr-2" />
              Ils nous font confiance
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos <span className="text-amber-600">clients</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-amber-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                  <div className="flex mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à soutenir l'artisanat <span className="text-amber-200">sénégalais</span> ?
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Rejoignez notre communauté et découvrez des produits uniques directement des artisans locaux
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link to="/register">
                  <ShoppingBag className="mr-3 h-5 w-5" />
                  Commencer à vendre
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="px-10 py-6 text-lg rounded-full border-2 border-white text-white hover:bg-white hover:text-amber-600"
                asChild
              >
                <Link to="/products">
                  <Sparkles className="mr-3 h-5 w-5" />
                  Découvrir les produits
                </Link>
              </Button>
            </div>
            
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Shield, text: "Paiement sécurisé" },
                { icon: Truck, text: "Livraison rapide" },
                { icon: Award, text: "Qualité garantie" },
                { icon: Users, text: "Support 24/7" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-center gap-2 text-white/90">
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-600 rounded-lg">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold">Minane Business</span>
              </div>
              <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
                Plateforme dédiée à la promotion de l'artisanat et des produits locaux sénégalais. 
                Nous connectons les artisans avec des clients passionnés.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-full border-gray-700 hover:border-amber-600 hover:bg-amber-600">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-gray-700 hover:border-amber-600 hover:bg-amber-600">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-gray-700 hover:border-amber-600 hover:bg-amber-600">
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Navigation</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link to="/" className="hover:text-amber-400 transition-colors">Accueil</Link></li>
                <li><Link to="/products" className="hover:text-amber-400 transition-colors">Produits</Link></li>
                <li><Link to="/categories" className="hover:text-amber-400 transition-colors">Catégories</Link></li>
                <li><Link to="/artisans" className="hover:text-amber-400 transition-colors">Artisans</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Support</h4>
              <ul className="space-y-4 text-gray-400">
                <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="hover:text-amber-400 transition-colors">FAQ</Link></li>
                <li><Link to="/shipping" className="hover:text-amber-400 transition-colors">Livraison</Link></li>
                <li><Link to="/returns" className="hover:text-amber-400 transition-colors">Retours</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+221 33 800 00 00</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>contact@minane.sn</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Dakar, Sénégal</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-12 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Minane Business - Tous droits réservés. Fièrement Sénégalais</p>
            <p className="mt-2">Made with ❤️ in Senegal</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;