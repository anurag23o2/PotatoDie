import { useQuery } from "@tanstack/react-query";
import {
  fetchHistory,
  fetchSummary,
  fetchClassDistribution,
  fetchDailyUsage,
  fetchConfidenceLevels,
} from "@/lib/api";

export function useHistory() {
  return useQuery({
    queryKey: ["history"],
    queryFn: fetchHistory,
    staleTime: 30000,
  });
}

export function useSummary() {
  return useQuery({
    queryKey: ["summary"],
    queryFn: fetchSummary,
    staleTime: 30000,
  });
}

export function useClassDistribution() {
  return useQuery({
    queryKey: ["classDistribution"],
    queryFn: fetchClassDistribution,
    staleTime: 30000,
  });
}

export function useDailyUsage() {
  return useQuery({
    queryKey: ["dailyUsage"],
    queryFn: fetchDailyUsage,
    staleTime: 30000,
  });
}

export function useConfidenceLevels() {
  return useQuery({
    queryKey: ["confidenceLevels"],
    queryFn: fetchConfidenceLevels,
    staleTime: 30000,
  });
}
