import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Edit, Palette, Ruler, Plus } from "lucide-react";

const AttributeManager = () => {
    const [view, setView] = useState<'colors' | 'sizes'>('colors');

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm border">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gestion des Attributs</h2>
            </div>
            
            {/* Toggle Switch */}
            <div className="flex mb-8 bg-gray-100 p-1 rounded-lg w-fit">
                <button 
                    onClick={() => setView('colors')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                        view === 'colors' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Palette className="w-4 h-4" /> Couleurs
                </button>
                <button 
                    onClick={() => setView('sizes')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                        view === 'sizes' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <Ruler className="w-4 h-4" /> Tailles
                </button>
            </div>

            {/* Contenu dynamique */}
            <div className="animate-in fade-in duration-300">
                {view === 'colors' ? <ColorListManager /> : <SizeListManager />}
            </div>
        </div>
    );
};

// --- GESTION DES TAILLES ---
const SizeListManager = () => {
    const queryClient = useQueryClient();
    const [newName, setNewName] = useState("");
    
    const { data: sizesRes, isLoading } = useQuery({ 
        queryKey: ["sizes"], 
        queryFn: () => apiClient.getSizes() 
    });

    const addMutation = useMutation({
        mutationFn: (name: string) => apiClient.createSize({ name }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sizes"] });
            setNewName("");
            toast.success("Taille ajoutée avec succès");
        },
        onError: () => toast.error("Erreur lors de l'ajout")
    });

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input 
                    placeholder="Nouvelle taille (ex: XXL, 42...)" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="max-w-xs"
                />
                <Button 
                    onClick={() => addMutation.mutate(newName)} 
                    disabled={!newName.trim() || addMutation.isPending}
                >
                    <Plus className="w-4 h-4 mr-2" /> Ajouter
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {sizesRes?.data?.map((size: any) => (
                    <div key={size.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
                        <span className="font-semibold">{size.name}</span>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-3 h-3 text-gray-400" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- GESTION DES COULEURS ---
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
            <div className="flex flex-wrap gap-2 items-end p-4 bg-blue-50/50 rounded-lg">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Nom</label>
                    <Input 
                        placeholder="Bleu Marine" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Couleur</label>
                    <div className="flex gap-2">
                        <Input 
                            type="color" 
                            value={hex}
                            onChange={(e) => setHex(e.target.value)}
                            className="w-12 p-1 h-10 bg-white"
                        />
                    </div>
                </div>
                <Button 
                    onClick={() => addMutation.mutate({ name, hexCode: hex })}
                    disabled={!name.trim()}
                >
                    <Plus className="w-4 h-4 mr-2" /> Ajouter
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {colorsRes?.data?.map((color: any) => (
                    <div key={color.id} className="flex items-center justify-between p-3 border rounded-md bg-white shadow-sm">
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-6 h-6 rounded-full border shadow-inner" 
                                style={{ backgroundColor: color.hexCode }} 
                            />
                            <span className="text-sm font-medium">{color.name}</span>
                        </div>
                        <span className="text-xs text-gray-400 font-mono uppercase">{color.hexCode}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AttributeManager;