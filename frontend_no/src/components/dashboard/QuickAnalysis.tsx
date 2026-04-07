import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, CheckCircle, AlertTriangle, XCircle, ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { analyzeImage, PredictionResult } from "@/lib/api";
import { cn } from "@/lib/utils";

const diseaseInfo: Record<string, { icon: typeof CheckCircle; color: string; bgColor: string }> = {
  Healthy: { icon: CheckCircle, color: "text-success", bgColor: "bg-success/10" },
  "Early Blight": { icon: AlertTriangle, color: "text-warning", bgColor: "bg-warning/10" },
  "Late Blight": { icon: XCircle, color: "text-destructive", bgColor: "bg-destructive/10" },
};

export function QuickAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
    setIsAnalyzing(true);

    try {
      const prediction = await analyzeImage(file);
      setResult(prediction);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
    maxFiles: 1,
    multiple: false,
  });

  const reset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const info = result ? diseaseInfo[result.predicted_class] || diseaseInfo["Healthy"] : null;
  const Icon = info?.icon || CheckCircle;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Quick Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!preview ? (
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {isDragActive ? "Drop image here" : "Drag & drop an image"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse (PNG, JPG)
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden bg-muted aspect-video">
              <img
                src={preview}
                alt="Uploaded leaf"
                className="w-full h-full object-contain"
              />
            </div>

            <AnimatePresence mode="wait">
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3 py-4"
                >
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Analyzing image...</p>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-destructive/10 rounded-lg text-center"
                >
                  <p className="text-destructive font-medium">{error}</p>
                </motion.div>
              )}

              {result && info && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("p-4 rounded-xl", info.bgColor)}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={cn("h-8 w-8", info.color)} />
                    <div>
                      <p className="font-bold text-lg">{result.predicted_class}</p>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={result.confidence * 100} className="h-2" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button onClick={reset} variant="outline" className="w-full">
              Analyze Another Image
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
