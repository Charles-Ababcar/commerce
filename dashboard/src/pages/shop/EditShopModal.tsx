// import { useEffect, useState } from "react";
// import { Modal, Switch } from "@mantine/core";
// import { apiClient } from "@/lib/api";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";

// export default function EditShopModal({
//   opened,
//   onClose,
//   shop,
//   onUpdated,
// }: any) {
//   const [form, setForm] = useState({
//     name: shop?.name || "",
//     description: shop?.description || "",
//     address: shop?.address || "",
//     email: shop?.email || "",
//     phoneNumber: shop?.phoneNumber || "",
//     imageUrl: shop?.imageUrl || "",
//     isActive: shop?.isActive || false,
//   });

//   useEffect(() => {
//     if (shop)
//       setForm({
//         name: shop?.name,
//         description: shop.description,
//         address: shop?.address,
//         email: shop?.email,
//         phoneNumber: shop?.phoneNumber,
//         isActive: shop?.isActive,
//         imageUrl: shop?.imageUrl,
//       });
//   }, [shop]);

//   const [image, setImage] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [preview, setPreview] = useState(null);

//   const update = async () => {
//     setLoading(true);
//     try {
//       await apiClient.updateShop(shop.id, form, image || undefined);
//       onUpdated();
//       onClose();
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Modal
//       opened={opened}
//       onClose={onClose}
//       title="Modifier la boutique"
//       size="lg"
//     >
//       <div className="space-y-4">
//         <Input
//           placeholder="Nom"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />

//         <Textarea
//           placeholder="Description"
//           value={form.description}
//           onChange={(e) => setForm({ ...form, description: e.target.value })}
//         />

//         <Input
//           placeholder="Adresse"
//           value={form.address}
//           onChange={(e) => setForm({ ...form, address: e.target.value })}
//         />

//         <Input
//           placeholder="Email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />

//         <Input
//           placeholder="Téléphone"
//           value={form.phoneNumber}
//           onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
//         />

//         <Switch
//           label="Activer la boutique"
//           checked={form.isActive}
//           onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
//         />
//         {preview && (
//           <div className="mb-3">
//             <img
//               src={preview}
//               alt="Preview"
//               className="h-24 w-24 object-cover rounded"
//             />
//           </div>
//         )}

//         {form.imageUrl && (
//           <div className="mb-3">
//             <img
//               src={form.imageUrl}
//               alt="Shop"
//               className="h-24 w-24 object-cover rounded"
//             />
//           </div>
//         )}

//         <div>
//           <label className="block text-sm font-medium mb-2">Image</label>
//           <Input
//             type="file"
//             onChange={(e) => {
//               const file = e.target.files?.[0] || null;
//               setImage(file);

//               if (file) setPreview(URL.createObjectURL(file));
//             }}
//           />
//         </div>

//         <Button  onClick={update} loading={loading} className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:bg-blue-700 transition disabled:opacity-50">
//           Enregistrer
//         </Button>
//       </div>
//     </Modal>
//   );
// }


import { useEffect, useState } from "react";
import { Modal, Switch } from "@mantine/core";
import { apiClient } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner"; // Assurez-vous que 'sonner' est bien configuré pour les notifications

export default function EditShopModal({
  opened,
  onClose,
  shop,
  onUpdated,
}: any) {
  // --- HOOKS ET ÉTATS LOCAUX ---
  
  const queryClient = useQueryClient();
  
  const [form, setForm] = useState({
    name: shop?.name || "",
    description: shop?.description || "",
    address: shop?.address || "",
    email: shop?.email || "",
    phoneNumber: shop?.phoneNumber || "",
    imageUrl: shop?.imageUrl || "",
    isActive: shop?.isActive || false,
  });

  // État pour la nouvelle image (File) et l'aperçu (Preview URL)
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Synchronisation de l'état du formulaire lorsque la prop 'shop' change
  useEffect(() => {
    if (shop) {
      // Mise à jour du formulaire avec les données de la boutique
      setForm({
        name: shop.name || "",
        description: shop.description || "",
        address: shop.address || "",
        email: shop.email || "",
        phoneNumber: shop.phoneNumber || "",
        isActive: shop.isActive || false,
        imageUrl: shop.imageUrl || "",
      });
      // Réinitialisation de l'image locale et de l'aperçu lors de l'ouverture
      setImage(null);
      setPreview(null);
    }
  }, [shop]);


  // --- MUTATION POUR LA MISE À JOUR ---

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      // Sépare le fichier image des données du formulaire
      const { image, ...shopData } = payload;
console.log("🔄 Envoi des données de mise à jour de la boutique:", shopData, image);
      return apiClient.updateShop(shop.id, shopData, image);
    },
    onSuccess: (res:any) => {
        const msg = res?.message;
              console.log("✅ Succès mutation modification boutique:", res);
      // Affiche la notification de succès
      toast.success(msg);
      // Invalide le cache de la liste des boutiques pour forcer le rafraîchissement
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      
      // Déclenche la fonction du parent (si elle fait plus que l'invalidation)
      if (onUpdated) onUpdated();

      // Ferme la modale
      onClose();
    },
    onError: (e: any) => {
      console.error("❌ ERREUR MUTATION MODIFICATION BOUTIQUE:", e);
      // Affiche l'erreur du serveur
      toast.error(e?.response?.data?.message || e.message || "Erreur lors de la modification.");
    },
  });


  // --- FONCTION DE MISE À JOUR ---
  const handleUpdate = () => {
    // La mutation prend le form et l'image dans le payload
    saveMutation.mutate({ ...form, image });
  };

  // --- RENDER ---
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Modifier la boutique"
      size="lg"
    >
      <div className="space-y-4">
        <Input
          placeholder="Nom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <Input
          placeholder="Adresse"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <Input
          placeholder="Téléphone"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
        />

        <Switch
          label="Activer la boutique"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
        />

        {/* Affichage de l'aperçu (nouvelle image) ou de l'image existante */}
        {(preview || form.imageUrl) && (
          <div className="mb-3">
            <img
              // Affiche la preview si elle existe, sinon l'imageUrl du formulaire
              src={preview || form.imageUrl}
              alt="Boutique"
              className="h-24 w-24 object-cover rounded"
            />
          </div>
        )}
        {/* L'image ci-dessus gère l'affichage en combinant preview et imageUrl,
            il n'est plus nécessaire d'avoir deux blocs if séparés. */}

        <div>
          <label className="block text-sm font-medium mb-2">Image</label>
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImage(file);

              if (file) {
                setPreview(URL.createObjectURL(file));
              } else {
                 setPreview(null);
              }
            }}
          />
        </div>

        <Button 
          onClick={handleUpdate} 
          loading={saveMutation.isPending} // Utilise l'état de la mutation
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:bg-blue-700 transition disabled:opacity-50"
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </Modal>
  );
}