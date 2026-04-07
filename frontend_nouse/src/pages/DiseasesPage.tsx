import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle, Leaf, ShieldAlert, Bug } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const diseases = [
  {
    id: "healthy",
    name: "Healthy",
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
    badgeVariant: "default" as const,
    description:
      "Healthy potato leaves are vibrant green with no visible signs of disease, spots, or discoloration.",
    symptoms: [
      "Uniform green color throughout the leaf",
      "Smooth leaf surface without lesions",
      "No yellowing or browning",
      "Firm leaf texture",
    ],
    prevention: [
      "Use certified disease-free seed potatoes",
      "Practice crop rotation every 2-3 years",
      "Maintain proper plant spacing for air circulation",
      "Water at the base of plants, not on leaves",
    ],
    treatment: [
      "No treatment needed for healthy plants",
      "Continue good agricultural practices",
      "Monitor regularly for early signs of disease",
    ],
  },
  {
    id: "early_blight",
    name: "Early Blight",
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    badgeVariant: "secondary" as const,
    description:
      "Early blight is a fungal disease caused by Alternaria solani. It typically appears during warm, humid conditions and can significantly reduce yield if not managed.",
    symptoms: [
      "Dark brown to black circular spots with concentric rings (target pattern)",
      "Lesions often start on lower, older leaves",
      "Yellow halo around spots",
      "Leaves may turn yellow and drop prematurely",
      "Stem lesions in severe cases",
    ],
    prevention: [
      "Use resistant potato varieties when available",
      "Remove and destroy infected plant debris",
      "Avoid overhead irrigation",
      "Apply mulch to prevent soil splash",
      "Ensure adequate plant nutrition, especially nitrogen",
    ],
    treatment: [
      "Apply fungicides containing chlorothalonil or mancozeb",
      "Remove and destroy heavily infected leaves",
      "Increase plant spacing to improve air circulation",
      "Spray every 7-10 days during humid conditions",
    ],
  },
  {
    id: "late_blight",
    name: "Late Blight",
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    badgeVariant: "destructive" as const,
    description:
      "Late blight is caused by the oomycete Phytophthora infestans. This devastating disease can destroy entire fields within days under favorable conditions and was responsible for the Irish Potato Famine.",
    symptoms: [
      "Water-soaked, pale green to dark brown lesions",
      "White fuzzy growth on leaf undersides in humid conditions",
      "Rapid spreading of lesions, especially in cool, wet weather",
      "Brown/black areas on stems",
      "Distinctive rotting odor",
      "Tuber infection with firm, dry rot",
    ],
    prevention: [
      "Plant only certified disease-free seed potatoes",
      "Choose resistant varieties",
      "Destroy volunteer potatoes and cull piles",
      "Avoid planting in low-lying, poorly drained areas",
      "Scout fields regularly, especially during wet weather",
    ],
    treatment: [
      "Apply systemic fungicides immediately upon detection",
      "Use products containing metalaxyl, cymoxanil, or phosphorous acid",
      "Remove and destroy all infected plant material",
      "Consider vine killing 2-3 weeks before harvest",
      "Do NOT compost infected plants - destroy by burning or deep burial",
    ],
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function DiseasesPage() {
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
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Potato Diseases Guide</h1>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            Learn about common potato diseases, their symptoms, prevention methods, and treatments.
            Early identification is key to protecting your crops.
          </p>
        </motion.div>

        {/* Disease Cards */}
        <div className="space-y-8">
          {diseases.map((disease, index) => (
            <motion.div
              key={disease.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <Card className="overflow-hidden border-border">
                <CardHeader className={`${disease.bgColor} border-b border-border`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <disease.icon className={`h-8 w-8 ${disease.color}`} />
                      <div>
                        <CardTitle className="text-2xl">{disease.name}</CardTitle>
                        <Badge variant={disease.badgeVariant} className="mt-1">
                          {disease.id === "healthy" ? "No Disease" : "Fungal Disease"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <p className="text-muted-foreground leading-relaxed">{disease.description}</p>

                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Symptoms */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Bug className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">
                          {disease.id === "healthy" ? "Characteristics" : "Symptoms"}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {disease.symptoms.map((symptom, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${disease.color.replace('text-', 'bg-')} flex-shrink-0`} />
                            <span className="text-muted-foreground">{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Prevention */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Prevention</h3>
                      </div>
                      <ul className="space-y-2">
                        {disease.prevention.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Treatment */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">Treatment</h3>
                      </div>
                      <ul className="space-y-2">
                        {disease.treatment.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
