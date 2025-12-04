import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { 
  Star, MapPin, Package, Shield, Heart, Share2, 
  Phone, Mail, Globe, ChevronLeft, ShoppingBag, Filter,
  Truck, RotateCcw, CreditCard, Tag, ChevronDown, Search,
  Grid, List, ArrowUpDown, Check, X
} from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ShopDetailPage = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [page, setPage] = useState(0);
  const [activeTab, setActiveTab] = useState('all');
  const [isFavorite, setIsFavorite] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Récupérer les catégories - CORRECTION ICI
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(),
  });

  // S'assurer que categories est toujours un tableau
  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];

  // Récupérer la boutique
  const { data: shopApiResponse, isLoading: isShopLoading } = useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => apiClient.getShopById(Number(shopId)),
    enabled: !!shopId,
  });

  const shop = shopApiResponse?.data;

  // Récupérer les produits
  const { data: productsApiResponse, isLoading: isProductsLoading } = useQuery({
    queryKey: ['shopProducts', shopId, page, activeTab, debouncedSearch, selectedCategories, sortBy],
    queryFn: () => apiClient.getProductsByShopId(Number(shopId), { 
      page, 
      size: 12,
      search: debouncedSearch,
      categoryIds: selectedCategories.length > 0 ? selectedCategories : undefined,
      sortBy,
    }),
    enabled: !!shopId,
  });

  const products = Array.isArray(productsApiResponse?.content) ? productsApiResponse?.content : [];
  const totalPages = productsApiResponse?.totalPages || 0;
  const totalProducts = productsApiResponse?.totalElements || 0;

  // Catégories disponibles dans cette boutique
  const shopCategories = Array.from(
    new Set(products.flatMap(product => Array.isArray(product.categories) ? product.categories : []))
  ).map(catId => categories.find(c => c.id === catId)).filter(Boolean);

  // Produits en vedette
  const featuredProducts = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
    setPage(0);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSortBy('popular');
    setSearch('');
    setActiveTab('all');
  };

  const sortOptions = [
    { value: 'popular', label: 'Les plus populaires' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' },
    { value: 'newest', label: 'Nouveautés' },
    { value: 'rating', label: 'Meilleures notes' },
  ];

  const handlePaginationPrevious = () => {
    setPage(Math.max(0, page - 1));
  };

  const handlePaginationNext = () => {
    setPage(Math.min(totalPages - 1, page + 1));
  };

  if (isShopLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-gray-50/50 dark:to-gray-900/20">
        <Header />
        <div className="container py-8">
          <ShopDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-gray-50/50 dark:to-gray-900/20">
        <Header />
        <div className="container py-8">
          <div className="text-center py-16 max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Boutique introuvable</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Cette boutique n'existe pas ou a été supprimée.
            </p>
            <Button asChild className="gap-2">
              <Link to="/shops">
                <ChevronLeft className="h-4 w-4" />
                Retour aux boutiques
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50/50 dark:to-gray-900/20">
      <Header />
      
      {/* Hero Section de la boutique */}
      <div className="bg-gradient-to-r from-primary/5 via-white to-secondary/5 dark:from-primary/10 dark:via-gray-900 dark:to-secondary/10 border-b">
        <div className="container py-8">
          <Button 
            variant="ghost" 
            asChild
            className="gap-2 mb-6 hover:bg-primary/10"
          >
            <Link to="/shops">
              <ChevronLeft className="h-4 w-4" />
              Retour aux boutiques
            </Link>
          </Button>

          {/* En-tête */}
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-8">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                  <img 
                    src={shop.imageUrl || '/api/placeholder/96/96'} 
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge className="absolute -bottom-2 -right-2 gap-1.5 px-2 py-1 text-xs">
                  <Shield className="h-3 w-3" />
                  Vérifié
                </Badge>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                  {shop.name}
                </h1>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-primary" />
                    <span className="font-semibold">{shop.rating || '4.5'}</span>
                    <span className="text-sm">/5</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Package className="h-4 w-4" />
                    <span>{totalProducts} produits</span>
                  </div>
                  
                  {shop.location && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{shop.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button size="icon" variant="outline" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="gap-2">
                <Phone className="h-4 w-4" />
                Contacter
              </Button>
            </div>
          </div>

          {/* Description */}
          {shop.description && (
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mb-8 leading-relaxed">
              {shop.description}
            </p>
          )}
        </div>
      </div>

      {/* Produits en vedette */}
      {featuredProducts.length > 0 && (
        <div className="bg-white dark:bg-gray-900/50 border-y">
          <div className="container py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                Produits populaires
              </h2>
              <Button variant="ghost" className="gap-2" onClick={() => setActiveTab('all')}>
                Voir tous les produits
                <ChevronLeft className="h-4 w-4 rotate-180" />
              </Button>
            </div>

            <Carousel className="w-full">
              <CarouselContent>
                {featuredProducts.map((product) => (
                  <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>
        </div>
      )}

      <div className="container py-8">
        {/* Filtres et recherche */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Recherche */}
                <div className="flex-1 w-full lg:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher un produit..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-10 w-full lg:w-80"
                    />
                    {search && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
                        onClick={() => setSearch('')}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Filtres */}
                <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                  {/* View Toggle */}
                  <div className="flex border rounded-lg p-1">
                    <Button
                      size="sm"
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('grid')}
                      className="h-8 px-3"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('list')}
                      className="h-8 px-3"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Catégories */}
                  {categories.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2">
                          <Tag className="h-4 w-4" />
                          Catégories
                          {selectedCategories.length > 0 && (
                            <Badge className="ml-1">{selectedCategories.length}</Badge>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Filtrer par catégorie</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <ScrollArea className="h-60">
                          {categories.map((category) => (
                            <DropdownMenuCheckboxItem
                              key={category.id}
                              checked={selectedCategories.includes(category.id)}
                              onCheckedChange={() => toggleCategory(category.id)}
                            >
                              {category.name}
                              <Badge variant="secondary" className="ml-2">
                                {category.productCount || 0}
                              </Badge>
                            </DropdownMenuCheckboxItem>
                          ))}
                        </ScrollArea>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {/* Tri */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px] gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Reset */}
                  {(selectedCategories.length > 0 || sortBy !== 'popular' || search) && (
                    <Button variant="ghost" onClick={clearFilters} className="gap-2">
                      Réinitialiser
                    </Button>
                  )}
                </div>
              </div>

              {/* Catégories rapides */}
              {shopCategories.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategories.length === 0 && !search ? 'default' : 'outline'}
                      size="sm"
                      onClick={clearFilters}
                    >
                      Tous les produits
                    </Button>
                    {shopCategories.map((category: any) => (
                      <Button
                        key={category.id}
                        variant={selectedCategories.includes(category.id) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {category.name}
                        <Badge variant="secondary" className="ml-2">
                          {category.productCount || 0}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Résultats */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {search ? `Résultats pour "${search}"` : 'Tous les produits'}
            </h3>
            <span className="text-gray-600 dark:text-gray-400">
              {totalProducts} produit{totalProducts > 1 ? 's' : ''}
            </span>
          </div>
          {(selectedCategories.length > 0 || sortBy !== 'popular' || search) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCategories.map(catId => {
                const category = categories.find(c => c.id === catId);
                return category ? (
                  <Badge key={catId} variant="secondary" className="gap-1.5">
                    {category.name}
                    <button 
                      onClick={() => toggleCategory(catId)}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ) : null;
              })}
              {search && (
                <Badge variant="secondary" className="gap-1.5">
                  Recherche: "{search}"
                  <button 
                    onClick={() => setSearch('')}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Liste des produits */}
        {isProductsLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {Array.from({ length: 8 }).map((_, i) => (
              viewMode === 'grid' ? <ProductCardSkeleton key={i} /> : <ProductListSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {products.map((product) => (
              viewMode === 'grid' 
                ? <ProductCard key={product.id} product={product} />
                : <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Aucun produit trouvé</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {search 
                ? `Aucun produit ne correspond à "${search}"`
                : 'Cette boutique n\'a pas encore ajouté de produits.'
              }
            </p>
            {(search || selectedCategories.length > 0) && (
              <Button onClick={clearFilters}>
                Voir tous les produits
              </Button>
            )}
          </div>
        )}

        {/* Pagination - CORRECTION ICI */}
        {totalPages > 1 && products.length > 0 && (
          <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={handlePaginationPrevious}
                    className={page === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={page === i}
                      onClick={() => setPage(i)}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={handlePaginationNext}
                    className={page >= totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* Informations de la boutique */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>À propos de cette boutique</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Informations</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">Boutique vérifiée</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Depuis 2023</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <div className="font-medium">Livraison rapide</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">24-48h</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Politiques</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <RotateCcw className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Retours acceptés sous 30 jours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Paiements sécurisés</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">Garantie satisfaction</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Contact</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <Mail className="h-4 w-4" />
                      Envoyer un message
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-3">
                      <Phone className="h-4 w-4" />
                      Appeler la boutique
                    </Button>
                    {shop.website && (
                      <Button variant="outline" className="w-full justify-start gap-3">
                        <Globe className="h-4 w-4" />
                        Visiter le site
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Composants supplémentaires
const ShopDetailSkeleton = () => (
  <div className="space-y-8">
    <Skeleton className="h-48 w-full rounded-lg" />
    <div className="grid md:grid-cols-3 gap-6">
      <Skeleton className="h-64 rounded-lg" />
      <Skeleton className="h-64 rounded-lg" />
      <Skeleton className="h-64 rounded-lg" />
    </div>
  </div>
);

const ProductCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-square w-full" />
    <CardContent className="p-4">
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-6 w-1/2" />
    </CardContent>
  </Card>
);

const ProductListSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-6">
      <div className="flex gap-4">
        <Skeleton className="h-32 w-32 rounded-lg" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProductListItem = ({ product }: any) => {
  // S'assurer que product.categories est un tableau
  const productCategories = Array.isArray(product.categories) ? product.categories : [];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Image */}
          <div className="md:w-48">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <img 
                src={product.imageUrl || '/api/placeholder/192/192'} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          </div>
          
          {/* Details */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                {/* Catégories */}
                {productCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {productCategories.map((catId: string) => (
                      <Badge key={catId} variant="outline" className="text-xs">
                        Catégorie {catId}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-medium">{product.rating || '4.5'}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600 dark:text-gray-400">{product.stock || 0} en stock</span>
                </div>
              </div>
              
              {/* Price & CTA */}
              <div className="flex flex-col items-end gap-3">
                <div className="text-2xl font-bold text-primary">
                  {product.price ? `${product.price.toFixed(2)}€` : '--€'}
                </div>
                <Button className="gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Ajouter au panier
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShopDetailPage;