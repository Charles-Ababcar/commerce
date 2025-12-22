import { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { 
  MapPin, Plus, Trash2, Edit, Truck, Info, 
  ChevronLeft, ChevronRight, Loader2, AlertTriangle 
} from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export default function DeliveryZones() {
  const [page, setPage] = useState(0);
  const pageSize = 6;
  
  // États pour les Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [zoneToDelete, setZoneToDelete] = useState<any>(null);
  
  const queryClient = useQueryClient();

  // 1️⃣ RÉCUPÉRATION DES DONNÉES
  const { data: response, isLoading } = useQuery({
    queryKey: ["delivery-zones", page],
    queryFn: () => apiClient.getDeliveryZones(page, pageSize),
    placeholderData: keepPreviousData, 
  });

  const zones = response?.data?.content || [];
  const totalPages = response?.data?.totalPages || 0;
  const isFirst = response?.data?.first;
  const isLast = response?.data?.last;
  const totalElements = response?.data?.totalElements || 0;

  // 2️⃣ MUTATIONS (SAVE & DELETE)
  const saveMutation = useMutation({
    mutationFn: (data: any) => 
      selectedZone 
        ? apiClient.updateDeliveryZone(selectedZone.id, data)
        : apiClient.createDeliveryZone(data),
    onSuccess: (res) => {
      toast.success(res.message || "Zone enregistrée avec succès");
      queryClient.invalidateQueries({ queryKey: ["delivery-zones"] });
      setModalOpen(false);
    },
    onError: (error: any) => toast.error(error.message || "Une erreur est survenue")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteDeliveryZone(id),
    onSuccess: (res) => {
      toast.success(res.message || "Zone supprimée définitivement");
      queryClient.invalidateQueries({ queryKey: ["delivery-zones"] });
      setDeleteDialogOpen(false);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      areas: formData.get("areas"),
      price: Number(formData.get("price")),
    };
    saveMutation.mutate(data);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Zones de Livraison</h1>
            <p className="text-gray-500">Gérez {totalElements} zones et tarifs de transport</p>
          </div>
          <Button onClick={() => { setSelectedZone(null); setModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 shadow-md">
            <Plus className="w-4 h-4 mr-2" /> Nouvelle Zone
          </Button>
        </div>

        {/* GRILLE DES ZONES */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-blue-500" /></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {zones.map((zone: any) => (
                <Card key={zone.id} className="group hover:border-blue-300 transition-all duration-300 border-t-4 border-t-blue-500 shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-500" /> {zone.name}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 font-bold">
                          {zone.price} FCFA
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 min-h-[60px]">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Quartiers couverts</p>
                      <p className="text-sm text-slate-600 line-clamp-2 italic">{zone.areas}</p>
                    </div>
                    <div className="flex gap-2 justify-end pt-2 border-t">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedZone(zone); setModalOpen(true); }} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" 
                              onClick={() => { setZoneToDelete(zone); setDeleteDialogOpen(true); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* NAVIGATION DE PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border shadow-sm mt-8">
                <p className="text-sm text-gray-500">
                  Page <span className="font-bold text-gray-900">{page + 1}</span> sur {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={isFirst}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => p + 1)}
                    disabled={isLast}
                  >
                    Suivant <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* MODAL AJOUT / ÉDITION */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                {selectedZone ? <Edit className="text-blue-600" /> : <Plus className="text-green-600" />}
                {selectedZone ? "Modifier la zone" : "Nouvelle zone"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Nom de la Zone</label>
                <Input name="name" defaultValue={selectedZone?.name} placeholder="ex: Zone 1 (Dakar Centre)" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Quartiers (Séparez par virgules)</label>
                <Input name="areas" defaultValue={selectedZone?.areas} placeholder="ex: Plateau, Médina, Fass" required />
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1"><Info size={12}/> Ces noms apparaîtront sur le checkout client</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Tarif de livraison (FCFA)</label>
                <Input name="price" type="number" defaultValue={selectedZone?.price} placeholder="2500" required className="text-lg font-bold text-green-600" />
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Annuler</Button>
                <Button type="submit" disabled={saveMutation.isPending} className="bg-blue-600 flex-1">
                  {saveMutation.isPending ? <Loader2 className="animate-spin" /> : "Enregistrer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* POPUP DE CONFIRMATION DE SUPPRESSION */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="border-red-100">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600 text-xl">
                <AlertTriangle className="h-6 w-6" />
                Suppression irréversible
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base pt-2">
                Êtes-vous sûr de vouloir supprimer la zone <span className="font-bold text-gray-900">"{zoneToDelete?.name}"</span> ?
                <br /><br />
                Les clients ne pourront plus sélectionner cette option lors de leur commande.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4">
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteMutation.mutate(zoneToDelete.id)}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Suppression..." : "Supprimer définitivement"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </DashboardLayout>
  );
}