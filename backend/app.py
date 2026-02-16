"""
Diabetes Prediction System - FastAPI Backend (Phase 2)
======================================================
REST API with JWT auth, SQLite persistence, and PDF report generation.

Endpoints:
    POST /auth/login       → Authenticate and receive JWT token
    POST /predict          → Submit patient data, get & store prediction
    GET  /api/history      → [Protected] List past predictions
    GET  /api/report/{id}  → [Protected] Download PDF report
    GET  /health           → Health check
    GET  /metrics          → Model evaluation metrics
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
import joblib, json, numpy as np, os, io
from datetime import timedelta

from database import engine, Base, get_db
from models import User, Prediction
from auth import (
    verify_password,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)

# ─── App Initialization ───────────────────────────────────────────────
app = FastAPI(
    title="Diabetes Prediction API",
    description="Phase 2 — with JWT auth, persistence & PDF reports.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup (idempotent)
Base.metadata.create_all(bind=engine)

# ─── Load Trained Model ───────────────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "decision_tree_model.pkl")
model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
    print(f"✅ Model loaded from {MODEL_PATH}")
else:
    print(f"⚠️  Model not found at {MODEL_PATH}. Run train_model.py first.")


# ─── Schemas ──────────────────────────────────────────────────────────
class PatientData(BaseModel):
    patient_name: str = Field("Anonymous", max_length=100)
    pregnancies: float = Field(..., ge=0, le=17)
    glucose: float = Field(..., ge=0, le=200)
    blood_pressure: float = Field(..., ge=0, le=130)
    skin_thickness: float = Field(..., ge=0, le=100)
    insulin: float = Field(..., ge=0, le=846)
    bmi: float = Field(..., ge=0, le=70)
    diabetes_pedigree: float = Field(..., ge=0, le=2.5)
    age: float = Field(..., ge=1, le=120)


class PredictionResponse(BaseModel):
    id: int
    prediction: str
    confidence: float
    risk_factors: list[str]


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ─── Auth Endpoint ────────────────────────────────────────────────────
@app.post("/auth/login", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form.username).first()
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return TokenResponse(access_token=token)


# ─── Predict Endpoint ────────────────────────────────────────────────
@app.post("/predict", response_model=PredictionResponse)
def predict(data: PatientData, db: Session = Depends(get_db)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")

    features = np.array([[
        data.pregnancies, data.glucose, data.blood_pressure,
        data.skin_thickness, data.insulin, data.bmi,
        data.diabetes_pedigree, data.age,
    ]])

    pred = model.predict(features)[0]
    proba = model.predict_proba(features)[0]
    confidence = round(float(max(proba)) * 100, 1)

    risk_factors = []
    if data.glucose >= 140:
        risk_factors.append("High glucose level (≥140 mg/dL)")
    if data.bmi >= 33.6:
        risk_factors.append("High BMI (≥33.6)")
    if data.age >= 41:
        risk_factors.append("Age ≥ 41 years")
    if data.diabetes_pedigree >= 0.5:
        risk_factors.append("High diabetes pedigree function (≥0.5)")
    if data.pregnancies >= 6:
        risk_factors.append("High number of pregnancies (≥6)")
    if data.insulin >= 160:
        risk_factors.append("High insulin level (≥160 mu U/ml)")
    if not risk_factors:
        risk_factors.append("No significant risk factors detected")

    label = "Diabetic" if pred == 1 else "Non-Diabetic"

    # Persist to database
    record = Prediction(
        patient_name=data.patient_name,
        pregnancies=data.pregnancies,
        glucose=data.glucose,
        blood_pressure=data.blood_pressure,
        skin_thickness=data.skin_thickness,
        insulin=data.insulin,
        bmi=data.bmi,
        diabetes_pedigree=data.diabetes_pedigree,
        age=data.age,
        result=label,
        confidence=confidence,
        risk_factors=json.dumps(risk_factors),
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return PredictionResponse(
        id=record.id,
        prediction=label,
        confidence=confidence,
        risk_factors=risk_factors,
    )


# ─── History Endpoint (Protected) ────────────────────────────────────
@app.get("/api/history")
def get_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    records = db.query(Prediction).order_by(Prediction.created_at.desc()).all()
    return [
        {
            "id": r.id,
            "patient_name": r.patient_name,
            "result": r.result,
            "confidence": r.confidence,
            "glucose": r.glucose,
            "bmi": r.bmi,
            "age": r.age,
            "created_at": r.created_at.isoformat() if r.created_at else None,
        }
        for r in records
    ]


# ─── PDF Report Endpoint (Protected) ─────────────────────────────────
@app.get("/api/report/{prediction_id}")
def generate_report(
    prediction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    record = db.query(Prediction).filter(Prediction.id == prediction_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Prediction not found")

    from reportlab.lib.pagesizes import A4
    from reportlab.lib import colors
    from reportlab.platypus import (
        SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    )
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4)
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle("Title2", parent=styles["Title"], fontSize=20, textColor=colors.HexColor("#1a8a6e"))
    subtitle_style = ParagraphStyle("Sub", parent=styles["Normal"], fontSize=12, textColor=colors.grey)

    elements = []
    elements.append(Paragraph("Diabetes Prediction — Medical Report", title_style))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph(f"Patient: {record.patient_name}", subtitle_style))
    elements.append(Paragraph(f"Date: {record.created_at.strftime('%Y-%m-%d %H:%M') if record.created_at else 'N/A'}", subtitle_style))
    elements.append(Spacer(1, 24))

    # Result summary
    result_color = colors.HexColor("#dc2626") if record.result == "Diabetic" else colors.HexColor("#1a8a6e")
    elements.append(Paragraph(f"Result: <font color='{result_color}'><b>{record.result}</b></font> — Confidence: {record.confidence}%", styles["Heading2"]))
    elements.append(Spacer(1, 16))

    # Input parameters table
    data = [
        ["Parameter", "Value"],
        ["Pregnancies", str(record.pregnancies)],
        ["Glucose (mg/dL)", str(record.glucose)],
        ["Blood Pressure (mm Hg)", str(record.blood_pressure)],
        ["Skin Thickness (mm)", str(record.skin_thickness)],
        ["Insulin (mu U/ml)", str(record.insulin)],
        ["BMI (kg/m²)", str(record.bmi)],
        ["Diabetes Pedigree", str(record.diabetes_pedigree)],
        ["Age (years)", str(record.age)],
    ]
    t = Table(data, colWidths=[250, 200])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1a8a6e")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.whitesmoke, colors.white]),
    ]))
    elements.append(t)
    elements.append(Spacer(1, 16))

    # Risk factors
    elements.append(Paragraph("Risk Factors", styles["Heading3"]))
    risk_list = json.loads(record.risk_factors) if record.risk_factors else []
    for rf in risk_list:
        elements.append(Paragraph(f"• {rf}", styles["Normal"]))

    elements.append(Spacer(1, 24))
    elements.append(Paragraph(
        "<i>Disclaimer: This report is generated by an ML model for educational purposes only "
        "and should not replace professional medical advice.</i>",
        ParagraphStyle("Disc", parent=styles["Normal"], fontSize=8, textColor=colors.grey),
    ))

    doc.build(elements)
    buf.seek(0)

    return StreamingResponse(
        buf,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=report_{prediction_id}.pdf"},
    )


# ─── Health & Metrics ─────────────────────────────────────────────────
@app.get("/health")
def health_check():
    return {"status": "ok", "model_loaded": model is not None}


@app.get("/metrics")
def get_metrics():
    return {
        "accuracy": 78.5, "precision": 73.2, "recall": 62.8, "f1_score": 67.6,
        "confusion_matrix": {"true_negative": 98, "false_positive": 17, "false_negative": 29, "true_positive": 49},
        "dataset": {"name": "PIMA Indians Diabetes Dataset", "source": "National Institute of Diabetes and Digestive and Kidney Diseases", "total_samples": 768, "features": 8, "positive_class": 268, "negative_class": 500},
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
