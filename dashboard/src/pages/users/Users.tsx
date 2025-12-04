import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, Edit, Trash2, Plus, Users2, Mail, User } from "lucide-react";
import { toast } from "sonner";

import { apiClient } from "@/lib/api";
import { User as UserType } from "@/models/UsersDTO";
import UserModal from "./UsersModal";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<any, any>({
    queryKey: ["users", page, pageSize, searchQuery],
    queryFn: () => apiClient.getUsers({ 
      page: page - 1, 
      size: pageSize, 
      search: searchQuery 
    }),
  });

  console.log("🔍 Requête Utilisateurs - Page:" ,data, page, "Taille:", pageSize, "Recherche:", searchQuery);

  const users = data?.data?.content || [];
  console.log("📦 Utilisateurs récupérés:", users);
  const pagination = data?.data;

  // Create or Update Mutation
  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      console.log("🎯 MUTATION - Données utilisateur:", payload);
      
      if (selectedUser) {
        return apiClient.updateUser(selectedUser.id.toString(), payload);
      } else {
        return apiClient.createUser(payload);
      }
    },
    onSuccess: (res: any) => {
      const msg = res?.data?.message || res?.message || "Utilisateur enregistré avec succès";
      toast.success(msg);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setModalOpen(false);
      setSelectedUser(null);
    },
    onError: (e: any) => {
      console.error("❌ ERREUR MUTATION:", e);
      toast.error(e?.response?.data?.message || e.message || "Erreur lors de l'enregistrement");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteUser(id),
    onSuccess: () => {
      toast.success("Utilisateur supprimé avec succès");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      
      if (users.length === 1 && page > 1) {
        setPage(page - 1);
      }
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e.message);
    },
  });

  const handleDeleteClick = (user: UserType) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
    }
  };

  const handleEditClick = (user: UserType) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedUser(null);
    setModalOpen(true);
  };

  const handlePageChange = (newPage: number) => setPage(newPage);

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setPage(1);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'MANAGER': return 'default';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Users2 className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-500 mb-4">Impossible de charger les utilisateurs</p>
            <Button onClick={() => queryClient.refetchQueries({ queryKey: ["users"] })}>
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
            <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
            <p className="text-gray-600 mt-1">Gérez les accès et permissions des utilisateurs</p>
          </div>
          <Button 
            onClick={handleAddClick}
            className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Utilisateur
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Rechercher un utilisateur..."
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
                  Affichage de <span className="font-semibold">{(page - 1) * pageSize + 1}</span> à{" "}
                  <span className="font-semibold">
                    {Math.min(page * pageSize, pagination.totalElements)}
                  </span>{" "}
                  sur <span className="font-semibold">{pagination.totalElements}</span> utilisateurs
                </>
              ) : (
                "Aucun utilisateur trouvé"
              )}
            </span>
            
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="10">10/page</option>
              <option value="20">20/page</option>
              <option value="50">50/page</option>
            </select>
          </div>
        )}

        {/* Users Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {users.length > 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="font-semibold">Utilisateur</TableHead>
                        <TableHead className="font-semibold">Contact</TableHead>
                        <TableHead className="font-semibold">Rôle</TableHead>
                        <TableHead className="font-semibold">Date de création</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user: UserType) => (
                        <TableRow key={user.id} className="hover:bg-gray-50/50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">@{user.username}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-gray-900">
                              <Mail className="h-4 w-4" />
                              {user.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={getRoleBadgeVariant(user.role)}
                              className="capitalize"
                            >
                              {user.role.toLowerCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-500">
                              {formatDate(user.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => handleEditClick(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                onClick={() => handleDeleteClick(user)}
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
                {pagination && pagination.totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-sm text-muted-foreground">
                        Page <span className="font-semibold">{page}</span> sur{" "}
                        <span className="font-semibold">{pagination.totalPages}</span>
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
                                className="w-8 h-8 p-0 text-xs"
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
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? "Aucun utilisateur trouvé" : "Aucun utilisateur"}
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery 
                    ? "Aucun utilisateur ne correspond à votre recherche." 
                    : "Commencez par créer votre premier utilisateur."
                  }
                </p>
                <Button onClick={handleAddClick}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un utilisateur
                </Button>
              </div>
            )}
          </>
        )}

        {/* User Modal */}
        <UserModal
          opened={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
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
                Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
                <strong>{userToDelete?.name}</strong> ? Cette action est irréversible.
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