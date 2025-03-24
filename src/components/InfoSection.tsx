
import React from 'react';
import { Shield, Image, Zap, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface InfoSectionProps {
  id: string;
  title: string;
  description: string;
  type: 'about' | 'how-it-works' | 'features';
}

const InfoSection: React.FC<InfoSectionProps> = ({ id, title, description, type }) => {
  return (
    <section id={id} className="section-padding bg-white">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {description}
          </p>
        </div>
        
        {type === 'about' && <AboutContent />}
        {type === 'how-it-works' && <HowItWorksContent />}
        {type === 'features' && <FeaturesContent />}
      </div>
    </section>
  );
};

const AboutContent: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="flex flex-col justify-center">
        <h3 className="text-2xl font-semibold mb-4">Why This Matters</h3>
        <p className="text-muted-foreground mb-6">
          As AI-generated images become increasingly sophisticated, distinguishing between real 
          and artificial content is more challenging than ever. This technology helps maintain 
          authenticity and trust in visual media.
        </p>
        <p className="text-muted-foreground">
          Our advanced image classifier uses state-of-the-art machine learning algorithms 
          to identify subtle patterns and artifacts that are characteristic of AI-generated imagery, 
          helping users verify the authenticity of visual content.
        </p>
      </div>
      <div className="bg-gradient-to-tr from-blue-50 to-indigo-50 rounded-2xl p-6 flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          <Card className="glassmorphism border-0">
            <CardContent className="flex flex-col items-center py-6">
              <Shield className="text-primary mb-3" size={32} />
              <span className="text-sm font-medium">Protection</span>
            </CardContent>
          </Card>
          <Card className="glassmorphism border-0">
            <CardContent className="flex flex-col items-center py-6">
              <Image className="text-primary mb-3" size={32} />
              <span className="text-sm font-medium">Verification</span>
            </CardContent>
          </Card>
          <Card className="glassmorphism border-0">
            <CardContent className="flex flex-col items-center py-6">
              <Eye className="text-primary mb-3" size={32} />
              <span className="text-sm font-medium">Awareness</span>
            </CardContent>
          </Card>
          <Card className="glassmorphism border-0">
            <CardContent className="flex flex-col items-center py-6">
              <Zap className="text-primary mb-3" size={32} />
              <span className="text-sm font-medium">Efficiency</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const HowItWorksContent: React.FC = () => {
  const steps = [
    {
      number: 1,
      title: 'Upload an Image',
      description: 'Upload or drag and drop the image you want to analyze.'
    },
    {
      number: 2,
      title: 'Analysis Process',
      description: 'Our AI examines pixel-level patterns, metadata, and image characteristics.'
    },
    {
      number: 3,
      title: 'Detection Results',
      description: 'Receive detailed analysis with confidence scores and classification.'
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {steps.map((step) => (
        <div key={step.number} className="glassmorphism rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-xl font-semibold text-primary">{step.number}</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
          <p className="text-muted-foreground">{step.description}</p>
        </div>
      ))}
    </div>
  );
};

const FeaturesContent: React.FC = () => {
  const features = [
    {
      icon: <CheckCircle2 className="text-green-500" size={24} />,
      title: 'Real Photo Detection',
      description: 'Identify authentic photographs with high confidence'
    },
    {
      icon: <AlertCircle className="text-amber-500" size={24} />,
      title: 'AI Image Detection',
      description: 'Detect AI-generated content across multiple generation models'
    },
    {
      icon: <Shield className="text-primary" size={24} />,
      title: 'Detailed Analysis',
      description: 'Get comprehensive reports on detection confidence and image characteristics'
    },
    {
      icon: <Zap className="text-violet-500" size={24} />,
      title: 'Fast Processing',
      description: 'Results in seconds using optimized machine learning algorithms'
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {features.map((feature, index) => (
        <Card key={index} className="glassmorphism border-0 hover:shadow-lg transition-all">
          <CardContent className="p-6 flex">
            <div className="mr-4 mt-1">{feature.icon}</div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InfoSection;
