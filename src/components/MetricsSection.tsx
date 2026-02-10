import { modelMetrics, datasetInfo } from "@/lib/decisionTree";
import { BarChart3, Target, Crosshair, Repeat, Award } from "lucide-react";

const MetricCard = ({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) => (
  <div className="bg-card rounded-xl shadow-card border border-border p-5 text-center">
    <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
    <p className="text-2xl font-bold font-display text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

const MetricsSection = () => {
  const cm = modelMetrics.confusionMatrix;

  return (
    <section className="py-16 px-4 bg-secondary/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-display text-foreground mb-2">
            Model Performance
          </h2>
          <p className="text-muted-foreground">
            Evaluation metrics from training on {datasetInfo.samples} samples ({datasetInfo.name})
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <MetricCard label="Accuracy" value={`${modelMetrics.accuracy}%`} icon={Target} />
          <MetricCard label="Precision" value={`${modelMetrics.precision}%`} icon={Crosshair} />
          <MetricCard label="Recall" value={`${modelMetrics.recall}%`} icon={Repeat} />
          <MetricCard label="F1-Score" value={`${modelMetrics.f1Score}%`} icon={Award} />
        </div>

        {/* Confusion Matrix */}
        <div className="bg-card rounded-xl shadow-card border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold font-display text-foreground">Confusion Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full max-w-sm mx-auto text-center">
              <thead>
                <tr>
                  <th className="p-2" />
                  <th className="p-2 text-sm font-medium text-muted-foreground" colSpan={2}>
                    Predicted
                  </th>
                </tr>
                <tr>
                  <th className="p-2" />
                  <th className="p-2 text-sm font-medium text-foreground">Negative</th>
                  <th className="p-2 text-sm font-medium text-foreground">Positive</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 text-sm font-medium text-muted-foreground">Actual Neg</td>
                  <td className="p-3">
                    <span className="inline-block bg-success/10 text-success font-bold px-4 py-2 rounded-lg">
                      {cm.trueNegative}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-block bg-destructive/10 text-destructive font-bold px-4 py-2 rounded-lg">
                      {cm.falsePositive}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-2 text-sm font-medium text-muted-foreground">Actual Pos</td>
                  <td className="p-3">
                    <span className="inline-block bg-destructive/10 text-destructive font-bold px-4 py-2 rounded-lg">
                      {cm.falseNegative}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-block bg-success/10 text-success font-bold px-4 py-2 rounded-lg">
                      {cm.truePositive}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;
