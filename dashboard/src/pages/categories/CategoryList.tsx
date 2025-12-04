import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
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
import { Search, Edit, Trash2, Eye } from "lucide-react";
import Swal from "sweetalert2";
import { CategoryResponseDTO } from "@/models/CategoryResponseDTO";
import EditCategoryModal from "./EditCategoryModal";
import ViewCategoryModal from "./ViewCategoryModal";
import CreateCategoryModal from "./CreateCategoryModal";

export default function CategoryList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewCategory, setViewCategory] = useState<CategoryResponseDTO | null>(null);
  const [editCategory, setEditCategory] = useState<CategoryResponseDTO | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryResponseDTO | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["all-categories", page, pageSize, searchQuery],
    queryFn: () => apiClient.getCategories({ page: page - 1, size: pageSize, search: searchQuery }),
  });

  const categories = data?.data?.content || [];
  const pagination = data?.data;

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setPage(1);
  };

  const handleDeleteClick = (category: CategoryResponseDTO) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      await apiClient.deleteCategory(categoryToDelete.id);
      refetch();
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      Swal.fire("Supprimé", "La catégorie a été supprimée.", "success");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catégories</h1>
          <p className="text-gray-600 mt-1">Gestion de vos catégories</p>
        </div>
        <Button
          onClick={() => setOpened(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          + Ajouter une catégorie
        </Button>
      </div>

      <CreateCategoryModal
        opened={opened}
        onClose={() => setOpened(false)}
        onCreated={refetch}
      />

      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher des catégories..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1);
          }}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="font-semibold">Nom</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">Date Création</TableHead>
                  <TableHead className="font-semibold">Date Modification</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => (
                  <TableRow key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium">{cat.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{cat.description}</TableCell>
                    <TableCell>{formatDate(cat.createdAt)}</TableCell>
                    <TableCell>{formatDate(cat.updatedAt)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => setViewCategory(cat)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
                          onClick={() => setEditCategory(cat)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDeleteClick(cat)}
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
          {pagination && categories.length > 0 && (
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
                    catégories
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
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <Button
                          key={pageNumber}
                          variant={page === pageNumber ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
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

                <span className="text-sm text-muted-foreground">
                  Page <span className="font-semibold">{page}</span> sur{" "}
                  <span className="font-semibold">{pagination.totalPages}</span>
                </span>
              </div>
            </div>
          )}

          {categories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏪</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune catégorie trouvée
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery ? "Aucun résultat pour votre recherche." : "Commencez par créer votre première catégorie."}
              </p>
              <Button
                onClick={() => setOpened(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Créer une catégorie
              </Button>
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
              Êtes-vous sûr de vouloir supprimer la catégorie{" "}
              <strong>{categoryToDelete?.name}</strong> ? Cette action est irréversible.
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
              className="flex-1 gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {viewCategory && (
        <ViewCategoryModal
          opened={!!viewCategory}
          onClose={() => setViewCategory(null)}
          category={viewCategory}
        />
      )}

      {editCategory && (
        <EditCategoryModal
          opened={!!editCategory}
          onClose={() => setEditCategory(null)}
          category={editCategory}
          onUpdated={refetch}
        />
      )}
    </DashboardLayout>
  );
}