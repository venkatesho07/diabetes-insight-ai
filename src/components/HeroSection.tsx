import { Activity, Brain, HeartPulse } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden gradient-hero py-20 px-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-primary-foreground/20 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-foreground/10 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-primary-foreground/15 rounded-full px-4 py-2 mb-6">
          <Brain className="w-4 h-4 text-primary-foreground" />
          <span className="text-sm font-medium text-primary-foreground/90">
            Machine Learning Powered
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-primary-foreground mb-4 leading-tight">
          Diabetes Prediction System
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
          Using Decision Tree Classification Algorithm trained on the PIMA Indians Diabetes Dataset
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-primary-foreground/70 text-sm">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>8 Medical Parameters</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            <span>Decision Tree Algorithm</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4" />
            <span>78.5% Accuracy</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
