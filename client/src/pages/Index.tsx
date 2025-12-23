// // import { useState } from "react"; // 🆕 Import de useState
// // import { Button } from "@/components/ui/button";
// // import { ProductCard } from "@/components/ProductCard";
// // import { Header } from "@/components/Header";
// // import {
// //   ArrowRight,
// //   Package,
// //   Shield,
// //   Truck,
// //   Loader2,
// //   Sparkles,
// //   Award,
// //   CheckCircle,
// //   Zap,
// //   TrendingUp,
// //   Star,
// //   Clock,
// //   CreditCard,
// //   Gift,
// //   Tag,
// //   ChevronLeft,
// //   ChevronRight,
// //   Filter, // 🆕 Nouvelle icône
// // } from "lucide-react";
// // import { Link } from "react-router-dom";
// // import heroBanner from "@/assets/hero-banner.jpg";
// // import { useQuery } from "@tanstack/react-query";
// // import { apiClient } from "@/lib/api";
// // import { Skeleton } from "@/components/ui/skeleton";
// // import { Product } from "@/models/Product";
// // import { ApiResponse, PageResponse } from "@/models/ApiResponse";
// // import {
// //   Carousel,
// //   CarouselContent,
// //   CarouselItem,
// //   CarouselNext,
// //   CarouselPrevious,
// // } from "@/components/ui/carousel";
// // import { Badge } from "@/components/ui/badge";
// // import { Shop } from "@/types/api";

// // const Index = () => {
// //   const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

// //   const {
// //     data: productsData,
// //     isLoading: isLoadingProducts,
// //     error: productsError,
// //   } = useQuery({
// //     queryKey: ["products-display", selectedCategoryId], 
// //     queryFn: () =>
// //       selectedCategoryId 
// //         ? apiClient.getProductsByCategory(selectedCategoryId, 0, 8) 
// //         : apiClient.getProducts(0, 12),
// //     staleTime: 1000 * 60 * 5,
// //   });

// //   // Récupération des catégories
// //   const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
// //     queryKey: ["categories"],
// //     queryFn: () => apiClient.getCategories(),
// //   });

// //   // Récupération des boutiques populaires
// //   const { data: shopsData, isLoading: isLoadingShops } = useQuery({
// //     queryKey: ["popular-shops"],
// //     queryFn: () =>
// //       apiClient.getShops(0, 8) as Promise<ApiResponse<PageResponse<Shop>>>,
// //   });

// //   // --- LOGIQUE DE DONNÉES (Maintenue) ---
// //   const heroImages = [
// //     { id: 1, imageUrl: heroBanner, title: "Collection Printemps-Été", description: "Découvrez nos nouveautés", buttonText: "Voir la collection", link: "/products?collection=spring" },
// //     { id: 2, imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop", title: "Promotions exclusives", description: "Jusqu'à -50% sur une sélection", buttonText: "Profiter des promos", link: "/products?promo=true" },
// //     { id: 3, imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop", title: "Nouveautés", description: "Les derniers produits ajoutés", buttonText: "Découvrir", link: "/products?sort=newest" },
// //   ];

// //   const categories = Array.isArray(categoriesData?.data?.content) ? categoriesData.data?.content.slice(0, 10) : [];
// //   const displayProducts = Array.isArray(productsData?.data?.content) ? productsData.data.content : [];
// //   const shops = Array.isArray(shopsData?.data?.content) ? shopsData.data.content.slice(0, 6) : [];

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-background to-gray-50/30 dark:to-gray-900/10">
// //       <Header />

// //       {/* Hero Carousel (Maintenu) */}
// //       <section className="relative overflow-hidden">
// //         <Carousel opts={{ loop: true, align: "start" }} className="w-full">
// //           <CarouselContent>
// //             {heroImages.map((slide) => (
// //               <CarouselItem key={slide.id} className="pl-0">
// //                 <div className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 dark:from-primary/10 dark:via-gray-900 dark:to-secondary/10">
// //                   <div className="container relative py-16 md:py-24">
// //                     <div className="grid lg:grid-cols-2 gap-12 items-center">
// //                       <div className="space-y-6">
// //                         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20"><Sparkles className="h-4 w-4" /><span className="text-sm font-medium">Nouveauté</span></div>
// //                         <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">{slide.title} <span className="block text-primary">simplifiés</span></h1>
// //                         <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">{slide.description}</p>
// //                         <div className="flex flex-col sm:flex-row gap-4 pt-4">
// //                           <Link to={slide.link}><Button size="lg" className="gap-3 px-8 py-6 shadow-lg">{slide.buttonText}<ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
// //                           <Link to="/shops"><Button variant="outline" size="lg" className="gap-3 px-8 py-6 border-2">Découvrir les boutiques</Button></Link>
// //                         </div>
// //                       </div>
// //                       <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white dark:border-gray-800">
// //                         <img src={slide.imageUrl} alt={slide.title} className="w-full h-auto object-cover aspect-video lg:aspect-square" />
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </CarouselItem>
// //             ))}
// //           </CarouselContent>
// //           <CarouselPrevious className="absolute left-4" /><CarouselNext className="absolute right-4" />
// //         </Carousel>
// //       </section>

// //       {/* Features (Maintenu) */}
// //       <section className="py-16 bg-white dark:bg-gray-900/50">
// //         <div className="container">
// //           <div className="grid md:grid-cols-3 gap-8">
// //             {[{ icon: Truck, title: "Livraison Express", color: "bg-blue-100", text: "text-blue-600" }, { icon: Shield, title: "Paiement Sécurisé", color: "bg-green-100", text: "text-green-600" }, { icon: Award, title: "Qualité Garantie", color: "bg-purple-100", text: "text-purple-600" }].map((f, i) => (
// //               <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border hover:shadow-xl transition-all">
// //                 <div className={`inline-flex p-3 rounded-xl ${f.color} mb-4`}><f.icon className={`h-6 w-6 ${f.text}`} /></div>
// //                 <h3 className="font-bold text-xl mb-2">{f.title}</h3>
// //                 <p className="text-gray-600 dark:text-gray-400 text-sm">Service premium pour votre confort.</p>
// //               </div>
// //             ))}
// //           </div>
// //         </div>
// //       </section>

// //       {/* 🆕 Catégories Interactives (Appel par ID) */}
// //       <section className="py-16 bg-gray-50/50 dark:bg-gray-900/30 border-y">
// //         <div className="container">
// //           <div className="flex items-center justify-between mb-8">
// //             <div>
// //               <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Nos Univers</h2>
// //               <p className="text-gray-600">Cliquez sur une catégorie pour filtrer les produits ci-dessous</p>
// //             </div>
// //             {selectedCategoryId && (
// //               <Button variant="ghost" onClick={() => setSelectedCategoryId(null)} className="text-primary hover:underline">
// //                 Réinitialiser les filtres
// //               </Button>
// //             )}
// //           </div>

// //           {isLoadingCategories ? (
// //             <div className="flex gap-4 overflow-x-auto pb-4">
// //               {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-32 rounded-full shrink-0" />)}
// //             </div>
// //           ) : (
// //             <div className="flex flex-wrap gap-3">
// //               {/* Bouton "Tous" */}
// //               <Button 
// //                 variant={selectedCategoryId === null ? "default" : "outline"}
// //                 onClick={() => setSelectedCategoryId(null)}
// //                 className="rounded-full px-6"
// //               >
// //                 Tout voir
// //               </Button>
// //               {categories.map((category) => (
// //                 <Button
// //                   key={category.id}
// //                   variant={selectedCategoryId === category.id ? "default" : "outline"}
// //                   onClick={() => setSelectedCategoryId(category.id)}
// //                   className={`rounded-full px-6 transition-all ${selectedCategoryId === category.id ? "shadow-md scale-105" : ""}`}
// //                 >
// //                   <Tag className="h-4 w-4 mr-2" />
// //                   {category.name}
// //                 </Button>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       </section>

// //       {/* 🆕 Produits (Filtrés dynamiquement) */}
// //       <section className="py-16">
// //         <div className="container">
// //           <div className="flex items-center justify-between mb-8">
// //             <div className="flex items-center gap-3">
// //               <div className="p-2 bg-primary/10 rounded-lg text-primary"><TrendingUp className="h-6 w-6" /></div>
// //               <h2 className="text-3xl font-bold">
// //                 {selectedCategoryId 
// //                   ? `Produits : ${categories.find(c => c.id === selectedCategoryId)?.name}` 
// //                   : "Produits en vedette"}
// //               </h2>
// //             </div>
// //           </div>

// //           {isLoadingProducts ? (
// //             <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
// //               {Array.from({ length: 4 }).map((_, i) => (
// //                 <div key={i} className="space-y-4">
// //                   <Skeleton className="h-[200px] w-full rounded-xl" />
// //                   <Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" />
// //                 </div>
// //               ))}
// //             </div>
// //           ) : productsError ? (
// //             <div className="text-center py-12"><Button onClick={() => window.location.reload()} variant="outline">Réessayer</Button></div>
// //           ) : displayProducts.length > 0 ? (
// //             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
// //               {displayProducts.map((product) => (
// //                 <div key={product.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
// //                   <ProductCard product={product} />
// //                 </div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed">
// //               <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
// //               <p className="text-lg text-gray-500">Aucun produit trouvé dans cette catégorie.</p>
// //               <Button variant="link" onClick={() => setSelectedCategoryId(null)}>Voir tous les produits</Button>
// //             </div>
// //           )}
// //         </div>
// //       </section>

// //       {/* Boutiques populaires (Maintenu) */}
// //       {shops.length > 0 && (
// //         <section className="py-16 bg-primary/5">
// //           <div className="container">
// //             <h2 className="text-3xl font-bold mb-8">Boutiques populaires</h2>
// //             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
// //               {shops.map((shop) => (
// //                 <Link key={shop.id} to={`/shops/${shop.id}`} className="group block bg-white dark:bg-gray-800 p-4 rounded-2xl border hover:shadow-lg transition-all">
// //                   <div className="aspect-square rounded-xl overflow-hidden mb-3">
// //                     <img src={shop.imageUrl || "/api/placeholder/200/200"} alt={shop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
// //                   </div>
// //                   <h3 className="font-bold text-sm truncate">{shop.name}</h3>
// //                 </Link>
// //               ))}
// //             </div>
// //           </div>
// //         </section>
// //       )}

// //       {/* Footer (Maintenu) */}
// //       <footer className="bg-gray-50 dark:bg-gray-950 border-t py-12">
// //         <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
// //           <div className="col-span-2">
// //             <h3 className="text-2xl font-bold text-primary mb-4">Minane Business</h3>
// //             <p className="text-gray-600 dark:text-gray-400 max-w-sm">Votre destination shopping premium en ligne. Qualité et sécurité garanties.</p>
// //           </div>
// //           <div>
// //             <h4 className="font-bold mb-4">Support</h4>
// //             <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
// //               <li><Link to="/contact">Contact</Link></li>
// //               <li><Link to="/faq">FAQ</Link></li>
// //               <li><Link to="/shipping">Livraison</Link></li>
// //             </ul>
// //           </div>
// //           <div>
// //             <h4 className="font-bold mb-4">Légal</h4>
// //             <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
// //               <li><Link to="/privacy">Confidentialité</Link></li>
// //               <li><Link to="/terms">CGV</Link></li>
// //             </ul>
// //           </div>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // };

// // export default Index;

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { ProductCard } from "@/components/ProductCard";
// import { Header } from "@/components/Header";
// import {
//   ArrowRight,
//   Package,
//   Shield,
//   Truck,
//   Loader2,
//   Sparkles,
//   Award,
//   CheckCircle,
//   Zap,
//   TrendingUp,
//   Star,
//   Clock,
//   CreditCard,
//   Gift,
//   Tag,
//   ChevronLeft,
//   ChevronRight,
//   Filter,
//   ShoppingBag,
//   Heart,
//   Users,
//   Rocket,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import heroBanner from "@/assets/hero-banner.jpg";
// import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "@/lib/api";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Product } from "@/models/Product";
// import { ApiResponse, PageResponse } from "@/models/ApiResponse";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { Badge } from "@/components/ui/badge";
// import { Shop } from "@/types/api";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// const Index = () => {
//   const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
//   const [activeHeroSlide, setActiveHeroSlide] = useState(0);

//   const {
//     data: productsData,
//     isLoading: isLoadingProducts,
//     error: productsError,
//   } = useQuery({
//     queryKey: ["products-display", selectedCategoryId],
//     queryFn: () =>
//       selectedCategoryId
//         ? apiClient.getProductsByCategory(selectedCategoryId, 0, 8)
//         : apiClient.getProducts(0, 12),
//     staleTime: 1000 * 60 * 5,
//   });

//   const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
//     queryKey: ["categories"],
//     queryFn: () => apiClient.getCategories(),
//   });

//   const { data: shopsData, isLoading: isLoadingShops } = useQuery({
//     queryKey: ["popular-shops"],
//     queryFn: () =>
//       apiClient.getShops(0, 8) as Promise<ApiResponse<PageResponse<Shop>>>,
//   });

//   // Stats pour la section hero
//   const stats = [
//     { value: "10K+", label: "Produits", icon: Package },
//     { value: "500+", label: "Boutiques", icon: ShoppingBag },
//     { value: "98%", label: "Satisfaction", icon: Heart },
//     { value: "24h", label: "Livraison", icon: Rocket },
//   ];

//   const heroImages = [
//     {
//       id: 1,
//       imageUrl: heroBanner,
//       title: "Collection Printemps-Été",
//       description: "Découvrez nos nouveautés aux couleurs vibrantes",
//       buttonText: "Explorer la collection",
//       link: "/products?collection=spring",
//       badge: "Nouveau",
//       color: "from-pink-500/20 to-orange-500/20",
//     },
//     {
//       id: 2,
//       imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
//       title: "Promotions Exclusives",
//       description: "Jusqu'à -50% sur une sélection d'articles premium",
//       buttonText: "Voir les offres",
//       link: "/products?promo=true",
//       badge: "Promo",
//       color: "from-blue-500/20 to-purple-500/20",
//     },
//     {
//       id: 3,
//       imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=600&fit=crop",
//       title: "Nouveautés Arrivées",
//       description: "Les dernières tendances directement chez vous",
//       buttonText: "Découvrir",
//       link: "/products?sort=newest",
//       badge: "Trending",
//       color: "from-green-500/20 to-teal-500/20",
//     },
//   ];

//   const categories = Array.isArray(categoriesData?.data?.content) ? categoriesData.data?.content.slice(0, 10) : [];
//   const displayProducts = Array.isArray(productsData?.data?.content) ? productsData.data.content : [];
//   const shops = Array.isArray(shopsData?.data?.content) ? shopsData.data.content.slice(0, 6) : [];

//   // Auto-rotation du carousel hero
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveHeroSlide((prev) => (prev + 1) % heroImages.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-background via-white to-gray-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900/10">
//       <Header />

//       {/* Hero Section avec animation améliorée */}
//       <section className="relative overflow-hidden">
//         <Carousel 
//           opts={{ loop: true, align: "start" }} 
//           className="w-full"
//           onMouseEnter={() => setActiveHeroSlide(activeHeroSlide)}
//         >
//           <CarouselContent>
//             {heroImages.map((slide, index) => (
//               <CarouselItem key={slide.id} className="pl-0">
//                 <div className={`relative bg-gradient-to-br ${slide.color} transition-all duration-500`}>
//                   <div className="container relative py-16 md:py-24 lg:py-32">
//                     <div className="grid lg:grid-cols-2 gap-12 items-center">
//                       <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
//                         <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-white/20 shadow-lg">
//                           <Sparkles className="h-4 w-4 text-primary" />
//                           <span className="text-sm font-semibold text-gray-800 dark:text-white">
//                             {slide.badge}
//                           </span>
//                         </div>
                        
//                         <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
//                           {slide.title}
//                           <span className="block bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mt-2">
//                             simplifiés
//                           </span>
//                         </h1>
                        
//                         <p className="text-xl text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
//                           {slide.description}
//                         </p>
                        
//                         <div className="flex flex-col sm:flex-row gap-4 pt-4">
//                           <Link to={slide.link}>
//                             <Button 
//                               size="lg" 
//                               className="gap-3 px-10 py-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
//                             >
//                               {slide.buttonText}
//                               <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//                             </Button>
//                           </Link>
//                           <Link to="/shops">
//                             <Button 
//                               variant="outline" 
//                               size="lg" 
//                               className="gap-3 px-10 py-7 border-2 hover:border-primary hover:bg-primary/5 transition-all"
//                             >
//                               <Users className="h-5 w-5" />
//                               Découvrir les boutiques
//                             </Button>
//                           </Link>
//                         </div>
//                       </div>
                      
//                       <div className="relative animate-in fade-in slide-in-from-right-8 duration-700">
//                         <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-gray-800 rotate-3 hover:rotate-0 transition-transform duration-500">
//                           <img 
//                             src={slide.imageUrl} 
//                             alt={slide.title} 
//                             className="w-full h-auto object-cover aspect-video lg:aspect-square hover:scale-110 transition-transform duration-700"
//                           />
//                           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CarouselItem>
//             ))}
//           </CarouselContent>
//           <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:bg-white" />
//           <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:bg-white" />
//         </Carousel>

//         {/* Stats overlay */}
//         <div className="container relative -mt-10 z-10">
//           <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl">
//             <CardContent className="p-6">
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                 {stats.map((stat, index) => (
//                   <div 
//                     key={index}
//                     className="text-center group hover:scale-105 transition-transform duration-300"
//                   >
//                     <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
//                       <stat.icon className="h-6 w-6" />
//                     </div>
//                     <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
//                       {stat.value}
//                     </div>
//                     <div className="text-sm text-gray-600 dark:text-gray-400">
//                       {stat.label}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </section>

//       {/* Features avec animation */}
//       <section className="py-20 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50">
//         <div className="container">
//           <div className="text-center mb-12">
//             <Badge variant="secondary" className="mb-4 py-2 px-4 text-sm">
//               <Zap className="h-3 w-3 mr-2" />
//               Pourquoi nous choisir
//             </Badge>
//             <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
//               Une expérience shopping exceptionnelle
//             </h2>
//             <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
//               Tout ce dont vous avez besoin pour un shopping en ligne sécurisé et agréable
//             </p>
//           </div>
          
//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               { 
//                 icon: Truck, 
//                 title: "Livraison Express", 
//                 description: "Recevez vos achats en 24-48h, partout en France",
//                 color: "from-blue-500 to-cyan-500",
//                 features: ["Suivi en temps réel", "Livraison gratuite dès 50€", "Points relais"]
//               },
//               { 
//                 icon: Shield, 
//                 title: "Paiement Sécurisé", 
//                 description: "Transactions 100% sécurisées avec cryptage bancaire",
//                 color: "from-green-500 to-emerald-500",
//                 features: ["3D Secure", "Paiement en 4x", "Garantie remboursement"]
//               },
//               { 
//                 icon: Award, 
//                 title: "Qualité Garantie", 
//                 description: "Tous nos produits sont vérifiés et certifiés",
//                 color: "from-purple-500 to-pink-500",
//                 features: ["Authenticité garantie", "Retour sous 30 jours", "Support premium"]
//               }
//             ].map((feature, index) => (
//               <div 
//                 key={index}
//                 className="group relative bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                
//                 <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
//                   <feature.icon className="h-7 w-7" />
//                 </div>
                
//                 <h3 className="font-bold text-2xl mb-3 text-gray-900 dark:text-white">
//                   {feature.title}
//                 </h3>
                
//                 <p className="text-gray-600 dark:text-gray-400 mb-6">
//                   {feature.description}
//                 </p>
                
//                 <ul className="space-y-2">
//                   {feature.features.map((feat, idx) => (
//                     <li key={idx} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
//                       <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                       {feat}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Catégories interactives avec effet de vague */}
//       <section className="py-20 relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
//         <div className="container relative">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
//             <div>
//               <Badge className="mb-4 py-2 px-4 bg-primary/10 text-primary border-0">
//                 <Tag className="h-3 w-3 mr-2" />
//                 Explorez par catégorie
//               </Badge>
//               <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
//                 Parcourez nos univers
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Cliquez sur une catégorie pour découvrir ses produits
//               </p>
//             </div>
            
//             {selectedCategoryId && (
//               <Button 
//                 variant="ghost" 
//                 onClick={() => setSelectedCategoryId(null)}
//                 className="text-primary hover:text-primary/80 hover:bg-primary/10"
//               >
//                 <Filter className="h-4 w-4 mr-2" />
//                 Réinitialiser
//               </Button>
//             )}
//           </div>

//           {isLoadingCategories ? (
//             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
//               {Array.from({ length: 8 }).map((_, i) => (
//                 <Skeleton key={i} className="h-14 w-36 rounded-2xl shrink-0" />
//               ))}
//             </div>
//           ) : (
//             <>
//               <div className="flex flex-wrap gap-3 mb-8">
//                 <Button 
//                   variant={selectedCategoryId === null ? "default" : "outline"}
//                   onClick={() => setSelectedCategoryId(null)}
//                   className={`rounded-full px-8 py-6 text-base transition-all ${
//                     selectedCategoryId === null 
//                       ? "shadow-lg scale-105" 
//                       : "hover:scale-105"
//                   }`}
//                 >
//                   <Sparkles className="h-4 w-4 mr-3" />
//                   Tout voir
//                 </Button>
                
//                 {categories.map((category) => (
//                   <Button
//                     key={category.id}
//                     variant={selectedCategoryId === category.id ? "default" : "outline"}
//                     onClick={() => setSelectedCategoryId(category.id)}
//                     className={`rounded-full px-8 py-6 text-base transition-all duration-300 ${
//                       selectedCategoryId === category.id 
//                         ? "shadow-lg scale-105 ring-2 ring-primary/20" 
//                         : "hover:scale-105"
//                     }`}
//                   >
//                     <Tag className="h-4 w-4 mr-3" />
//                     {category.name}
//                   </Button>
//                 ))}
//               </div>
              
//               {/* Indicateur de catégorie active */}
//               {selectedCategoryId && (
//                 <div className="mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 animate-in fade-in">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-primary/10 rounded-lg">
//                       <TrendingUp className="h-5 w-5 text-primary" />
//                     </div>
//                     <span className="text-lg font-semibold text-gray-900 dark:text-white">
//                       Affichage des produits :{" "}
//                       <span className="text-primary">
//                         {categories.find(c => c.id === selectedCategoryId)?.name}
//                       </span>
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       </section>

//       {/* Produits avec tabs */}
//       <section className="py-20 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-900">
//         <div className="container">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
//             <div>
//               <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
//                 {selectedCategoryId 
//                   ? `Produits sélectionnés` 
//                   : "Nos meilleures ventes"}
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400">
//                 {selectedCategoryId 
//                   ? "Découvrez notre sélection dans cette catégorie"
//                   : "Les produits préférés de notre communauté"}
//               </p>
//             </div>
            
//             <Tabs defaultValue="grid" className="w-auto">
//               <TabsList className="grid w-full grid-cols-2">
//                 <TabsTrigger value="grid">Grille</TabsTrigger>
//                 <TabsTrigger value="list">Liste</TabsTrigger>
//               </TabsList>
//             </Tabs>
//           </div>

//           {isLoadingProducts ? (
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//               {Array.from({ length: 8 }).map((_, i) => (
//                 <Card key={i} className="overflow-hidden border-0 shadow-lg">
//                   <CardContent className="p-0">
//                     <Skeleton className="h-60 w-full" />
//                     <div className="p-6 space-y-3">
//                       <Skeleton className="h-4 w-3/4" />
//                       <Skeleton className="h-4 w-1/2" />
//                       <Skeleton className="h-10 w-full mt-4" />
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : productsError ? (
//             <Card className="border-0 shadow-lg">
//               <CardContent className="py-20 text-center">
//                 <div className="max-w-md mx-auto">
//                   <Package className="h-16 w-16 mx-auto text-gray-400 mb-6" />
//                   <h3 className="text-xl font-bold mb-3">Oups ! Une erreur est survenue</h3>
//                   <p className="text-gray-600 mb-6">
//                     Nous n'avons pas pu charger les produits. Veuillez réessayer.
//                   </p>
//                   <Button 
//                     onClick={() => window.location.reload()} 
//                     variant="default"
//                     className="gap-3"
//                   >
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Réessayer
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ) : displayProducts.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//               {displayProducts.map((product, index) => (
//                 <div 
//                   key={product.id}
//                   className="animate-in fade-in slide-in-from-bottom-4"
//                   style={{ animationDelay: `${index * 100}ms` }}
//                 >
//                   <ProductCard 
//                     product={product} 
//                   />
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <Card className="border-2 border-dashed border-gray-200 dark:border-gray-800">
//               <CardContent className="py-20 text-center">
//                 <div className="max-w-md mx-auto">
//                   <Package className="h-16 w-16 mx-auto text-gray-400 mb-6" />
//                   <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
//                     Aucun produit trouvé
//                   </h3>
//                   <p className="text-gray-600 dark:text-gray-400 mb-8">
//                     Cette catégorie est actuellement vide. Découvrez nos autres collections.
//                   </p>
//                   <div className="flex flex-col sm:flex-row gap-4 justify-center">
//                     <Button 
//                       variant="default" 
//                       onClick={() => setSelectedCategoryId(null)}
//                       className="gap-3"
//                     >
//                       <Sparkles className="h-4 w-4" />
//                       Voir tous les produits
//                     </Button>
//                     <Button variant="outline" asChild>
//                       <Link to="/categories">
//                         Explorer les catégories
//                       </Link>
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}

//           {displayProducts.length > 0 && (
//             <div className="text-center mt-16">
//               <Button 
//                 asChild 
//                 variant="outline" 
//                 size="lg"
//                 className="px-12 py-6 text-base rounded-full"
//               >
//                 <Link to="/products">
//                   Voir tous les produits
//                   <ArrowRight className="ml-3 h-5 w-5" />
//                 </Link>
//               </Button>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Boutiques populaires avec effet parallaxe */}
//       {shops.length > 0 && (
//         <section className="py-20 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          
//           <div className="container relative">
//             <div className="text-center mb-12">
//               <Badge variant="secondary" className="mb-4 py-2 px-4">
//                 <Store className="h-3 w-3 mr-2" />
//                 Nos partenaires
//               </Badge>
//               <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
//                 Boutiques populaires
//               </h2>
//               <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
//                 Découvrez nos boutiques partenaires qui vous réservent les meilleures offres
//               </p>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
//               {shops.map((shop, index) => (
//                 <Link 
//                   key={shop.id} 
//                   to={`/shops/${shop.id}`}
//                   className="group relative"
//                 >
//                   <Card className="overflow-hidden border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
//                     <CardContent className="p-0">
//                       <div className="relative aspect-square overflow-hidden">
//                         <img 
//                           src={shop.imageUrl || "/api/placeholder/400/400"} 
//                           alt={shop.name}
//                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
//                       </div>
//                       <div className="p-4 text-center">
//                         <h3 className="font-bold text-sm truncate text-gray-900 dark:text-white group-hover:text-primary transition-colors">
//                           {shop.name}
//                         </h3>
//                         <div className="flex items-center justify-center mt-2">
//                           {[1, 2, 3, 4, 5].map((star) => (
//                             <Star 
//                               key={star} 
//                               className="h-3 w-3 fill-yellow-400 text-yellow-400" 
//                             />
//                           ))}
//                           <span className="text-xs text-gray-500 ml-1">(4.9)</span>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </Link>
//               ))}
//             </div>

//             <div className="text-center mt-12">
//               <Button 
//                 asChild 
//                 variant="ghost" 
//                 className="gap-3 text-primary hover:text-primary/80"
//               >
//                 <Link to="/shops">
//                   Explorer toutes les boutiques
//                   <ArrowRight className="h-4 w-4" />
//                 </Link>
//               </Button>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* CTA Final */}
//       <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
//         <div className="container">
//           <Card className="border-0 shadow-2xl overflow-hidden">
//             <CardContent className="p-12 text-center relative overflow-hidden">
//               <div className="absolute inset-0 bg-white/5" />
              
//               <div className="relative z-10 max-w-3xl mx-auto">
//                 <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
//                   Prêt à découvrir l'expérience Minane ?
//                 </h2>
//                 <p className="text-xl text-white/90 mb-10">
//                   Rejoignez des milliers de clients satisfaits et profitez de nos offres exclusives.
//                 </p>
                
//                 <div className="flex flex-col sm:flex-row gap-6 justify-center">
//                   <Button 
//                     size="lg" 
//                     variant="secondary"
//                     className="px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all"
//                     asChild
//                   >
//                     <Link to="/register">
//                       <Sparkles className="mr-3 h-5 w-5" />
//                       Commencer maintenant
//                     </Link>
//                   </Button>
                  
//                   <Button 
//                     size="lg" 
//                     variant="outline"
//                     className="px-10 py-6 text-lg rounded-full border-2 border-white text-white hover:bg-white hover:text-primary"
//                     asChild
//                   >
//                     <Link to="/products">
//                       <ShoppingBag className="mr-3 h-5 w-5" />
//                       Voir nos produits
//                     </Link>
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </section>

//       {/* Footer amélioré */}
//       <footer className="bg-gray-50 dark:bg-gray-950 border-t">
//         <div className="container py-16">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
//             <div className="col-span-2">
//               <div className="flex items-center gap-3 mb-6">
//                 <div className="p-2 bg-primary rounded-lg">
//                   <ShoppingBag className="h-6 w-6 text-white" />
//                 </div>
//                 <span className="text-2xl font-bold text-primary">Minane Business</span>
//               </div>
//               <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8 leading-relaxed">
//                 Votre destination shopping premium en ligne. Nous rassemblons les meilleures boutiques 
//                 pour vous offrir une expérience unique de shopping en ligne.
//               </p>
//               <div className="flex gap-4">
//                 <Button variant="outline" size="icon" className="rounded-full">
//                   <span className="sr-only">Facebook</span>
//                   <div className="h-5 w-5" />
//                 </Button>
//                 <Button variant="outline" size="icon" className="rounded-full">
//                   <span className="sr-only">Instagram</span>
//                   <div className="h-5 w-5" />
//                 </Button>
//                 <Button variant="outline" size="icon" className="rounded-full">
//                   <span className="sr-only">Twitter</span>
//                   <div className="h-5 w-5" />
//                 </Button>
//               </div>
//             </div>
            
//             <div>
//               <h4 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">À propos</h4>
//               <ul className="space-y-4 text-gray-600 dark:text-gray-400">
//                 <li><Link to="/about" className="hover:text-primary transition-colors">Notre histoire</Link></li>
//                 <li><Link to="/careers" className="hover:text-primary transition-colors">Carrières</Link></li>
//                 <li><Link to="/press" className="hover:text-primary transition-colors">Presse</Link></li>
//                 <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Support</h4>
//               <ul className="space-y-4 text-gray-600 dark:text-gray-400">
//                 <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
//                 <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
//                 <li><Link to="/shipping" className="hover:text-primary transition-colors">Livraison</Link></li>
//                 <li><Link to="/returns" className="hover:text-primary transition-colors">Retours</Link></li>
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Légal</h4>
//               <ul className="space-y-4 text-gray-600 dark:text-gray-400">
//                 <li><Link to="/privacy" className="hover:text-primary transition-colors">Confidentialité</Link></li>
//                 <li><Link to="/terms" className="hover:text-primary transition-colors">CGV</Link></li>
//                 <li><Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link></li>
//                 <li><Link to="/legal" className="hover:text-primary transition-colors">Mentions légales</Link></li>
//               </ul>
//             </div>
//           </div>
          
//           <div className="border-t pt-8 mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
//             <p>© {new Date().getFullYear()} Minane Business. Tous droits réservés.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// // Ajouter l'icône Store pour la section boutiques
// const Store = ({ className }: { className?: string }) => (
//   <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//   </svg>
// );

// export default Index;

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

  // Récupération des boutiques populaires avec typage
  // const { data: shopsData, isLoading: isLoadingShops } = useQuery<
  //   ApiResponse<PageResponse<Shop>>
  // >({
  //   queryKey: ["popular-shops"],
  //   queryFn: () => apiClient.getShops(0, 8),
  // });



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
                className="px-10 py-6 text-lg rounded-full border-2 border-white text-white hover:bg-white hover:text-primary"
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
                <Button variant="outline" size="icon" className="rounded-full border-gray-300 dark:border-gray-700">
                  <span className="sr-only">Facebook</span>
                  <div className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-gray-300 dark:border-gray-700">
                  <span className="sr-only">Instagram</span>
                  <div className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full border-gray-300 dark:border-gray-700">
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