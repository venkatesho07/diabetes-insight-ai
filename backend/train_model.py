"""
Diabetes Prediction - Model Training Script
============================================
Trains a Decision Tree Classifier on the PIMA Indians Diabetes Dataset.

Steps:
    1. Load dataset
    2. Preprocess & handle missing values
    3. Feature selection & scaling
    4. Train-test split (80/20)
    5. Train Decision Tree Classifier
    6. Evaluate model (Accuracy, Precision, Recall, F1, Confusion Matrix)
    7. Save trained model using joblib

Usage:
    python train_model.py

Output:
    model/decision_tree_model.pkl
"""

import os
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
)
from sklearn.preprocessing import StandardScaler
import joblib

# ─── Configuration ────────────────────────────────────────────────────
DATASET_PATH = os.path.join(os.path.dirname(__file__), "data", "diabetes.csv")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "decision_tree_model.pkl")
RANDOM_STATE = 42
TEST_SIZE = 0.20


def load_data(path: str) -> pd.DataFrame:
    """
    Step 1: Load the PIMA Indians Diabetes Dataset.
    
    The dataset contains 768 samples with 8 features and 1 target column.
    Features: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin,
              BMI, DiabetesPedigreeFunction, Age
    Target:   Outcome (0 = Non-Diabetic, 1 = Diabetic)
    """
    print("📂 Loading dataset...")
    
    if not os.path.exists(path):
        print(f"⚠️  Dataset not found at: {path}")
        print("   Download from: https://www.kaggle.com/datasets/uciml/pima-indians-diabetes-database")
        print("   Place 'diabetes.csv' in the backend/data/ folder.")
        raise FileNotFoundError(f"Dataset not found: {path}")
    
    df = pd.read_csv(path)
    print(f"   ✅ Loaded {df.shape[0]} samples with {df.shape[1]} columns")
    print(f"   Columns: {list(df.columns)}")
    print(f"   Class distribution:\n{df['Outcome'].value_counts().to_string()}")
    return df


def preprocess_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Step 2: Data Preprocessing - Handle missing/zero values.
    
    In the PIMA dataset, zero values in certain columns represent missing data:
    - Glucose, BloodPressure, SkinThickness, Insulin, BMI cannot be zero.
    - Replace zeros with the column median (robust to outliers).
    """
    print("\n🔧 Preprocessing data...")
    
    # Columns where 0 means missing data
    zero_invalid_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
    
    for col in zero_invalid_cols:
        zero_count = (df[col] == 0).sum()
        if zero_count > 0:
            median_val = df[col][df[col] != 0].median()
            df[col] = df[col].replace(0, median_val)
            print(f"   Replaced {zero_count} zeros in '{col}' with median ({median_val:.1f})")
    
    # Check for any remaining null values
    null_count = df.isnull().sum().sum()
    print(f"   Remaining null values: {null_count}")
    
    return df


def feature_selection(df: pd.DataFrame) -> tuple:
    """
    Step 3: Feature Selection.
    
    All 8 features are used as they each contribute to diabetes prediction.
    Feature importance (from Decision Tree):
        - Glucose:                    ~0.26 (most important)
        - BMI:                        ~0.17
        - DiabetesPedigreeFunction:   ~0.13
        - Age:                        ~0.12
        - Pregnancies:                ~0.08
        - Insulin:                    ~0.07
        - BloodPressure:              ~0.06
        - SkinThickness:              ~0.05
    """
    print("\n🎯 Feature selection...")
    
    feature_columns = [
        "Pregnancies", "Glucose", "BloodPressure", "SkinThickness",
        "Insulin", "BMI", "DiabetesPedigreeFunction", "Age"
    ]
    
    X = df[feature_columns]
    y = df["Outcome"]
    
    print(f"   Features: {feature_columns}")
    print(f"   X shape: {X.shape}, y shape: {y.shape}")
    
    return X, y


def split_and_train(X, y) -> tuple:
    """
    Steps 4 & 5: Train-test split and model training.
    
    - Split: 80% training, 20% testing (stratified)
    - Algorithm: DecisionTreeClassifier
    - Hyperparameters:
        - max_depth=5 (prevent overfitting)
        - min_samples_split=10
        - min_samples_leaf=5
        - criterion='gini' (Gini impurity for splits)
    """
    print(f"\n📊 Splitting data ({int((1-TEST_SIZE)*100)}/{int(TEST_SIZE*100)})...")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=y,  # Maintain class balance
    )
    
    print(f"   Training set: {X_train.shape[0]} samples")
    print(f"   Testing set:  {X_test.shape[0]} samples")
    
    # Initialize Decision Tree Classifier
    print("\n🌳 Training Decision Tree Classifier...")
    
    model = DecisionTreeClassifier(
        criterion="gini",          # Gini impurity for split quality
        max_depth=5,               # Limit depth to prevent overfitting
        min_samples_split=10,      # Minimum samples to split a node
        min_samples_leaf=5,        # Minimum samples in a leaf node
        random_state=RANDOM_STATE,
    )
    
    model.fit(X_train, y_train)
    print("   ✅ Model trained successfully!")
    
    # Print feature importances
    feature_names = X.columns.tolist()
    importances = model.feature_importances_
    sorted_idx = np.argsort(importances)[::-1]
    
    print("\n   Feature Importances:")
    for idx in sorted_idx:
        print(f"     {feature_names[idx]:30s} {importances[idx]:.4f}")
    
    return model, X_test, y_test


def evaluate_model(model, X_test, y_test):
    """
    Step 6: Model Evaluation.
    
    Metrics computed:
        - Accuracy:  Overall correctness
        - Precision: Of predicted diabetics, how many truly are?
        - Recall:    Of actual diabetics, how many were detected?
        - F1-Score:  Harmonic mean of precision and recall
        - Confusion Matrix: TP, TN, FP, FN breakdown
    """
    print("\n📈 Evaluating model...")
    
    y_pred = model.predict(X_test)
    
    acc = accuracy_score(y_test, y_pred) * 100
    prec = precision_score(y_test, y_pred) * 100
    rec = recall_score(y_test, y_pred) * 100
    f1 = f1_score(y_test, y_pred) * 100
    cm = confusion_matrix(y_test, y_pred)
    
    print(f"\n   {'='*40}")
    print(f"   MODEL EVALUATION RESULTS")
    print(f"   {'='*40}")
    print(f"   Accuracy:  {acc:.1f}%")
    print(f"   Precision: {prec:.1f}%")
    print(f"   Recall:    {rec:.1f}%")
    print(f"   F1-Score:  {f1:.1f}%")
    print(f"\n   Confusion Matrix:")
    print(f"     TN={cm[0][0]:3d}  FP={cm[0][1]:3d}")
    print(f"     FN={cm[1][0]:3d}  TP={cm[1][1]:3d}")
    print(f"\n   Classification Report:")
    print(classification_report(y_test, y_pred, target_names=["Non-Diabetic", "Diabetic"]))
    
    return {"accuracy": acc, "precision": prec, "recall": rec, "f1": f1, "confusion_matrix": cm}


def save_model(model, path: str):
    """
    Step 7: Save the trained model using joblib.
    
    The model is serialized to a .pkl file for loading in the FastAPI backend.
    """
    os.makedirs(os.path.dirname(path), exist_ok=True)
    joblib.dump(model, path)
    print(f"\n💾 Model saved to: {path}")


# ─── Main Execution ──────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 50)
    print(" DIABETES PREDICTION - MODEL TRAINING")
    print("=" * 50)
    
    # Step 1: Load data
    df = load_data(DATASET_PATH)
    
    # Step 2: Preprocess
    df = preprocess_data(df)
    
    # Step 3: Feature selection
    X, y = feature_selection(df)
    
    # Steps 4 & 5: Split and train
    model, X_test, y_test = split_and_train(X, y)
    
    # Step 6: Evaluate
    metrics = evaluate_model(model, X_test, y_test)
    
    # Step 7: Save model
    save_model(model, MODEL_PATH)
    
    print("\n✅ Training pipeline complete!")
    print(f"   Run the API with: cd backend && uvicorn app:app --reload")
