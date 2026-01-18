import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FileText, 
  Download, 
  CheckCircle,
  ArrowRight,
  Plus,
  Home,
  Eye
} from "lucide-react";
import { HealthcareButton } from "@/components/ui/healthcare-button";
import { HealthcareCard, HealthcareCardContent } from "@/components/ui/healthcare-card";
import Header from "@/components/layout/Header";
import ChatBot from "@/components/chatbot/ChatBot";

const ClaimDossier = () => {
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsDownloading(false);
    setDownloadComplete(true);
  };

  const dossierSections = [
    { title: "Claim Summary", pages: "1-2" },
    { title: "Patient Information", pages: "3" },
    { title: "Uploaded Documents", pages: "4-8" },
    { title: "AI Analysis Report", pages: "9-11" },
    { title: "Verification Details", pages: "12" },
    { title: "Eligibility Assessment", pages: "13" },
    { title: "Deduction Breakdown", pages: "14" },
    { title: "Final Decision", pages: "15" },
    { title: "Consent Artifact", pages: "16" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-20 h-20 rounded-2xl bg-card flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Claim Dossier Ready
              </h1>
              <p className="text-muted-foreground">
                Your complete claim documentation package is ready for download
              </p>
            </motion.div>

            {/* Dossier Preview Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <HealthcareCard variant="elevated" padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      CLM-2024-003_Dossier.pdf
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      16 pages • 2.4 MB • Generated Jan 15, 2024
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-destructive" />
                  </div>
                </div>

                {/* Document Sections */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Document Contents
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {dossierSections.map((section, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
                      >
                        <CheckCircle className="w-4 h-4 text-success shrink-0" />
                        <span className="text-sm text-foreground truncate">{section.title}</span>
                        <span className="text-xs text-muted-foreground ml-auto">p.{section.pages}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                <div className="space-y-3">
                  <HealthcareButton
                    variant={downloadComplete ? "success" : "hero"}
                    className="w-full"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                        Preparing Download...
                      </>
                    ) : downloadComplete ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Downloaded Successfully
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Download Claim Dossier
                      </>
                    )}
                  </HealthcareButton>

                  <HealthcareButton variant="outline" className="w-full">
                    <Eye className="w-5 h-5" />
                    Preview in Browser
                  </HealthcareButton>
                </div>
              </HealthcareCard>
            </motion.div>

            {/* Confirmation Message */}
            {downloadComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <HealthcareCard variant="success" padding="default">
                  <HealthcareCardContent className="text-center">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Claim Process Complete!
                    </h3>
                    <p className="text-muted-foreground">
                      Your claim has been successfully processed. The reimbursement amount 
                      of ₹38,500 will be settled within 3-5 business days.
                    </p>
                  </HealthcareCardContent>
                </HealthcareCard>
              </motion.div>
            )}

            {/* Next Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <HealthcareCard variant="sage" padding="lg">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  What would you like to do next?
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <HealthcareButton
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/new-claim")}
                  >
                    <Plus className="w-5 h-5" />
                    Start Another Claim
                  </HealthcareButton>
                  <HealthcareButton
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/dashboard")}
                  >
                    <Home className="w-5 h-5" />
                    Go to Dashboard
                  </HealthcareButton>
                </div>
              </HealthcareCard>
            </motion.div>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default ClaimDossier;
