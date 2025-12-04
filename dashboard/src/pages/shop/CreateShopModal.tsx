import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

const schema = z.object({
  name: z.string().min(1, "Nom obligatoire"),
  email: z.string().email("Email invalide"),
  phoneNumber: z.string().min(1, "Téléphone obligatoire"),
  address: z.string().min(1, "Adresse obligatoire"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export default function CreateShopModal({ opened, onClose, onCreated }) {
  const queryClient = useQueryClient();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      description: "",
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: { data: any; image?: File }) =>
      apiClient.createShop(payload.data, payload.image),

    onSuccess: (res) => {
      toast.success(res?.message || "Boutique créée !");
      queryClient.invalidateQueries({ queryKey: ["shops"] });
      onCreated?.();
      onClose();
      form.reset();
      setSelectedImage(null);
      setPreviewUrl(null);
    },

    onError: (e: any) => {
      console.log(e?.response?.message);
      
      toast.error(e?.response?.message || "Erreur lors de la création.");
    },
  });

  const onSubmit = (values) => {
    createMutation.mutate({
      data: values,
      image: selectedImage ?? undefined,
    });
  };

  return (
    <Dialog open={opened} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-2xl">
    <DialogHeader>
      <DialogTitle>Créer une boutique</DialogTitle>
    </DialogHeader>

    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Colonne de gauche */}
          <div className="space-y-4">
            {/* Champ NOM */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de la boutique" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champ EMAIL */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champ Telephone */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="770000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Colonne de droite */}
          <div className="space-y-4">
            {/* Champ Adresse */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Adresse complète..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Champ Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="h-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Description de la boutique..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section en bas : Activer la boutique + Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Option Activer la boutique */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Activer la boutique</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Si cette option est désactivée, la boutique ne sera pas visible.
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Image optionnelle */}
          <div className="space-y-2">
            <FormLabel>Image (optionnelle)</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setSelectedImage(file);

                if (file) {
                  const preview = URL.createObjectURL(file);
                  setPreviewUrl(preview);
                } else {
                  setPreviewUrl(null);
                }
              }}
            />

            {previewUrl && (
              <div className="flex justify-center mt-2">
                <img
                  src={previewUrl}
                  alt="Aperçu"
                  className="w-32 h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Création..." : "Créer"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  </DialogContent>
</Dialog>
  );
}
