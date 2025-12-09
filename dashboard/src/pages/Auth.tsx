// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { ShoppingBag } from 'lucide-react';

// export default function Auth() {
//   const [username, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       await login(username, password);
//       toast.success('Content de te revoir!');
//       navigate('/dashboard');
//     } catch (error) {
//       toast.error('Invalid credentials. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
//       <Card className="w-full max-w-md shadow-lg">
//         <CardHeader className="space-y-4 text-center">
//           <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-md">
//             <ShoppingBag className="w-8 h-8 text-primary-foreground" />
//           </div>
//           <div>
//             <CardTitle className="text-3xl">Bienvenu Minane Service</CardTitle>
//             <CardDescription className="text-base mt-2">
//              Connectez-vous pour accéder à votre tableau de bord e-commerce
//             </CardDescription>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="username">Nom d'Utilisateur</Label>
//               <Input
//                 id="username"
//                 type="text"
//                 placeholder="Entrez votre nom d'utilisateur"
//                 value={username}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Mot de Passe</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="••••••••"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//             <Button 
//               type="submit" 
//               className="w-full" 
//               disabled={isLoading}
//             >
//               {isLoading ? 'Signing in...' : 'Sign In'}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ShoppingBag, Eye, EyeOff, User, Lock, Sparkles, AlertCircle, Shield, Smartphone, Globe } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Veuillez remplir tous les champs', {
        icon: <AlertCircle className="w-4 h-4" />
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await login(username, password);
      toast.success('Content de te revoir !', {
        description: 'Redirection vers votre tableau de bord',
        icon: <Sparkles className="w-4 h-4" />
      });
      navigate('/dashboard');
    } catch (error) {
      toast.error('Identifiants incorrects', {
        description: 'Vérifiez votre nom d\'utilisateur et mot de passe',
        icon: <AlertCircle className="w-4 h-4" />
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4 md:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 pr-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Minane Service
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Plateforme E-commerce Professionnelle</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Gérez votre boutique en ligne efficacement
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Accédez à votre tableau de bord pour suivre vos ventes, gérer vos produits et analyser vos performances.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Gestion Produits</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Ajoutez et modifiez vos articles</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                <Smartphone className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Mobile Friendly</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Accessible sur tous vos appareils</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Sécurité</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Données chiffrées et protégées</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
                <Globe className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">24/7 Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Disponible à tout moment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Système sécurisé</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Chiffrement AES-256</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div>v2.4.1</div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <Card className="w-full shadow-2xl border-0 max-w-lg mx-auto lg:mx-0 lg:ml-auto">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            
            <CardHeader className="space-y-6 text-center pb-2">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Connexion à votre compte
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                    Entrez vos identifiants pour accéder à votre tableau de bord
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm font-medium">
                      Nom d'Utilisateur
                    </Label>
                    <div className="relative">
                      <Input
                        id="username"
                        type="text"
                        placeholder="votre.nom.utilisateur"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-700"
                        disabled={isLoading}
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Mot de Passe
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 h-12 rounded-lg border-gray-300 dark:border-gray-700"
                        disabled={isLoading}
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    {showPassword && password && (
                      <div className="text-xs text-gray-500 flex items-center gap-2">
                        {password.length < 6 ? (
                          <>
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span className="text-amber-600">Mot de passe trop court (min. 6 caractères)</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-green-600" />
                            <span className="text-green-600">Mot de passe visible</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <Label htmlFor="remember" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                        Se souvenir de moi
                      </Label>
                    </div>
                    <Button
                      type="button"
                      variant="link"
                      className="text-sm text-primary hover:text-primary/80 px-0"
                      onClick={() => toast.info('Fonctionnalité à venir', {
                        description: 'Contactez l\'administrateur pour réinitialiser votre mot de passe'
                      })}
                    >
                      Mot de passe oublié ?
                    </Button>
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
                      Connexion en cours...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 border-t pt-6">
              <div className="text-center text-sm text-gray-500">
                <p>
                  Vous n'avez pas de compte ?{' '}
                  <Button
                    variant="link"
                    className="text-primary hover:text-primary/80 px-0"
                    onClick={() => toast.info('Fonctionnalité à venir', {
                      description: 'Contactez l\'administrateur pour créer un compte'
                    })}
                  >
                    Demander un accès
                  </Button>
                </p>
              </div>
            </CardFooter>
          </Card>
          
          {/* Mobile Branding - Only visible on small screens */}
          <div className="lg:hidden mt-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">Minane Service</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Plateforme e-commerce professionnelle • © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}