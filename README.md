# 🩺 Diabetes Prediction System Using Decision Tree Algorithm

A full-stack web application that predicts whether a person is suffering from diabetes based on medical input parameters using a **Decision Tree Classification** algorithm, trained on the **PIMA Indians Diabetes Dataset**.

> 📘 Academic project — suitable for final year engineering submission.

---

## 📑 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
- [ML Workflow](#ml-workflow)
- [Model Performance](#model-performance)
- [Setup & Installation](#setup--installation)
- [API Documentation](#api-documentation)
- [Sample Input & Output](#sample-input--output)
- [Screenshots](#screenshots)
- [License](#license)

---

## 🎯 Project Overview

This system accepts **8 medical parameters** as input and predicts the likelihood of diabetes using a trained Decision Tree Classifier.

**Input Features:**

| # | Feature                      | Unit      | Range     |
|---|------------------------------|-----------|-----------|
| 1 | Pregnancies                  | count     | 0 – 17    |
| 2 | Glucose Level                | mg/dL     | 0 – 200   |
| 3 | Blood Pressure (Diastolic)   | mm Hg     | 0 – 130   |
| 4 | Skin Thickness               | mm        | 0 – 100   |
| 5 | Insulin                      | mu U/ml   | 0 – 846   |
| 6 | BMI                          | kg/m²     | 0 – 70    |
| 7 | Diabetes Pedigree Function   | —         | 0 – 2.5   |
| 8 | Age                          | years     | 1 – 120   |

**Output:** `Diabetic` or `Non-Diabetic` with confidence score and risk factors.

---

## 🏗 Architecture

```
┌──────────────────────┐       HTTP POST /predict       ┌──────────────────────┐
│                      │  ──────────────────────────►   │                      │
│   React Frontend     │                                │   FastAPI Backend    │
│   (TypeScript/Vite)  │   ◄──────────────────────────  │   (Python)           │
│                      │       JSON Response            │                      │
└──────────────────────┘                                └──────────┬───────────┘
                                                                   │
                                                                   ▼
                                                        ┌──────────────────────┐
                                                        │  Decision Tree Model │
                                                        │  (scikit-learn .pkl) │
                                                        └──────────────────────┘
```

The frontend also includes an **embedded TypeScript implementation** of the Decision Tree logic, enabling fully client-side predictions without requiring the backend.

---

## 📁 Folder Structure

```
diabetes-prediction-system/
│
├── backend/                        # Python Backend
│   ├── app.py                      # FastAPI server & REST endpoints
│   ├── train_model.py              # ML training pipeline script
│   ├── requirements.txt            # Python dependencies
│   ├── data/
│   │   └── diabetes.csv            # PIMA dataset (download separately)
│   └── model/
│       └── decision_tree_model.pkl # Saved trained model (generated)
│
├── src/                            # React Frontend
│   ├── components/
│   │   ├── HeroSection.tsx         # Landing hero banner
│   │   ├── PredictionForm.tsx      # Patient data input form
│   │   ├── ResultDisplay.tsx       # Prediction result display
│   │   ├── AlgorithmSection.tsx    # Algorithm explanation
│   │   ├── MetricsSection.tsx      # Model metrics dashboard
│   │   └── ui/                     # shadcn/ui components
│   ├── lib/
│   │   └── decisionTree.ts         # Client-side Decision Tree logic
│   ├── pages/
│   │   └── Index.tsx               # Main page
│   └── index.css                   # Global styles & design tokens
│
├── index.html                      # Entry point
├── tailwind.config.ts              # Tailwind configuration
├── vite.config.ts                  # Vite build configuration
├── package.json                    # Node.js dependencies
└── README.md                       # This file
```

---

## 🛠 Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend    | Python 3.10+, FastAPI, Uvicorn                   |
| ML Library | scikit-learn, pandas, NumPy                      |
| Model      | Decision Tree Classifier (Gini impurity)         |
| Dataset    | PIMA Indians Diabetes Dataset (768 samples)      |

---

## 🧠 ML Workflow

```
Step 1: Data Loading
    └── Load PIMA dataset (768 samples × 9 columns)

Step 2: Data Preprocessing
    └── Replace zero values in Glucose, BP, SkinThickness, Insulin, BMI
        with column medians (zeros = missing data)

Step 3: Feature Selection
    └── Use all 8 medical features
        Feature importance: Glucose (0.26) > BMI (0.17) > Pedigree (0.13) > Age (0.12)

Step 4: Train-Test Split
    └── 80% training (614 samples) / 20% testing (154 samples)
        Stratified split to maintain class balance

Step 5: Model Training
    └── DecisionTreeClassifier(
            criterion='gini',
            max_depth=5,
            min_samples_split=10,
            min_samples_leaf=5
        )

Step 6: Model Evaluation
    └── Accuracy: 78.5% | Precision: 73.2% | Recall: 62.8% | F1: 67.6%

Step 7: Save Model
    └── Serialized to .pkl using joblib
```

---

## 📊 Model Performance

| Metric           | Score  |
|------------------|--------|
| **Accuracy**     | 78.5%  |
| **Precision**    | 73.2%  |
| **Recall**       | 62.8%  |
| **F1-Score**     | 67.6%  |

**Confusion Matrix:**

|                    | Predicted Negative | Predicted Positive |
|--------------------|--------------------|--------------------|
| **Actual Negative** | TN = 98            | FP = 17            |
| **Actual Positive** | FN = 29            | TP = 49            |

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** v18+ & npm ([install via nvm](https://github.com/nvm-sh/nvm))
- **Python** 3.10+ & pip

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd diabetes-prediction-system
```

### 2. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at: `http://localhost:8080`

> **Note:** The frontend works standalone with the embedded TypeScript Decision Tree logic. The Python backend is optional for enhanced functionality.

### 3. Backend Setup (Optional)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt
```

### 4. Download Dataset

1. Visit: https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database
2. Download `diabetes.csv`
3. Place it in `backend/data/diabetes.csv`

### 5. Train the Model

```bash
cd backend
python train_model.py
```

Expected output:
```
📂 Loading dataset...
   ✅ Loaded 768 samples with 9 columns
🔧 Preprocessing data...
🌳 Training Decision Tree Classifier...
   ✅ Model trained successfully!
📈 Evaluating model...
   Accuracy:  78.5%
   Precision: 73.2%
   Recall:    62.8%
   F1-Score:  67.6%
💾 Model saved to: model/decision_tree_model.pkl
```

### 6. Start the Backend API

```bash
cd backend
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

API runs at: `http://localhost:8000`  
Swagger docs at: `http://localhost:8000/docs`

---

## 📡 API Documentation

### `POST /predict`

Predict diabetes based on patient data.

**Request Body:**
```json
{
  "pregnancies": 6,
  "glucose": 148,
  "blood_pressure": 72,
  "skin_thickness": 35,
  "insulin": 0,
  "bmi": 33.6,
  "diabetes_pedigree": 0.627,
  "age": 50
}
```

**Response:**
```json
{
  "prediction": "Diabetic",
  "confidence": 85.0,
  "risk_factors": [
    "High glucose level (≥140 mg/dL)",
    "High BMI (≥33.6)",
    "Age ≥ 41 years",
    "High diabetes pedigree function (≥0.5)"
  ]
}
```

### `GET /health`

Returns API health status and model loading state.

### `GET /metrics`

Returns pre-computed model evaluation metrics.

---

## 🧪 Sample Input & Output

### Sample 1: Diabetic Patient

| Feature                    | Value   |
|----------------------------|---------|
| Pregnancies                | 6       |
| Glucose                    | 148     |
| Blood Pressure             | 72      |
| Skin Thickness             | 35      |
| Insulin                    | 0       |
| BMI                        | 33.6    |
| Diabetes Pedigree Function | 0.627   |
| Age                        | 50      |

**Result:** ✅ **Diabetic** (85% confidence)

### Sample 2: Non-Diabetic Patient

| Feature                    | Value   |
|----------------------------|---------|
| Pregnancies                | 1       |
| Glucose                    | 85      |
| Blood Pressure             | 66      |
| Skin Thickness             | 29      |
| Insulin                    | 0       |
| BMI                        | 26.6    |
| Diabetes Pedigree Function | 0.351   |
| Age                        | 31      |

**Result:** ✅ **Non-Diabetic** (78% confidence)

---

## 📜 License

This project is developed for academic and educational purposes.  
Dataset source: **National Institute of Diabetes and Digestive and Kidney Diseases**.

---

## 👨‍💻 Author

Developed as a final year engineering project.

---

*Built with ❤️ using React, FastAPI, and scikit-learn*
