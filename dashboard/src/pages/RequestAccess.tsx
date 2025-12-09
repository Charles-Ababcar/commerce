import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Mail, User, Building, MessageSquare } from 'lucide-react';

export default function RequestAccess() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulation d'envoi
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Demande envoyée !', {
        description: 'Nous vous contacterons dans les 24-48h'
      });
      
      // Reset form
      setFormData({ name: '', company: '', email: '', phone: '', message: '' });
      
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/10 p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
        
        <CardHeader>
          <Button
            variant="ghost"
            size="sm"
            className="w-fit -ml-2 mb-2"
            onClick={() => navigate('/auth')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          
          <div className="text-center">
            <CardTitle className="text-2xl">Demande d'accès</CardTitle>
            <CardDescription>
              Remplissez ce formulaire pour demander un compte administrateur
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champs du formulaire */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet *</Label>
                <div className="relative">
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Votre nom"
                    required
                    className="pl-10"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <div className="relative">
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="Nom de votre entreprise"
                    className="pl-10"
                  />
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="vous@entreprise.com"
                  required
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <div className="relative">
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Décrivez pourquoi vous avez besoin d'un accès..."
                  required
                  className="min-h-[120px] pl-10 pt-3"
                />
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer la demande'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="border-t pt-6">
          <div className="text-center text-sm text-gray-500 w-full">
            <p>
              Vous avez déjà un compte ?{' '}
              <Button
                variant="link"
                className="text-primary px-0"
                onClick={() => navigate('/auth')}
              >
                Se connecter
              </Button>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}