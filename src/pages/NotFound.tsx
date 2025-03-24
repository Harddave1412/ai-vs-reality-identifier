
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="glassmorphism rounded-2xl p-12 text-center max-w-md animate-fade-up">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-red-500">404</span>
          </div>
          <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find the page you were looking for. The page might have been moved, deleted, or never existed.
          </p>
          <Button size="lg" asChild>
            <a href="/">
              <Home className="mr-2" size={18} />
              Return to Home
            </a>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
