import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { type PredictionResult } from "./decisionTree";

export interface ReportData {
  patientName: string;
  prediction: PredictionResult;
  inputs: {
    pregnancies: number;
    glucose: number;
    bloodPressure: number;
    skinThickness: number;
    insulin: number;
    bmi: number;
    diabetesPedigree: number;
    age: number;
  };
}

export function generatePdfReport(data: ReportData) {
  const doc = new jsPDF();
  const isDiabetic = data.prediction.prediction === "Diabetic";
  const primaryColor: [number, number, number] = [26, 138, 110]; // teal
  const dangerColor: [number, number, number] = [220, 38, 38];
  const resultColor = isDiabetic ? dangerColor : primaryColor;

  // ─── Header bar ───
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Diabetes Prediction System", 14, 18);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Medical Risk Assessment Report", 14, 28);

  const now = new Date();
  doc.setFontSize(9);
  doc.text(`Generated: ${now.toLocaleString()}`, 210 - 14, 28, { align: "right" });

  // ─── Patient info ───
  let y = 50;
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Information", 14, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Patient Name: ${data.patientName || "Anonymous"}`, 14, y);
  y += 6;
  doc.text(`Assessment Date: ${now.toLocaleDateString()}`, 14, y);
  y += 6;
  doc.text(`Report ID: RPT-${Date.now().toString(36).toUpperCase()}`, 14, y);
  y += 14;

  // ─── Result summary ───
  doc.setFillColor(...resultColor);
  doc.roundedRect(14, y, 182, 28, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(`Result: ${data.prediction.prediction}`, 22, y + 12);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Confidence: ${data.prediction.confidence}%`, 22, y + 22);
  y += 38;

  // ─── Clinical parameters table ───
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Clinical Parameters", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    head: [["Parameter", "Value", "Unit", "Status"]],
    body: [
      ["Pregnancies", String(data.inputs.pregnancies), "count", data.inputs.pregnancies >= 6 ? "⚠ High" : "Normal"],
      ["Glucose", String(data.inputs.glucose), "mg/dL", data.inputs.glucose >= 140 ? "⚠ High" : data.inputs.glucose >= 120 ? "Elevated" : "Normal"],
      ["Blood Pressure", String(data.inputs.bloodPressure), "mm Hg", data.inputs.bloodPressure >= 80 ? "Elevated" : "Normal"],
      ["Skin Thickness", String(data.inputs.skinThickness), "mm", data.inputs.skinThickness >= 35 ? "⚠ High" : "Normal"],
      ["Insulin", String(data.inputs.insulin), "mu U/ml", data.inputs.insulin >= 160 ? "⚠ High" : "Normal"],
      ["BMI", String(data.inputs.bmi), "kg/m²", data.inputs.bmi >= 33.6 ? "⚠ High" : data.inputs.bmi >= 26.6 ? "Elevated" : "Normal"],
      ["Diabetes Pedigree", String(data.inputs.diabetesPedigree), "", data.inputs.diabetesPedigree >= 0.5 ? "⚠ High" : "Normal"],
      ["Age", String(data.inputs.age), "years", data.inputs.age >= 41 ? "⚠ Risk Factor" : "Normal"],
    ],
    headStyles: { fillColor: primaryColor, textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 250, 248] },
    columnStyles: {
      3: {
        fontStyle: "bold",
        cellWidth: 30,
      },
    },
    styles: { fontSize: 9, cellPadding: 4 },
    margin: { left: 14, right: 14 },
  });

  // @ts-ignore
  y = doc.lastAutoTable.finalY + 12;

  // ─── Risk Factors ───
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 60, 60);
  doc.text("Identified Risk Factors", 14, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  data.prediction.riskFactors.forEach((factor) => {
    const bullet = isDiabetic ? "▲" : "●";
    doc.setTextColor(...resultColor);
    doc.text(bullet, 18, y);
    doc.setTextColor(80, 80, 80);
    doc.text(factor, 26, y);
    y += 7;
  });

  y += 8;

  // ─── Confidence bar visual ───
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 60, 60);
  doc.text("Confidence Level", 14, y);
  y += 6;

  // Background bar
  doc.setFillColor(230, 230, 230);
  doc.roundedRect(14, y, 140, 8, 2, 2, "F");
  // Filled bar
  const barWidth = (data.prediction.confidence / 100) * 140;
  doc.setFillColor(...resultColor);
  doc.roundedRect(14, y, barWidth, 8, 2, 2, "F");
  // Label
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`${data.prediction.confidence}%`, 158, y + 6);
  y += 18;

  // ─── Disclaimer ───
  doc.setDrawColor(200, 200, 200);
  doc.line(14, y, 196, y);
  y += 8;

  doc.setFontSize(7.5);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "italic");
  const disclaimer = "Disclaimer: This report is generated by a machine learning model (Decision Tree Classifier) for educational and screening purposes only. It should not replace professional medical diagnosis, advice, or treatment. Always consult a qualified healthcare provider.";
  const lines = doc.splitTextToSize(disclaimer, 182);
  doc.text(lines, 14, y);

  // ─── Footer ───
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFillColor(...primaryColor);
  doc.rect(0, pageHeight - 12, 210, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Diabetes Prediction System — Decision Tree Classification • PIMA Indians Diabetes Dataset", 105, pageHeight - 4.5, { align: "center" });

  // Save
  const filename = `diabetes_report_${(data.patientName || "patient").replace(/\s+/g, "_")}_${now.toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
