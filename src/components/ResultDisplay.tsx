
import React from 'react';
import { Check, AlertTriangle, ShieldAlert, Info } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface ResultDisplayProps {
  isAnalyzing: boolean;
  result: {
    prediction: 'real' | 'ai' | null;
    confidence: number;
    details?: {
      realScore: number;
      aiScore: number;
    };
  } | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ isAnalyzing, result }) => {
  if (isAnalyzing) {
    return (
      <div className="glassmorphism rounded-xl p-8 w-full max-w-xl mx-auto animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-full space-y-2">
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse-soft w-3/4"></div>
            </div>
          </div>
          <h3 className="text-lg font-medium mt-4">Analyzing image...</h3>
          <p className="text-muted-foreground text-sm mt-2">
            Our AI is examining the image for signs of artificial generation
          </p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const { prediction, confidence, details } = result;
  
  // Format confidence for display
  const confidencePercent = Math.round(confidence * 100);
  
  // Determine messages based on confidence levels
  const getMessage = () => {
    if (prediction === 'real') {
      if (confidence > 0.9) {
        return "This image appears to be a genuine photograph with high confidence.";
      } else if (confidence > 0.7) {
        return "This image appears to be a real photograph, though there are some ambiguous elements.";
      } else {
        return "This image appears to be a real photograph, but our confidence is low.";
      }
    } else {
      if (confidence > 0.9) {
        return "This image shows strong indicators of AI generation.";
      } else if (confidence > 0.7) {
        return "This image appears to be AI-generated, though some elements look realistic.";
      } else {
        return "This image shows some signs of AI generation, but our confidence is low.";
      }
    }
  };
  
  return (
    <div className="glassmorphism rounded-xl p-8 w-full max-w-xl mx-auto animate-fade-in">
      <div className="flex flex-col items-center text-center">
        {prediction === 'real' ? (
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Check className="text-green-600" size={32} />
          </div>
        ) : prediction === 'ai' ? (
          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <ShieldAlert className="text-amber-600" size={32} />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <AlertTriangle className="text-gray-600" size={32} />
          </div>
        )}

        <h3 className="text-2xl font-semibold mb-2">
          {prediction === 'real' 
            ? 'Real Image' 
            : prediction === 'ai' 
              ? 'AI-Generated' 
              : 'Uncertain Result'}
        </h3>
        
        <p className="text-muted-foreground mb-6">
          {getMessage()}
        </p>

        <div className="w-full space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Confidence</span>
              <span className="font-medium">{confidencePercent}%</span>
            </div>
            <Progress value={confidencePercent} className="h-2" />
          </div>

          {details && (
            <div>
              <div className="flex items-center justify-center gap-1 mb-3 text-sm text-muted-foreground">
                <Info size={16} />
                <span>Detailed analysis scores</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Real Score</span>
                    <span className="font-medium">{Math.round(details.realScore * 100)}%</span>
                  </div>
                  <Progress value={details.realScore * 100} className="h-2 bg-secondary" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI Score</span>
                    <span className="font-medium">{Math.round(details.aiScore * 100)}%</span>
                  </div>
                  <Progress value={details.aiScore * 100} className="h-2 bg-secondary" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
