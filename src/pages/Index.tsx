
import React from 'react';
import { ArrowDown } from 'lucide-react';
import Header from '../components/Header';
import ImageClassifier from '../components/ImageClassifier';
import InfoSection from '../components/InfoSection';
import ExampleGallery from '../components/ExampleGallery';
import Footer from '../components/Footer';

const Index = () => {
  const scrollToClassifier = () => {
    const element = document.getElementById('classifier');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="mt-16 pt-12 pb-20 px-6 flex items-center justify-center min-h-[90vh] bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            AI vs. Reality Detection Technology
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight animate-fade-up">
            Distinguish <span className="text-primary">Real</span> Photos from <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">AI-Generated</span> Images
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Our advanced AI technology analyzes images to determine whether they were captured by a camera or created by artificial intelligence.
          </p>
          <button 
            onClick={scrollToClassifier}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl animate-fade-up"
            style={{ animationDelay: '0.2s' }}
          >
            Try It Now
            <ArrowDown className="ml-2" size={18} />
          </button>
        </div>
      </section>
      
      {/* Classifier Section */}
      <section id="classifier" className="py-16 px-6 bg-white">
        <div className="container mx-auto">
          <ImageClassifier />
        </div>
      </section>
      
      {/* About Section */}
      <InfoSection 
        id="about"
        title="About Our Technology"
        description="Our AI-powered image classifier uses advanced machine learning algorithms to distinguish between real photographs and AI-generated images."
        type="about"
      />
      
      {/* How It Works Section */}
      <InfoSection 
        id="how-it-works"
        title="How It Works"
        description="Our technology analyzes multiple aspects of an image to determine its authenticity with high accuracy."
        type="how-it-works"
      />
      
      {/* Examples Section */}
      <section id="examples" className="section-padding bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Example Gallery</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Browse our collection of real and AI-generated images to see the differences our technology can detect.
            </p>
          </div>
          
          <ExampleGallery />
        </div>
      </section>
      
      {/* Features Section */}
      <InfoSection 
        id="features"
        title="Key Features"
        description="Our platform offers powerful tools and capabilities to help you identify the authenticity of any image."
        type="features"
      />
      
      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Verify Your Images?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Start using our advanced AI technology today to distinguish between real photos and AI-generated images.
          </p>
          <button 
            onClick={scrollToClassifier}
            className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-medium hover:bg-blue-50 transition-colors shadow-lg"
          >
            Try the Analyzer
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
