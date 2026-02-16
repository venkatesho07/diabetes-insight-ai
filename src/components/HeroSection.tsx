import { Activity, Brain, HeartPulse, LogIn, LayoutDashboard, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/api";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-doctor.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Doctor consulting patient in modern hospital"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
      </div>

      {/* Animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-20 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-5 py-2.5 mb-8"
          >
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary tracking-wide uppercase">
              Machine Learning Powered
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold font-display text-primary-foreground mb-6 leading-[1.1]"
          >
            Diabetes{" "}
            <span className="text-gradient">Prediction</span>{" "}
            System
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-primary-foreground/70 max-w-lg mb-10 leading-relaxed"
          >
            Advanced Decision Tree Classification trained on the PIMA Indians
            Diabetes Dataset — delivering instant, accurate risk assessments.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-6 mb-12"
          >
            {[
              { icon: Activity, label: "8 Parameters" },
              { icon: Brain, label: "Decision Tree" },
              { icon: HeartPulse, label: "78.5% Accuracy" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 text-primary-foreground/60">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <a href="#predict">
              <Button size="lg" className="gradient-primary text-primary-foreground font-semibold text-base px-8 h-13 rounded-xl shadow-glow hover:shadow-elevated transition-all duration-300">
                Start Prediction
              </Button>
            </a>
            {isAuthenticated() ? (
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 font-semibold h-13 rounded-xl">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="lg" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 font-semibold h-13 rounded-xl">
                  <LogIn className="w-4 h-4 mr-2" />
                  Doctor Login
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <a href="#predict" className="flex flex-col items-center gap-1 text-primary-foreground/40 hover:text-primary-foreground/60 transition-colors">
          <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
