import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';
import { User, Mail, Key, Shield, Calendar, Edit, Check, X } from 'lucide-react';

export default function Profile() {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => apiClient.getProfile(),
    enabled: !!authUser,
  });

  // États pour les informations du profil
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // États pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // États pour le reset de mot de passe (admin)
  const [adminPasswordData, setAdminPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setEmail(profile.email || '');
    }
  }, [profile]);

  // Mutation pour le changement de mot de passe par l'utilisateur
  const updatePasswordMutation = useMutation({
    mutationFn: () => 
      apiClient.updatePasswordSelf(profile.id, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }),
    onSuccess: () => {
      toast.success('Mot de passe mis à jour avec succès!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la mise à jour du mot de passe');
    },
  });

  // Mutation pour le reset de mot de passe par admin
  const updatePasswordByAdminMutation = useMutation({
    mutationFn: () => 
      apiClient.updatePasswordByAdmin(profile.id, {
        newPassword: adminPasswordData.newPassword,
      }),
    onSuccess: () => {
      toast.success('Mot de passe réinitialisé avec succès!');
      setAdminPasswordData({ newPassword: '', confirmPassword: '' });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erreur lors de la réinitialisation du mot de passe');
    },
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    updatePasswordMutation.mutate();
  };

  const handleAdminPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (adminPasswordData.newPassword !== adminPasswordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (adminPasswordData.newPassword.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    updatePasswordByAdminMutation.mutate();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'destructive';
      case 'MANAGER': return 'default';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="h-10 w-48 bg-muted animate-pulse rounded mx-auto" />
            <div className="h-6 w-64 bg-muted animate-pulse rounded mx-auto mt-2" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Carte profil skeleton */}
            <Card className="shadow-lg animate-pulse lg:col-span-1">
              <CardHeader className="text-center">
                <div className="w-24 h-24 rounded-full bg-muted mx-auto" />
                <div className="h-6 w-32 bg-muted rounded mx-auto mt-4" />
                <div className="h-4 w-48 bg-muted rounded mx-auto mt-2" />
                <div className="h-8 w-24 bg-muted rounded mx-auto mt-3" />
              </CardHeader>
            </Card>

            {/* Informations skeleton */}
            <Card className="shadow-md animate-pulse lg:col-span-2">
              <CardHeader>
                <div className="h-6 w-40 bg-muted rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-10 w-full bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded" />
                <div className="h-10 w-full bg-muted rounded" />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mon Profil
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Gérez vos informations personnelles et votre sécurité
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Informations personnelles
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Sécurité
            </TabsTrigger>
          </TabsList>

          {/* Tab Informations personnelles */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Carte profil */}
              <Card className="shadow-lg border-l-4 border-l-blue-500 lg:col-span-1">
                <CardHeader className="text-center pb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <CardTitle className="text-xl">{profile?.username || 'Utilisateur'}</CardTitle>
                  <CardDescription className="flex items-center justify-center gap-2 mt-2">
                    <Mail className="h-4 w-4" />
                    {profile?.email || 'Aucun email'}
                  </CardDescription>
                  <Badge 
                    variant={getRoleBadgeVariant(profile?.role)} 
                    className="mt-3 capitalize"
                  >
                    {profile?.role?.toLowerCase() || 'utilisateur'}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Inscrit le {profile?.createdAt ? formatDate(profile.createdAt) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Edit className="h-4 w-4" />
                    <span>Modifié le {profile?.updatedAt ? formatDate(profile.updatedAt) : 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Informations détaillées */}
              <Card className="shadow-md lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>
                      Consultez et gérez vos informations de compte
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Sauvegarder
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Annuler
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="username" className="text-sm font-medium">
                        Nom d'utilisateur
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="pl-10"
                          disabled={!isEditing}
                          placeholder="Votre nom d'utilisateur"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Adresse email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          disabled={!isEditing}
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Modification en attente
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            N'oubliez pas de sauvegarder vos modifications
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tab Sécurité */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Changement de mot de passe utilisateur */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Changer mon mot de passe
                  </CardTitle>
                  <CardDescription>
                    Mettez à jour votre mot de passe actuel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="oldPassword">Mot de passe actuel</Label>
                      <Input
                        id="oldPassword"
                        type="password"
                        value={passwordData.oldPassword}
                        onChange={(e) => setPasswordData(prev => ({
                          ...prev,
                          oldPassword: e.target.value
                        }))}
                        placeholder="Entrez votre mot de passe actuel"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({
                          ...prev,
                          newPassword: e.target.value
                        }))}
                        placeholder="Minimum 6 caractères"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({
                          ...prev,
                          confirmPassword: e.target.value
                        }))}
                        placeholder="Retapez le nouveau mot de passe"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={updatePasswordMutation.isPending}
                    >
                      {updatePasswordMutation.isPending ? (
                        <>Mise à jour...</>
                      ) : (
                        <>Mettre à jour le mot de passe</>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Réinitialisation par admin (si l'utilisateur est admin) */}
              {authUser?.role === 'ADMIN' && (
                <Card className="shadow-md border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Réinitialisation administrateur
                    </CardTitle>
                    <CardDescription>
                      Réinitialiser le mot de passe de cet utilisateur
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAdminPasswordSubmit} className="space-y-4">
                      <div className="space-y-3">
                        <Label htmlFor="adminNewPassword">Nouveau mot de passe</Label>
                        <Input
                          id="adminNewPassword"
                          type="password"
                          value={adminPasswordData.newPassword}
                          onChange={(e) => setAdminPasswordData(prev => ({
                            ...prev,
                            newPassword: e.target.value
                          }))}
                          placeholder="Nouveau mot de passe"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="adminConfirmPassword">Confirmer le mot de passe</Label>
                        <Input
                          id="adminConfirmPassword"
                          type="password"
                          value={adminPasswordData.confirmPassword}
                          onChange={(e) => setAdminPasswordData(prev => ({
                            ...prev,
                            confirmPassword: e.target.value
                          }))}
                          placeholder="Confirmer le mot de passe"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        variant="outline"
                        className="w-full"
                        disabled={updatePasswordByAdminMutation.isPending}
                      >
                        {updatePasswordByAdminMutation.isPending ? (
                          <>Réinitialisation...</>
                        ) : (
                          <>Réinitialiser le mot de passe</>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Conseils de sécurité */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Conseils de sécurité
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Utilisez un mot de passe unique et complexe</li>
                      <li>• Changez votre mot de passe régulièrement</li>
                      <li>• Ne partagez jamais votre mot de passe</li>
                      <li>• Utilisez l'authentification à deux facteurs si disponible</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}