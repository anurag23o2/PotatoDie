const API_BASE = "https://potatodie-hbw1.onrender.com";

export interface HistoryItem {
  id: number;
  image_path: string;
  class: string;
  confidence: number;
  timestamp: string;
}

export interface SummaryData {
  total_predictions?: number;
  total_scans?: number;
  average_confidence: number;
  max_confidence?: number;
  highest_confidence?: number;
  min_confidence?: number;
  lowest_confidence?: number;
  most_common_class?: string;
}

export interface ClassDistribution {
  class: string;
  count: number;
  percentage: number;
}

export interface DailyUsage {
  date: string;
  count: number;
}

export interface ConfidenceLevel {
  range: string;
  count: number;
}

export interface PredictionResult {
  class: string;
  confidence: number;
  image_path: string;
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const response = await fetch(`${API_BASE}/history`);
  if (!response.ok) throw new Error("Failed to fetch history");
  return response.json();
}

export async function fetchSummary(): Promise<SummaryData> {
  const response = await fetch(`${API_BASE}/analytics/summary`);
  if (!response.ok) throw new Error("Failed to fetch summary");
  return response.json();
}

export async function fetchClassDistribution(): Promise<ClassDistribution[]> {
  const response = await fetch(`${API_BASE}/analytics/class-distribution`);
  if (!response.ok) throw new Error("Failed to fetch class distribution");
  return response.json();
}

export async function fetchDailyUsage(): Promise<DailyUsage[]> {
  const response = await fetch(`${API_BASE}/analytics/daily-usage`);
  if (!response.ok) throw new Error("Failed to fetch daily usage");
  return response.json();
}

export async function fetchConfidenceLevels(): Promise<ConfidenceLevel[]> {
  const response = await fetch(`${API_BASE}/analytics/confidence-levels`);
  if (!response.ok) throw new Error("Failed to fetch confidence levels");
  return response.json();
}

export async function analyzeImage(file: File): Promise<PredictionResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to analyze image");
  return response.json();
}
