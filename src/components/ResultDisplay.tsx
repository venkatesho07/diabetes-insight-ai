import { type PredictionResult } from "@/lib/decisionTree";
import { ShieldCheck, ShieldAlert, TrendingUp } from "lucide-react";

interface ResultDisplayProps {
  result: PredictionResult;
}

const ResultDisplay = ({ result }: ResultDisplayProps) => {
  const isDiabetic = result.prediction === "Diabetic";

  return (
    <div className={`mt-8 rounded-2xl p-6 md:p-8 border-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
      isDiabetic
        ? "border-destructive/30 bg-destructive/5"
        : "border-success/30 bg-success/5"
    }`}>
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          isDiabetic ? "bg-destructive/10" : "bg-success/10"
        }`}>
          {isDiabetic ? (
            <ShieldAlert className="w-8 h-8 text-destructive" />
          ) : (
            <ShieldCheck className="w-8 h-8 text-success" />
          )}
        </div>

        <div>
          <h3 className="text-2xl font-bold font-display text-foreground mb-1">
            {result.prediction}
          </h3>
          <div className="flex items-center justify-center gap-1 text-muted-foreground">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Confidence: {result.confidence}%</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isDiabetic ? "bg-destructive" : "bg-success"
              }`}
              style={{ width: `${result.confidence}%` }}
            />
          </div>
        </div>

        {result.riskFactors.length > 0 && (
          <div className="w-full mt-2">
            <p className="text-sm font-medium text-foreground mb-2">Risk Factors Identified:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              {result.riskFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                    isDiabetic ? "bg-destructive" : "bg-success"
                  }`} />
                  {factor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;
