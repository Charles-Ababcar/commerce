import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  DollarSign,
  ShoppingBag,
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Eye,
  Truck,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  MoreVertical,
  Mail,
  Store,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardStats, RecentOrder, SalesTrend } from "@/types/api";
import { AllOrdersDialog } from "./AllOrdersDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- CONFIGURATION DU GRAPHIQUE ---
const chartConfig = {
  revenue: {
    label: "Revenu",
    color: "#0ea5e9",
  },
};

// --- HELPERS ---
const formatXOF = (amount: number | any) => {
  return new Intl.NumberFormat("fr-SN", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(Number(amount || 0));
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "DELIVERED":
    case "COMPLETED":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "PENDING":
    case "PROCESSING":
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case "CANCELLED":
      return <XCircle className="w-4 h-4 text-red-500" />;
    default:
      return <Package className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "DELIVERED":
    case "COMPLETED":
      return "bg-green-50 text-green-700 border-green-200";
    case "PENDING":
    case "PROCESSING":
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return "Livrée";
    case "COMPLETED":
      return "Terminée";
    case "PENDING":
      return "En attente";
    case "PROCESSING":
      return "En traitement";
    case "CANCELLED":
      return "Annulée";
    default:
      return status;
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    period: "daily",
    startDate: "",
    endDate: "",
    page: 0,
  });

  const [isAllOrdersOpen, setIsAllOrdersOpen] = useState(false);

  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    setFilters(prev => ({
      ...prev,
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    }));
  }, []);

  // --- QUERIES ---
  const { data: generalData, isLoading: isLoadingGeneral } = useQuery<DashboardStats>({
    queryKey: ["dashboardGeneral", filters.startDate, filters.endDate],
    queryFn: () => apiClient.getGeneralDashboard({
      startDate: filters.startDate ? new Date(filters.startDate) : undefined,
      endDate: filters.endDate ? new Date(filters.endDate) : undefined,
    }),
  });

  const { data: recentOrdersData, isLoading: isLoadingOrders, refetch: refetchOrders } = useQuery({
    queryKey: ["dashboardRecentOrders", filters.page],
    queryFn: () => apiClient.getRecentOrders({ page: filters.page, size: 6 }),
  });

  const { data: salesTrendsData, isLoading: isLoadingSalesTrends } = useQuery({
    queryKey: ["dashboardSalesTrends", filters.period, filters.startDate],
    queryFn: () => apiClient.getSalesTrends({ type: filters.period }),
  });

  const stats = generalData?.data || generalData || {};
  
  // STATISTIQUES POUR LES CARTES
  const keyStats = [
    {
      title: "Chiffre d'Affaires",
      value: formatXOF(stats.totalRevenue),
      icon: DollarSign,
      change: stats.trends?.revenueGrowth || 0,
      description: "Revenu total",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      trendIcon: TrendingUp,
    },
    {
      title: "Commandes",
      value: stats.totalOrders || 0,
      icon: ShoppingBag,
      change: stats.trends?.orderGrowth || 0,
      description: "Commandes validées",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      trendIcon: TrendingUp,
    },
    {
      title: "Livraisons",
      value: formatXOF(stats.totalDeliveryRevenue || 0),
      icon: Truck,
      change: 0,
      description: "Revenu livraison",
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      trendIcon: TrendingUp,
    },
    {
      title: "Panier Moyen",
      value: formatXOF(stats.averageOrderValue || 0),
      icon: CreditCard,
      change: stats.trends?.conversionGrowth || 0,
      description: "Par commande",
      color: "bg-gradient-to-br from-violet-500 to-violet-600",
      trendIcon: TrendingUp,
    },
    {
      title: "Clients",
      value: stats.totalCustomers || 0,
      icon: Users,
      change: stats.trends?.customerGrowth || 0,
      description: "Clients actifs",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      trendIcon: TrendingUp,
    },
  ];

  const formattedTrends = (salesTrendsData?.data || []).map((d: any) => ({
    ...d,
    name: new Date(d.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
  }));

  // Fonctions de gestion des commandes
  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await apiClient.updateOrderStatus(orderId, newStatus);
      refetchOrders();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleViewOrderDetails = (orderId: number) => {
    // Navigation vers les détails de la commande
    window.location.href = `/orders/${orderId}`;
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    // Vous pourriez ajouter une notification ici
    console.log("Email copié:", email);
  };

  const getOrderNumber = (order: RecentOrder) => {
    return order.orderNumber || `CMD-${String(order.orderId).padStart(6, '0')}`;
  };

  return (
    <DashboardLayout>
      <AllOrdersDialog open={isAllOrdersOpen} onOpenChange={setIsAllOrdersOpen} filters={filters} />

      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tableau de Bord</h1>
            <p className="text-muted-foreground mt-1">
              Bonjour <span className="font-semibold text-primary">{user?.name || "Administrateur"}</span>, voici vos performances
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" /> Actualiser
            </Button>
            <Button size="sm" onClick={() => setIsAllOrdersOpen(true)} className="bg-primary hover:bg-primary/90">
              <Eye className="w-4 h-4 mr-2" /> Toutes les commandes
            </Button>
          </div>
        </div>

        {/* CARTES STATISTIQUES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {keyStats.map((stat, i) => (
            <Card 
              key={i} 
              className="shadow-sm border-none bg-white overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color} text-white shadow-md`}>
                    <stat.icon size={20} />
                  </div>
                  <div className="flex flex-col items-end">
                    {stat.change !== 0 && (
                      <div className="flex items-center gap-1">
                        {stat.change > 0 ? (
                          <TrendingUp className="w-3 h-3 text-green-500" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className={`text-xs font-semibold ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change > 0 ? "+" : ""}{stat.change}%
                        </span>
                      </div>
                    )}
                    <span className="text-[10px] text-muted-foreground mt-1">vs. période précédente</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold tracking-tight mb-1">
                    {isLoadingGeneral ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {stat.value}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* GRAPH ET DERNIERES VENTES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GRAPHIQUE */}
          <Card className="lg:col-span-2 shadow-sm border-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">Performance Commerciale</CardTitle>
                <CardDescription className="text-sm">Évolution des revenus sur la période</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-blue-500">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">+12% cette semaine</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {isLoadingSalesTrends ? (
                  <Skeleton className="h-full w-full rounded-lg" />
                ) : (
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={formattedTrends}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          fontSize={11} 
                          dy={10} 
                          stroke="#64748b" 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          fontSize={11} 
                          stroke="#64748b" 
                          tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          formatter={(value) => [formatXOF(value), "Revenu"]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="var(--color-revenue)" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: "var(--color-revenue)", strokeWidth: 2, stroke: "#fff" }} 
                          activeDot={{ r: 6, strokeWidth: 0 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </div>
            </CardContent>
          </Card>

          {/* COMMANDES RECENTES AVEC GESTION */}
          <Card className="shadow-sm border-none bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">Ventes Récentes</CardTitle>
                  <CardDescription className="text-sm">Commandes des dernières 24h</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  {recentOrdersData?.content?.length || 0} commandes
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {isLoadingOrders ? (
                  <div className="p-4 space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-2 w-16" />
                        </div>
                        <Skeleton className="h-6 w-16" />
                      </div>
                    ))}
                  </div>
                ) : recentOrdersData?.content?.length === 0 ? (
                  <div className="p-6 text-center">
                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Aucune commande récente</p>
                    <p className="text-xs text-gray-400 mt-1">Les nouvelles commandes apparaîtront ici</p>
                  </div>
                ) : (
                  recentOrdersData?.content?.map((order: RecentOrder) => (
                    <div 
                      key={order.orderId} 
                      className="flex items-start justify-between p-4 hover:bg-gray-50/50 transition-colors group border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="absolute -bottom-1 -right-1">
                            {getStatusIcon(order.status)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {order.customerName || "Client non renseigné"}
                            </p>
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] px-1.5 py-0 h-5 ${getStatusColor(order.status)}`}
                            >
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                          
                          {/* Numéro de commande et boutique */}
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-xs text-gray-600 font-medium">
                              {getOrderNumber(order)}
                            </p>
                            {order.shopName && (
                              <div className="flex items-center gap-1">
                                <Store className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500 truncate max-w-[100px]">
                                  {order.shopName}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Email du client */}
                          {order.customerEmail && (
                            <div className="flex items-center gap-1 mb-1">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600 truncate max-w-[150px]">
                                {order.customerEmail}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 ml-1 opacity-0 group-hover:opacity-100"
                                onClick={() => handleCopyEmail(order.customerEmail!)}
                                title="Copier l'email"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </Button>
                            </div>
                          )}

                          {/* Date de création */}
                          <p className="text-xs text-gray-500">
                            {formatDateTime(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        {/* Montant */}
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {formatXOF(order.total)}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1">
                            Total commande
                          </p>
                        </div>
                        
                        {/* Menu d'actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewOrderDetails(order.orderId)}>
                              <Eye className="w-4 h-4 mr-2" /> Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.orderId, "PROCESSING")}>
                              <Clock className="w-4 h-4 mr-2" /> Marquer en traitement
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.orderId, "COMPLETED")}>
                              <CheckCircle className="w-4 h-4 mr-2" /> Marquer comme terminée
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleUpdateOrderStatus(order.orderId, "CANCELLED")}
                              className="text-red-600"
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Annuler la commande
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {recentOrdersData?.content && recentOrdersData.content.length > 0 && (
                <div className="p-4 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-sm text-primary hover:text-primary"
                    onClick={() => setIsAllOrdersOpen(true)}
                  >
                    Voir toutes les commandes →
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FILTRES DE DATE */}
        <Card className="bg-gradient-to-r from-gray-50 to-white border-gray-200">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <RefreshCw className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">Filtrer par période</p>
                  <p className="text-xs text-gray-500">Sélectionnez une période d'analyse</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border">
                  <span className="text-xs font-medium text-gray-600">Du</span>
                  <Input 
                    type="date" 
                    value={filters.startDate} 
                    onChange={(e) => setFilters(f => ({...f, startDate: e.target.value}))} 
                    className="h-8 text-xs w-32 border-none shadow-none"
                  />
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-lg border">
                  <span className="text-xs font-medium text-gray-600">Au</span>
                  <Input 
                    type="date" 
                    value={filters.endDate} 
                    onChange={(e) => setFilters(f => ({...f, endDate: e.target.value}))} 
                    className="h-8 text-xs w-32 border-none shadow-none"
                  />
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    const end = new Date();
                    const start = new Date();
                    start.setDate(start.getDate() - 7);
                    setFilters(f => ({
                      ...f,
                      startDate: start.toISOString().split("T")[0],
                      endDate: end.toISOString().split("T")[0],
                    }));
                  }}
                >
                  7 derniers jours
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}