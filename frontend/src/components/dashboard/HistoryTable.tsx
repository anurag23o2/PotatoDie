import { format } from "date-fns";
import { History, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useHistory } from "@/hooks/useAnalytics";
import { cn } from "@/lib/utils";

const classConfig: Record<string, { icon: typeof CheckCircle; color: string; variant: "default" | "secondary" | "destructive" }> = {
  Healthy: { icon: CheckCircle, color: "text-success", variant: "default" },
  "Early Blight": { icon: AlertTriangle, color: "text-warning", variant: "secondary" },
  "Late Blight": { icon: XCircle, color: "text-destructive", variant: "destructive" },
};

export function HistoryTable() {
  const { data: history, isLoading, error } = useHistory();

  if (isLoading) return <Card><CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5 text-primary" />Analysis History</CardTitle></CardHeader><CardContent><div className="space-y-3">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div></CardContent></Card>;
  if (error) return <Card><CardHeader><CardTitle className="flex items-center gap-2"><History className="h-5 w-5 text-primary" />Analysis History</CardTitle></CardHeader><CardContent><p className="text-destructive text-sm">Failed to load history</p></CardContent></Card>;

  const sortedHistory = [...(history || [])].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Analysis History
          {history && <Badge variant="secondary" className="ml-2">{history.length} records</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedHistory.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No analysis history yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Filename</TableHead>
                  <TableHead>Prediction</TableHead>
                  <TableHead className="text-right">Confidence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedHistory.slice(0, 20).map((item) => {
                  const config = classConfig[item.class] || classConfig["Healthy"];
                  const Icon = config.icon;
                  const filename = item.image_path.split('/').pop() || 'Unknown';
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="text-muted-foreground">{format(new Date(item.timestamp), "MMM d, yyyy HH:mm")}</TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">{filename}</TableCell>
                      <TableCell><div className="flex items-center gap-2"><Icon className={cn("h-4 w-4", config.color)} /><Badge variant={config.variant}>{item.class}</Badge></div></TableCell>
                      <TableCell className="text-right font-medium">{(item.confidence * 100).toFixed(1)}%</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
