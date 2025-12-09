import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Shield } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const validatePassword = (pass: string) => {
    const errors = [];
    if (pass.length < 8) errors.push('8 caractères minimum');
    if (!/[A-Z]/.test(pass)) errors.push('1 majuscule minimum');
    if (!/[0-9]/.test(pass)) errors.push('1 chiffre minimum');
    if (!/[!@#$%^&*]/.test(pass)) errors.push('1 caractère spécial minimum');
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Lien invalide', {
        description: 'Le lien de réinitialisation est invalide ou a expiré',
        icon: <AlertCircle className="w-4 h-4" />
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas', {
        icon: <AlertCircle className="w-4 h-4" />
      });
      return;
    }
    
    const errors = validatePassword(password);
    if (errors.length > 0) {
      toast.error('Mot de passe trop faible', {
        description: `Exigences manquantes: ${errors.join(', ')}`,
        icon: <AlertCircle className="w-4 h-4" />
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En production, remplacer par un appel réel à votre API
      // await updatePassword(token, password);
      
      setIsSuccess(true);
      toast.success('Mot de passe modifié !', {
        description: 'Votre mot de passe a été réinitialisé avec succès',
        icon: <CheckCircle className="w-4 h-4" />
      });
      
      // Redirection automatique après 3 secondes
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
      
    } catch (error) {
      toast.error('Erreur de réinitialisation', {
        description: 'Le lien a peut-être expiré. Veuillez en demander un nouveau.',
        icon: <AlertCircle className="w-4 h-4" />
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordErrors = validatePassword(password);
  const passwordStrength = password.length > 0 
    ? Math.max(0, 25 * (4 - passwordErrors.length))
    : 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        
        <CardHeader className="space-y-4 pb-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-fit -ml-2 mb-2"
            onClick={() => navigate('/forgot-password')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          
          <div className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {isSuccess ? 'Succès !' : 'Nouveau mot de passe'}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                {isSuccess 
                  ? 'Votre mot de passe a été réinitialisé avec succès'
                  : 'Créez un nouveau mot de passe sécurisé'
                }
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Nouveau mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 h-12 rounded-lg"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  
                  {password && (
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            passwordStrength < 50 ? 'bg-red-500' :
                            passwordStrength < 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">
                        {passwordStrength < 50 && 'Faible'}
                        {passwordStrength >= 50 && passwordStrength < 75 && 'Moyen'}
                        {passwordStrength >= 75 && 'Fort'}
                        <ul className="mt-1 space-y-1">
                          {password.length >= 8 ? (
                            <li className="text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> 8 caractères minimum
                            </li>
                          ) : (
                            <li className="text-gray-400">8 caractères minimum</li>
                          )}
                          {/[A-Z]/.test(password) ? (
                            <li className="text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> 1 majuscule minimum
                            </li>
                          ) : (
                            <li className="text-gray-400">1 majuscule minimum</li>
                          )}
                          {/[0-9]/.test(password) ? (
                            <li className="text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> 1 chiffre minimum
                            </li>
                          ) : (
                            <li className="text-gray-400">1 chiffre minimum</li>
                          )}
                          {/[!@#$%^&*]/.test(password) ? (
                            <li className="text-green-600 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> 1 caractère spécial
                            </li>
                          ) : (
                            <li className="text-gray-400">1 caractère spécial</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmer le mot de passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-10 pr-10 h-12 rounded-lg"
                    />
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                  {confirmPassword && password === confirmPassword && (
                    <p className="text-green-600 text-xs flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Les mots de passe correspondent
                    </p>
                  )}
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Réinitialisation...
                  </>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Mot de passe réinitialisé !
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Vous allez être redirigé vers la page de connexion dans quelques secondes...
                </p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-1">
                    <div className="bg-green-500 h-1 rounded-full animate-[progress_3s_ease-in-out]"></div>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => navigate('/auth')}
                variant="default"
                className="w-full h-12 bg-gradient-to-r from-primary to-accent"
              >
                Se connecter maintenant
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3 border-t pt-6">
          <div className="text-center text-sm text-gray-500">
            <p>Problème avec la réinitialisation ? <Button variant="link" className="text-primary px-0">Contactez le support</Button></p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}