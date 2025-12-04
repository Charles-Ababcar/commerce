import { useState, useEffect } from "react";
import { Modal, Textarea } from "@mantine/core";
import { apiClient } from "@/lib/api";
import { CategoryRequestDTO } from "@/models/CategoryRequestDTO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function EditCategoryModal({ opened, onClose, category, onUpdated }: any) {
  const [form, setForm] = useState<CategoryRequestDTO>({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) setForm({ name: category.name, description: category.description });

     // Si la catégorie contient une valeur range
      if (category.level !== undefined) {
        setSliderValue([category.level]);
      }
  }, [category]);

   const [sliderValue, setSliderValue] = useState([50]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await apiClient.updateCategory(category.id, form);
      onUpdated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Modifier la catégorie" size="lg">
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

         {/* SLIDER INTÉGRÉ */}
        {/* <div className="space-y-2">
          <label className="text-sm font-medium">Niveau</label>

          <Slider 
            value={sliderValue}
            onValueChange={setSliderValue}
            max={100}
            step={1}
            className="w-full"
          />

          <div className="text-right text-sm">
            <span className="font-semibold">{sliderValue[0]}</span>/100
          </div>
        </div> */}
        <Button  onClick={handleUpdate} loading={loading} className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:bg-blue-700 transition disabled:opacity-50">
          Enregistrer
        </Button>
      </div>
    </Modal>
  );
}
