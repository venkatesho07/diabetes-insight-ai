import { GitBranch, Database, Cog, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";
import doctorReportImg from "@/assets/doctor-report.jpg";

const steps = [
  {
    icon: Database,
    title: "Data Collection",
    desc: "Load the PIMA Indians Diabetes Dataset containing 768 patient records with 8 medical features.",
  },
  {
    icon: Cog,
    title: "Preprocessing",
    desc: "Handle missing values, normalize features, and split data into 80% training and 20% testing sets.",
  },
  {
    icon: GitBranch,
    title: "Decision Tree Training",
    desc: "Train a Decision Tree Classifier using Gini impurity to create optimal splits on medical features.",
  },
  {
    icon: FlaskConical,
    title: "Prediction",
    desc: "The trained model traverses the tree based on patient input to classify as Diabetic or Non-Diabetic.",
  },
];

const AlgorithmSection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-semibold text-primary tracking-widest uppercase mb-3">Methodology</span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            A four-step machine learning pipeline from data to diagnosis
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="bg-card rounded-2xl shadow-card border border-border p-5 flex gap-4 items-start hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold font-display text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Image + Tree visualization */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-2xl overflow-hidden shadow-premium border border-border">
              <img
                src={doctorReportImg}
                alt="Doctor reviewing medical report"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
            </div>

            <div className="bg-card rounded-2xl shadow-card border border-border p-6">
              <h3 className="text-sm font-semibold font-display text-foreground mb-4 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-primary" />
                Decision Tree Structure (Simplified)
              </h3>
              <pre className="text-xs text-muted-foreground font-mono leading-relaxed overflow-x-auto">
{`             ┌─────────────────┐
             │  Glucose ≥ 140? │
             └────────┬────────┘
            Yes ─┐    └─── No
       ┌─────────┴──────┐    ┌──────────┐
       │   BMI ≥ 33.6?  │    │ Age ≥ 29?│
       └───────┬────────┘    └────┬─────┘
      Yes ─┐   └── No      Yes ─┐└── No
   ┌───────┴──────┐       ┌──┴───────┐
   │  🔴 Diabetic  │       │ DPF≥0.5? │
   └──────────────┘       └────┬─────┘
                         Yes ─┐└── No
                     ┌───────┴──┐ ┌──────────┐
                     │🔴Diabetic│ │🟢Non-Diab│
                     └──────────┘ └──────────┘`}
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AlgorithmSection;
