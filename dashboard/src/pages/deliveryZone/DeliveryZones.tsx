import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"; // Import du popup de confirmation
import { MapPin, Plus, Trash2, Edit, Truck, Info, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

export default function DeliveryZones() {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // État pour le popup de suppression
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [zoneToDelete, setZoneToDelete] = useState<any>(null); // Stocke la zone en cours de suppression
  
  const queryClient = useQueryClient();

  // Fetch Zones
  const { data: response, isLoading } = useQuery({
    queryKey: ["delivery-zones"],
    queryFn: () => apiClient.getDeliveryZones(),
  });

  const zones = response?.data || [];

  // Mutation Save (Create/Update)
  const saveMutation = useMutation({
    mutationFn: (data: any) => 
      selectedZone 
        ? apiClient.updateDeliveryZone(selectedZone.id, data)
        : apiClient.createDeliveryZone(data),
    onSuccess: (response) => {
      toast.success(response.message || "Zone de livraison enregistrée");
      queryClient.invalidateQueries({ queryKey: ["delivery-zones"] });
      setModalOpen(false);
    }
  });

  // Mutation Delete
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteDeliveryZone(id),
    onSuccess: () => {
      toast.success("Zone supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ["delivery-zones"] });
      setDeleteDialogOpen(false);
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
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

  // Ouvre le popup de confirmation
  const confirmDelete = (zone: any) => {
    setZoneToDelete(zone);
    setDeleteDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Zones de Livraison</h1>
            <p className="text-gray-600">Gérez les tarifs de transport par quartier</p>
          </div>
          <Button onClick={() => { setSelectedZone(null); setModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 shadow-lg transition-all">
            <Plus className="w-4 h-4 mr-2" /> Nouvelle Zone
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-44 bg-gray-200 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zones.map((zone: any) => (
              <Card key={zone.id} className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Truck className="w-5 h-5 text-blue-500" /> {zone.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 font-bold">
                        {zone.price} FCFA
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2 items-start bg-gray-50 p-2 rounded-lg">
                    <MapPin className="w-4 h-4 mt-1 text-gray-400 shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-2 italic">{zone.areas}</p>
                  </div>
                  <div className="flex gap-2 justify-end pt-2 border-t">
                    <Button variant="ghost" size="sm" onClick={() => { setSelectedZone(zone); setModalOpen(true); }} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                      <Edit className="w-4 h-4 mr-1" /> Modifier
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" 
                            onClick={() => confirmDelete(zone)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 1. Modal Ajout/Modif */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                {selectedZone ? <Edit className="text-blue-600" /> : <Plus className="text-green-600" />}
                {selectedZone ? "Modifier la zone" : "Nouvelle zone de livraison"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Nom de la Zone</label>
                <Input name="name" defaultValue={selectedZone?.name} placeholder="ex: Zone 1 (Dakar Centre)" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Quartiers desservis</label>
                <Input name="areas" defaultValue={selectedZone?.areas} placeholder="ex: Plateau, Médina, Fass" required />
                <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Info size={14} className="text-blue-500"/> Séparez les quartiers par des virgules</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Tarif de livraison (FCFA)</label>
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

        {/* 2. Popup de confirmation de suppression (AlertDialog) */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="border-red-100">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-6 w-6" />
                Confirmer la suppression
              </AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer la zone <span className="font-bold text-gray-900">"{zoneToDelete?.name}"</span> ?
                <br /><br />
                <span className="text-red-500 text-sm font-medium">Cette action est irréversible et pourrait affecter les commandes en attente dans cette zone.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteMutation.mutate(zoneToDelete.id)}
                className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
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

// Petit composant Badge si vous ne l'avez pas
function Badge({ children, className, variant }: any) {
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{children}</span>
}