import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Shield, Smartphone, Globe, ShoppingBag, Sparkles } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Veuillez entrer votre adresse email', {
        icon: <AlertCircle className="w-4 h-4" />
      });
      return;
    }
    
    // Validation basique d'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Adresse email invalide', {
        description: 'Veuillez entrer une adresse email valide',
        icon: <AlertCircle className="w-4 h-4" />
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En production, remplacer par un appel réel à votre API
      // await resetPassword(email);
      
      setIsSubmitted(true);
      toast.success('Email envoyé avec succès !', {
        description: 'Vérifiez votre boîte de réception',
        icon: <CheckCircle className="w-4 h-4" />
      });
      
    } catch (error) {
      toast.error('Erreur lors de l\'envoi', {
        description: 'Veuillez réessayer plus tard',
        icon: <AlertCircle className="w-4 h-4" />
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast.success('Email renvoyé !', {
        description: 'Vérifiez à nouveau votre boîte de réception',
        icon: <Sparkles className="w-4 h-4" />
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4 md:p-8">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 pr-8">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Sécurité Minane
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Récupération de compte sécurisée</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Retrouvez l'accès à votre compte
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Suivez les étapes simples pour réinitialiser votre mot de passe en toute sécurité.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Entrez votre email</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  L'adresse email associée à votre compte Minane Service
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Vérifiez vos emails</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Recevez un lien de réinitialisation sécurisé dans votre boîte de réception
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-primary font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Créez un nouveau mot de passe</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Choisissez un mot de passe fort et sécurisé pour votre compte
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Sécurisé</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Lien de réinitialisation unique</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
                <Smartphone className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">Rapide</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Réinitialisation en quelques minutes</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Processus sécurisé</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Chiffrement TLS 1.3</span>
            </div>
          </div>
        </div>

        {/* Right Side - Reset Form */}
        <div className="w-full">
          <Card className="w-full shadow-2xl border-0 max-w-lg mx-auto lg:mx-0 lg:ml-auto">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            
            <CardHeader className="space-y-4 pb-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-fit -ml-2 mb-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200 text-center">
                    {isSubmitted ? 'Vérifiez vos emails' : 'Mot de passe oublié ?'}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-2 text-center">
                    {isSubmitted 
                      ? 'Nous avons envoyé un lien de réinitialisation à votre adresse email'
                      : 'Entrez votre adresse email pour réinitialiser votre mot de passe'
                    }
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Adresse Email
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          placeholder="vous@exemple.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="pl-10 h-12 rounded-lg border-gray-300 dark:border-gray-700"
                          disabled={isLoading}
                        />
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Entrez l'adresse email associée à votre compte Minane Service
                      </p>
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
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer le lien de réinitialisation'
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Email envoyé avec succès !
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Un lien de réinitialisation a été envoyé à :
                    </p>
                    <p className="font-medium text-primary mt-2">{email}</p>
                    <p className="text-xs text-gray-500 mt-4">
                      Le lien expirera dans 1 heure pour des raisons de sécurité
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                        ⚡ Conseils rapides
                      </h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="mt-1">•</span>
                          <span>Vérifiez votre dossier spam/courrier indésirable</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1">•</span>
                          <span>Assurez-vous que l'email est correct : {email}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1">•</span>
                          <span>Cliquez sur le lien dans les 60 minutes</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={handleResendEmail}
                        variant="outline"
                        className="flex-1 h-12"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                            Renvoi...
                          </>
                        ) : (
                          'Renvoyer l\'email'
                        )}
                      </Button>
                      <Button
                        onClick={() => navigate('/auth')}
                        variant="default"
                        className="flex-1 h-12 bg-gradient-to-r from-primary to-accent"
                      >
                        Retour à la connexion
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 border-t pt-6">
              <div className="text-center text-sm text-gray-500">
                <p>
                  Vous n'avez pas reçu d'email ?{' '}
                  <Button
                    variant="link"
                    className="text-primary hover:text-primary/80 px-0"
                    onClick={() => {
                      toast.info('Contactez le support', {
                        description: 'Email: support@minaneservice.com',
                        duration: 5000
                      });
                    }}
                  >
                    Contacter le support
                  </Button>
                </p>
              </div>
              
              <div className="text-center text-xs text-gray-400">
                <p>Pour votre sécurité, nous ne stockons jamais vos mots de passe en clair.</p>
              </div>
            </CardFooter>
          </Card>
          
          {/* Mobile Branding */}
          <div className="lg:hidden mt-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShoppingBag className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-gray-800 dark:text-gray-200">Minane Service</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Assistance sécurité • © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}