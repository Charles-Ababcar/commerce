import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ImageIcon,
  Search,
  Edit,
  Trash2,
  Plus,
  Package,
  Store,
  Tag,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import ProductModal from "./ProductModal";
import { apiClient } from "@/lib/api";

import { ApiResponse, Product } from "@/models/product";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products", page, pageSize, searchQuery],
    queryFn: () =>
      apiClient
        .getProducts({
          page: page - 1,
          size: pageSize,
          search: searchQuery,
        })
        .then((res) => res as ApiResponse),
  });

  const products = data?.data?.content || [];
  const pagination = data?.data;

  // Create or Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      console.log("🎯 MUTATION - Payload reçu:", payload);

      const { image, ...productData } = payload;

      console.log("🎯 MUTATION - Données produit:", productData);
      console.log(
        "🎯 MUTATION - Image:",
        image ? `OUI (${image.name})` : "NON"
      );

      // VÉRIFICATION FINALE avant envoi
      if (!productData.priceCents || productData.priceCents <= 0) {
        throw new Error("Le prix est invalide");
      }

      if (selectedProduct) {
        return apiClient.updateProduct(
          selectedProduct.id.toString(),
          productData,
          image
        );
      } else {
        return apiClient.createProduct(productData, image);
      }
    },
    onSuccess: (res: any) => {
      const msg = res?.message || "Produit enregistré avec succès";
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setModalOpen(false);
      setSelectedProduct(null);
    },
    onError: (e: any) => {
      console.error("❌ ERREUR MUTATION:", e);
      toast.error(
        e?.response?.data?.message ||
          e.message ||
          "Erreur lors de l'enregistrement"
      );
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteProduct(id),
    onSuccess: () => {
      toast.success("Produit supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      refetch();
      // Si on supprime le dernier produit de la page, revenir à la page précédente
      if (products.length === 1 && page > 1) {
        setPage(page - 1);
      }
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e.message);
    },
  });

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id);
    }
  };

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setPage(1);
  };

  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(priceCents);
  };

  const truncateText = (text: string | null, maxLength: number) => {
    if (!text) return "Aucune description";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Package className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-500 mb-4">
              Impossible de charger les produits
            </p>
            <Button
              onClick={() =>
                queryClient.refetchQueries({ queryKey: ["products"] })
              }
            >
              Réessayer
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Produits</h1>
            <p className="text-gray-600 mt-1">
              Gérez l'inventaire de vos produits
            </p>
          </div>
          <Button
            onClick={handleAddClick}
            className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Produit
          </Button>

          <Button variant="outline" onClick={() => navigate("/attributes")}>
            <Settings2 className="w-4 h-4 mr-2" />
            Réglages Attributs
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Stats */}
        {pagination && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {pagination.totalElements > 0 ? (
                <>
                  Affichage de{" "}
                  <span className="font-semibold">
                    {(page - 1) * pageSize + 1}
                  </span>{" "}
                  à{" "}
                  <span className="font-semibold">
                    {Math.min(page * pageSize, pagination.totalElements)}
                  </span>{" "}
                  sur{" "}
                  <span className="font-semibold">
                    {pagination.totalElements}
                  </span>{" "}
                  produits
                </>
              ) : (
                "Aucun produit trouvé"
              )}
            </span>

            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="12">12/page</option>
              <option value="24">24/page</option>
              <option value="36">36/page</option>
              <option value="48">48/page</option>
            </select>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-200" />
                <CardContent className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="relative">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-48 w-full object-cover"
                          />
                        ) : (
                          <div className="h-48 flex flex-col items-center justify-center bg-gray-100">
                            <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                            <span className="text-sm text-gray-500">
                              Aucune image
                            </span>
                          </div>
                        )}

                        <Badge
                          variant="secondary"
                          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm"
                        >
                          {formatPrice(product.priceCents)}
                        </Badge>
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-semibold line-clamp-1">
                          {product.name}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="pb-3">
                        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px] mb-3">
                          {truncateText(product.description, 100)}
                        </p>

                        {/* Boutique et Catégorie */}
                        <div className="space-y-2">
                          {/* Boutique */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Store className="w-3 h-3" />
                            <span className="font-medium">Boutique:</span>
                            <span
                              className="truncate flex-1"
                              title={product.cshopResponseDTO?.name}
                            >
                              {product.cshopResponseDTO?.name || "Non assigné"}
                            </span>
                          </div>

                          {/* Catégorie */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Tag className="w-3 h-3" />
                            <span className="font-medium">Catégorie:</span>
                            <span
                              className="truncate flex-1"
                              title={product.categoryResponseDTO?.name}
                            >
                              {product.categoryResponseDTO?.name ||
                                "Non assigné"}
                            </span>
                          </div>
                        </div>

                        {/* Stock */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t">
                          <Badge
                            variant={
                              product.stock > 0 ? "default" : "destructive"
                            }
                            className="text-xs"
                          >
                            Stock: {product.stock || 0}
                          </Badge>

                          {/* Date de mise à jour */}
                          <span className="text-xs text-muted-foreground">
                            {new Date(product.updatedAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter className="flex gap-2 pt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => handleEditClick(product)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-red-50 hover:text-red-600 transition-colors"
                          onClick={() => handleDeleteClick(product)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t">
                    <div className="text-sm text-muted-foreground">
                      Page <span className="font-semibold">{page}</span> sur{" "}
                      <span className="font-semibold">
                        {pagination.totalPages}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
                        Précédent
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, pagination.totalPages) },
                          (_, i) => {
                            const pageNumber = i + 1;
                            return (
                              <Button
                                key={pageNumber}
                                variant={
                                  page === pageNumber ? "default" : "outline"
                                }
                                size="sm"
                                className="w-8 h-8 p-0 text-xs"
                                onClick={() => handlePageChange(pageNumber)}
                              >
                                {pageNumber}
                              </Button>
                            );
                          }
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= pagination.totalPages}
                      >
                        Suivant
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📦</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? "Aucun produit trouvé" : "Aucun produit"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery
                    ? "Aucun produit ne correspond à votre recherche."
                    : "Commencez par créer votre premier produit."}
                </p>
                <Button onClick={handleAddClick}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un produit
                </Button>
              </div>
            )}
          </>
        )}

        {/* Product Modal */}
        <ProductModal
          opened={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
          onSubmit={saveMutation.mutate}
          isLoading={saveMutation.isPending}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Confirmation de suppression
              </DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer le produit{" "}
                <strong>{productToDelete?.name}</strong> ? Cette action est
                irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-row justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="flex-1 gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {deleteMutation.isPending ? "Suppression..." : "Supprimer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
