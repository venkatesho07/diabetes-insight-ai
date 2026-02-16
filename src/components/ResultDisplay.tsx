import { type PredictionResult } from "@/lib/decisionTree";
import { ShieldCheck, ShieldAlert, TrendingUp, FileDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadReport, isAuthenticated } from "@/lib/api";
import { motion } from "framer-motion";

interface ResultDisplayProps {
  result: PredictionResult;
  predictionId?: number | null;
}

const ResultDisplay = ({ result, predictionId }: ResultDisplayProps) => {
  const isDiabetic = result.prediction === "Diabetic";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className={`mt-10 rounded-2xl overflow-hidden shadow-premium border-2 ${
        isDiabetic ? "border-destructive/30" : "border-success/30"
      }`}
    >
      {/* Gradient header */}
      <div className={`py-6 px-8 ${isDiabetic ? "bg-gradient-to-r from-destructive/10 to-destructive/5" : "bg-gradient-to-r from-success/10 to-success/5"}`}>
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              isDiabetic ? "bg-destructive/15" : "bg-success/15"
            }`}
          >
            {isDiabetic ? (
              <ShieldAlert className="w-8 h-8 text-destructive" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-success" />
            )}
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold font-display text-foreground">
              {result.prediction}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Confidence: {result.confidence}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 bg-card">
        {/* Confidence bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Confidence Level</span>
            <span className="font-semibold">{result.confidence}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.confidence}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`h-full rounded-full ${isDiabetic ? "bg-destructive" : "bg-success"}`}
            />
          </div>
        </div>

        {/* Risk factors */}
        {result.riskFactors.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              {isDiabetic ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <CheckCircle2 className="w-4 h-4 text-success" />}
              {isDiabetic ? "Risk Factors Identified" : "Health Indicators"}
            </p>
            <div className="grid gap-2">
              {result.riskFactors.map((factor, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm ${
                    isDiabetic ? "bg-destructive/5" : "bg-success/5"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isDiabetic ? "bg-destructive" : "bg-success"}`} />
                  <span className="text-muted-foreground">{factor}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {predictionId && isAuthenticated() && (
          <Button
            variant="outline"
            className="mt-6 rounded-xl"
            onClick={() => downloadReport(predictionId)}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Download Medical Report (PDF)
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ResultDisplay;
