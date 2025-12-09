import { Header } from '@/components/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Search, Filter, MapPin, Clock, ChevronRight, Shield, Store, X, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Shop } from '@/types/api';
import { ApiResponse, PageResponse } from '@/models/ApiResponse';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CommandEmpty } from '@/components/ui/command';

const ShopsPage = () => { 
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Récupération des catégories pour les filtres
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.getCategories(),
  });

  const categories = Array.isArray(categoriesData?.data) ? categoriesData.data : [];

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Récupération des boutiques avec filtres
  const { data: shopsData, isLoading, error } = useQuery({
    queryKey: ['shops', page, debouncedSearch, sortBy, verifiedOnly],
    queryFn: () => apiClient.getShops(page, 12) as Promise<ApiResponse<PageResponse<Shop>>>,
  });

  const shops = shopsData?.data?.content || [];
  const totalPages = shopsData?.data?.totalPages || 0;
  const totalElements = shopsData?.data?.totalElements || 0;

  const sortOptions = [
    { value: 'name', label: 'Nom (A-Z)', icon: '🔤' },
    { value: 'rating_desc', label: 'Meilleures notes', icon: '⭐' },
    { value: 'rating_asc', label: 'Moins bonnes notes', icon: '📉' },
    { value: 'newest', label: 'Plus récentes', icon: '🆕' },
    { value: 'popular', label: 'Plus populaires', icon: '🔥' },
  ];

  // Statistiques simulées (à remplacer par des données réelles si disponibles)
  const shopStats = {
    totalVerified: 42,
    avgRating: 4.8,
    fastestDelivery: '24h',
    customerSatisfaction: '98%',
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearch('');
    setSortBy('name');
    setVerifiedOnly(false);
    setPage(0);
  };

  const hasActiveFilters = search || sortBy !== 'name' || verifiedOnly;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
        <Header />
        <div className="container py-8">
          <div className="text-center py-12 max-w-md mx-auto">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Store className="h-10 w-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-3">
              Oups ! Une erreur est survenue
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Nous n'avons pas pu charger les boutiques. 
              Veuillez vérifier votre connexion et réessayer.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => window.location.reload()} 
                className="gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Réessayer
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Retour à l'accueil</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/5">
      <Header />
      
      {/* Hero Section améliorée */}
      <div className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/10 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        
        <div className="container relative py-12 md:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary backdrop-blur-sm border border-primary/20">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Explorez nos partenaires</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Découvrez des{' '}
              <span className="relative">
                <span className="relative z-10 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  boutiques d'exception
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full" />
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Des commerces vérifiés et sélectionnés avec soin pour une expérience 
              d'achat unique et sécurisée.
            </p>

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 max-w-2xl mx-auto">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 text-center border">
                <div className="text-2xl font-bold text-primary">{totalElements}</div>
                <div className="text-sm text-muted-foreground">Boutiques</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 text-center border">
                <div className="text-2xl font-bold text-green-600">{shopStats.avgRating}/5</div>
                <div className="text-sm text-muted-foreground">Note moyenne</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 text-center border">
                <div className="text-2xl font-bold text-blue-600">{shopStats.totalVerified}</div>
                <div className="text-sm text-muted-foreground">Vérifiées</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 text-center border">
                <div className="text-2xl font-bold text-purple-600">{shopStats.customerSatisfaction}</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Filtres améliorés */}
        <div className="mb-8 space-y-4">
          {/* Barre de recherche et actions */}
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl border p-4 md:p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="flex-1 w-full">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Rechercher une boutique, une spécialité..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-12 pr-10 py-6 rounded-xl border-2 focus:border-primary hover:border-primary/50 transition-all shadow-sm"
                  />
                  {search && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-primary/10"
                      onClick={() => setSearch('')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Filtres mobile */}
              <div className="flex lg:hidden w-full gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="flex-1 py-6 rounded-xl gap-2">
                      <Filter className="h-4 w-4" />
                      Filtres
                      {hasActiveFilters && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 p-0">
                          !
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
                    <SheetHeader>
                      <SheetTitle className="text-left">Filtres et tri</SheetTitle>
                    </SheetHeader>
                    <div className="py-6 space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">Trier par</h3>
                        <div className="space-y-2">
                          {sortOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setSortBy(option.value);
                                setPage(0);
                              }}
                              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all ${
                                sortBy === option.value
                                  ? 'bg-primary/10 text-primary border border-primary/20' 
                                  : 'hover:bg-secondary/50'
                              }`}
                            >
                              <span className="text-lg">{option.icon}</span>
                              <span className="flex-1 text-left">{option.label}</span>
                              {sortBy === option.value && (
                                <CheckCircle className="h-4 w-4 text-primary" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="verified-filter" className="font-semibold">
                              Boutiques vérifiées uniquement
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Afficher seulement les boutiques certifiées
                            </p>
                          </div>
                          <Switch
                            id="verified-filter"
                            checked={verifiedOnly}
                            onCheckedChange={setVerifiedOnly}
                          />
                        </div>
                      </div>

                      {hasActiveFilters && (
                        <SheetClose asChild>
                          <Button 
                            variant="outline" 
                            className="w-full gap-2 mt-4"
                            onClick={clearAllFilters}
                          >
                            <X className="h-4 w-4" />
                            Réinitialiser les filtres
                          </Button>
                        </SheetClose>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32 py-6 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtres desktop */}
              <div className="hidden lg:flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 py-6 rounded-xl border-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      <SelectValue placeholder="Trier par" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <span>{option.icon}</span>
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-card">
                  <Switch
                    id="verified-filter-desktop"
                    checked={verifiedOnly}
                    onCheckedChange={setVerifiedOnly}
                  />
                  <Label htmlFor="verified-filter-desktop" className="cursor-pointer">
                    Vérifiées
                  </Label>
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Effacer
                  </Button>
                )}
              </div>
            </div>

            {/* Affichage des filtres actifs */}
            {hasActiveFilters && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Filtres actifs :
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-7 text-xs"
                  >
                    Tout effacer
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {search && (
                    <Badge variant="secondary" className="gap-1.5">
                      Recherche : {search}
                      <button onClick={() => setSearch('')}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {sortBy !== 'name' && (
                    <Badge variant="secondary" className="gap-1.5">
                      {sortOptions.find(o => o.value === sortBy)?.label}
                      <button onClick={() => setSortBy('name')}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {verifiedOnly && (
                    <Badge variant="secondary" className="gap-1.5">
                      Vérifiées uniquement
                      <button onClick={() => setVerifiedOnly(false)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                <>
                  <span className="font-semibold text-foreground">{totalElements}</span> 
                  {totalElements === 1 ? ' boutique trouvée' : ' boutiques trouvées'}
                  {search && ` pour "${search}"`}
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:block">Affichage :</span>
              <div className="flex border rounded-lg p-1">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3 rounded-md"
                >
                  Grille
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3 rounded-md"
                >
                  Liste
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        {isLoading ? (
          <ShopsGridSkeleton viewMode={viewMode} />
        ) : shops.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {shops.map((shop: Shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {shops.map((shop: Shop) => (
                  <ShopCardList key={shop.id} shop={shop} />
                ))}
              </div>
            )}

            {/* Pagination améliorée */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(0, page - 1))}
                        className={page === 0 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const showStartEllipsis = i === 2 && page > 3;
                      const showEndEllipsis = i === 2 && page < totalPages - 4;
                      
                      if (showStartEllipsis) {
                        return <PaginationEllipsis key="start-ellipsis" />;
                      }
                      
                      if (showEndEllipsis) {
                        return <PaginationEllipsis key="end-ellipsis" />;
                      }
                      
                      const pageNumber = i;
                      const isCurrent = page === pageNumber;
                      
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            isActive={isCurrent}
                            onClick={() => handlePageChange(pageNumber)}
                            className="cursor-pointer min-w-[2.5rem]"
                          >
                            {pageNumber + 1}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
                        className={page >= totalPages - 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  Page {page + 1} sur {totalPages} • {totalElements} boutique{totalElements !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </>
        ) : (
          <CommandEmpty
           
          />
        )}
      </div>

      {/* Section CTA en bas de page */}
      {!isLoading && shops.length > 0 && (
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-t mt-12">
          <div className="container py-12">
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <h3 className="text-2xl font-bold">
                Vous êtes commerçant ?
              </h3>
              <p className="text-muted-foreground">
                Rejoignez notre communauté de boutiques vérifiées et augmentez votre visibilité.
              </p>
              <Button size="lg" className="gap-2">
                <Store className="h-4 w-4" />
                Devenir partenaire
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Composant Shop Card (Grid View)
const ShopCard = ({ shop }: { shop: Shop }) => {
  return (
    <Link to={`/shops/${shop.id}`} className="block h-full">
      <Card className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 border hover:border-primary/30 bg-gradient-to-b from-card to-card/95 hover:scale-[1.02]">
        {/* Image avec effet hover */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/10">
          <img 
            src={shop.imageUrl || '/api/placeholder/400/300'} 
            alt={shop.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Overlay gradient au hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges overlay */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <Badge className="gap-1 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 text-xs font-medium">
              <Shield className="h-3 w-3" />
              Vérifiée
            </Badge>
            <div className="bg-black/80 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span className="text-white text-xs font-semibold">{shop.rating || '4.5'}</span>
            </div>
          </div>
          
          {/* CTA overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button className="w-full gap-2" size="sm">
              <ChevronRight className="h-4 w-4" />
              Visiter la boutique
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4 md:p-5">
          <div className="space-y-3">
            <div>
              <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors mb-1">
                {shop.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {shop.description || 'Boutique partenaire certifiée'}
              </p>
            </div>
            
         
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

// Composant Shop Card (List View)
const ShopCardList = ({ shop }: { shop: Shop }) => {
  return (
    <Link to={`/shops/${shop.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border hover:border-primary/30">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-48 relative">
            <div className="aspect-square md:aspect-auto md:h-full overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/10">
              <img 
                src={shop.imageUrl || '/api/placeholder/400/300'} 
                alt={shop.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <Badge className="absolute top-2 left-2 gap-1 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 text-xs">
              <Shield className="h-3 w-3" />
            </Badge>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div>
                    <h3 className="text-xl font-bold line-clamp-1 group-hover:text-primary transition-colors">
                      {shop.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {shop.description || 'Boutique partenaire certifiée'}
                    </p>
                  </div>
                </div>
                
                {/* Infos */}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium">{shop.rating || '4.5'}</span>
                      <span className="text-muted-foreground">/5</span>
                    </div>
                  </div>
                  
                 
                </div>
              </div>
              
              {/* CTA */}
              <div className="flex flex-col items-end gap-3">
                <Button className="gap-2">
                  <ChevronRight className="h-4 w-4" />
                  Visiter
                </Button>
                
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

// Composant Empty State amélioré
const EmptyState = ({ search, hasActiveFilters, clearFilters }: { 
  search: string; 
  hasActiveFilters: boolean;
  clearFilters: () => void;
}) => (
  <div className="text-center py-16 md:py-24">
    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-secondary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <Store className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground" />
    </div>
    <h3 className="text-2xl md:text-3xl font-bold mb-4">
      {search ? 'Aucune boutique trouvée' : 'Aucune boutique disponible'}
    </h3>
    <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
      {search 
        ? `Nous n'avons trouvé aucune boutique correspondant à "${search}"`
        : 'Les boutiques seront disponibles prochainement. Revenez plus tard !'
      }
    </p>
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {hasActiveFilters ? (
        <Button 
          onClick={clearFilters}
          className="gap-2"
          size="lg"
        >
          <X className="h-4 w-4" />
          Réinitialiser les filtres
        </Button>
      ) : (
        <Button asChild size="lg">
          <Link to="/">Explorer l'accueil</Link>
        </Button>
      )}
      <Button variant="outline" asChild size="lg">
        <Link to="/contact">Nous contacter</Link>
      </Button>
    </div>
  </div>
);

// Skeleton amélioré
const ShopsGridSkeleton = ({ viewMode }: { viewMode: 'grid' | 'list' }) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden border-2">
            <Skeleton className="aspect-[4/3] w-full" />
            <CardContent className="p-4 md:p-5 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between pt-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="overflow-hidden border-2">
          <div className="flex flex-col md:flex-row">
            <Skeleton className="md:w-48 h-48 md:h-auto" />
            <CardContent className="flex-1 p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ShopsPage;