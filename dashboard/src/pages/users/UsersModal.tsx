import { useEffect, useState } from "react";
import { Modal } from "@mantine/core";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { User, Mail, User as UserIcon, Key } from "lucide-react";
import { User as UserType } from "@/models/UsersDTO";

interface UserModalProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  user: UserType | null;
  isLoading?: boolean;
}

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER' | 'MANAGER';
}

export default function UserModal({
  opened,
  onClose,
  onSubmit,
  user,
  isLoading = false,
}: UserModalProps) {
  const [form, setForm] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "USER",
  });

  // ---- Pré-remplissage si update ----
  useEffect(() => {
    if (user) {
      console.log("🔄 User data:", user);
      setForm({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
        password: "", // Mot de passe vide pour l'édition
        role: user.role || "USER",
      });
    } else {
      // Reset pour la création
      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
        role: "USER",
      });
    }
  }, [user, opened]);

  const handleSave = () => {
    // Validation
    const nameValue = String(form.name || "").trim();
    const usernameValue = String(form.username || "").trim();
    const emailValue = String(form.email || "").trim();
    
    if (!nameValue) {
      toast.error("Le nom est obligatoire");
      return;
    }

    if (!usernameValue) {
      toast.error("Le nom d'utilisateur est obligatoire");
      return;
    }

    if (!emailValue) {
      toast.error("L'email est obligatoire");
      return;
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
      toast.error("L'email n'est pas valide");
      return;
    }

    // Pour la création, le mot de passe est obligatoire
    if (!user && !form.password) {
      toast.error("Le mot de passe est obligatoire");
      return;
    }

    // Pour la création, validation du mot de passe
    if (!user && form.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    // Préparation des données
    const submitData: any = {
      name: nameValue,
      username: usernameValue,
      email: emailValue,
      role: form.role,
    };

    // Inclure le mot de passe seulement s'il a été modifié ou pour la création
    if (form.password) {
      submitData.password = form.password;
    }

    console.log("✅ DONNÉES UTILISATEUR PRÊTES:", submitData);
    onSubmit(submitData);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={user ? "Modifier l'utilisateur" : "Créer un nouvel utilisateur"}
      size="lg"
      centered
      styles={{
        title: { fontSize: '18px', fontWeight: 'bold' },
      }}
    >
      <div className="space-y-4 p-1 max-h-[70vh] overflow-y-auto">
        {/* Nom complet */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Nom complet *</label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Entrez le nom complet"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Nom d'utilisateur */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Nom d'utilisateur *</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Entrez le nom d'utilisateur"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Email *</label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Entrez l'email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Mot de passe */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Mot de passe {!user && "*"}
          </label>
          <div className="relative">
            <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder={user ? "Laissez vide pour ne pas modifier" : "Entrez le mot de passe"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {user ? "Laissez vide pour conserver le mot de passe actuel" : "Minimum 6 caractères"}
          </p>
        </div>

        {/* Rôle */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Rôle *</label>
          <Select
            value={form.role}
            onValueChange={(value: 'ADMIN' | 'USER' | 'MANAGER') => 
              setForm({ ...form, role: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un rôle" />
            </SelectTrigger>
            <SelectContent className="z-[9999]">
              <SelectItem value="USER">Utilisateur</SelectItem>
              <SelectItem value="MANAGER">Manager</SelectItem>
              <SelectItem value="ADMIN">Administrateur</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1"
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Enregistrement..." : (user ? "Modifier" : "Créer")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}