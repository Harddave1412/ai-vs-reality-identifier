
import React, { useState, useCallback, useRef } from 'react';
import { Upload, ImageIcon, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onImageSelected: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.match('image.*')) {
        handleFile(file);
      }
    }
  }, []);
  
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, []);
  
  const handleFile = (file: File) => {
    setPreviewUrl(URL.createObjectURL(file));
    onImageSelected(file);
  };
  
  const clearImage = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <div className="w-full max-w-xl mx-auto">
      {!previewUrl ? (
        <div
          className={`image-upload-area h-80 flex flex-col items-center justify-center cursor-pointer p-6 ${
            isDragging ? 'drag-active' : 'border-muted-foreground/30 hover:border-primary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Upload className="text-primary" size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload an image</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Drag and drop an image, or click to select a file
            </p>
            <div className="text-xs text-muted-foreground">
              Supports JPG, PNG, WEBP • Max size 10MB
            </div>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileInput}
          />
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden group">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-auto object-contain rounded-xl"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              onClick={clearImage}
              variant="destructive"
              className="absolute top-4 right-4"
              size="icon"
            >
              <X size={18} />
            </Button>
            <Button onClick={clearImage} variant="secondary">
              Choose Another Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadZone;
