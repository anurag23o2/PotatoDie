import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useClassDistribution, useDailyUsage, useConfidenceLevels } from "@/hooks/useAnalytics";

const COLORS = {
  Healthy: "hsl(142, 72%, 45%)",
  "Early Blight": "hsl(38, 92%, 50%)",
  "Late Blight": "hsl(0, 72%, 51%)",
};

export function DiseaseDistributionChart() {
  const { data, isLoading, error } = useClassDistribution();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Disease Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <Skeleton className="h-40 w-40 rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Disease Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: item.class_name,
    value: item.count,
    percentage: item.percentage,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Disease Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.name as keyof typeof COLORS] || "#8884d8"}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} scans`, name]}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {chartData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] }}
              />
              <span className="text-sm text-muted-foreground">
                {item.name} ({item.percentage?.toFixed(0) || 0}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DailyUsageChart() {
  const { data, isLoading, error } = useDailyUsage();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Usage</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Usage</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    count: item.count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(142, 72%, 45%)"
                strokeWidth={2}
                dot={{ fill: "hsl(142, 72%, 45%)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function ConfidenceLevelsChart() {
  const { data, isLoading, error } = useConfidenceLevels();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Confidence Levels</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px]">
          <Skeleton className="h-full w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Confidence Levels</CardTitle>
        </CardHeader>
        <CardContent className="h-[250px] flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confidence Levels</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="range"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
              />
              <YAxis
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="hsl(142, 72%, 45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
