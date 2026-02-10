import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { predictDiabetes, type PatientData, type PredictionResult } from "@/lib/decisionTree";
import { Stethoscope, RotateCcw } from "lucide-react";
import ResultDisplay from "./ResultDisplay";

interface FieldConfig {
  key: keyof PatientData;
  label: string;
  placeholder: string;
  min: number;
  max: number;
  unit: string;
}

const fields: FieldConfig[] = [
  { key: "pregnancies", label: "Pregnancies", placeholder: "e.g., 6", min: 0, max: 17, unit: "count" },
  { key: "glucose", label: "Glucose Level", placeholder: "e.g., 148", min: 0, max: 200, unit: "mg/dL" },
  { key: "bloodPressure", label: "Blood Pressure", placeholder: "e.g., 72", min: 0, max: 130, unit: "mm Hg" },
  { key: "skinThickness", label: "Skin Thickness", placeholder: "e.g., 35", min: 0, max: 100, unit: "mm" },
  { key: "insulin", label: "Insulin", placeholder: "e.g., 0", min: 0, max: 846, unit: "mu U/ml" },
  { key: "bmi", label: "BMI", placeholder: "e.g., 33.6", min: 0, max: 70, unit: "kg/m²" },
  { key: "diabetesPedigree", label: "Diabetes Pedigree Function", placeholder: "e.g., 0.627", min: 0, max: 2.5, unit: "" },
  { key: "age", label: "Age", placeholder: "e.g., 50", min: 1, max: 120, unit: "years" },
];

const initialData: PatientData = {
  pregnancies: 0,
  glucose: 0,
  bloodPressure: 0,
  skinThickness: 0,
  insulin: 0,
  bmi: 0,
  diabetesPedigree: 0,
  age: 0,
};

const PredictionForm = () => {
  const [formData, setFormData] = useState<PatientData>(initialData);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof PatientData, string>>>({});

  const handleChange = (key: keyof PatientData, value: string) => {
    const num = value === "" ? 0 : parseFloat(value);
    setFormData((prev) => ({ ...prev, [key]: num }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const prediction = predictDiabetes(formData);
      setResult(prediction);
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    setResult(null);
    setErrors({});
  };

  return (
    <section id="predict" className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-display text-foreground mb-2">
            Enter Patient Data
          </h2>
          <p className="text-muted-foreground">
            Fill in the medical parameters below to get a prediction
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl shadow-card p-6 md:p-8 border border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key} className="text-sm font-medium text-foreground">
                  {f.label}
                  {f.unit && (
                    <span className="text-muted-foreground font-normal ml-1">({f.unit})</span>
                  )}
                </Label>
                <Input
                  id={f.key}
                  type="number"
                  step={f.key === "diabetesPedigree" || f.key === "bmi" ? "0.01" : "1"}
                  placeholder={f.placeholder}
                  value={formData[f.key] || ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className={errors[f.key] ? "border-destructive" : ""}
                />
                {errors[f.key] && (
                  <p className="text-xs text-destructive">{errors[f.key]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button type="submit" size="lg" className="flex-1 gradient-primary text-primary-foreground font-semibold text-base">
              <Stethoscope className="w-5 h-5 mr-2" />
              Predict
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </form>

        {result && <ResultDisplay result={result} />}
      </div>
    </section>
  );
};

export default PredictionForm;
