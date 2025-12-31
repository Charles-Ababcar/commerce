import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Edit, Palette, Ruler, Plus, ArrowLeft } from "lucide-react";
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const AttributeManager = () => {
    const [view, setView] = useState<'colors' | 'sizes'>('colors');
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div className="p-6 bg-white rounded-lg shadow-sm border">
                {/* Header avec bouton retour */}
                <div className="flex items-center gap-4 mb-6 border-b pb-4">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => navigate(-1)}
                        className="flex items-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour
                    </Button>
                    <h2 className="text-2xl font-bold text-gray-800">Gestion des Attributs</h2>
                </div>
                
                {/* Toggle Switch */}
                <div className="flex mb-8 bg-gray-100 p-1 rounded-lg w-fit">
                    <button 
                        onClick={() => setView('colors')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition ${
                            view === 'colors' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Palette className="w-4 h-4" /> Couleurs
                    </button>
                    <button 
                        onClick={() => setView('sizes')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition ${
                            view === 'sizes' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Ruler className="w-4 h-4" /> Tailles
                    </button>
                </div>

                {/* Contenu dynamique (SANS DashboardLayout ici) */}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {view === 'colors' ? <ColorListManager /> : <SizeListManager />}
                </div>
            </div>
        </DashboardLayout>
    );
};

// --- GESTION DES TAILLES (Nettoyé) ---
const SizeListManager = () => {
    const queryClient = useQueryClient();
    const [newName, setNewName] = useState("");
    
    const { data: sizesRes } = useQuery({ 
        queryKey: ["sizes"], 
        queryFn: () => apiClient.getSizes() 
    });

    const addMutation = useMutation({
        mutationFn: (name: string) => apiClient.createSize({ name }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sizes"] });
            setNewName("");
            toast.success("Taille ajoutée avec succès");
        }
    });

    return (
        <div className="space-y-4">
            <div className="flex gap-2 p-4 bg-gray-50 rounded-lg">
                <Input 
                    placeholder="Nouvelle taille (ex: XL, 42...)" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="max-w-xs bg-white"
                />
                <Button 
                    onClick={() => addMutation.mutate(newName)} 
                    disabled={!newName.trim() || addMutation.isPending}
                >
                    <Plus className="w-4 h-4 mr-2" /> Ajouter
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sizesRes?.data?.map((size: any) => (
                    <div key={size.id} className="flex justify-between items-center p-3 bg-white rounded-md border shadow-sm">
                        <span className="font-semibold text-gray-700">{size.name}</span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-3 h-3 text-gray-400" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- GESTION DES COULEURS (Nettoyé) ---
const ColorListManager = () => {
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [hex, setHex] = useState("#3b82f6");

    const { data: colorsRes } = useQuery({ 
        queryKey: ["colors"], 
        queryFn: () => apiClient.getColors() 
    });

    const addMutation = useMutation({
        mutationFn: (data: {name: string, hexCode: string}) => apiClient.createColor(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["colors"] });
            setName("");
            toast.success("Couleur ajoutée");
        }
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-end p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Nom de la couleur</label>
                    <Input 
                        placeholder="Ex: Rouge vif" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white min-w-[200px]"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Aperçu</label>
                    <Input 
                        type="color" 
                        value={hex}
                        onChange={(e) => setHex(e.target.value)}
                        className="w-16 p-1 h-10 bg-white cursor-pointer"
                    />
                </div>
                <Button 
                    onClick={() => addMutation.mutate({ name, hexCode: hex })}
                    disabled={!name.trim() || addMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    <Plus className="w-4 h-4 mr-2" /> Ajouter
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {colorsRes?.data?.map((color: any) => (
                    <div key={color.id} className="flex items-center justify-between p-3 border rounded-md bg-white shadow-sm hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-8 h-8 rounded-full border shadow-inner" 
                                style={{ backgroundColor: color.hexCode }} 
                            />
                            <div>
                                <p className="text-sm font-bold text-gray-800">{color.name}</p>
                                <p className="text-[10px] text-gray-400 font-mono uppercase">{color.hexCode}</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-3 h-3 text-gray-400" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttributeManager;