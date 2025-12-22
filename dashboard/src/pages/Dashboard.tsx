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
  RefreshCw,
  Eye,
  ShoppingCart,
  Download,
  Filter,
  Activity,
  Truck,
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
import { DashboardStats, RecentOrder, SalesTrend } from "@/types/api";
import { AllOrdersDialog } from "./AllOrdersDialog";

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

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState({
    period: "daily",
    startDate: "",
    endDate: "",
    page: 0,
  });

  const [isAllOrdersOpen, setIsAllOrdersOpen] = useState(false);

  // Initialisation des dates (30 derniers jours)
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

  const { data: recentOrdersData, isLoading: isLoadingOrders } = useQuery({
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
      description: "Revenu net des produits",
      color: "bg-blue-500",
    },
    {
      title: "Commandes Valides",
      value: stats.totalOrders || 0,
      icon: ShoppingBag,
      change: stats.trends?.orderGrowth || 0,
      description: "Excluant les annulations",
      color: "bg-green-500",
    },
    {
      title: "Frais de Livraison",
      value: formatXOF(stats.totalDeliveryRevenue || 0),
      icon: Truck,
      change: 0,
      description: "Total collecté (Zone 1-3)",
      color: "bg-orange-500",
    },
    {
      title: "Panier Moyen",
      value: formatXOF(stats.averageOrderValue || 0),
      icon: CreditCard,
      change: stats.trends?.conversionGrowth || 0,
      description: "Moyenne par client",
      color: "bg-purple-500",
    },
  ];

  const formattedTrends = (salesTrendsData?.data || []).map((d: any) => ({
    ...d,
    name: new Date(d.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
  }));

  return (
    <DashboardLayout>
      <AllOrdersDialog open={isAllOrdersOpen} onOpenChange={setIsAllOrdersOpen} filters={filters} />

      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tableau de Bord</h1>
            <p className="text-muted-foreground">Ravi de vous revoir, {user?.name || "Admin"}.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              <RefreshCw className="w-4 h-4 mr-2" /> Actualiser
            </Button>
            <Button size="sm" onClick={() => setIsAllOrdersOpen(true)}>
              <Eye className="w-4 h-4 mr-2" /> Toutes les commandes
            </Button>
          </div>
        </div>

        {/* CARTES STATISTIQUES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyStats.map((stat, i) => (
            <Card key={i} className="shadow-sm border-none">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                    <stat.icon size={20} />
                  </div>
                  {stat.change !== 0 && (
                    <Badge variant={stat.change > 0 ? "default" : "destructive"} className="text-[10px]">
                      {stat.change > 0 ? "+" : ""}{stat.change}%
                    </Badge>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {isLoadingGeneral ? <Skeleton className="h-8 w-24" /> : stat.value}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-1">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* GRAPHique ET DERNIERES VENTES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Évolution du Chiffre d'Affaires</CardTitle>
              <Activity className="text-muted-foreground w-4 h-4" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                {isLoadingSalesTrends ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ChartContainer config={chartConfig} className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={formattedTrends}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} dy={10} />
                        <YAxis axisLine={false} tickLine={false} fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="var(--color-revenue)" 
                          strokeWidth={3} 
                          dot={{ r: 4, fill: "var(--color-revenue)" }} 
                          activeDot={{ r: 6 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Dernières Ventes</CardTitle>
              <CardDescription>Journal des activités</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {isLoadingOrders ? (
                  <div className="p-4 space-y-4">
                    <Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  recentOrdersData?.content?.map((order: RecentOrder) => (
                    <div key={order.orderId} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px] font-bold">
                          {order.customerName?.charAt(0) || "C"}
                        </div>
                        <div>
                          <p className="text-xs font-bold truncate max-w-[100px]">{order.customerName}</p>
                          <p className="text-[10px] text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold">{formatXOF(order.total)}</p>
                        <Badge className={`text-[8px] px-1 h-4 ${
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FILTRES DE DATE */}
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium">Filtrer par date :</span>
            </div>
            <div className="flex gap-2">
               <Input 
                 type="date" 
                 value={filters.startDate} 
                 onChange={(e) => setFilters(f => ({...f, startDate: e.target.value}))} 
                 className="h-8 text-xs w-32"
               />
               <Input 
                 type="date" 
                 value={filters.endDate} 
                 onChange={(e) => setFilters(f => ({...f, endDate: e.target.value}))} 
                 className="h-8 text-xs w-32"
               />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}