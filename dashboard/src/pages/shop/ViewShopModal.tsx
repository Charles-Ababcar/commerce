import { Label } from "@/components/ui/label";
import { Image, Modal, Text } from "@mantine/core";

interface Shop {
  imageUrl?: string;
  name: string;
  description: string;
  address: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
}

interface ViewShopModalProps {
  opened: boolean;
  onClose: () => void;
  shop: Shop | null;
}

export default function ViewShopModal({ opened, onClose, shop }: ViewShopModalProps) {
  if (!shop) return null;

  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title="Détails de la boutique" 
      size="lg"
      classNames={{
        header: "bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200",
        title: "text-xl font-bold text-gray-800",
        body: "p-6",
      }}
    >
      <div className="space-y-6">
        {/* Image avec effet d'ombre */}
        <div className="relative rounded-xl overflow-hidden shadow-lg">
          <Image
            src={shop.imageUrl || "/placeholder-shop.jpg"}
            alt={`Image de ${shop.name}`}
            className="w-full h-64 object-cover transition-transform hover:scale-105 duration-300"
          />
        </div>

        {/* Grid pour les informations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Colonne 1 */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Nom
              </Label>
              <Label className="text-lg font-medium text-gray-800">
                {shop.name}
              </Label>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Email
              </Label>
              <Text className="text-lg text-blue-600 hover:text-blue-800 transition-colors">
                {shop.email}
              </Text>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Statut
              </Label>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                shop.isActive 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {shop.isActive ? "🟢 Active" : "🔴 Inactive"}
              </span>
            </div>
          </div>

          {/* Colonne 2 */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Téléphone
              </Label>
              <Label className="text-lg text-gray-800">
                {shop.phoneNumber}
              </Label>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <Label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Adresse
              </Label>
              <Text className="text-lg text-gray-800 leading-relaxed">
                {shop.address}
              </Text>
            </div>
          </div>
        </div>

        {/* Description - Pleine largeur */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
          <Label className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Description
          </Label>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <Label className="text-gray-700 leading-relaxed text-justify">
              {shop.description}
            </Label>
          </div>
        </div>
      </div>
    </Modal>
  );
}