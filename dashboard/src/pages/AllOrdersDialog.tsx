// Créez un nouveau fichier: src/components/Orders/AllOrdersDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

interface AllOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    startDate?: string;
    endDate?: string;
  };
}

export function AllOrdersDialog({ open, onOpenChange, filters }: AllOrdersDialogProps) {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['allOrders', page, size, filters],
    queryFn: () => apiClient.getRecentOrders({ page, size }),
  });

  const orders = ordersData?.content || [];
  const totalPages = ordersData?.totalPages || 0;

  const formatXOF = (amount: number) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: string, label: string }> = {
      'PENDING': { variant: 'warning', label: 'En attente' },
      'CONFIRMED': { variant: 'info', label: 'Confirmée' },
      'SHIPPED': { variant: 'secondary', label: 'Expédiée' },
      'DELIVERED': { variant: 'success', label: 'Livrée' },
      'CANCELLED': { variant: 'destructive', label: 'Annulée' },
    };
    
    const config = statusConfig[status] || { variant: 'default', label: status };
    return <Badge variant={config.variant as any}>{config.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Toutes les Commandes</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Statistiques rapides */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-600">Total Commandes</p>
              <p className="text-2xl font-bold">{ordersData?.totalElements || 0}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-600">Revenu Total</p>
              <p className="text-2xl font-bold">
                {formatXOF(orders.reduce((sum, order) => sum + (order.total || 0), 0))}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-purple-600">En attente</p>
              <p className="text-2xl font-bold">
                {orders.filter(o => o.status === 'PENDING').length}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-orange-600">Livrées</p>
              <p className="text-2xl font-bold">
                {orders.filter(o => o.status === 'DELIVERED').length}
              </p>
            </div>
          </div>

          {/* Table des commandes */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commande</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Boutique</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.orderId} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {order.orderNumber || `CMD-${order.orderId}`}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.createdAt ? formatDate(order.createdAt) : '-'}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatXOF(order.total || 0)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status || 'PENDING')}
                      </TableCell>
                      <TableCell>
                        {order.shopName || 'En ligne'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Voir détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucune commande trouvée
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page + 1} sur {totalPages} • {ordersData?.totalElements || 0} commandes
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => Math.max(0, prev - 1))}
                  disabled={page === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Suivant
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}