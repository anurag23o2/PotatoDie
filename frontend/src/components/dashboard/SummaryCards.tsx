import { Activity, Target, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSummary } from "@/hooks/useAnalytics";

export function SummaryCards() {
  const { data: summary, isLoading, error } = useSummary();

  if (error) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-destructive/5 border-destructive/20">
            <CardContent className="p-4">
              <p className="text-sm text-destructive">Error loading data</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const total = summary?.total_predictions ?? summary?.total_scans ?? 0;
  const avg = summary?.average_confidence ?? 0;
  const max = summary?.max_confidence ?? summary?.highest_confidence ?? 0;
  const min = summary?.min_confidence ?? summary?.lowest_confidence ?? 0;

  const cards = [
    { title: "Total Scans", value: total, icon: Activity, format: (v: number) => v.toLocaleString() },
    { title: "Avg Confidence", value: avg, icon: Target, format: (v: number) => `${(v * 100).toFixed(1)}%` },
    { title: "Highest Score", value: max, icon: TrendingUp, format: (v: number) => `${(v * 100).toFixed(1)}%` },
    { title: "Lowest Score", value: min, icon: TrendingDown, format: (v: number) => `${(v * 100).toFixed(1)}%` },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{card.format(card.value)}</p>
                </div>
                <div className="p-2 rounded-lg bg-primary/10">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
