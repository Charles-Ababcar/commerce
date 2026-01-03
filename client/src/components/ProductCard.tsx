
import { Star, ShoppingCart, Store, Heart, Loader2 } from 'lucide-react';import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';
import { Product } from '@/models/Product';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isWishlist, setIsWishlist] = useState(false);
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) return;
    
    try {
      await addToCart(Number(product.id), 1);
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlist(!isWishlist);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  return (
    <Link to={`/products/${product.id}`} className="block h-full">
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border-2 hover:border-primary/10">
        <CardContent className="p-5 flex-1">
          {/* Header avec catégorie et boutique */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="text-xs font-medium">
              {product?.categoryResponseDTO?.name}
            </Badge>
            {product.cshopResponseDTO && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Store className="h-3.5 w-3.5" />
                <span className="max-w-[100px] truncate font-medium">
                  {product.cshopResponseDTO.name}
                </span>
              </div>
            )}
          </div>

          {/* Image du produit */}
          <div className="aspect-square overflow-hidden bg-muted relative rounded-lg mb-4">
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Badge de catégorie */}
            <Badge 
              variant="secondary" 
              className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm"
            >
              {product.categoryResponseDTO?.name}
            </Badge>
            
            {/* Bouton favori */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-9 w-9 bg-background/80 backdrop-blur-sm hover:bg-background shadow-sm"
              onClick={handleWishlist}
            >
              <Heart 
                className={`h-4.5 w-4.5 transition-colors ${
                  isWishlist ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                }`} 
              />
            </Button>

            {/* Overlay rupture de stock */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                <Badge variant="destructive" className="text-sm py-1.5 px-3 font-semibold">
                  Rupture de stock
                </Badge>
              </div>
            )}
          </div>

          {/* Informations du produit */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
              {product.name}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">
              {product.description}
            </p>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm font-semibold">{product.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({Math.round(product.rating * 10)} avis)
              </span>
            </div>
          </div>

          {/* Prix et stock */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.priceCents)} FCFA
              </span>
              {product.priceCents && product.priceCents > product.priceCents && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.priceCents)} FCFA
                </span>
              )}
            </div>
            
            <div className="text-right">
              {product.stock > 0 ? (
                <span className={`text-xs font-medium ${
                  product.stock > 10 ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {product.stock > 10 ? 'En stock' : `${product.stock} restant(s)`}
                </span>
              ) : (
                <span className="text-xs text-destructive font-medium">Rupture</span>
              )}
            </div>
          </div>
        </CardContent>
        
        {/* Bouton d'ajout au panier */}
        <CardFooter className="p-5 pt-0">
          <Button 
            variant="hero" 
            className="w-full h-12 text-base font-semibold shadow-sm hover:shadow-md transition-shadow"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 mr-2 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4.5 w-4.5 mr-2" />
                {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};