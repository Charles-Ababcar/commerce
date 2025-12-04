import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/models/Product';
import { ApiResponse, PageResponse } from '@/models/ApiResponse';

const Products = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState('createdAt');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: productsData, isLoading, error, refetch } = useQuery({
    queryKey: ['products', page, size, debouncedSearch, category, sortBy],
    queryFn: () => apiClient.getProducts(page, size, undefined, debouncedSearch) as Promise<ApiResponse<PageResponse<Product>>>,
    staleTime: 1000 * 60 * 5,
  });

  const products: Product[] = productsData?.data?.content || [];
  const totalPages = productsData?.data?.totalPages || 0;
  const totalElements = productsData?.data?.totalElements || 0;
  const categories = ['Tous', ...Array.from(new Set(products.map(p => p.categoryResponseDTO?.name).filter(Boolean)))];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    refetch();
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.priceCents - b.priceCents;
      case 'price-desc': return b.priceCents - a.priceCents;
      case 'rating': return b.rating - a.rating;
      case 'name': return a.name.localeCompare(b.name);
      case 'createdAt':
      default: return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  const filteredProducts = sortedProducts.filter(product => category === 'Tous' || product.categoryResponseDTO?.name === category);

  if (error) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Erreur de chargement</h2>
        <p className="text-muted-foreground mb-6">Impossible de charger les produits. Veuillez réessayer.</p>
        <Button onClick={() => refetch()}>Réessayer</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tous les Produits</h1>
          <p className="text-muted-foreground">Découvrez notre collection complète de {totalElements} produits</p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-card rounded-lg border p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Rechercher un produit..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Button type="submit" className="flex items-center gap-2">
              <Search className="h-4 w-4" /> Rechercher
            </Button>
          </form>

          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="w-full md:w-[200px]">
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue placeholder="Catégorie" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-[200px]">
                <label className="block text-sm font-medium mb-2">Trier par</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger><SelectValue placeholder="Trier par" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Plus récent</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix décroissant</SelectItem>
                    <SelectItem value="rating">Meilleures notes</SelectItem>
                    <SelectItem value="name">Nom A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')}><Grid3X3 className="h-4 w-4" /></Button>
              <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')}><List className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        {isLoading ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className={viewMode === 'grid' ? 'space-y-4' : 'flex gap-4'}>
                <Skeleton className={viewMode === 'grid' ? 'h-[200px] w-full rounded-lg' : 'h-32 w-32 rounded-lg'} />
                <div className={viewMode === 'grid' ? 'space-y-2' : 'flex-1 space-y-2'}>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground mb-6">Aucun produit ne correspond à vos critères de recherche.</p>
            <Button onClick={() => { setSearch(''); setCategory('Tous'); setPage(0); }}>Voir tous les produits</Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            <Button variant="outline" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>Précédent</Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => (
              <Button key={i} variant={page === i ? 'default' : 'outline'} onClick={() => setPage(i)}>{i + 1}</Button>
            ))}
            {totalPages > 5 && <span className="px-4 py-2 text-muted-foreground">...</span>}
            <Button variant="outline" onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1}>Suivant</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
