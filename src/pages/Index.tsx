import HeroSection from "@/components/HeroSection";
import PredictionForm from "@/components/PredictionForm";
import MetricsSection from "@/components/MetricsSection";
import AlgorithmSection from "@/components/AlgorithmSection";
import { HeartPulse } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <PredictionForm />
      <MetricsSection />
      <AlgorithmSection />

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border bg-card">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <HeartPulse className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground text-lg">
              Diabetes Prediction System
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built using Decision Tree Classification Algorithm • PIMA Indians Diabetes Dataset
          </p>
          <p className="mt-2 text-xs text-muted-foreground/70">
            Disclaimer: This tool is for educational purposes only and should not replace professional medical advice.
          </p>
        </motion.div>
      </footer>
    </div>
  );
};

export default Index;
