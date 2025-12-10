import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from '@/lib/api';
import { 
  Package, 
  Calendar, 
  User, 
  Store, 
  MapPin, 
  Phone, 
  Mail,
  Eye,
  MoreHorizontal,
  ShoppingBag,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  X,
  Download,
  Loader2
} from 'lucide-react';
import { Page, Order } from '@/types/api';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const STATUS_STYLES: { [key: string]: { bg: string, text: string, icon: React.ReactNode } } = {
  PLACED: { 
    bg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', 
    text: 'Commandé',
    icon: <ShoppingBag className="w-3 h-3" />
  },
  PENDING: { 
    bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', 
    text: 'En attente',
    icon: <Calendar className="w-3 h-3" />
  },
  SHIPPED: { 
    bg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', 
    text: 'Expédié',
    icon: <Truck className="w-3 h-3" />
  },
  DELIVERED: { 
    bg: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', 
    text: 'Livré',
    icon: <CheckCircle className="w-3 h-3" />
  },
  CANCELLED: { 
    bg: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', 
    text: 'Annulé',
    icon: <XCircle className="w-3 h-3" />
  },
};

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'Tous les statuts' },
  { value: 'PLACED', label: 'Commandé' },
  { value: 'PENDING', label: 'En attente' },
  { value: 'SHIPPED', label: 'Expédié' },
  { value: 'DELIVERED', label: 'Livré' },
  { value: 'CANCELLED', label: 'Annulé' },
];

const SORT_OPTIONS = [
  { value: 'createdAt,desc', label: 'Plus récentes' },
  { value: 'createdAt,asc', label: 'Plus anciennes' },
  { value: 'totalCents,desc', label: 'Montant élevé' },
  { value: 'totalCents,asc', label: 'Montant faible' },
];

const formatPrice = (cents: number) => {
  return cents.toLocaleString('fr-FR') + ' FCFA';
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function Orders() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt,desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Construire les paramètres de requête
  const buildQueryParams = () => {
    const params: any = {
      page,
      size: 5,
      sort: sortBy
    };
    
    if (debouncedSearch) {
      params.search = debouncedSearch;
    }
    
    if (statusFilter !== 'ALL') {
      params.status = statusFilter;
    }
    
    return params;
  };

  const { data: ordersData, isLoading } = useQuery<Page<Order>>({
    queryKey: ['orders', page, debouncedSearch, statusFilter, sortBy],
    queryFn: async () => {
      const data = await apiClient.getOrders(buildQueryParams());
      console.log("Données API reçues:", data); 
      console.log("Structure de pagination:", {
        content: data?.content?.length,
        totalPages: data?.totalPages,
        totalElements: data?.totalElements,
        pageable: data?.pageable
      });
      console.log("Détails pagination:", {
        page,
        totalPages: data?.totalPages,
        totalElements: data?.totalElements,
        ordersCount: data?.content?.length,
        hasNextPage: page < ((data?.totalPages || 1) - 1),
        hasPrevPage: page > 0
      });
      return data;
    },
    placeholderData: keepPreviousData,
  });

  const orders = ordersData?.content || [];
  const totalPages = ordersData?.totalPages || 1;
  const totalElements = ordersData?.totalElements || 0;

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setSortBy('createdAt,desc');
    setPage(0);
  };

  const hasActiveFilters = search || statusFilter !== 'ALL' || sortBy !== 'createdAt,desc';

  const getPageNumbers = () => {
    // Si aucune donnée ou pages invalides, retourner seulement la page 0
    if (!totalPages || totalPages <= 0) {
      return [0];
    }
    
    const pages = [];
    const maxVisiblePages = 5;
    
    // Cas simple : moins de pages que le maximum visible
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } 
    // Cas complexe : besoin d'ellipsis
    else {
      // Toujours inclure la première page
      pages.push(0);
      
      // Calculer les pages autour de la page courante
      let start = Math.max(1, page - 1);
      let end = Math.min(totalPages - 2, page + 1);
      
      // Ajuster si on est près du début
      if (page <= 2) {
        end = Math.min(totalPages - 2, 3);
      }
      // Ajuster si on est près de la fin
      else if (page >= totalPages - 3) {
        start = Math.max(1, totalPages - 4);
      }
      
      // Ajouter ellipsis au début si nécessaire
      if (start > 1) {
        pages.push('ellipsis-start');
      }
      
      // Ajouter les pages centrales
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Ajouter ellipsis à la fin si nécessaire
      if (end < totalPages - 2) {
        pages.push('ellipsis-end');
      }
      
      // Toujours inclure la dernière page
      if (totalPages > 1) {
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  // ⭐️ MUTATION D'ANNULATION
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: number) => apiClient.cancelOrder(orderId),
    onSuccess: (response:any) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] }); 
      
      console.log(`Commande ${response.data.orderNumber} annulée.`);
      toast.success(response.message)
    },
    onError: (error: any) => {
      console.error("Erreur d'annulation:", error);
      alert(error.message || "La commande n'a pas pu être annulée.");
    },
  });

  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null); 

  const handlePrepareCancellation = (order: Order) => {
    // Vérification préliminaire du statut (cette vérification sera répétée dans le backend)
    if (order.status === "DELIVERED" || order.status === "CANCELLED") {
      alert(`Impossible d'annuler une commande déjà ${STATUS_STYLES[order.status].text}.`);
      return;
    }
    // Stocke la commande dans l'état et ouvre le dialogue via AlertDialogTrigger
    setOrderToCancel(order); 
  };
    
  // ⭐️ ACTION DÉFINITIVE DE L'ANNULATION
  const handleConfirmCancellation = () => {
    if (orderToCancel) {
      cancelOrderMutation.mutate(orderToCancel.id);
      setOrderToCancel(null); 
    }
  };

  return (
    <DashboardLayout>
      {/* ⭐️ Boîte de dialogue de confirmation d'annulation ⭐️ */}
      <AlertDialog open={!!orderToCancel} onOpenChange={(open) => !open && setOrderToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <XCircle className="mr-2 h-5 w-5" />
              Confirmer l'annulation de la commande
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous certain de vouloir annuler la commande{" "}
              <span className="font-semibold text-gray-800">
                #{orderToCancel?.orderNumber || `CMD-${orderToCancel?.id}`}
              </span>{" "}
              ? Cette action est irréversible. Le stock du produit sera remis à jour.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelOrderMutation.isPending}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancellation}
              disabled={cancelOrderMutation.isPending}
              className={
                cancelOrderMutation.isPending
                  ? "bg-red-400"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {cancelOrderMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Annulation en cours...
                </>
              ) : (
                "Oui, annuler définitivement"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Section gauche */}
          <div className="space-y-4">
            {/* Titre élégant */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                    <Package className="h-6 w-6 text-white" />
                  </div>
                  <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-primary/30 to-secondary/30 blur-sm -z-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Commandes
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Gestion centralisée
                  </p>
                </div>
              </div>
            </div>

            {/* Stats en badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">{totalElements}</span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-medium">commande{totalElements !== 1 ? 's' : ''}</p>
                </div>
              </div>
              
              {/* Indicateur de page */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border shadow-sm">
                <div className="text-sm text-muted-foreground">Page</div>
                <div className="flex items-center gap-1">
                  <span className="text-xl font-bold text-primary">{page + 1}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="font-medium">{Math.max(1, totalPages)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section droite - Actions */}
          <div className="flex items-center gap-3">
            {/* Bouton export amélioré */}
            <Button 
              className="gap-2 px-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              size="lg"
            >
              <Download className="h-5 w-5" />
              <span>Exporter les données</span>
            </Button>
          </div>
        </div>

        {/* Filtres et recherche */}
        <Card className="border">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Barre de recherche */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par numéro de commande, client, email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {search && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                      onClick={() => setSearch('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Plus de filtres
                </Button>
              </div>

              {/* Filtres rapides */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
 

                  <div>
                    <label className="text-sm font-medium mb-2 block">Statut</label>
                    <Select 
                      value={statusFilter} 
                 
                      onValueChange={(newStatus) => { 
                        setStatusFilter(newStatus);
                        setPage(0); 
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Trier par</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Trier par" />
                      </SelectTrigger>
                      <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {hasActiveFilters && (
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        onClick={handleClearFilters}
                        className="gap-2 h-10"
                      >
                        <X className="h-4 w-4" />
                        Réinitialiser
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Affichage des filtres actifs */}
              {hasActiveFilters && (
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Filtres actifs :</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
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
                    {statusFilter !== 'ALL' && (
                      <Badge variant="secondary" className="gap-1.5">
                        Statut : {STATUS_OPTIONS.find(s => s.value === statusFilter)?.label}
                        <button onClick={() => setStatusFilter('ALL')}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                    {sortBy !== 'createdAt_desc' && (
                      <Badge variant="secondary" className="gap-1.5">
                        Tri : {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
                        <button onClick={() => setSortBy('createdAt_desc')}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Table des commandes */}
        <Card>
          <CardContent className="p-0">
            {isLoading && orders.length === 0 ? (
              <div className="p-8">
                <div className="space-y-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {hasActiveFilters ? 'Aucune commande trouvée' : 'Aucune commande'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {hasActiveFilters 
                    ? 'Aucune commande ne correspond à vos critères de recherche.'
                    : 'Vous n\'avez pas encore de commandes.'
                  }
                </p>
                {hasActiveFilters && (
                  <Button onClick={handleClearFilters} variant="outline">
                    Réinitialiser les filtres
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[120px]">Numéro Commande</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Boutique</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow 
                        key={order.id} 
                        className="hover:bg-muted/50 dark:hover:bg-gray-800/50"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center">
                              <Package className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">{order.orderNumber || `CMD-${order.id}`}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.client.name}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {order.client.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Store className="w-4 h-4 text-blue-600" />
                            <div>
                              <span className="font-medium">{order.shop.name}</span>
                              <p className="text-xs text-muted-foreground">
                                ID: {order.shop.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-bold text-primary">
                            {formatPrice(order.totalCents)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {order.items?.length || 0} article{order.items?.length !== 1 ? 's' : ''}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${STATUS_STYLES[order.status]?.bg} gap-1`}>
                            {STATUS_STYLES[order.status]?.icon}
                            {STATUS_STYLES[order.status]?.text}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <span className="text-sm">{formatDate(order.createdAt)}</span>
                              <div className="text-xs text-muted-foreground">
                                {new Date(order.createdAt).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                              className="h-8 w-8 p-0 hover:bg-primary/10"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Voir détails</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir détails
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  Contacter le client
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Télécharger facture
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onSelect={(e) => {
                                    e.preventDefault();
                                    handlePrepareCancellation(order);
                                  }}
                                  className="text-red-600 focus:bg-red-50"
                                  disabled={order.status === 'CANCELLED' || order.status === 'DELIVERED'}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Annuler la commande
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination - directement sous le tableau */}
        {(totalPages > 0 || orders.length > 0) && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Affichage de {orders.length} commande{orders.length !== 1 ? 's' : ''} 
              {totalElements > 0 && ` sur ${totalElements}`}
              {page > 0 && ` (page ${page + 1}/${totalPages > 0 ? totalPages : 1})`}
            </div>
            
            {/* Pagination - afficher seulement si plus d'une page */}
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(page - 1)}
                      className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {getPageNumbers().map((pageNum, index) => (
                    <PaginationItem key={index}>
                      {pageNum === 'ellipsis-start' || pageNum === 'ellipsis-end' ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          isActive={pageNum === page}
                          onClick={() => handlePageChange(pageNum as number)}
                          className="cursor-pointer min-w-[40px] justify-center"
                        >
                          {(pageNum as number) + 1}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(page + 1)}
                      className={page >= totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}

        {/* Dialog pour les détails de la commande */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedOrder && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div>Commande {selectedOrder.orderNumber || `CMD-${selectedOrder.id}`}</div>
                      <DialogDescription className="text-base">
                        Créée le {formatDateTime(selectedOrder.createdAt)}
                      </DialogDescription>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Informations principales */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <User className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold text-lg">Client</h4>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground">Nom complet</p>
                            <p className="font-semibold">{selectedOrder.client.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <p>{selectedOrder.client.email}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Téléphone</p>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <p>{selectedOrder.client.phoneNumber}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Adresse</p>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <p className="text-sm">{selectedOrder.client.address}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Store className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold text-lg">Boutique</h4>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Nom de la boutique</p>
                            <p className="font-semibold text-lg">{selectedOrder.shop.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Informations</p>
                            <div className="flex gap-2">
                              <Badge variant="outline">ID: {selectedOrder.shop.id}</Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Montant total</p>
                            <p className="text-3xl font-bold text-primary">
                              {formatPrice(selectedOrder.totalCents)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Statut</p>
                            <Badge className={`${STATUS_STYLES[selectedOrder.status]?.bg} gap-2 px-3 py-1.5 text-sm`}>
                              {STATUS_STYLES[selectedOrder.status]?.icon}
                              {STATUS_STYLES[selectedOrder.status]?.text}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                            <p className="font-medium">{formatDateTime(selectedOrder.updatedAt)}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Articles de la commande */}
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-lg mb-4">Articles commandés</h4>
                      <div className="space-y-3">
                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                          selectedOrder.items.map((item, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                {item.imageUrl && (
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.productName}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                )}
                                <div>
                                  <p className="font-medium">{item.productName}</p>
                                  <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                                    <span>Catégorie: {item.categoryName}</span>
                                    <span>•</span>
                                    <span>Quantité: {item.quantity}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{formatPrice(item.priceCents * item.quantity)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatPrice(item.priceCents)} × {item.quantity}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-gray-500">Aucun article dans cette commande</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Fermer
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Télécharger facture
                    </Button>
                    <Button className="gap-2">
                      <Mail className="h-4 w-4" />
                      Contacter le client
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}