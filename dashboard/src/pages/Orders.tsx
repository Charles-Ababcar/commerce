import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const STATUS_STYLES: { [key: string]: { bg: string, text: string, icon: React.ReactNode } } = {
  PLACED: { bg: 'bg-blue-100 text-blue-800', text: 'Commandé', icon: <ShoppingBag className="w-3 h-3" /> },
  PENDING: { bg: 'bg-yellow-100 text-yellow-800', text: 'En attente', icon: <Calendar className="w-3 h-3" /> },
  SHIPPED: { bg: 'bg-purple-100 text-purple-800', text: 'Expédié', icon: <Truck className="w-3 h-3" /> },
  DELIVERED: { bg: 'bg-green-100 text-green-800', text: 'Livré', icon: <CheckCircle className="w-3 h-3" /> },
  CANCELLED: { bg: 'bg-red-100 text-red-800', text: 'Annulé', icon: <XCircle className="w-3 h-3" /> },
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
  { value: 'createdAt_desc', label: 'Plus récentes' },
  { value: 'createdAt_asc', label: 'Plus anciennes' },
  { value: 'totalCents_desc', label: 'Montant élevé' },
  { value: 'totalCents_asc', label: 'Montant faible' },
];

const formatPrice = (cents: number) => `${cents.toLocaleString('fr-FR')} FCFA`;
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
const formatDateTime = (dateString: string) => new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function Orders() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt_desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null); 
  const queryClient = useQueryClient();

  // Debounce search
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
    queryFn: async () => {
      const data = await apiClient.getOrders(buildQueryParams());
      return data;
    },
    keepPreviousData: true,
  });

  const orders = ordersData?.content || [];
  const totalPages = ordersData?.totalPages || 1;
  const totalElements = ordersData?.totalElements || 0;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setSortBy('createdAt_desc');
    setPage(0);
  };

  const hasActiveFilters = search || statusFilter !== 'ALL' || sortBy !== 'createdAt_desc';

  // Annulation
  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: number) => apiClient.cancelOrder(orderId),
    onSuccess: (response:any) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] }); 
      toast.success(response.message);
    },
    onError: (error: any) => {
      alert(error.message || "Erreur lors de l'annulation.");
    },
  });

  const handlePrepareCancellation = (order: Order) => {
    if (order.status === "DELIVERED" || order.status === "CANCELLED") {
      alert(`Impossible d'annuler une commande déjà ${STATUS_STYLES[order.status].text}.`);
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

  const getPageNumbers = () => {
    if (!totalPages || totalPages <= 0) return [0];
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      let start = Math.max(1, page - 1);
      let end = Math.min(totalPages - 2, page + 1);
      if (page <= 2) end = 3;
      else if (page >= totalPages - 3) start = totalPages - 4;
      if (start > 1) pages.push('ellipsis-start');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 2) pages.push('ellipsis-end');
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <DashboardLayout>
      {/* Dialogue annulation */}
      <AlertDialog open={!!orderToCancel} onOpenChange={(open) => !open && setOrderToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <XCircle className="mr-2 h-5 w-5" />
              Confirmer l'annulation de la commande
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler la commande{" "}
              <span className="font-semibold text-gray-800">
                #{orderToCancel?.orderNumber || `CMD-${orderToCancel?.id}`}
              </span> ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelOrderMutation.isPending}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancellation} disabled={cancelOrderMutation.isPending} className={cancelOrderMutation.isPending ? "bg-red-400" : "bg-red-600 hover:bg-red-700"}>
              {cancelOrderMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Annulation...</> : "Oui, annuler"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6">
        {/* Filtres */}
        <Card className="border">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Statut</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger><SelectValue placeholder="Filtrer par statut" /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Trier par</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger><SelectValue placeholder="Trier par" /></SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                {hasActiveFilters && (
                  <div className="flex items-end">
                    <Button variant="ghost" onClick={handleClearFilters} className="gap-2 h-10"><X className="h-4 w-4" /> Réinitialiser</Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des commandes */}
        <Card>
          <CardContent className="p-0">
            {isLoading && orders.length === 0 ? (
              <div className="p-8">Chargement...</div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">Aucune commande trouvée.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Boutique</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map(order => (
                    <TableRow key={order.id} className="hover:bg-muted/50">
                      <TableCell>{order.orderNumber || `CMD-${order.id}`}</TableCell>
                      <TableCell>{order.client.name}</TableCell>
                      <TableCell>{order.shop.name}</TableCell>
                      <TableCell className="text-right">{formatPrice(order.totalCents)}</TableCell>
                      <TableCell>
                        <Badge className={`${STATUS_STYLES[order.status]?.bg}`}>{STATUS_STYLES[order.status]?.text}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order) & setIsDialogOpen(true)}>Voir</Button>
                        <Button variant="ghost" size="sm" onClick={() => handlePrepareCancellation(order)} disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}>Annuler</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationPrevious onClick={() => handlePageChange(page-1)} disabled={page===0}/>
              {getPageNumbers().map((p,i) => typeof p==='number' ? <PaginationLink key={i} isActive={p===page} onClick={()=>handlePageChange(p)}>{p+1}</PaginationLink> : <PaginationEllipsis key={i}/> )}
              <PaginationNext onClick={() => handlePageChange(page+1)} disabled={page>=totalPages-1}/>
            </PaginationContent>
          </Pagination>
        )}

        {/* Dialog détails commande */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedOrder && <div>Détails commande {selectedOrder.orderNumber || selectedOrder.id}</div>}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
