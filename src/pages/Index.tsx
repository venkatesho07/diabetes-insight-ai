import HeroSection from "@/components/HeroSection";
import PredictionForm from "@/components/PredictionForm";
import MetricsSection from "@/components/MetricsSection";
import AlgorithmSection from "@/components/AlgorithmSection";
import { HeartPulse } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <PredictionForm />
      <MetricsSection />
      <AlgorithmSection />

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HeartPulse className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-foreground">
              Diabetes Prediction System
            </span>
          </div>
          <p>
            Built using Decision Tree Classification Algorithm • PIMA Indians Diabetes Dataset
          </p>
          <p className="mt-1 text-xs">
            Disclaimer: This tool is for educational purposes only and should not replace professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
