
import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import UploadZone from './UploadZone';
import ResultDisplay from './ResultDisplay';
import { toast } from "@/components/ui/sonner";

const ImageClassifier: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    prediction: 'real' | 'ai' | null;
    confidence: number;
    details?: {
      realScore: number;
      aiScore: number;
    };
  } | null>(null);

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setResult(null);
  };

  const analyzeImage = () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // In a real app, this would be an actual API call to a model
      // For demo purposes, we'll use random results
      const isAI = Math.random() > 0.5;
      const confidence = 0.7 + (Math.random() * 0.3); // Random between 0.7 and 1.0
      
      const realScore = isAI ? 1 - confidence : confidence;
      const aiScore = isAI ? confidence : 1 - confidence;
      
      setResult({
        prediction: isAI ? 'ai' : 'real',
        confidence,
        details: {
          realScore,
          aiScore
        }
      });
      
      setIsAnalyzing(false);
      
      toast.success("Analysis complete!");
    }, 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glassmorphism rounded-2xl p-8 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Image Analyzer</h2>
          <p className="text-muted-foreground">
            Upload an image to determine if it's a real photograph or AI-generated
          </p>
        </div>
        
        <UploadZone onImageSelected={handleImageSelected} />
        
        {selectedImage && !isAnalyzing && !result && (
          <div className="mt-6 text-center">
            <Button 
              onClick={analyzeImage}
              className="px-8 py-6 text-lg"
            >
              <Sparkles className="mr-2" size={20} />
              Analyze Image
            </Button>
          </div>
        )}
      </div>
      
      {(isAnalyzing || result) && (
        <div className="mt-8">
          <ResultDisplay isAnalyzing={isAnalyzing} result={result} />
        </div>
      )}
    </div>
  );
};

export default ImageClassifier;
