import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Zap, Shield, BarChart3, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useSummary, useClassDistribution } from "@/hooks/useAnalytics";

const features = [
  {
    icon: Zap,
    title: "Instant Analysis",
    description: "Get disease predictions in seconds using our advanced AI model",
  },
  {
    icon: Shield,
    title: "High Accuracy",
    description: "Trained on thousands of images for reliable classification",
  },
  {
    icon: Leaf,
    title: "3 Disease Classes",
    description: "Detect Early Blight, Late Blight, or confirm Healthy leaves",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Track your analysis history with comprehensive statistics",
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function HomePage() {
  const { data: summary, isLoading } = useSummary();
  const { data: distribution } = useClassDistribution();

  const mostDetected = distribution?.length
    ? distribution.reduce((max, item) => (item.count > max.count ? item : max), distribution[0])
    : null;

  return (
    <DashboardLayout>
      <div className="space-y-12">
        {/* Hero Section */}
        <motion.section
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm font-medium text-secondary-foreground mb-6"
            {...fadeInUp}
          >
            <Leaf className="h-4 w-4 text-primary" />
            AI-Powered Potato Disease Detection
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Protect Your Potato Crops
            <br />
            <span className="text-primary">with AI Analysis</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Upload images of potato leaves and get instant disease classification.
            Identify Early Blight, Late Blight, or confirm healthy plants in seconds.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button asChild size="lg" className="gap-2 text-base px-8">
              <Link to="/dashboard">
                <Upload className="h-5 w-5" />
                Start Analysis
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 text-base px-8">
              <Link to="/diseases">
                Learn About Diseases
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.section>

        {/* Quick Stats */}
        {!isLoading && summary && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {(() => {
              const total = summary.total_predictions ?? summary.total_scans ?? 0;
              const highest = summary.max_confidence ?? summary.highest_confidence ?? 0;

              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-primary text-primary-foreground border-0">
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl md:text-4xl font-bold">{total}</p>
                      <p className="text-sm opacity-90 mt-1">Total Scans</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border">
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl md:text-4xl font-bold text-primary">
                        {(summary.average_confidence * 100).toFixed(0)}%
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Avg Confidence</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border">
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl md:text-4xl font-bold text-primary">
                        {(highest * 100).toFixed(0)}%
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Highest Score</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-card border-border">
                    <CardContent className="p-6 text-center">
                      <p className="text-3xl md:text-4xl font-bold text-primary capitalize">
                        {mostDetected?.class || "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Most Detected</p>
                    </CardContent>
                  </Card>
                </div>
              );
            })()}
          </motion.section>
        )}

        {/* Features */}
        <motion.section
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Why Use PotatoDie?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-border bg-card">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center border border-primary/10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Protect Your Crops?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Start analyzing your potato leaves now. It's fast, accurate, and completely free.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link to="/dashboard">
              Go to Dashboard
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </motion.section>
      </div>
    </DashboardLayout>
  );
}
