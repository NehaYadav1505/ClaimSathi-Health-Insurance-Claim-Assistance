import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle, 
  AlertTriangle,
  FileText,
  IndianRupee,
  Minus,
  ArrowRight,
  Download,
  Info,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { HealthcareButton } from "@/components/ui/healthcare-button";
import { HealthcareCard, HealthcareCardHeader, HealthcareCardTitle, HealthcareCardContent } from "@/components/ui/healthcare-card";
import Header from "@/components/layout/Header";
import ChatBot from "@/components/chatbot/ChatBot";

const ClaimDecision = () => {
  const navigate = useNavigate();
  const [showRiskDetails, setShowRiskDetails] = useState(false);

  const claimData = {
    id: "CLM-2024-003",
    status: "approved",
    totalBill: 45000,
    approvedAmount: 38500,
    deductionAmount: 6500,
    deductions: [
      { item: "Room Rent Excess", amount: 3000, reason: "Policy limit: ₹3,000/day. Billed: ₹4,500/day" },
      { item: "Non-Medical Items", amount: 2500, reason: "Toiletries, food items not covered" },
      { item: "Admin Charges", amount: 1000, reason: "Standard co-pay as per policy" }
    ],
    timeline: [
      { step: "Documents Received", time: "10:30 AM", status: "complete" },
      { step: "Verification Complete", time: "10:32 AM", status: "complete" },
      { step: "Eligibility Confirmed", time: "10:33 AM", status: "complete" },
      { step: "Hospital Validated", time: "10:34 AM", status: "complete" },
      { step: "Decision Generated", time: "10:35 AM", status: "complete" }
    ],
    riskAlert: {
      title: "Minor Discrepancy Noted",
      description: "Your bill mentions surgery charges (₹12,000), but the prescription only mentions medication treatment. Our team has verified this as a billing error by the hospital for 'minor procedure' charges."
    }
  };

  const handleDownloadDossier = () => {
    navigate("/claim-dossier");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-10 h-10 text-success" />
              </motion.div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Claim Approved
              </h1>
              <p className="text-muted-foreground">
                Claim ID: {claimData.id}
              </p>
            </motion.div>

            {/* Risk Alert */}
            {claimData.riskAlert && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <HealthcareCard variant="warning" padding="default">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">
                          {claimData.riskAlert.title}
                        </h3>
                        <button
                          onClick={() => setShowRiskDetails(!showRiskDetails)}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                          {showRiskDetails ? "Hide" : "Details"}
                          {showRiskDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                      {showRiskDetails && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-muted-foreground mt-2"
                        >
                          {claimData.riskAlert.description}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </HealthcareCard>
              </motion.div>
            )}

            <div className="grid lg:grid-cols-5 gap-8">
              {/* Left Panel - Amount Summary */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* Total Bill */}
                <HealthcareCard variant="elevated" padding="lg">
                  <HealthcareCardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <FileText className="w-5 h-5 text-foreground" />
                      </div>
                      <span className="text-muted-foreground">Total Bill Amount</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground flex items-center">
                      <IndianRupee className="w-7 h-7" />
                      {claimData.totalBill.toLocaleString()}
                    </p>
                  </HealthcareCardContent>
                </HealthcareCard>

                {/* Approved Amount */}
                <HealthcareCard variant="success" padding="lg">
                  <HealthcareCardContent>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-success" />
                      </div>
                      <span className="text-foreground">Approved Reimbursement</span>
                    </div>
                    <p className="text-4xl font-bold text-success flex items-center">
                      <IndianRupee className="w-8 h-8" />
                      {claimData.approvedAmount.toLocaleString()}
                    </p>
                  </HealthcareCardContent>
                </HealthcareCard>

                {/* Deductions */}
                <HealthcareCard variant="elevated" padding="lg">
                  <HealthcareCardHeader>
                    <HealthcareCardTitle className="flex items-center gap-2 text-base">
                      <Minus className="w-4 h-4 text-destructive" />
                      Deductions Breakdown
                    </HealthcareCardTitle>
                  </HealthcareCardHeader>
                  <HealthcareCardContent>
                    <div className="space-y-4">
                      {claimData.deductions.map((deduction, index) => (
                        <div key={index} className="pb-3 border-b border-border last:border-0 last:pb-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-foreground">{deduction.item}</span>
                            <span className="font-semibold text-destructive">
                              -₹{deduction.amount.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{deduction.reason}</p>
                        </div>
                      ))}
                      <div className="pt-3 border-t-2 border-border">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">Total Deductions</span>
                          <span className="font-bold text-destructive">
                            -₹{claimData.deductionAmount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </HealthcareCardContent>
                </HealthcareCard>
              </motion.div>

              {/* Right Panel - AI Reasoning Timeline */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-3"
              >
                <HealthcareCard variant="elevated" padding="lg" className="h-full">
                  <HealthcareCardHeader>
                    <HealthcareCardTitle className="flex items-center gap-2">
                      <Info className="w-5 h-5 text-primary" />
                      Why This Amount Was Approved
                    </HealthcareCardTitle>
                  </HealthcareCardHeader>
                  <HealthcareCardContent>
                    <div className="space-y-1">
                      {claimData.timeline.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="relative pl-8 pb-6 last:pb-0"
                        >
                          {/* Timeline Line */}
                          {index < claimData.timeline.length - 1 && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-success/30" />
                          )}
                          
                          {/* Timeline Dot */}
                          <div className="absolute left-0 top-0.5 w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-success" />
                          </div>

                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-semibold text-foreground">{item.step}</h4>
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {index === 0 && "All 4 required documents were successfully uploaded and parsed."}
                              {index === 1 && "Prescription details match the diagnosis mentioned in lab reports."}
                              {index === 2 && "Treatment is covered under your policy. Room category within limits."}
                              {index === 3 && "Apollo Hospital is a network hospital. Direct settlement available."}
                              {index === 4 && "Based on policy terms, ₹38,500 is approved with itemized deductions."}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Summary Box */}
                    <div className="mt-8 p-4 bg-card/50 rounded-xl border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Summary</h4>
                      <p className="text-sm text-muted-foreground">
                        Your claim has been processed successfully. The deductions are primarily 
                        due to room rent exceeding policy limits and non-medical consumables. 
                        The approved amount of ₹38,500 will be processed for direct settlement 
                        with Apollo Hospital within 3-5 business days.
                      </p>
                    </div>
                  </HealthcareCardContent>
                </HealthcareCard>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8"
            >
              <HealthcareCard variant="sage" padding="lg">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Download Your Claim Dossier
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Get a complete PDF with all documents, AI analysis, and decision details
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <HealthcareButton variant="outline" onClick={() => navigate("/dashboard")}>
                      Back to Dashboard
                    </HealthcareButton>
                    <HealthcareButton variant="hero" onClick={handleDownloadDossier} className="group">
                      <Download className="w-5 h-5" />
                      Download Dossier
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </HealthcareButton>
                  </div>
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

export default ClaimDecision;
