import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/Layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api';
import { Sparkles, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Gemini() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [response, setResponse] = useState('');

  const chatMutation = useMutation({
    mutationFn: (text: string) => apiClient.chatWithGemini(text),
    onSuccess: (data) => setResponse(data.response),
    onError: (error) => toast.error(`An error occurred: ${error.message}`),
  });

  const chatWithImageMutation = useMutation({
    mutationFn: (variables: { prompt: string; file: File }) => apiClient.chatWithGeminiWithImage(variables.prompt, variables.file),
    onSuccess: (data) => setResponse(data.response),
    onError: (error) => toast.error(`An error occurred: ${error.message}`),
  });

  const handleSubmit = () => {
    if (!prompt) {
      toast.error('Please enter a prompt.');
      return;
    }

    setResponse('');

    if (image) {
      chatWithImageMutation.mutate({ prompt, file: image });
    } else {
      chatMutation.mutate(prompt);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Gemini AI</h1>
          <p className="text-muted-foreground mt-2">Interact with the Gemini AI assistant</p>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-6 space-y-4">
            <Textarea
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[150px] text-lg"
            />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                        <ImageIcon className="w-5 h-5 mr-2" />
                        {image ? `Image: ${image.name}` : 'Upload Image'}
                    </Button>
                    <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={e => setImage(e.target.files?.[0] || null)}/>
                </div>
                <Button onClick={handleSubmit} disabled={chatMutation.isPending || chatWithImageMutation.isPending}>
                    <Sparkles className="w-5 h-5 mr-2" />
                    {chatMutation.isPending || chatWithImageMutation.isPending ? 'Generating...' : 'Generate Response'}
                </Button>
            </div>

          </CardContent>
        </Card>

        {(chatMutation.isPending || chatWithImageMutation.isPending || response) && (
          <Card className="shadow-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">AI Response</h3>
              {chatMutation.isPending || chatWithImageMutation.isPending ? (
                <div className="space-y-2">
                    <div className="h-4 bg-muted animate-pulse rounded w-full" />
                    <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                </div>
              ) : (
                <p className="text-muted-foreground whitespace-pre-wrap">{response}</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
