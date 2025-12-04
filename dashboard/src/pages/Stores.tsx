// import { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { DashboardLayout } from '@/components/Layout/DashboardLayout';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { apiClient } from '@/lib/api';
// import { Store as StoreIcon, Plus, MoreVertical, Edit, Trash, ImageIcon } from 'lucide-react';
// import { toast } from 'sonner';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Page, Store } from '@/types/api';

// export default function Stores() {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [isEditMode, setEditMode] = useState(false);
//   const [selectedStore, setSelectedStore] = useState<Store | null>(null);

//   // Form state
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const queryClient = useQueryClient();

//   const { data: storesData, isLoading } = useQuery<Page<Store>>({
//     queryKey: ['shop'],
//     queryFn: () => apiClient.getShop(),
//   });

//   useEffect(() => {
//     if (isEditMode && selectedStore) {
//       setName(selectedStore.name);
//       setDescription(selectedStore.description);
//     } else {
//       setName('');
//       setDescription('');
//       setImageFile(null)
//     }
//   }, [isEditMode, selectedStore]);

//   const createStoreMutation = useMutation({
//     mutationFn: (variables: { name: string; description: string; image?: File }) =>
//       apiClient.createStore({ name: variables.name, description: variables.description }, variables.image),
//     onSuccess: () => {
//       toast.success('Store created successfully!');
//       queryClient.invalidateQueries({ queryKey: ['stores'] });
//       setModalOpen(false);
//     },
//     onError: (error) => toast.error(`Failed to create store: ${error.message}`),
//   });

//   // const updateStoreMutation = useMutation({
//   //   mutationFn: (data: { id: string; name: string; description: string; image?: File }) =>
//   //     apiClient.updateStore(data.id, { name: data.name, description: data.description }, data.image),
//   //   onSuccess: () => {
//   //     toast.success('Store updated successfully!');
//   //     queryClient.invalidateQueries({ queryKey: ['stores'] });
//   //     setModalOpen(false);
//   //   },
//   //   onError: (error) => toast.error(`Failed to update store: ${error.message}`),
//   // });


//   const handleOpenModal = (store?: Store) => {
//     if (store) {
//       setSelectedStore(store);
//       setEditMode(true);
//     } else {
//       setSelectedStore(null);
//       setEditMode(false);
//     }
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedStore(null);
//     setEditMode(false);
//   }

//   const handleSubmit = () => {
//     if (!name || !description) {
//       toast.error('Please provide a name and description.');
//       return;
//     }

//     if (isEditMode && selectedStore) {
//      // updateStoreMutation.mutate({ id: selectedStore.id, name, description, image: imageFile || undefined });
//     } else {
//       createStoreMutation.mutate({ name, description, image: imageFile || undefined });
//     }
//   };

//   const stores = storesData?.content || [];

//   return (
//     <DashboardLayout>
//       <div className="space-y-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-4xl font-bold">Stores</h1>
//             <p className="text-muted-foreground mt-2">Manage your stores and their products</p>
//           </div>
//           <Button onClick={() => handleOpenModal()}>
//             <Plus className="mr-2 h-4 w-4" /> Add Store
//           </Button>
//         </div>

//         {isLoading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {[...Array(3)].map((_, i) => (
//               <Card key={i} className="animate-pulse">
//                 <div className="h-40 bg-muted rounded-t-lg" />
//                 <CardHeader className="h-12 bg-muted mt-2 rounded-t-lg" />
//                 <CardContent className="pt-4 space-y-2">
//                   <div className="h-4 bg-muted rounded w-3/4" />
//                   <div className="h-4 bg-muted rounded w-1/2" />
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {stores.map((store) => (
//               <Card key={store.id} className="shadow-md hover:shadow-lg transition-smooth flex flex-col overflow-hidden">
//                 {store.imageUrl ? (
//                   <img src={store.imageUrl} alt={store.name} className="h-40 w-full object-cover" />
//                 ) : (
//                   <div className="h-40 w-full bg-muted flex items-center justify-center">
//                     <ImageIcon className="w-12 h-12 text-muted-foreground" />
//                   </div>
//                 )}
//                 <CardHeader className="flex-row items-center justify-between">
//                   <CardTitle>{store.name}</CardTitle>
//                   <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                       <Button variant="ghost" size="icon">
//                         <MoreVertical className="h-4 w-4" />
//                       </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent>
//                       <DropdownMenuItem onClick={() => handleOpenModal(store)}>
//                         <Edit className="mr-2 h-4 w-4" />
//                         Edit
//                       </DropdownMenuItem>
//                       {/* <DropdownMenuItem onClick={() => deleteStoreMutation.mutate(store.id)} className="text-red-600">
//                         <Trash className="mr-2 h-4 w-4" />
//                         Delete
//                       </DropdownMenuItem> */}
//                     </DropdownMenuContent>
//                   </DropdownMenu>
//                 </CardHeader>
//                 <CardContent className="flex-grow">
//                   <p className="text-sm text-muted-foreground line-clamp-3">{store.description}</p>
//                 </CardContent>
//                 <div className="p-4 pt-0">
//                   <Button className="w-full" variant="outline">View Products</Button>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         )}

//         {/* Create/Edit Store Modal */}
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg w-96 space-y-4">
//               <h2 className="text-xl font-bold">{isEditMode ? 'Edit Store' : 'Add Store'}</h2>
//               <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
//               <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
//               <Input type="file" onChange={e => setImageFile(e.target.files?.[0] || null)} />
//               <div className="flex justify-end gap-2">
//                 <Button variant="secondary" onClick={handleCloseModal}>
//                   Cancel
//                 </Button>
//                 {/* <Button onClick={handleSubmit} disabled={createStoreMutation.isPending || updateStoreMutation.isPending}>
//                   {createStoreMutation.isPending || updateStoreMutation.isPending ? 'Saving...' : 'Save'}
//                 </Button> */}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }
