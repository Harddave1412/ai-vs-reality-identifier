
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Example {
  id: number;
  imageUrl: string;
  type: 'real' | 'ai';
  title: string;
  description: string;
}

const examples: Example[] = [
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    type: 'real',
    title: 'Computer Programming',
    description: 'A real photograph of a programmer working with code on a monitor.'
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    type: 'real',
    title: 'MacBook Pro User',
    description: 'A real photograph of a person using a MacBook Pro laptop.'
  },
  {
    id: 3,
    imageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    type: 'real',
    title: 'Laptop on Surface',
    description: 'A real photograph of a gray and black laptop computer on a surface.'
  },
  {
    id: 4,
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    type: 'real',
    title: 'Circuit Board',
    description: 'A real macro photograph of a black circuit board.'
  },
  {
    id: 5,
    imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    type: 'real',
    title: 'Colorful Code',
    description: 'A real photograph of colorful software code on a computer monitor.'
  }
];

// For AI examples, in a real app we would have actual AI-generated images
const aiExamples: Example[] = examples.map((example, index) => ({
  ...example,
  id: example.id + 100,
  type: 'ai',
  title: `AI ${example.title}`,
  description: `An AI-generated version that mimics ${example.title.toLowerCase()}.`
}));

const allExamples = [...examples, ...aiExamples];

const ExampleGallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedType, setSelectedType] = useState<'all' | 'real' | 'ai'>('all');
  
  const filteredExamples = selectedType === 'all' 
    ? allExamples 
    : allExamples.filter(ex => ex.type === selectedType);
  
  const navigateGallery = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else {
      setActiveIndex(prev => (prev < filteredExamples.length - 3 ? prev + 1 : prev));
    }
  };
  
  return (
    <div className="w-full py-8">
      <div className="flex justify-center space-x-2 mb-8">
        <Button 
          variant={selectedType === 'all' ? "default" : "outline"} 
          onClick={() => { setSelectedType('all'); setActiveIndex(0); }}
          className="rounded-full"
        >
          All
        </Button>
        <Button 
          variant={selectedType === 'real' ? "default" : "outline"} 
          onClick={() => { setSelectedType('real'); setActiveIndex(0); }}
          className="rounded-full"
        >
          Real Photos
        </Button>
        <Button 
          variant={selectedType === 'ai' ? "default" : "outline"} 
          onClick={() => { setSelectedType('ai'); setActiveIndex(0); }}
          className="rounded-full"
        >
          AI Generated
        </Button>
      </div>
      
      <div className="relative">
        {activeIndex > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={() => navigateGallery('prev')}
          >
            <ChevronLeft size={24} />
          </Button>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-12 overflow-hidden">
          {filteredExamples.slice(activeIndex, activeIndex + 3).map((example) => (
            <Card key={example.id} className="overflow-hidden border glassmorphism group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={example.imageUrl}
                  alt={example.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <Badge 
                  className={`absolute top-3 right-3 ${
                    example.type === 'real' ? 'bg-green-500' : 'bg-amber-500'
                  }`}
                >
                  {example.type === 'real' ? 'Real Photo' : 'AI Generated'}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-1">{example.title}</h3>
                <p className="text-sm text-muted-foreground">{example.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {activeIndex < filteredExamples.length - 3 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
            onClick={() => navigateGallery('next')}
          >
            <ChevronRight size={24} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExampleGallery;
