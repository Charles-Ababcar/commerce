import { useEffect, useState } from "react";
import { Modal } from "@mantine/core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { Shop } from "@/models/Shop";
import { Category } from "@/models/Category";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";

interface ProductModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  product: any;
  isLoading?: boolean;
}

interface FormData {
  name: string;
  description: string;
  priceCents: number | string;
  stock: number;
  categoryId: number | null;
  shopId: number | null;
  isActive: boolean;
  colorIds: number[]; 
  sizeIds: number[];  
}

export default function ProductModal({
  opened,
  onClose,
  onSubmit,
  product,
  isLoading = false,
}: ProductModalProps) {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // 1. Récupération des données référentielles
    const { data: colorsRes } = useQuery({ queryKey: ["colors"], queryFn: () => apiClient.getColors() });
    const { data: sizesRes } = useQuery({ queryKey: ["sizes"], queryFn: () => apiClient.getSizes() });

    const colors = colorsRes?.data || [];
    const sizes = sizesRes?.data || [];

  // Initialisation du formulaire avec react-hook-form
  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      priceCents: "",
      stock: 0,
      categoryId: null,
      shopId: null,
      isActive: true,
      colorIds: [], 
      sizeIds: [],  
    },
  });

  // Observer les valeurs du formulaire pour valider en temps réel
  const formValues = form.watch();
  const { name, priceCents, stock } = formValues;

  // Validation des champs obligatoires (description n'est pas obligatoire)
  const isFormValid = () => {
    // Validation du nom
    const isNameValid = name && name.trim().length > 0;
    
    // Validation du prix
    let isPriceValid = false;
    try {
      const priceValue = Number(priceCents);
      isPriceValid = !isNaN(priceValue) && priceValue > 0;
    } catch {
      isPriceValid = false;
    }
    
    // Validation du stock
    const isStockValid = stock >= 0;
    
    // Validation de l'image (obligatoire uniquement pour la création)
    const isCreation = !product;
    const isImageValid = !isCreation || (isCreation && image !== null);
    
    return isNameValid && isPriceValid && isStockValid && isImageValid;
  };

  // État du bouton de soumission
  const isSubmitDisabled = !isFormValid() || isLoading;

  // ---- Requêtes dynamiques ----
  const { data: categoriesData } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.getCategories({ page: 0, size: 999 }),
  });

  const categories = categoriesData?.data?.content || [];

  const { data: shopsData } = useQuery({
    queryKey: ["shops"],
    queryFn: () => apiClient.getShop({ page: 0, size: 999 }),
  });

  const shops = shopsData?.data?.content || [];

  // ---- Pré-remplissage si update ----
  useEffect(() => {
    if (product) {
      console.log("🔄 Product data:", product);
      form.reset({
        name: product.name || "",
        description: product.description || "",
        priceCents: product.priceCents || "",
        categoryId: product.categoryResponseDTO?.id || product.category?.id || null,
        shopId: product.cshopResponseDTO?.id || product.shop?.id || null,
        stock: product.stock || 0,
        isActive: product.isActive !== undefined ? product.isActive : true,
        colorIds: product.availableColors?.map((c: any) => c.id) || [],
        sizeIds: product.availableSizes?.map((s: any) => s.id) || [],
      });
      
      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
      } else {
        setImagePreview(null);
      }
      setImage(null);
    } else {
      // Reset pour la création
      form.reset({
        name: "",
        description: "",
        priceCents: "",
        stock: 0,
        categoryId: null,
        shopId: null,
        isActive: true,
        colorIds: [],
        sizeIds: [],
      });
      setImage(null);
      setImagePreview(null);
    }
    setHasAttemptedSubmit(false);
  }, [product, opened, form]);

  // Gérer le changement d'image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    console.log("📸 Fichier sélectionné:", file);
    
    setImage(file);
    setHasAttemptedSubmit(false);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(product?.imageUrl || null);
    }
  };

  const handleSave = (data: FormData) => {
    setHasAttemptedSubmit(true);
    
    // 🔍 DEBUG COMPLET
    console.log("=== 🚨 DÉBUT DEBUG 🚨 ===");
    console.log("Form complet:", data);
    console.log("data.priceCents:", data.priceCents, "type:", typeof data.priceCents);
    console.log("Image:", image);
    console.log("=== 🚨 FIN DEBUG 🚨 ===");

    // Validation supplémentaire avant soumission
    const nameValue = String(data.name || "").trim();
    
    if (!nameValue) {
      toast.error("Le nom du produit est obligatoire");
      return;
    }

    // 🔥 VALIDATION ULTRA SÉCURISÉE DU PRIX
    let priceValue: number;
    try {
      priceValue = Number(data.priceCents);
      if (isNaN(priceValue)) {
        toast.error("Le prix doit être un nombre valide");
        return;
      }
      if (priceValue <= 0) {
        toast.error("Le prix doit être supérieur à 0");
        return;
      }
    } catch (error) {
      toast.error("Erreur de conversion du prix");
      return;
    }

    if (data.stock < 0) {
      toast.error("Le stock ne peut pas être négatif");
      return;
    }

    // Validation d'image
    const isCreation = !product;
    if (isCreation && !image) {
      toast.error("Veuillez sélectionner une image pour le produit");
      return;
    }

    // 🎯 PRÉPARATION DES DONNÉES - VERSION GARANTIE
    const submitData = {
      name: nameValue,
      description: data.description || "", // Description optionnelle
      priceCents: Math.round(priceValue),
      stock: data.stock,
      shopId: data.shopId,
      categoryId: data.categoryId,
      isActive: data.isActive,
      colorIds: data.colorIds,
      sizeIds: data.sizeIds,
    };

    // VÉRIFICATION FINALE ANTI-ERREUR
    if (typeof submitData.priceCents !== 'number' || isNaN(submitData.priceCents)) {
      console.error("🚨 ERREUR CRITIQUE: priceCents n'est pas un nombre!");
      toast.error("Erreur interne: Le prix est invalide");
      return;
    }

    console.log("✅ DONNÉES FINALES PRÊTES:", submitData);
    console.log("✅ priceCents final:", submitData.priceCents, "type:", typeof submitData.priceCents);

    // Inclure l'image
    const dataToSubmit = { ...submitData, image };
    onSubmit(dataToSubmit);
  };

  const handleClose = () => {
    setHasAttemptedSubmit(false);
    onClose();
  };

  // Helper pour convertir les valeurs de sélection
  const getSelectValue = (value: number | null): string => {
    return value ? String(value) : "";
  };

  const isCreation = !product;
  const showImageError = hasAttemptedSubmit && isCreation && !image;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={product ? "Modifier le produit" : "Créer un nouveau produit"}
      size="xl"
      centered
      styles={{
        title: { fontSize: '18px', fontWeight: 'bold' },
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne gauche */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du produit *</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* SÉLECTION DES COULEURS (Multi-badges) */}
              <FormField
                control={form.control}
                name="colorIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couleurs (Optionnel)</FormLabel>
                    <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[45px]">
                      {colors.map((c: any) => (
                        <Badge
                          key={c.id}
                          variant={field.value?.includes(c.id) ? "default" : "outline"}
                          className="cursor-pointer hover:opacity-80 transition"
                          onClick={() => {
                            const newValue = field.value?.includes(c.id)
                              ? field.value.filter((id) => id !== c.id)
                              : [...(field.value || []), c.id];
                            field.onChange(newValue);
                          }}
                        >
                          <div 
                            className="w-2 h-2 rounded-full mr-2" 
                            style={{ backgroundColor: c.hexCode }} 
                          />
                          {c.name}
                        </Badge>
                      ))}
                      {colors.length === 0 && <span className="text-xs text-muted-foreground">Aucune couleur configurée</span>}
                    </div>
                  </FormItem>
                )}
              />

              {/* SÉLECTION DES TAILLES (Multi-badges) */}
              <FormField
                control={form.control}
                name="sizeIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tailles (Optionnel)</FormLabel>
                    <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-[45px]">
                      {sizes.map((s: any) => (
                        <Badge
                          key={s.id}
                          variant={field.value?.includes(s.id) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newValue = field.value?.includes(s.id)
                              ? field.value.filter((id) => id !== s.id)
                              : [...(field.value || []), s.id];
                            field.onChange(newValue);
                          }}
                        >
                          {s.name}
                        </Badge>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </div>

                
            <div className="space-y-4">
              {/* Nom */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du produit *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Entrez le nom du produit" 
                        {...field}
                        className={!field.value && hasAttemptedSubmit ? "border-red-500" : ""}
                      />
                    </FormControl>
                    {!field.value && hasAttemptedSubmit && (
                      <FormMessage>Le nom du produit est obligatoire</FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Description (optionnelle) */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez le produit..."
                        className="min-h-[120px] resize-vertical"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Prix et Stock */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priceCents"
                  render={({ field }) => {
                    const isInvalid = hasAttemptedSubmit && (!field.value || Number(field.value) <= 0);
                    return (
                      <FormItem>
                        <FormLabel>Prix (XOF) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1000"
                            {...field}
                            min="1"
                            step="1"
                            className={isInvalid ? "border-red-500" : ""}
                          />
                        </FormControl>
                        {isInvalid && (
                          <FormMessage>Le prix est obligatoire et doit être supérieur à 0</FormMessage>
                        )}
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => {
                    const isInvalid = hasAttemptedSubmit && field.value < 0;
                    return (
                      <FormItem>
                        <FormLabel>Stock *</FormLabel>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => field.onChange(Math.max(0, Number(field.value) - 1))}
                            disabled={Number(field.value) <= 0}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            className={`text-center ${isInvalid ? "border-red-500" : ""}`}
                            {...field}
                            min="0"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => field.onChange(Number(field.value) + 1)}
                          >
                            +
                          </Button>
                        </div>
                        {isInvalid && (
                          <FormMessage>Le stock ne peut pas être négatif</FormMessage>
                        )}
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>

            {/* Colonne droite */}
            <div className="space-y-4">
              {/* Boutique */}
              <FormField
                control={form.control}
                name="shopId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Boutique</FormLabel>
                    <Select
                      value={getSelectValue(field.value)}
                      onValueChange={(value) => field.onChange(value ? Number(value) : null)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une boutique" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[9999]">
                        {shops.map((shop: Shop) => (
                          <SelectItem key={shop.id} value={String(shop.id)}>
                            {shop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Catégorie */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select
                      value={getSelectValue(field.value)}
                      onValueChange={(value) => field.onChange(value ? Number(value) : null)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[9999]">
                        {categories.map((category: Category) => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Activer le produit */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Activer le produit</FormLabel>
                      <FormDescription>
                        Si cette option est désactivée, le produit ne sera pas visible.
                      </FormDescription>
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
            </div>
          </div>

          {/* Image optionnelle - En bas sur toute la largeur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <FormLabel>
                Image {isCreation && "*"}
              </FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                  showImageError ? "border border-red-500 rounded" : ""
                }`}
              />
              {showImageError && (
                <p className="text-xs text-red-500">Veuillez sélectionner une image pour le produit</p>
              )}
            </div>

            {(imagePreview || product?.imageUrl) && (
              <div className="space-y-2">
                <FormLabel>Aperçu</FormLabel>
                <div className="border rounded-lg p-2 flex justify-center">
                  <img 
                    src={imagePreview || product?.imageUrl} 
                    alt="Aperçu du produit" 
                    className="h-32 w-auto object-contain rounded"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Indicateur de validation */}
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">
              * Champs obligatoires
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitDisabled}
            >
              {isLoading ? "Enregistrement..." : (product ? "Modifier" : "Créer")}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}