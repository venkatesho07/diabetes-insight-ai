import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { predictDiabetes, type PatientData, type PredictionResult } from "@/lib/decisionTree";
import { predictApi } from "@/lib/api";
import { Stethoscope, RotateCcw, Activity, Droplets, Heart, Ruler, Syringe, Scale, Dna, Calendar, UserRound } from "lucide-react";
import { motion } from "framer-motion";
import ResultDisplay from "./ResultDisplay";
import diabetesTestingImg from "@/assets/diabetes-testing.jpg";

interface FieldConfig {
  key: keyof PatientData;
  label: string;
  placeholder: string;
  min: number;
  max: number;
  unit: string;
  icon: React.ElementType;
  step?: string;
}

const fields: FieldConfig[] = [
  { key: "pregnancies", label: "Pregnancies", placeholder: "e.g., 6", min: 0, max: 17, unit: "count", icon: Activity },
  { key: "glucose", label: "Glucose Level", placeholder: "e.g., 148", min: 0, max: 200, unit: "mg/dL", icon: Droplets },
  { key: "bloodPressure", label: "Blood Pressure", placeholder: "e.g., 72", min: 0, max: 130, unit: "mm Hg", icon: Heart },
  { key: "skinThickness", label: "Skin Thickness", placeholder: "e.g., 35", min: 0, max: 100, unit: "mm", icon: Ruler },
  { key: "insulin", label: "Insulin", placeholder: "e.g., 0", min: 0, max: 846, unit: "mu U/ml", icon: Syringe },
  { key: "bmi", label: "BMI", placeholder: "e.g., 33.6", min: 0, max: 70, unit: "kg/m²", icon: Scale },
  { key: "diabetesPedigree", label: "Diabetes Pedigree Function", placeholder: "e.g., 0.627", min: 0, max: 2.5, unit: "", icon: Dna, step: "0.001" },
  { key: "age", label: "Age", placeholder: "e.g., 50", min: 1, max: 120, unit: "years", icon: Calendar },
];

const initialData: PatientData = {
  pregnancies: 0, glucose: 0, bloodPressure: 0, skinThickness: 0,
  insulin: 0, bmi: 0, diabetesPedigree: 0, age: 0,
};

const PredictionForm = () => {
  const [patientName, setPatientName] = useState("");
  const [formData, setFormData] = useState<PatientData>(initialData);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [predictionId, setPredictionId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof PatientData, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: keyof PatientData, value: string) => {
    const num = value === "" ? 0 : parseFloat(value);
    setFormData((prev) => ({ ...prev, [key]: num }));
    if (errors[key]) {
      setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof PatientData, string>> = {};
    fields.forEach((f) => {
      const val = formData[f.key];
      if (f.key !== "pregnancies" && f.key !== "insulin" && f.key !== "skinThickness" && val <= 0) {
        newErrors[f.key] = `${f.label} must be greater than 0`;
      }
      if (val < f.min || val > f.max) {
        newErrors[f.key] = `Must be between ${f.min} and ${f.max}`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setPredictionId(null);

    // Try backend first, fallback to client-side
    try {
      const backendResult = await predictApi({
        patient_name: patientName || "Anonymous",
        pregnancies: formData.pregnancies,
        glucose: formData.glucose,
        blood_pressure: formData.bloodPressure,
        skin_thickness: formData.skinThickness,
        insulin: formData.insulin,
        bmi: formData.bmi,
        diabetes_pedigree: formData.diabetesPedigree,
        age: formData.age,
      });
      setResult({
        prediction: backendResult.prediction as "Diabetic" | "Non-Diabetic",
        confidence: backendResult.confidence,
        riskFactors: backendResult.risk_factors,
      });
      setPredictionId(backendResult.id);
    } catch {
      // Backend unavailable — use client-side prediction
      const prediction = predictDiabetes(formData);
      setResult(prediction);
    }

    setSubmitting(false);
  };

  const handleReset = () => {
    setPatientName("");
    setFormData(initialData);
    setResult(null);
    setPredictionId(null);
    setErrors({});
  };

  return (
    <section id="predict" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--primary)/0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-sm font-semibold text-primary tracking-widest uppercase mb-3">Patient Assessment</span>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            Enter Medical Parameters
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Input 8 clinical measurements to receive an instant diabetes risk assessment
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Side image card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
            <div className="rounded-2xl overflow-hidden shadow-premium border border-border">
              <img
                src={diabetesTestingImg}
                alt="Blood glucose testing device"
                className="w-full h-64 object-cover"
                loading="lazy"
              />
              <div className="p-6 bg-card">
                <h3 className="font-display font-semibold text-foreground mb-2">Clinical Testing</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our model analyzes 8 key biomarkers based on the PIMA Indians Diabetes Dataset with 768 validated patient records.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">Model Active • 78.5% Accuracy</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-card rounded-2xl shadow-premium p-6 md:p-8 border border-border"
          >
            {/* Patient Name Field */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <Label htmlFor="patientName" className="text-sm font-medium text-foreground flex items-center gap-2 mb-1.5">
                <UserRound className="w-3.5 h-3.5 text-primary" />
                Patient Name
                <span className="text-muted-foreground font-normal text-xs">(optional)</span>
              </Label>
              <Input
                id="patientName"
                type="text"
                placeholder="e.g., John Doe"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="h-11 rounded-xl transition-all duration-200 hover:border-primary/50 focus:shadow-glow"
              />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.map((f, i) => (
                <motion.div
                  key={f.key}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="space-y-1.5"
                >
                  <Label htmlFor={f.key} className="text-sm font-medium text-foreground flex items-center gap-2">
                    <f.icon className="w-3.5 h-3.5 text-primary" />
                    {f.label}
                    {f.unit && (
                      <span className="text-muted-foreground font-normal text-xs">({f.unit})</span>
                    )}
                  </Label>
                  <Input
                    id={f.key}
                    type="number"
                    step={f.key === "diabetesPedigree" || f.key === "bmi" ? "0.01" : "1"}
                    placeholder={f.placeholder}
                    value={formData[f.key] || ""}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    className={`h-11 rounded-xl transition-all duration-200 focus:shadow-glow ${errors[f.key] ? "border-destructive" : "hover:border-primary/50"}`}
                  />
                  {errors[f.key] && (
                    <p className="text-xs text-destructive">{errors[f.key]}</p>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="flex-1 gradient-primary text-primary-foreground font-semibold text-base h-12 rounded-xl shadow-glow hover:shadow-elevated transition-all duration-300"
              >
                <Stethoscope className="w-5 h-5 mr-2" />
                {submitting ? "Analyzing…" : "Analyze & Predict"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={handleReset} className="h-12 rounded-xl">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </motion.form>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResultDisplay
              result={result}
              predictionId={predictionId}
              patientName={patientName}
              formData={formData}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PredictionForm;
