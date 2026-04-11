import { Button } from "../components/ui/button";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FileQuestion } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 mb-6 rounded-full bg-[#F7931E]/10 flex items-center justify-center text-[#F7931E]">
          <FileQuestion className="w-12 h-12" />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex gap-4">
          <Button 
            className="bg-[#F7931E] hover:bg-[#F7931E]/90 text-white px-8 h-12 rounded-full"
            onClick={() => window.location.href = '/'}
          >
            Go to Homepage
          </Button>
          <Button 
            variant="outline" 
            className="px-8 h-12 rounded-full border-gray-300"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
