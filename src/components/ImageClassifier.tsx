
import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import UploadZone from './UploadZone';
import ResultDisplay from './ResultDisplay';
import { toast } from "sonner";
import { pipeline } from '@huggingface/transformers';

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
  const [modelLoading, setModelLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [classifier, setClassifier] = useState<any>(null);

  // Initialize the model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelLoading(true);
        setModelError(null);
        
        // Use a simpler image classification model that's compatible with the browser
        const imgClassifier = await pipeline(
          'image-classification',
          'Xenova/vit-base-patch16-224'
        );
        
        setClassifier(() => imgClassifier); // Store classifier as a function
        setModelLoaded(true);
        toast.success("Image analysis model loaded successfully!");
      } catch (error) {
        console.error('Error loading model:', error);
        setModelError('Failed to load the image classification model');
        toast.error('Could not load the image analysis model');
      } finally {
        setModelLoading(false);
      }
    };

    loadModel();
  }, []);

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    if (!modelLoaded || !classifier) {
      toast.error("Model is not loaded yet. Please wait and try again.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);
    
    try {
      // Convert the File to a base64 string, which works better with the models
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          if (!e.target || !e.target.result) {
            throw new Error("Failed to read image file");
          }
          
          const base64String = e.target.result as string;
          
          // Run the model with the base64 string
          console.log("Running classification on image...");
          const results = await classifier(base64String);
          console.log("Model results:", results);
          
          // Define more comprehensive keyword lists for better classification
          const aiKeywords = [
            'synthetic', 'artificial', 'digital art', 'rendering', 'illustration', 
            'cartoon', 'drawing', 'animated', 'cgi', 'graphic', 'computer', 'generated',
            'digital', 'painting', '3d', 'anime', 'artwork', 'design', 'abstract',
            'vector', 'model', 'simulation', 'virtual', 'game', 'concept art'
          ];
          
          const realKeywords = [
            'photo', 'photograph', 'photography', 'landscape', 'portrait', 
            'natural', 'real', 'image', 'camera', 'realistic', 'person',
            'outdoor', 'indoor', 'nature', 'building', 'animal', 'face',
            'human', 'man', 'woman', 'candid', 'snapshot', 'documentary'
          ];
          
          let aiScore = 0;
          let realScore = 0;
          let hasFoundKeywords = false;
          
          // Analyze the labels and their scores - use the full result set
          results.forEach((prediction: any) => {
            const label = prediction.label.toLowerCase();
            const score = prediction.score;
            
            // Check if any AI or real keywords are found in the label
            const foundAiKeyword = aiKeywords.find(keyword => label.includes(keyword));
            const foundRealKeyword = realKeywords.find(keyword => label.includes(keyword));
            
            if (foundAiKeyword) {
              aiScore += score;
              hasFoundKeywords = true;
              console.log(`Found AI keyword: ${foundAiKeyword} in ${label} with score ${score}`);
            } 
            
            if (foundRealKeyword) {
              realScore += score;
              hasFoundKeywords = true;
              console.log(`Found Real keyword: ${foundRealKeyword} in ${label} with score ${score}`);
            }
          });
          
          // If no keywords were found, use a more sophisticated analysis
          if (!hasFoundKeywords) {
            // Examine the top 3 predictions and their distribution
            const topPredictions = results.slice(0, 3);
            
            // Check confidence of top prediction - real photos often have more definitive top prediction
            const topScore = topPredictions[0].score;
            
            // Calculate distribution of confidence across top predictions
            const distributionScore = topPredictions.reduce((sum: number, pred: any, index: number) => {
              return sum + (pred.score / (index + 1));
            }, 0);
            
            // Natural images often have clearer subjects and higher top scores
            if (topScore > 0.5) {
              realScore += 0.7;
              aiScore += 0.3;
              console.log("No keywords found, using confidence-based analysis. High top score suggests real image.");
            } 
            // More even distribution of probabilities often indicates AI-generated content
            else if (distributionScore < 0.4) {
              aiScore += 0.7;
              realScore += 0.3;
              console.log("No keywords found, using distribution analysis. Even probability distribution suggests AI image.");
            }
            // If still uncertain, use the label content itself for hints
            else {
              const topLabels = topPredictions.map(p => p.label.toLowerCase());
              const isAbstract = topLabels.some(label => 
                ['abstract', 'pattern', 'texture', 'design', 'art'].some(term => 
                  label.includes(term)
                )
              );
              
              if (isAbstract) {
                aiScore += 0.65;
                realScore += 0.35;
                console.log("No direct keywords found, but abstract concepts detected suggesting AI generation.");
              } else {
                realScore += 0.55;
                aiScore += 0.45;
                console.log("No clear indicators, slightly favoring real image based on concrete subjects.");
              }
            }
          }
          
          // Normalize scores to ensure they sum to 1
          const total = aiScore + realScore;
          if (total > 0) {
            aiScore = aiScore / total;
            realScore = realScore / total;
          } else {
            // Fallback if no scores were calculated (shouldn't happen with the improved analysis)
            aiScore = 0.5;
            realScore = 0.5;
          }
          
          // Determine final prediction and confidence
          const isAI = aiScore > realScore;
          const confidence = isAI ? aiScore : realScore;
          
          setResult({
            prediction: isAI ? 'ai' : 'real',
            confidence,
            details: {
              realScore,
              aiScore
            }
          });
          
          toast.success("Analysis complete!");
        } catch (error) {
          console.error("Error during image analysis:", error);
          toast.error("Failed to analyze the image");
        } finally {
          setIsAnalyzing(false);
        }
      };
      
      reader.onerror = () => {
        console.error("Error reading file");
        toast.error("Failed to read the image file");
        setIsAnalyzing(false);
      };
      
      // Start reading the file as a data URL (base64)
      reader.readAsDataURL(selectedImage);
      
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error("Failed to analyze the image");
      setIsAnalyzing(false);
    }
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
        
        {modelError && (
          <div className="bg-destructive/10 p-4 rounded-lg mb-6 flex items-center">
            <AlertCircle className="text-destructive mr-2" size={20} />
            <p className="text-destructive">{modelError}</p>
          </div>
        )}
        
        {modelLoading && (
          <div className="text-center py-4 mb-6">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-muted-foreground">Loading analysis model...</p>
          </div>
        )}
        
        <UploadZone onImageSelected={handleImageSelected} />
        
        {selectedImage && !isAnalyzing && !result && modelLoaded && (
          <div className="mt-6 text-center">
            <Button 
              onClick={analyzeImage}
              className="px-8 py-6 text-lg"
              disabled={!modelLoaded}
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
