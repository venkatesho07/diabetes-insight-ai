/**
 * API client for the Diabetes Prediction FastAPI backend.
 * Base URL defaults to localhost:8000 for local development.
 */

const API_BASE = "http://localhost:8000";

// ─── Token helpers ────────────────────────────────────────────────────
export function getToken(): string | null {
  return localStorage.getItem("jwt_token");
}

export function setToken(token: string) {
  localStorage.setItem("jwt_token", token);
}

export function clearToken() {
  localStorage.removeItem("jwt_token");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Auth ─────────────────────────────────────────────────────────────
export async function loginApi(username: string, password: string) {
  const body = new URLSearchParams({ username, password });
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(err.detail || "Login failed");
  }
  const data = await res.json();
  setToken(data.access_token);
  return data;
}

// ─── Predict (backend) ───────────────────────────────────────────────
export interface PredictPayload {
  patient_name: string;
  pregnancies: number;
  glucose: number;
  blood_pressure: number;
  skin_thickness: number;
  insulin: number;
  bmi: number;
  diabetes_pedigree: number;
  age: number;
}

export interface PredictResponse {
  id: number;
  prediction: string;
  confidence: number;
  risk_factors: string[];
}

export async function predictApi(data: PredictPayload): Promise<PredictResponse> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Backend prediction failed");
  }
  return res.json();
}

// ─── History (protected) ──────────────────────────────────────────────
export interface HistoryRecord {
  id: number;
  patient_name: string;
  result: string;
  confidence: number;
  glucose: number;
  bmi: number;
  age: number;
  created_at: string | null;
}

export async function fetchHistory(): Promise<HistoryRecord[]> {
  const res = await fetch(`${API_BASE}/api/history`, {
    headers: authHeaders(),
  });
  if (res.status === 401) {
    clearToken();
    throw new Error("Session expired. Please login again.");
  }
  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
}

// ─── PDF Report (protected) ──────────────────────────────────────────
export async function downloadReport(predictionId: number) {
  const res = await fetch(`${API_BASE}/api/report/${predictionId}`, {
    headers: authHeaders(),
  });
  if (res.status === 401) {
    clearToken();
    throw new Error("Session expired. Please login again.");
  }
  if (!res.ok) throw new Error("Failed to generate report");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `report_${predictionId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
