import {
  ShoppingCart,
  Search,
  User,
  Menu,
  Home,
  Store,
  Package,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";
import { useState, useEffect } from "react";
import { useCartCount } from "@/hooks/useCart";
import logo from "@/assets/LOGO-MINANE-STORES.avif";

export const Header = () => {
  const [search, setSearch] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const cartCount = useCartCount();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Composant pour les liens du menu mobile qui ferment automatiquement le menu
  const MobileNavLink = ({ to, icon: Icon, children }) => (
    <SheetClose asChild>
      <Link
        to={to}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/80 hover:text-foreground hover:bg-primary/5 transition-all group w-full"
      >
        <Icon className="h-4 w-4" />
        <span className="font-medium">{children}</span>
      </Link>
    </SheetClose>
  );

  // Navigation pour desktop
  const DesktopNavLinks = () => (
    <>
      <Link
        to="/"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-primary/5 transition-all group"
      >
        <Home className="h-4 w-4" />
        <span className="font-medium">Accueil</span>
      </Link>
      <Link
        to="/products"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-primary/5 transition-all group"
      >
        <Package className="h-4 w-4" />
        <span className="font-medium">Produits</span>
      </Link>
      <Link
        to="/shops"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-primary/5 transition-all group"
      >
        <Store className="h-4 w-4" />
        <span className="font-medium">Boutiques</span>
      </Link>
    </>
  );

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-background/90 backdrop-blur-sm'
    }`}>
      <div className="container flex h-16 items-center justify-between">
        {/* Section gauche avec logo et texte */}
        <div className="flex-1 flex items-center justify-start">
          <Link to="/" className="flex items-center gap-3">
            {/* Logo */}
            <img 
              src={logo} 
              alt="Logo Minane Business" 
              className="h-9 w-auto object-contain filter brightness-110 contrast-110 md:h-10" 
            />
            
            {/* Texte */}
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent md:text-xl">
                Minane Business
              </span>
            </div>
          </Link>
          
          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-2 ml-8 lg:ml-12">
            <DesktopNavLinks />
          </nav>
        </div>

        {/* Section droite avec recherche et icônes */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Barre de recherche - cachée sur mobile */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm justify-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher des produits..." 
                className="pl-9 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Icônes */}
          <div className="flex items-center gap-2">
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-in zoom-in-50"
                  >
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Link to="/auth">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Menu burger pour mobile */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="mt-8 space-y-6">
                  {/* Logo dans le menu mobile */}
                  <div className="flex items-center gap-3 pb-6">
                    <img 
                      src={logo} 
                      alt="Logo Minane Business" 
                      className="h-10 w-auto object-contain" 
                    />
                    <div className="flex flex-col">
                      <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Minane Business
                      </span>
                    </div>
                  </div>

                  {/* Navigation mobile avec liens qui ferment le menu */}
                  <nav className="space-y-2">
                    <MobileNavLink to="/" icon={Home}>
                      Accueil
                    </MobileNavLink>
                    <MobileNavLink to="/products" icon={Package}>
                      Produits
                    </MobileNavLink>
                    <MobileNavLink to="/shops" icon={Store}>
                      Boutiques
                    </MobileNavLink>
                  </nav>
                  
                  <div className="pt-4 border-t">
                    {/* Barre de recherche mobile */}
                    <div className="mb-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Rechercher..." 
                          className="pl-9"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    {/* Boutons d'action mobile */}
                    <div className="space-y-2">
                      <SheetClose asChild>
                        <Link to="/cart">
                          <Button variant="outline" className="w-full justify-start gap-3">
                            <ShoppingCart className="h-4 w-4" />
                            Panier
                            {cartCount > 0 && (
                              <Badge variant="secondary" className="ml-auto">
                                {cartCount}
                              </Badge>
                            )}
                          </Button>
                        </Link>
                      </SheetClose>
                      
                      <SheetClose asChild>
                        <Link to="/auth">
                          <Button variant="outline" className="w-full justify-start gap-3">
                            <User className="h-4 w-4" />
                            Mon compte
                          </Button>
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      
      {/* Barre de recherche mobile - en dessous */}
      <div className="md:hidden container pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
};