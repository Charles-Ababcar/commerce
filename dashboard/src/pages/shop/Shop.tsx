import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import CreateShopModal from "./CreateShopModal";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, Eye, Plus } from "lucide-react";
import { toast } from "sonner";
import ViewShopModal from "./ViewShopModal";
import EditShopModal from "./EditShopModal";

// Assurez-vous que l'interface Shop est définie quelque part ou utilisez 'any'
type ShopType = any;
type ApiResponse = any; // Définissez votre structure de réponse API

export default function Shop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false); 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewShop, setViewShop] = useState<ShopType | null>(null);
  const [editShop, setEditShop] = useState<ShopType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shopToDelete, setShopToDelete] = useState<ShopType | null>(null);

  const queryClient = useQueryClient();

  // --- QUERY pour Lister les Boutiques ---
  const { data, isLoading, refetch } = useQuery<ApiResponse>({
    queryKey: ["shops", page, pageSize, searchQuery],
    queryFn: () =>
      apiClient.getShop({
        page: page - 1,
        size: pageSize,
        search: searchQuery,
      }),
  });

  const shops: ShopType[] = data?.data?.content || [];
  const pagination = data?.data;

  // --- MUTATION pour la Suppression ---
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteShop(id),
    onSuccess: (res: any) => {
      const msg = res?.data?.message || "Boutique supprimée avec succès.";
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      setDeleteDialogOpen(false);
      setShopToDelete(null);
      refetch();
      // Réduire la page si la dernière boutique de la page est supprimée
      if (shops.length === 1 && page > 1) {
        setPage(page - 1);
      }
    },
    onError: (e: any) => {
      console.error("❌ ERREUR SUPPRESSION:", e);
      toast.error(
        e?.response?.data?.message ||
          e.message ||
          "Erreur lors de la suppression."
      );
    },
  });

  // --- Fonctions de Gestion ---

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setPage(1);
  };

  const handleDeleteClick = (shop: ShopType) => {
    setShopToDelete(shop);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (shopToDelete) {
      deleteMutation.mutate(shopToDelete.id);
    }
  };



  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Boutiques</h1>
          <p className="text-gray-600 mt-1">
            Gestion de vos boutiques et points de vente
          </p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)} 
          className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une boutique
        </Button>
      </div>
      {/* Modale de Création : Rendu conditionnel (aucune icône ni style ici) */}
           {" "}
      {createModalOpen && (
        <CreateShopModal
          opened={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
           onCreated={refetch}
        />
      )}
      {/* Barre de Recherche */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher des boutiques..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="pl-10"
        />
      </div>
      {/* Affichage des données (Tableau et Pagination) */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Tableau */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Boutique</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shops.map((shop) => (
                  <TableRow
                    key={shop.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200"
                            src={shop.imageUrl || "/placeholder-shop.jpg"}
                            alt={shop.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {shop.name}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">
                            {shop.description}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{shop.email}</div>
                      <div className="text-sm text-gray-500">
                        {shop.phoneNumber}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {shop.address}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={shop.isActive ? "default" : "secondary"}
                        className={`rounded-full px-3 py-1 ${
                          shop.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {shop.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => setViewShop(shop)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() => setEditShop(shop)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDeleteClick(shop)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && shops.length > 0 && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Affichage de{" "}
                    <span className="font-semibold">
                      {(page - 1) * pageSize + 1}-
                      {Math.min(page * pageSize, pagination.totalElements)}
                    </span>{" "}
                    sur{" "}
                    <span className="font-semibold">
                      {pagination.totalElements}
                    </span>{" "}
                    boutiques
                  </span>

                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="5">5/page</option>
                    <option value="10">10/page</option>
                    <option value="20">20/page</option>
                    <option value="50">50/page</option>
                  </select>
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
                            className="w-8 h-8 p-0"
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

                <span className="text-sm text-muted-foreground hidden sm:block">
                  Page <span className="font-semibold">{page}</span> sur{" "}
                  <span className="font-semibold">{pagination.totalPages}</span>
                </span>
              </div>
            </div>
          )}

          {/* État vide */}
          {shops.length === 0 && !searchQuery && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏪</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune boutique trouvée
              </h3>
              <p className="text-gray-500 mb-4">
                Commencez par créer votre première boutique.
              </p>
              <Button
                onClick={() => setCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Créer une boutique
              </Button>
            </div>
          )}
          {shops.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun résultat pour "{searchQuery}"
              </h3>
              <p className="text-gray-500 mb-4">
                Veuillez essayer une autre recherche.
              </p>
            </div>
          )}
        </div>
      )}
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Confirmation de suppression
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la boutique{" "}
              <strong>{shopToDelete?.name}</strong> ? Cette action est
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
      {/* Modale de Consultation */}
      <ViewShopModal
        opened={!!viewShop}
        onClose={() => setViewShop(null)}
        shop={viewShop}
      />
      {/* Modale de Modification */}
      <EditShopModal
        opened={!!editShop}
        onClose={() => setEditShop(null)}
        shop={editShop}
         onUpdated={refetch}
      />
    </DashboardLayout>
  );
}
