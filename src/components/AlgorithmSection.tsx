import { GitBranch, Database, Cog, FlaskConical } from "lucide-react";

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
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-display text-foreground mb-2">
            How It Works
          </h2>
          <p className="text-muted-foreground">
            The Decision Tree algorithm workflow
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-card rounded-xl shadow-card border border-border p-6 flex gap-4 items-start hover:shadow-elevated transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
                <step.icon className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary bg-accent rounded-full px-2 py-0.5">
                    Step {i + 1}
                  </span>
                  <h3 className="font-semibold font-display text-foreground">{step.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Decision Tree visual */}
        <div className="mt-10 bg-card rounded-xl shadow-card border border-border p-6">
          <h3 className="text-lg font-semibold font-display text-foreground mb-4 text-center">
            Decision Tree Visualization (Simplified)
          </h3>
          <div className="flex justify-center">
            <pre className="text-xs md:text-sm text-muted-foreground font-mono leading-relaxed overflow-x-auto">
{`                    ┌─────────────────┐
                    │  Glucose ≥ 140? │
                    └────────┬────────┘
                   Yes ─┐    └─── No
              ┌─────────┴──────┐     ┌──────────────┐
              │   BMI ≥ 33.6?  │     │  Age ≥ 29?   │
              └───────┬────────┘     └──────┬───────┘
             Yes ─┐   └── No       Yes ─┐   └── No
          ┌───────┴──────┐            ┌──┴───────────┐
          │  🔴 Diabetic  │            │ DPF ≥ 0.5?   │
          └──────────────┘            └──────┬───────┘
                                    Yes ─┐   └── No
                                 ┌───────┴───┐  ┌───────────────┐
                                 │ 🔴 Diabetic│  │ 🟢 Non-Diabet.│
                                 └───────────┘  └───────────────┘`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AlgorithmSection;
