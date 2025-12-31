import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Edit, Palette, Ruler, Plus, ArrowLeft } from "lucide-react";
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

// --- COMPOSANT MODAL D'ÉDITION RÉUTILISABLE ---
interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: any) => void;
    initialData: { id: number; name: string; hexCode?: string };
    title: string;
    isColor?: boolean;
}

const EditAttributeModal = ({ isOpen, onClose, onConfirm, initialData, title, isColor }: EditModalProps) => {
    const [name, setName] = useState(initialData.name);
    const [hex, setHex] = useState(initialData.hexCode || "#000000");

    useEffect(() => {
        setName(initialData.name);
        if (initialData.hexCode) setHex(initialData.hexCode);
    }, [initialData, isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Nom</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    {isColor && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Code Couleur</label>
                            <div className="flex gap-2">
                                <Input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="h-10 w-12 p-1" />
                                <Input value={hex} onChange={(e) => setHex(e.target.value)} className="flex-1" />
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Annuler</Button>
                    <Button onClick={() => onConfirm(isColor ? { name, hexCode: hex } : { name })}>
                        Enregistrer les modifications
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// --- COMPOSANT PRINCIPAL ---
const AttributeManager = () => {
    const [view, setView] = useState<'colors' | 'sizes'>('colors');
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div className="p-6 bg-white rounded-lg shadow-sm border">
                <div className="flex items-center gap-4 mb-6 border-b pb-4">
                    <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft className="w-4 h-4 mr-2" /> Retour
                    </Button>
                    <h2 className="text-2xl font-bold text-gray-800">Gestion des Attributs</h2>
                </div>
                
                <div className="flex mb-8 bg-gray-100 p-1 rounded-lg w-fit">
                    <button 
                        onClick={() => setView('colors')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition ${view === 'colors' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                    >
                        <Palette className="w-4 h-4" /> Couleurs
                    </button>
                    <button 
                        onClick={() => setView('sizes')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition ${view === 'sizes' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                    >
                        <Ruler className="w-4 h-4" /> Tailles
                    </button>
                </div>

                <div className="animate-in fade-in duration-300">
                    {view === 'colors' ? <ColorListManager /> : <SizeListManager />}
                </div>
            </div>
        </DashboardLayout>
    );
};

// --- GESTION DES TAILLES ---
const SizeListManager = () => {
    const queryClient = useQueryClient();
    const [newName, setNewName] = useState("");
    const [editingSize, setEditingSize] = useState<any>(null);

    const { data: sizesRes } = useQuery({ queryKey: ["sizes"], queryFn: () => apiClient.getSizes() });

    const addMutation = useMutation({
        mutationFn: (name: string) => apiClient.createSize({ name }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sizes"] });
            setNewName("");
            toast.success("Taille ajoutée");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => apiClient.updateSize(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sizes"] });
            setEditingSize(null);
            toast.success("Taille mise à jour");
        }
    });

    return (
        <div className="space-y-4">
            <div className="flex gap-2 p-4 bg-gray-50 rounded-lg">
                <Input placeholder="Ex: XL, 44..." value={newName} onChange={(e) => setNewName(e.target.value)} className="max-w-xs bg-white" />
                <Button onClick={() => addMutation.mutate(newName)} disabled={!newName.trim()}>Ajouter</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sizesRes?.data?.map((size: any) => (
                    <div key={size.id} className="flex justify-between items-center p-3 bg-white border rounded-md">
                        <span className="font-semibold">{size.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => setEditingSize(size)}>
                            <Edit className="w-3 h-3 text-blue-500" />
                        </Button>
                    </div>
                ))}
            </div>

            {editingSize && (
                <EditAttributeModal
                    isOpen={!!editingSize}
                    onClose={() => setEditingSize(null)}
                    title="Modifier la taille"
                    initialData={editingSize}
                    onConfirm={(data) => updateMutation.mutate({ id: editingSize.id, data })}
                />
            )}
        </div>
    );
};

// --- GESTION DES COULEURS ---
const ColorListManager = () => {
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [hex, setHex] = useState("#3b82f6");
    const [editingColor, setEditingColor] = useState<any>(null);

    const { data: colorsRes } = useQuery({ queryKey: ["colors"], queryFn: () => apiClient.getColors() });

    const addMutation = useMutation({
        mutationFn: (data: {name: string, hexCode: string}) => apiClient.createColor(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["colors"] });
            setName("");
            toast.success("Couleur ajoutée");
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => apiClient.updateColor(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["colors"] });
            setEditingColor(null);
            toast.success("Couleur mise à jour");
        }
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-end p-4 bg-blue-50/50 rounded-lg border">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">NOM</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-white" />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500">COULEUR</label>
                    <Input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="w-16 p-1 h-10 bg-white" />
                </div>
                <Button onClick={() => addMutation.mutate({ name, hexCode: hex })} disabled={!name.trim()}>Ajouter</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {colorsRes?.data?.map((color: any) => (
                    <div key={color.id} className="flex items-center justify-between p-3 border rounded-md bg-white">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: color.hexCode }} />
                            <span className="text-sm font-bold">{color.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setEditingColor(color)}>
                            <Edit className="w-3 h-3 text-blue-500" />
                        </Button>
                    </div>
                ))}
            </div>

            {editingColor && (
                <EditAttributeModal
                    isOpen={!!editingColor}
                    onClose={() => setEditingColor(null)}
                    title="Modifier la couleur"
                    isColor={true}
                    initialData={editingColor}
                    onConfirm={(data) => updateMutation.mutate({ id: editingColor.id, data })}
                />
            )}
        </div>
    );
};

export default AttributeManager;