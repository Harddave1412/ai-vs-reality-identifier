
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
        
        // Use a better model for general image classification
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
      // Convert the File to a base64 string
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
          
          // Improved keyword lists with more precise terms
          const aiKeywords = [
            'digital art', 'rendering', 'illustration', 'cartoon', 'drawing', 
            'animated', 'cgi', 'graphic', 'computer generated', 'digital painting', 
            '3d model', 'artwork', 'animation', 'game art', 'concept art', 
            'vector', 'digital illustration', 'artificial', 'synthetic', 'generated',
            'comic', 'manga', 'anime', 'abstract', 'design'
          ];
          
          const realKeywords = [
            'photo', 'photograph', 'photography', 'landscape', 'portrait', 
            'camera', 'realistic', 'person', 'people', 'natural', 'nature', 
            'outdoor', 'indoor', 'building', 'animal', 'face', 'human', 
            'man', 'woman', 'candid', 'snapshot', 'documentary', 'wildlife',
            'street', 'food', 'plant', 'sky', 'water', 'garden', 'beach'
          ];
          
          let aiScore = 0;
          let realScore = 0;
          let hasFoundKeywords = false;
          
          // Analyze the labels and their scores - use the full result set
          results.forEach((prediction: any) => {
            const label = prediction.label.toLowerCase();
            const score = prediction.score;
            
            // Check if any AI or real keywords are found in the label
            const foundAiKeyword = aiKeywords.some(keyword => label.includes(keyword));
            const foundRealKeyword = realKeywords.some(keyword => label.includes(keyword));
            
            if (foundAiKeyword) {
              aiScore += score;
              hasFoundKeywords = true;
              console.log(`Found AI keyword in: ${label} with score ${score}`);
            } 
            
            if (foundRealKeyword) {
              realScore += score;
              hasFoundKeywords = true;
              console.log(`Found Real keyword in: ${label} with score ${score}`);
            }
          });
          
          // If no keywords were found, use a more sophisticated analysis
          if (!hasFoundKeywords) {
            // Examine the top predictions and their distribution
            const topPredictions = results.slice(0, 5);
            
            // Check confidence of top prediction
            const topScore = topPredictions[0].score;
            
            // Calculate distribution of confidence across top predictions
            const avgConfidence = topPredictions.reduce((sum: number, pred: any) => 
              sum + pred.score, 0) / topPredictions.length;
            
            const confidenceSpread = topScore - avgConfidence;
            
            // Natural photos often have clearer subjects and higher top scores
            if (topScore > 0.6 && confidenceSpread > 0.3) {
              realScore += 0.8;
              aiScore += 0.2;
              console.log("No keywords found. High top score with large spread suggests real image.");
            } 
            // More even distribution often indicates AI-generated content
            else if (confidenceSpread < 0.2) {
              aiScore += 0.7;
              realScore += 0.3;
              console.log("No keywords found. Even distribution suggests AI image.");
            }
            // Check for patterns in the labels themselves
            else {
              const topLabels = topPredictions.map(p => p.label.toLowerCase()).join(' ');
              
              // Check for artificial/abstract content indicators
              const artificialIndicators = ['abstract', 'pattern', 'texture', 'design', 'art', 'graphic'];
              const hasArtificialIndicators = artificialIndicators.some(indicator => 
                topLabels.includes(indicator)
              );
              
              // Check for natural world indicators
              const naturalIndicators = ['person', 'tree', 'water', 'sky', 'mountain', 'animal', 'building'];
              const hasNaturalIndicators = naturalIndicators.some(indicator => 
                topLabels.includes(indicator)
              );
              
              if (hasArtificialIndicators && !hasNaturalIndicators) {
                aiScore += 0.75;
                realScore += 0.25;
                console.log("Found artificial indicators in predictions.");
              } else if (hasNaturalIndicators && !hasArtificialIndicators) {
                realScore += 0.75;
                aiScore += 0.25;
                console.log("Found natural world indicators in predictions.");
              } else {
                // If balanced or unclear, give slightly more weight to real
                realScore += 0.6;
                aiScore += 0.4;
                console.log("No clear indicators, slightly favoring real image.");
              }
            }
          }
          
          // Normalize scores to ensure they sum to 1
          const total = aiScore + realScore;
          if (total > 0) {
            aiScore = aiScore / total;
            realScore = realScore / total;
          } else {
            // Fallback if no scores were calculated
            aiScore = 0.5;
            realScore = 0.5;
          }
          
          console.log(`Final scores - Real: ${realScore}, AI: ${aiScore}`);
          
          // Determine final prediction and confidence
          const prediction = realScore > aiScore ? 'real' : 'ai';
          const confidence = prediction === 'real' ? realScore : aiScore;
          
          setResult({
            prediction,
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
