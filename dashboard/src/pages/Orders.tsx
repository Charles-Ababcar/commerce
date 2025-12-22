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
  Loader2,
  MessageCircle,
  Globe
} from 'lucide-react';
import { Page, Order } from '@/types/api';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

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

// 🆕 Styles pour les canaux de commande
const CHANNEL_STYLES: { [key: string]: { bg: string, text: string, icon: React.ReactNode } } = {
  WEB: { 
    bg: 'bg-slate-100 text-slate-700 border-slate-200', 
    text: 'Site Web', 
    icon: <Globe className="w-3 h-3" /> 
  },
  WHATSAPP: { 
    bg: 'bg-green-100 text-green-700 border-green-200', 
    text: 'WhatsApp', 
    icon: <MessageCircle className="w-3 h-3" /> 
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
  const [selectedOrder, setSelectedOrder] = useState<Order | any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const buildQueryParams = () => {
    const params: any = { page, size: 5, sort: sortBy };
    if (debouncedSearch) params.search = debouncedSearch;
    if (statusFilter !== 'ALL') params.status = statusFilter;
    return params;
  };

  const { data: ordersData, isLoading } = useQuery<Page<Order>>({
    queryKey: ['orders', page, debouncedSearch, statusFilter, sortBy],
    queryFn: async () => apiClient.getOrders(buildQueryParams()),
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
    if (!totalPages || totalPages <= 0) return [0];
    const pages = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      let start = Math.max(1, page - 1);
      let end = Math.min(totalPages - 2, page + 1);
      if (page <= 2) end = Math.min(totalPages - 2, 3);
      else if (page >= totalPages - 3) start = Math.max(1, totalPages - 4);
      if (start > 1) pages.push('ellipsis-start');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 2) pages.push('ellipsis-end');
      if (totalPages > 1) pages.push(totalPages - 1);
    }
    return pages;
  };

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: number) => apiClient.cancelOrder(orderId),
    onSuccess: (response:any) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] }); 
      toast.success(response.message);
    },
    onError: (error: any) => {
      toast.error(error.message || "Erreur d'annulation");
    },
  });

  const handlePrepareCancellation = (order: Order) => {
    if (order.status === "DELIVERED" || order.status === "CANCELLED") {
      toast.error(`Impossible d'annuler une commande déjà ${STATUS_STYLES[order.status].text}.`);
      return;
    }
    setOrderToCancel(order); 
  };
    
  const handleConfirmCancellation = () => {
    if (orderToCancel) {
      cancelOrderMutation.mutate(orderToCancel.id);
      setOrderToCancel(null); 
    }
  };

  return (
    <DashboardLayout>
      {/* Dialogue de confirmation d'annulation */}
      <AlertDialog open={!!orderToCancel} onOpenChange={(open) => !open && setOrderToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <XCircle className="mr-2 h-5 w-5" /> Confirmer l'annulation
            </AlertDialogTitle>
            <AlertDialogDescription>
              Voulez-vous annuler la commande #{orderToCancel?.orderNumber} ? Le stock sera remis à jour.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelOrderMutation.isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancellation} disabled={cancelOrderMutation.isPending} className="bg-red-600 hover:bg-red-700">
              {cancelOrderMutation.isPending ? "En cours..." : "Oui, annuler définitivement"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6">
        {/* Header avec statistiques et titre */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Commandes</h1>
                  <p className="text-muted-foreground mt-1">Gestion centralisée des transactions</p>
                </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="px-4 py-2 border shadow-sm gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                {totalElements} commandes au total
              </Badge>
              <Badge variant="outline" className="px-4 py-2 border shadow-sm">
                Page {page + 1} sur {totalPages}
              </Badge>
            </div>
          </div>
          <Button className="gap-2 px-6 shadow-lg" size="lg">
            <Download className="h-5 w-5" /> Exporter les données
          </Button>
        </div>

        {/* Filtres */}
        <Card className="border">
          <CardContent className="p-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher par N°, client, email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue placeholder="Filtrer par statut" /></SelectTrigger>
                <SelectContent>{STATUS_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger><SelectValue placeholder="Trier par" /></SelectTrigger>
                <SelectContent>{SORT_OPTIONS.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}</SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={handleClearFilters} className="text-red-500 hover:text-red-600">
                  <X className="mr-2 h-4 w-4" /> Réinitialiser les filtres
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Table des commandes */}
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            {isLoading ? (
              <div className="p-8 space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-muted animate-pulse rounded" />)}</div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground"><Package className="mx-auto h-12 w-12 opacity-20 mb-4"/><p>Aucune commande trouvée</p></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° & Canal</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Livraison (Zone)</TableHead>
                    <TableHead>Boutique</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-bold">#{order.orderNumber || order.id}</div>
                        {/* 🆕 Badge Canal */}
                        <Badge variant="outline" className={`${CHANNEL_STYLES[order.channel]?.bg || 'bg-gray-100'} border-none text-[10px] py-0 px-1.5 mt-1 gap-1`}>
                          {CHANNEL_STYLES[order.channel]?.icon || <Globe className="w-3 h-3"/>}
                          {CHANNEL_STYLES[order.channel]?.text || "Web"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{order.client.name}</p>
                        <p className="text-xs text-muted-foreground">{order.client.phoneNumber}</p>
                      </TableCell>
                      <TableCell>
                        {/* 🆕 Zone et Quartier */}
                        <div className="text-sm font-semibold flex items-center gap-1"><MapPin size={14} className="text-blue-500" /> {order.deliveryZone || "N/A"}</div>
                        <div className="text-[11px] text-muted-foreground italic truncate max-w-[120px]">{order.deliveryAddressDetail || "Sans précision"}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2"><Store size={14} className="text-muted-foreground"/> <span className="text-sm">{order.shop.name}</span></div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="font-bold text-primary">{formatPrice(order.totalCents)}</div>
                        <div className="text-[10px] text-muted-foreground">Frais: {formatPrice(order.deliveryFee || 0)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${STATUS_STYLES[order.status]?.bg} border-none`}>{STATUS_STYLES[order.status]?.text}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order)}><Eye className="h-4 w-4" /></Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleViewOrder(order)}><Eye className="mr-2 h-4 w-4" /> Détails</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600" onSelect={(e) => { e.preventDefault(); handlePrepareCancellation(order); }} disabled={order.status === 'CANCELLED' || order.status === 'DELIVERED'}><XCircle className="mr-2 h-4 w-4" /> Annuler</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination complexe maintenue */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
             <div className="text-sm text-muted-foreground">Affichage de {orders.length} sur {totalElements}</div>
             <Pagination>
                <PaginationContent>
                  <PaginationItem><PaginationPrevious onClick={() => handlePageChange(page - 1)} className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}/></PaginationItem>
                  {getPageNumbers().map((pageNum, i) => (
                    <PaginationItem key={i}>
                      {pageNum === 'ellipsis-start' || pageNum === 'ellipsis-end' ? <PaginationEllipsis /> : <PaginationLink isActive={pageNum === page} onClick={() => handlePageChange(pageNum as number)} className="cursor-pointer">{(pageNum as number) + 1}</PaginationLink>}
                    </PaginationItem>
                  ))}
                  <PaginationItem><PaginationNext onClick={() => handlePageChange(page + 1)} className={page >= totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}/></PaginationItem>
                </PaginationContent>
             </Pagination>
          </div>
        )}

        {/* Dialog Détails complet avec nouvelles infos */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedOrder && (
              <div className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Package className="text-primary" /> Commande {selectedOrder.orderNumber || selectedOrder.id}
                  </DialogTitle>
                  <DialogDescription>Créée le {formatDateTime(selectedOrder.createdAt)} via <Badge variant="outline" className="ml-1">{selectedOrder.channel || "WEB"}</Badge></DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 space-y-2">
                    <h4 className="font-bold flex items-center gap-2"><User size={16}/> Client</h4>
                    <p className="text-sm font-semibold">{selectedOrder.client.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedOrder.client.phoneNumber}</p>
                    <p className="text-xs">{selectedOrder.client.address}</p>
                  </Card>
                  <Card className="p-4 space-y-2 bg-blue-50/30 border-blue-100">
                    <h4 className="font-bold flex items-center gap-2 text-blue-700"><Truck size={16}/> Livraison</h4>
                    <p className="text-sm font-bold">{selectedOrder.deliveryZone}</p>
                    <p className="text-xs italic">{selectedOrder.deliveryAddressDetail}</p>
                    <p className="text-xs text-blue-600">Frais appliqués: {formatPrice(selectedOrder.deliveryFee || 0)}</p>
                  </Card>
                  <Card className="p-4 space-y-2">
                    <h4 className="font-bold flex items-center gap-2"><ShoppingBag size={16}/> Résumé</h4>
                    <p className="text-2xl font-bold text-primary">{formatPrice(selectedOrder.totalCents)}</p>
                    <Badge className={STATUS_STYLES[selectedOrder.status]?.bg}>{STATUS_STYLES[selectedOrder.status]?.text}</Badge>
                  </Card>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader className="bg-muted/50"><TableRow><TableHead>Produit</TableHead><TableHead className="text-center">Qté</TableHead><TableHead className="text-right">Total</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {selectedOrder.items?.map((item: any, i: number) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm font-medium">{item.productName}</TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right font-bold">{formatPrice(item.priceCents * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}