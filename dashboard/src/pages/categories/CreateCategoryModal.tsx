import { useState } from "react";
import { Modal, TextInput, Textarea, Button } from "@mantine/core";
import { apiClient } from "@/lib/api";
import { CategoryRequestDTO } from "@/models/CategoryRequestDTO";

export default function CreateCategoryModal({ opened, onClose, onCreated }: any) {
  const [form, setForm] = useState<CategoryRequestDTO>({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      await apiClient.createCategory(form);
      onCreated();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Créer une catégorie" size="lg">
      <div className="space-y-4">
        <TextInput
          label="Nom"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Button fullWidth onClick={handleCreate} loading={loading}  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:bg-blue-700 transition disabled:opacity-50">
          Créer
        </Button>
      </div>
    </Modal>
  );
}
