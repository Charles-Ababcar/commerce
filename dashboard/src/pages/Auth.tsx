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
import { ShoppingBag, Eye, EyeOff, User, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      
      <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 relative z-10 overflow-hidden">
        {/* Card accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        
        <CardHeader className="space-y-6 text-center pb-2">
          <div className="relative">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <ShoppingBag className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-accent-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Bienvenue Minane Service
            </CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-gray-400">
              Connectez-vous pour accéder à votre tableau de bord e-commerce
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4" />
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
                    className="pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    disabled={isLoading}
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="w-4 h-4" />
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
                    className="pl-10 pr-10 h-12 rounded-lg border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-transparent"
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
                  <div className="text-xs text-gray-500 animate-in fade-in duration-300">
                    {password.length < 6 ? (
                      <span className="text-amber-600">Mot de passe trop court (min. 6 caractères)</span>
                    ) : (
                      <span className="text-green-600">Mot de passe visible</span>
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
                    className="rounded"
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
              className="w-full h-12 rounded-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
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
          
          <div className="relative my-6">
            <Separator />
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-sm text-gray-500">
              ou
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-lg border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => toast.info('Fonctionnalité à venir', {
                description: 'Authentification unique bientôt disponible'
              })}
            >
              <div className="w-5 h-5 rounded-full bg-blue-500 mr-3 flex items-center justify-center">
                <span className="text-xs text-white">SSO</span>
              </div>
              Continuer avec SSO
            </Button>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3 border-t pt-6">
          <div className="text-center text-sm text-gray-500">
            <p>Besoin d'aide ? <span className="text-primary cursor-pointer hover:underline">Contactez le support</span></p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>Système sécurisé • HTTPS • Chiffrement AES-256</span>
          </div>
        </CardFooter>
      </Card>
      
      {/* Version info */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400">
        v2.4.1 • {new Date().getFullYear()} © Minane Service
      </div>
    </div>
  );
}