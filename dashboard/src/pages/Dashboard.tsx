import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  DollarSign,
  ShoppingBag,
  Users,
  CreditCard,
  Package,
  TrendingUp,
  TrendingDown,
  User,
  Calendar,
  Store,
  BarChart3,
  RefreshCw,
  Eye,
  ShoppingCart,
  Download,
  Filter,
  Activity,
  Target,
} from "lucide-react";
import { apiClient } from "@/lib/api";
import {
  Bar,
  BarChart,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DashboardStats,
  RecentOrder,
  SalesTrend,
  TopProduct,
} from "@/types/api";
import FileSaver from "file-saver";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AllOrdersDialog } from "./AllOrdersDialog";

// Fonction pour obtenir le numéro de semaine
const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Formatage FCFA
const formatXOF = (amount: number | any) => {
  const amountNumber = typeof amount === "number" ? amount : Number(amount);
  return new Intl.NumberFormat("fr-SN", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountNumber);
};

// Formatage nombre FCFA sans devise
const formatXOFNumber = (amount: number | any) => {
  const amountNumber = typeof amount === "number" ? amount : Number(amount);
  return new Intl.NumberFormat("fr-SN").format(Math.round(amountNumber));
};

// Formatage de date
const formatDate = (dateString: string | any) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Formatage date avec heure
const formatDateTime = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Couleurs pour les graphiques
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const MONTHS_FR = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState({
    period: "daily",
    dateRange: "30days",
    startDate: "",
    endDate: "",
    page: 0,
    size: 10,
  });

  const [isFullReportOpen, setIsFullReportOpen] = useState(false);
  const [isAllOrdersOpen, setIsAllOrdersOpen] = useState(false);
  const [isAllProductsOpen, setIsAllProductsOpen] = useState(false);

  // Date par défaut - dernier mois
  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    setFilters((prev) => ({
      ...prev,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    }));
  }, []);

  // Définir cette fonction à utiliser dans le bouton
  const openFullReport = () => {
    setIsFullReportOpen(true);
  };

  // OUVREZ LE DIALOG POUR TOUTES LES COMMANDES
  const openAllOrders = () => {
    setIsAllOrdersOpen(true);
  };

  // OUVREZ LE DIALOG POUR TOUS LES PRODUITS
  const openAllProducts = () => {
    setIsAllProductsOpen(true);
  };

  // Données du dashboard
  const {
    data: generalData,
    isLoading: isLoadingGeneral,
    error: generalError,
  } = useQuery<DashboardStats>({
    queryKey: ["dashboardGeneral", filters],
    queryFn: () =>
      apiClient.getGeneralDashboard({
        startDate: filters.startDate ? new Date(filters.startDate) : undefined,
        endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      }),
    retry: 1,
  });

  // Commandes récentes
  const {
    data: recentOrdersData,
    isLoading: isLoadingOrders,
    error: ordersError,
  } = useQuery<{ content?: RecentOrder[]; totalElements?: number }>({
    queryKey: ["dashboardRecentOrders", filters.page, filters.size],
    queryFn: () =>
      apiClient.getRecentOrders({
        page: filters.page,
        size: filters.size,
      }),
    retry: 1,
  });

  // Produits populaires
  const {
    data: topProductsData,
    isLoading: isLoadingTopProducts,
    error: productsError,
  } = useQuery<{ content?: TopProduct[]; totalElements?: number }>({
    queryKey: ["dashboardTopProducts", filters],
    queryFn: () =>
      apiClient.getTopProducts({
        page: filters.page,
        size: filters.size,
        startDate: filters.startDate ? new Date(filters.startDate) : undefined,
        endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      }),
    retry: 1,
  });

  // Tendances
  const {
    data: salesTrendsData,
    isLoading: isLoadingSalesTrends,
    error: trendsError,
  } = useQuery<{ data?: SalesTrend[] }>({
    queryKey: ["dashboardSalesTrends", filters],
    queryFn: () =>
      apiClient.getSalesTrends({
        type: filters.period,
        startDate: filters.startDate ? new Date(filters.startDate) : undefined,
        endDate: filters.endDate ? new Date(filters.endDate) : undefined,
      }),
    retry: 1,
  });

  // Statistiques principales - données du backend avec fallback
  const statsData = generalData?.data || generalData || {};

  const keyStats = [
    {
      title: "Revenu Total",
      value: formatXOF(statsData.totalRevenue || 0),
      icon: DollarSign,
      isLoading: isLoadingGeneral,
      change: statsData.trends?.revenueGrowth || 12.5,
      description: "vs période précédente",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      title: "Commandes",
      value: statsData.totalOrders || "0",
      icon: ShoppingBag,
      isLoading: isLoadingGeneral,
      change: statsData.trends?.orderGrowth || 8.2,
      description: "nouvelles commandes",
      color: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      title: "Clients",
      value: statsData.totalCustomers || "0",
      icon: Users,
      isLoading: isLoadingGeneral,
      change: statsData.trends?.customerGrowth || 15.3,
      description: "nouveaux clients",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      title: "Panier Moyen",
      value: formatXOF(statsData.averageOrderValue || 0),
      icon: CreditCard,
      isLoading: isLoadingGeneral,
      change: statsData.trends?.conversionGrowth || 4.7,
      description: "par commande",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
  ];

  // Métriques de performance
  const performanceMetrics = [
    {
      label: "Taux de conversion",
      value: `${(statsData.conversionRate || 0).toFixed(1)}%`,
      target: "8%",
      progress: Math.min(((statsData.conversionRate || 0) / 8) * 100, 100),
    },
    { label: "Satisfaction client", value: "94%", target: "95%", progress: 94 },
    { label: "Temps de réponse", value: "2.1h", target: "1.5h", progress: 70 },
    { label: "Rotation stocks", value: "4.2x", target: "4.5x", progress: 85 },
  ];

  // Préparation des données pour les graphiques
  const trendsArray = salesTrendsData?.data || [];

  const formattedSalesTrends = trendsArray.map((d: SalesTrend) => {
    const date = d.date ? new Date(d.date) : new Date();
    return {
      ...d,
      revenue: d.revenue || 0,
      name:
        filters.period === "monthly"
          ? MONTHS_FR[date.getMonth()]
          : filters.period === "weekly"
          ? `Sem ${getWeekNumber(date)}`
          : date.getDate().toString(),
    };
  });

  // Configuration des graphiques
  const chartConfig = {
    revenue: { label: "Revenu", color: CHART_COLORS[0] },
    sales: { label: "Ventes", color: CHART_COLORS[1] },
    customers: { label: "Clients", color: CHART_COLORS[2] },
  };

  const resetFilters = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    setFilters({
      period: "daily",
      dateRange: "30days",
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      page: 0,
      size: 10,
    });
  };

  const exportData = async () => {
    console.log("Exporting data...");
    const today = new Date();
    const fileName = `RapportComplet-${today.getDate()}-${
      today.getMonth() + 1
    }-${today.getFullYear()}.xlsx`;

    try {
      // Implémentez l'export ici
      console.log("Exportation réussie en", fileName);
    } catch (error) {
      console.error("Erreur lors de l'exportation:", error);
    }
  };

  // Afficher les erreurs en console pour debug
  useEffect(() => {
    if (generalError) console.error("Erreur dashboard général:", generalError);
    if (ordersError) console.error("Erreur commandes:", ordersError);
    if (productsError) console.error("Erreur produits:", productsError);
    if (trendsError) console.error("Erreur tendances:", trendsError);
  }, [generalError, ordersError, productsError, trendsError]);

  // Calculer le total des ventes pour les produits
  const totalProductsSold =
    topProductsData?.content?.reduce(
      (sum, product) => sum + (product.totalSold || 0),
      0
    ) || 0;

  return (
    <DashboardLayout>
      <Dialog open={isFullReportOpen} onOpenChange={setIsFullReportOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rapport Complet des Commandes</DialogTitle>
            <DialogDescription>
              Liste complète et détaillée des commandes pour la période
              sélectionnée.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <p>Rapport complet en cours de développement...</p>
          </div>
        </DialogContent>
      </Dialog>

      <AllOrdersDialog
        open={isAllOrdersOpen}
        onOpenChange={setIsAllOrdersOpen}
        filters={filters}
      />

      {/* Dialog pour tous les produits */}
      <Dialog open={isAllProductsOpen} onOpenChange={setIsAllProductsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tous les Produits</DialogTitle>
            <DialogDescription>
              Liste complète des produits et de leurs performances
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <p>Fonctionnalité en cours de développement...</p>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {/* Header avec salutation personnalisée */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Tableau de Bord
                </h1>
                <p className="text-muted-foreground mt-1">
                  {user
                    ? `Bon retour, ${user.name || user.email}!`
                    : "Bienvenue sur votre tableau de bord"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button size="sm" onClick={openFullReport}>
              <Eye className="w-4 h-4 mr-2" />
              Voir rapport complet
            </Button>
          </div>
        </div>

        {/* Affichage des erreurs */}
        {(generalError || ordersError || productsError || trendsError) && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-700">
                <span className="font-medium">Erreur de chargement :</span>
                <span className="text-sm">
                  {generalError?.message ||
                    ordersError?.message ||
                    productsError?.message ||
                    trendsError?.message ||
                    "Une erreur est survenue"}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs pour différentes vues */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Ventes
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Produits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Cartes de statistiques principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {keyStats.map((stat, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          {stat.title}
                        </p>
                        {stat.isLoading ? (
                          <Skeleton className="h-8 w-32 mb-2" />
                        ) : (
                          <h3 className="text-2xl font-bold mb-2">
                            {stat.value}
                          </h3>
                        )}
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              stat.change > 0 ? "default" : "destructive"
                            }
                            className="gap-1"
                          >
                            {stat.change > 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {stat.change > 0 ? "+" : ""}
                            {stat.change}%
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {stat.description}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`p-3 rounded-lg ${stat.color} text-white`}
                      >
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Graphiques et métriques */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Graphique des tendances */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Performance des Ventes</CardTitle>
                    <CardDescription>
                      Tendance des revenus sur la période
                    </CardDescription>
                  </div>
                  <Select
                    value={filters.period}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, period: value }))
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
                  {isLoadingSalesTrends ? (
                    <div className="h-[300px] w-full bg-muted animate-pulse rounded-lg" />
                  ) : formattedSalesTrends.length > 0 ? (
                    <ChartContainer
                      config={chartConfig}
                      className="h-[300px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedSalesTrends}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-muted"
                          />
                          <XAxis
                            dataKey="name"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <YAxis
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                          />
                          <ChartTooltip
                            content={<ChartTooltipContent />}
                            formatter={(value: unknown) => {
                              const num =
                                typeof value === "number"
                                  ? value
                                  : Number(value || 0);
                              return [`${formatXOFNumber(num)} FCFA`, "Revenu"];
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke={CHART_COLORS[0]}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mb-2 opacity-50" />
                      <p>Aucune donnée disponible</p>
                      <p className="text-sm mt-1">
                        Les données de tendances seront bientôt disponibles
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Métriques de performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Métriques Clés</CardTitle>
                  <CardDescription>Indicateurs de performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          {metric.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{metric.value}</span>
                          <Badge variant="outline" className="text-xs">
                            Objectif: {metric.target}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={metric.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Grille inférieure */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Commandes récentes */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Commandes Récentes</CardTitle>
                    <CardDescription>
                      Dernières activités commerciales
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {recentOrdersData?.totalElements || 0} commandes totales
                  </Badge>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoadingOrders ? (
                    <div className="space-y-4 p-6">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : recentOrdersData?.content &&
                    recentOrdersData.content.length > 0 ? (
                    <div className="divide-y">
                      {recentOrdersData.content
                        .slice(0, 5)
                        .map((order: RecentOrder) => (
                          <div
                            key={order.orderId}
                            className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <ShoppingBag className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {order.orderNumber || `CMD-${order.orderId}`}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {order.customerName || "Client"} •{" "}
                                  {formatDateTime(order.createdAt)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">
                                {formatXOF(order.total || 0)}
                              </p>
                              <Badge
                                variant="outline"
                                className={`
    mt-1 text-xs
    ${
      order.status === "DELIVERED"
        ? "bg-green-100 text-green-800 border-green-200"
        : order.status === "PENDING"
        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
        : order.status === "CANCELLED"
        ? "bg-red-100 text-red-800 border-red-200"
        : "bg-blue-100 text-blue-800 border-blue-200"
    }
  `}
                              >
                                {order.status || "PLACED"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-muted-foreground">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Aucune commande récente</p>
                      <p className="text-sm mt-1">
                        Les nouvelles commandes apparaîtront ici
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={openAllOrders}
                  >
                    Voir toutes les commandes
                  </Button>
                </CardFooter>
              </Card>

              {/* Produits populaires */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Produits Populaires</CardTitle>
                    <CardDescription>
                      Les plus vendus cette période
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {totalProductsSold} ventes totales
                  </Badge>
                </CardHeader>
                <CardContent>
                  {isLoadingTopProducts ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-12 w-12 rounded-md" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : topProductsData?.content &&
                    topProductsData.content.length > 0 ? (
                    <div className="space-y-4">
                      {topProductsData.content
                        .slice(0, 5)
                        .map((product: TopProduct, index: number) => (
                          <div
                            key={product.productId || index}
                            className="flex items-center gap-3"
                          >
                            <div className="flex-shrink-0">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.productName}
                                  className="w-10 h-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                                  <span className="font-bold text-primary">
                                    {index + 1}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {product.productName || "Produit sans nom"}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{product.totalSold || 0} vendu(s)</span>
                                <span>•</span>
                                <span className="font-semibold">
                                  {formatXOF(product.totalRevenue || 0)}
                                </span>
                                {product.categoryName && (
                                  <>
                                    <span>•</span>
                                    <span>{product.categoryName}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            {product.totalSold &&
                              topProductsData.content &&
                              topProductsData.content[0]?.totalSold && (
                                <Progress
                                  value={
                                    (product.totalSold /
                                      (topProductsData.content[0]?.totalSold ||
                                        1)) *
                                    100
                                  }
                                  className="w-16 h-2"
                                />
                              )}
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Aucun produit vendu cette période</p>
                      <p className="text-sm mt-1">
                        Les ventes de produits apparaîtront ici
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={openAllProducts}
                  >
                    Voir tous les produits
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytique des Ventes</CardTitle>
                <CardDescription>
                  Analyse détaillée des performances commerciales
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <ShoppingCart className="w-16 h-16 opacity-50" />
                  <p>Fonctionnalité en développement</p>
                  <p className="text-sm">Bientôt disponible</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyse Clients</CardTitle>
                <CardDescription>
                  Comportement et segmentation des clients
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <Users className="w-16 h-16 opacity-50" />
                  <p>Fonctionnalité en développement</p>
                  <p className="text-sm">Bientôt disponible</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Produits</CardTitle>
                <CardDescription>
                  Analyse des performances par produit
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                  <Package className="w-16 h-16 opacity-50" />
                  <p>Fonctionnalité en développement</p>
                  <p className="text-sm">Bientôt disponible</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Filtres avancés */}
        <Card className="bg-gradient-to-r from-muted/50 to-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtres avancés</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, dateRange: value }))
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">7 derniers jours</SelectItem>
                    <SelectItem value="30days">30 derniers jours</SelectItem>
                    <SelectItem value="90days">90 derniers jours</SelectItem>
                    <SelectItem value="year">Cette année</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="w-[140px]"
                  />
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="w-[140px]"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Note informative */}
        <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800">
                Objectif du mois
              </p>
              <p className="text-sm text-blue-700">
                Vous avez atteint <span className="font-bold">78%</span> de
                votre objectif de vente mensuel. Continuez sur cette lancée !
              </p>
              <div className="mt-2">
                <Progress value={78} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
