import * as React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  User,
  LogOut,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Users,
  Settings,
  Bell,
  HelpCircle,
  BarChart3,
  TrendingUp,
  CreditCard,
  Layers,
  Home,
  Briefcase,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { IconCategory2 } from "@tabler/icons-react";
import LogoMinane from '@/assets/LOGO-MINANE-STORES.avif';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types pour les éléments de navigation
interface NavItem {
  to: string;
  icon: React.ComponentType<any>;
  label: string;
  badge?: number;
}

// Groupes de navigation (version simplifiée)
const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/", icon: Home, label: "Accueil" },
  { to: "/orders", icon: Package, label: "Commandes", badge: 12 },
  { to: "/products", icon: ShoppingBag, label: "Produits", badge: 3 },
  { to: "/shop", icon: ShoppingCart, label: "Boutique" },
  { to: "/category", icon: IconCategory2, label: "Catégories" },
  { to: "/users", icon: Users, label: "Utilisateurs" },
  { to: "/profile", icon: User, label: "Profil" },
];

export function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = React.useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsLogoutDialogOpen(false);
  };

  const goToProfile = () => {
    navigate("/profile");
  };



  const goToNotifications = () => {
    navigate("/notifications");
  };

  // Vérifie si un chemin est actif
  const isPathActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <TooltipProvider>
        <aside
          className={cn(
            "fixed left-0 top-0 h-screen bg-gradient-to-b from-sidebar via-sidebar/95 to-sidebar-accent/10",
            "border-r border-sidebar-border/50 backdrop-blur-sm",
            "transition-all duration-300 ease-in-out cursor-default z-40",
            "flex flex-col",
            isCollapsed ? "w-20" : "w-64"
          )}
        >
          {/* Header avec logo */}
          <div className="p-6 border-b border-sidebar-border/50 flex-shrink-0">
            <div className={cn(
              "flex items-center gap-3 transition-all duration-300",
              isCollapsed ? "justify-center" : "justify-between"
            )}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={LogoMinane}
                    alt="Minane Stores Logo"
                    className="h-10 w-10 rounded-lg object-cover border-2 border-blue-400/30 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => navigate("/dashboard")}
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-sidebar"></div>
                </div>
                {!isCollapsed && (
                  <div>
                    <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Minane Stores
                    </h1>
                    <p className="text-xs text-sidebar-foreground/60 mt-0.5">
                      Business Suite
                    </p>
                  </div>
                )}
              </div>

              {/* Notification bell (seulement quand développé) */}
              {!isCollapsed && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer relative"
                      onClick={goToNotifications}
                    >
                      <Bell className="h-4 w-4" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        3
                      </Badge>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Profile section (seulement quand non réduit) */}
            {!isCollapsed && user && (
              <div 
                className="mt-4 p-3 bg-sidebar-accent/20 rounded-lg border border-sidebar-border/30 hover:bg-sidebar-accent/30 transition-colors cursor-pointer"
                onClick={goToProfile}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-blue-400/30">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-xs">
                      {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-sidebar-foreground/60 truncate">
                      {user.role || "Admin"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation principale - sans scroll */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isPathActive(item.to);
              
              return (
                <Tooltip key={item.to} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.to}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 relative group cursor-pointer",
                        "hover:bg-sidebar-accent/30 hover:text-sidebar-foreground",
                        isActive
                          ? "bg-blue-500/20 text-blue-400 border border-blue-400/20 shadow-lg shadow-blue-500/10"
                          : "text-sidebar-foreground/80",
                        isCollapsed ? "justify-center" : ""
                      )}
                    >
                      <div className="relative">
                        <Icon 
                          className={cn(
                            "transition-transform duration-200",
                            isActive 
                              ? "scale-110 text-blue-400" 
                              : "group-hover:scale-105 group-hover:text-blue-300"
                          )} 
                          size={20} 
                        />
                        {item.badge && (
                          <Badge className="absolute -top-1.5 -right-1.5 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between min-w-0">
                          <span className="font-medium text-sm truncate">
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs h-5 min-w-5">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {isActive && !isCollapsed && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      )}
                    </NavLink>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right" className="bg-blue-500 text-white text-sm">
                      {item.label}
                      {item.badge && (
                        <span className="ml-1 text-xs opacity-90">({item.badge})</span>
                      )}
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </nav>

          {/* Footer avec actions - position fixe en bas */}
          <div className="p-4 border-t border-sidebar-border/50 space-y-3 flex-shrink-0">
            {/* Quick Actions */}
            {/* {!isCollapsed && (
              <div className="flex gap-2 mb-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-8 cursor-pointer text-xs"
                  onClick={() => navigate("/help")}
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Aide
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 h-8 cursor-pointer text-xs"
                  onClick={goToSettings}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Paramètres
                </Button>
              </div>
            )} */}

            {/* Toggle Collapse Button */}
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size={isCollapsed ? "icon" : "default"}
                  className={cn(
                    "w-full cursor-pointer text-sidebar-foreground/70 hover:text-blue-400 hover:bg-blue-500/10",
                    "transition-all duration-200 group h-9"
                  )}
                  onClick={() => setIsCollapsed(!isCollapsed)}
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  ) : (
                    <>
                      <ChevronLeft className="h-4 w-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
                      <span className="text-sm">Réduire</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-sm">
                {isCollapsed ? "Développer" : "Réduire"}
              </TooltipContent>
            </Tooltip>

            {/* Logout Button */}
            <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size={isCollapsed ? "icon" : "default"}
                      className={cn(
                        "w-full cursor-pointer border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300",
                        "transition-all duration-200 group h-9"
                      )}
                    >
                      <LogOut className={cn("h-4 w-4", isCollapsed ? "" : "mr-2")} />
                      {!isCollapsed && (
                        <span className="text-sm">Déconnexion</span>
                      )}
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right" className="bg-red-500 text-white text-sm">
                    Déconnexion
                  </TooltipContent>
                )}
              </Tooltip>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <LogOut className="h-6 w-6 text-red-400" />
                    </div>
                    <div>
                      <DialogTitle className="text-red-400">
                        Confirmation de déconnexion
                      </DialogTitle>
                      <DialogDescription>
                        Voulez-vous vraiment vous déconnecter ?
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                
                <div className="py-4">
                  <div className="flex items-center gap-3 p-3 bg-sidebar-accent/20 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500">
                        {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user?.name || "Utilisateur"}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <DialogFooter className="flex flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsLogoutDialogOpen(false)}
                    className="flex-1 cursor-pointer"
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="flex-1 gap-2 cursor-pointer"
                  >
                    <LogOut size={16} />
                    Se déconnecter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Version info */}
            {!isCollapsed && (
              <div className="pt-3 border-t border-sidebar-border/30">
                <p className="text-xs text-center text-sidebar-foreground/50">
                  Minane Stores v1.0
                </p>
              </div>
            )}
          </div>
        </aside>
      </TooltipProvider>

      {/* Espace pour le contenu principal */}
      <div className={cn(
        "transition-all duration-300",
        isCollapsed ? "lg:ml-20" : "lg:ml-64"
      )} />
    </>
  );
}