import { modelMetrics, datasetInfo } from "@/lib/decisionTree";
import { BarChart3, Target, Crosshair, Repeat, Award } from "lucide-react";
import { motion } from "framer-motion";
import medicalAnalyticsImg from "@/assets/medical-analytics.jpg";

const metrics = [
  { label: "Accuracy", value: modelMetrics.accuracy, icon: Target, color: "text-primary" },
  { label: "Precision", value: modelMetrics.precision, icon: Crosshair, color: "text-primary" },
  { label: "Recall", value: modelMetrics.recall, icon: Repeat, color: "text-primary" },
  { label: "F1-Score", value: modelMetrics.f1Score, icon: Award, color: "text-primary" },
];

const MetricsSection = () => {
  const cm = modelMetrics.confusionMatrix;

  return (
    <section className="py-20 px-4 bg-secondary/40 relative overflow-hidden">
      {/* Background image accent */}
      <div className="absolute right-0 top-0 w-1/3 h-full opacity-[0.06] pointer-events-none hidden lg:block">
        <img src={medicalAnalyticsImg} alt="" className="w-full h-full object-cover" aria-hidden="true" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-semibold text-primary tracking-widest uppercase mb-3">Performance</span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            Model Evaluation Metrics
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Trained on {datasetInfo.samples} samples from the {datasetInfo.name}
          </p>
        </motion.div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl shadow-card border border-border p-6 text-center group hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                <m.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold font-display text-foreground">{m.value}%</p>
              <p className="text-sm text-muted-foreground mt-1">{m.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Confusion Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-2xl shadow-premium border border-border p-6 md:p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold font-display text-foreground">Confusion Matrix</h3>
              <p className="text-xs text-muted-foreground">True vs Predicted classifications</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full max-w-lg mx-auto text-center">
              <thead>
                <tr>
                  <th className="p-3" />
                  <th className="p-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider" colSpan={2}>
                    Predicted
                  </th>
                </tr>
                <tr>
                  <th className="p-3" />
                  <th className="p-3 text-sm font-semibold text-foreground">Negative</th>
                  <th className="p-3 text-sm font-semibold text-foreground">Positive</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 text-sm font-semibold text-muted-foreground">Actual Neg</td>
                  <td className="p-3">
                    <span className="inline-block bg-success/10 text-success font-bold px-6 py-3 rounded-xl text-lg">
                      {cm.trueNegative}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-block bg-destructive/10 text-destructive font-bold px-6 py-3 rounded-xl text-lg">
                      {cm.falsePositive}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 text-sm font-semibold text-muted-foreground">Actual Pos</td>
                  <td className="p-3">
                    <span className="inline-block bg-destructive/10 text-destructive font-bold px-6 py-3 rounded-xl text-lg">
                      {cm.falseNegative}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-block bg-success/10 text-success font-bold px-6 py-3 rounded-xl text-lg">
                      {cm.truePositive}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MetricsSection;
