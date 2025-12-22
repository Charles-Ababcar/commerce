import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Plus, Trash2, Edit, Truck, Info } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/api";

export default function DeliveryZones() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<any>(null);
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
    onSuccess: () => {
      toast.success("Zone de livraison enregistrée");
      queryClient.invalidateQueries({ queryKey: ["delivery-zones"] });
      setModalOpen(false);
    }
  });

  // Mutation Delete
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.deleteDeliveryZone(id),
    onSuccess: () => {
      toast.success("Zone supprimée");
      queryClient.invalidateQueries({ queryKey: ["delivery-zones"] });
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Zones de Livraison</h1>
            <p className="text-gray-600">Gérez les tarifs de transport par quartier</p>
          </div>
          <Button onClick={() => { setSelectedZone(null); setModalOpen(true); }} className="bg-blue-600">
            <Plus className="w-4 h-4 mr-2" /> Nouvelle Zone
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zones.map((zone: any) => (
              <Card key={zone.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2 border-b">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Truck className="w-5 h-5 text-blue-500" /> {zone.name}
                    </CardTitle>
                    <span className="font-bold text-lg text-green-600">{zone.price} FCFA</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex gap-2 items-start">
                    <MapPin className="w-4 h-4 mt-1 text-gray-400 shrink-0" />
                    <p className="text-sm text-gray-600 line-clamp-3">{zone.areas}</p>
                  </div>
                  <div className="flex gap-2 justify-end pt-2">
                    <Button variant="outline" size="sm" onClick={() => { setSelectedZone(zone); setModalOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-100 hover:bg-red-50" 
                            onClick={() => deleteMutation.mutate(zone.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Ajout/Modif */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedZone ? "Modifier la zone" : "Ajouter une zone"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom de la Zone</label>
                <Input name="name" defaultValue={selectedZone?.name} placeholder="ex: Zone 1" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Quartiers desservis</label>
                <Input name="areas" defaultValue={selectedZone?.areas} placeholder="ex: Almadies, Ngor, Yoff" required />
                <p className="text-[10px] text-gray-400 flex items-center gap-1"><Info size={12}/> Séparez les quartiers par des virgules</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tarif (FCFA)</label>
                <Input name="price" type="number" defaultValue={selectedZone?.price} placeholder="2000" required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saveMutation.isPending} className="w-full">
                  {saveMutation.isPending ? "Enregistrement..." : "Confirmer"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}