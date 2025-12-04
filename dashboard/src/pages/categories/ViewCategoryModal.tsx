import { CategoryResponseDTO } from "@/models/CategoryResponseDTO";
import { Modal, Text, Textarea } from "@mantine/core";



interface ViewCategoryModalProps {
  opened: boolean;
  onClose: () => void;
  category: CategoryResponseDTO | null;
}

export default function ViewCategoryModal({ 
  opened, 
  onClose, 
  category 
}: ViewCategoryModalProps) {
  if (!category) return null;

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Détails de la catégorie" 
      size="lg"
      classNames={{
        header: "bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200",
        title: "text-xl font-bold text-gray-800",
        body: "p-6",
      }}
    >
      <div className="space-y-6">
        {/* Carte principale */}
        <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl p-8 shadow-lg border border-green-100">
          
          {/* Nom avec badge élégant */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-500 text-white text-sm font-semibold shadow-md mb-2">
              📋 Catégorie
            </span>
            <Text className="text-3xl font-bold text-gray-800 mt-2">
              {category.name}
            </Text>
          </div>

          {/* Séparateur */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"></div>
          </div>

          {/* Description */}
          <div>
            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 text-center">
              Description
            </Text>
            <div className="bg-white rounded-xl p-6 shadow-inner border border-gray-200">
              <Textarea 
                value={category.description} 
                readOnly 
                autosize
                minRows={4}
                maxRows={8}
                classNames={{
                  input: "border-0 bg-transparent text-gray-700 text-lg leading-relaxed text-center resize-none focus:outline-none focus:ring-0"
                }}
              />
            </div>
          </div>

          {/* Stats ou métriques (optionnel) */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-green-600">📊</div>
              <Text className="text-xs text-gray-500 mt-1">Produits associés</Text>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">🏪</div>
              <Text className="text-xs text-gray-500 mt-1">Boutiques utilisatrices</Text>
            </div>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center space-x-2">
            <span className="text-blue-500">💡</span>
            <Text className="text-sm text-blue-700">
              Cette catégorie permet d'organiser vos produits de manière cohérente.
            </Text>
          </div>
        </div>
      </div>
    </Modal>
  );
}
