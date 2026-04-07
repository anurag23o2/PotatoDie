import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { QuickAnalysis } from "@/components/dashboard/QuickAnalysis";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import {
  DiseaseDistributionChart,
  DailyUsageChart,
  ConfidenceLevelsChart,
} from "@/components/dashboard/AnalyticsCharts";
import { HistoryTable } from "@/components/dashboard/HistoryTable";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Analysis Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Analyze potato leaves and track your classification history with detailed statistics.
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <SummaryCards />
        </motion.div>

        {/* Quick Analysis + Distribution Chart */}
        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <QuickAnalysis />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DiseaseDistributionChart />
          </motion.div>
        </div>

        {/* Charts Row */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <DailyUsageChart />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <ConfidenceLevelsChart />
          </motion.div>
        </div>

        {/* History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <HistoryTable />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
