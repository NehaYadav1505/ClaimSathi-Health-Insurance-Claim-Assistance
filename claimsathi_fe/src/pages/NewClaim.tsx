import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FileText, 
  FlaskConical, 
  Receipt, 
  Shield,
  Mic,
  CheckCircle,
  X,
  Loader2,
  Sparkles
} from "lucide-react";
import { HealthcareButton } from "@/components/ui/healthcare-button";
import { HealthcareCard, HealthcareCardHeader, HealthcareCardTitle, HealthcareCardDescription, HealthcareCardContent } from "@/components/ui/healthcare-card";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import Header from "@/components/layout/Header";
import ChatBot from "@/components/chatbot/ChatBot";

interface UploadedFile {
  name: string;
  type: string;
  status: "uploading" | "scanning" | "complete" | "error";
  extractedData?: {
    diagnosis?: string;
    date?: string;
    amount?: string;
    hospital?: string;
  };
}

const documentTypes = [
  {
    id: "prescription",
    icon: FileText,
    title: "Doctor's Prescription",
    description: "Upload the prescription from your treating doctor"
  },
  {
    id: "lab",
    icon: FlaskConical,
    title: "Lab Reports",
    description: "Blood tests, imaging, or other diagnostic reports"
  },
  {
    id: "bill",
    icon: Receipt,
    title: "Hospital Bill",
    description: "Itemized bill from the hospital or clinic"
  },
  {
    id: "policy",
    icon: Shield,
    title: "Insurance Policy",
    description: "Your health insurance policy document"
  }
];

const NewClaim = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({});
  const [voiceContext, setVoiceContext] = useState("");
  const [activeUpload, setActiveUpload] = useState<string | null>(null);

  const simulateUpload = async (docId: string, file: File) => {
    // Start uploading
    setUploadedFiles(prev => ({
      ...prev,
      [docId]: { name: file.name, type: docId, status: "uploading" }
    }));

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Start scanning
    setUploadedFiles(prev => ({
      ...prev,
      [docId]: { ...prev[docId], status: "scanning" }
    }));

    await new Promise(resolve => setTimeout(resolve, 2000));

    // Complete with extracted data
    const extractedData = {
      prescription: { diagnosis: "Acute Bronchitis", date: "Jan 12, 2024" },
      lab: { diagnosis: "Blood Test - CBC", date: "Jan 13, 2024" },
      bill: { amount: "₹45,000", hospital: "Apollo Hospital" },
      policy: { amount: "Sum Insured: ₹5,00,000" }
    };

    setUploadedFiles(prev => ({
      ...prev,
      [docId]: { 
        ...prev[docId], 
        status: "complete",
        extractedData: extractedData[docId as keyof typeof extractedData]
      }
    }));
  };

  const handleFileChange = (docId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(docId, file);
    }
  };

  const handleRemoveFile = (docId: string) => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[docId];
      return updated;
    });
  };

  const handleVoiceTranscript = (text: string) => {
    setVoiceContext(text);
  };

  const isReadyToSubmit = () => {
    const requiredDocs = ["prescription", "bill"];
    return requiredDocs.every(doc => uploadedFiles[doc]?.status === "complete");
  };

  const handleSubmit = () => {
    navigate("/claim-processing");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-foreground mb-2">
                New Claim Submission
              </h1>
              <p className="text-muted-foreground">
                Upload your documents and add voice context for a thorough AI assessment
              </p>
            </motion.div>

            {/* Document Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <HealthcareCard variant="elevated" padding="lg">
                <HealthcareCardHeader>
                  <HealthcareCardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Upload Documents
                  </HealthcareCardTitle>
                  <HealthcareCardDescription>
                    Required: Prescription & Hospital Bill. Optional: Lab Reports & Policy
                  </HealthcareCardDescription>
                </HealthcareCardHeader>
                
                <HealthcareCardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {documentTypes.map((doc, index) => {
                      const uploadedFile = uploadedFiles[doc.id];
                      const isRequired = doc.id === "prescription" || doc.id === "bill";
                      
                      return (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                        >
                          <HealthcareCard
                            variant={uploadedFile?.status === "complete" ? "success" : "sage"}
                            padding="sm"
                            className="relative overflow-hidden"
                          >
                            {/* Upload Input */}
                            <input
                              type="file"
                              id={`upload-${doc.id}`}
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(doc.id, e)}
                              className="sr-only"
                              disabled={!!uploadedFile}
                            />

                            {!uploadedFile ? (
                              <label
                                htmlFor={`upload-${doc.id}`}
                                className="block cursor-pointer"
                              >
                                <div className="flex items-start gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <doc.icon className="w-6 h-6 text-primary" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-semibold text-foreground">
                                        {doc.title}
                                      </h3>
                                      {isRequired && (
                                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                                          Required
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {doc.description}
                                    </p>
                                    <p className="text-xs text-primary mt-2 font-medium">
                                      Click to upload or drag & drop
                                    </p>
                                  </div>
                                </div>
                              </label>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                      uploadedFile.status === "complete"
                                        ? "bg-success/20"
                                        : "bg-primary/10"
                                    }`}>
                                      {uploadedFile.status === "complete" ? (
                                        <CheckCircle className="w-5 h-5 text-success" />
                                      ) : (
                                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium text-foreground text-sm">
                                        {uploadedFile.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {uploadedFile.status === "uploading" && "Uploading..."}
                                        {uploadedFile.status === "scanning" && "AI is scanning..."}
                                        {uploadedFile.status === "complete" && "Analysis complete"}
                                      </p>
                                    </div>
                                  </div>
                                  {uploadedFile.status === "complete" && (
                                    <button
                                      onClick={() => handleRemoveFile(doc.id)}
                                      className="p-1 hover:bg-muted rounded-lg transition-colors"
                                    >
                                      <X className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                  )}
                                </div>

                                {/* Scanning Animation */}
                                <AnimatePresence>
                                  {uploadedFile.status === "scanning" && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="bg-surface-elevated rounded-lg p-3 border border-border">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Sparkles className="w-4 h-4 text-primary" />
                                          <span className="text-sm font-medium text-foreground">
                                            Scanning & Extracting Data...
                                          </span>
                                        </div>
                                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                                          <motion.div
                                            className="h-full bg-primary"
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2 }}
                                          />
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {/* Extracted Data */}
                                <AnimatePresence>
                                  {uploadedFile.status === "complete" && uploadedFile.extractedData && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      className="overflow-hidden"
                                    >
                                      <div className="bg-success/10 rounded-lg p-3 border border-success/20">
                                        <p className="text-xs font-medium text-success mb-2">
                                          ✓ Data Extracted
                                        </p>
                                        <div className="space-y-1">
                                          {Object.entries(uploadedFile.extractedData).map(([key, value]) => (
                                            <p key={key} className="text-xs text-foreground">
                                              <span className="text-muted-foreground capitalize">{key}:</span>{" "}
                                              <span className="font-medium">{value}</span>
                                            </p>
                                          ))}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </HealthcareCard>
                        </motion.div>
                      );
                    })}
                  </div>
                </HealthcareCardContent>
              </HealthcareCard>
            </motion.div>

            {/* Voice Context Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <HealthcareCard variant="elevated" padding="lg">
                <HealthcareCardHeader>
                  <HealthcareCardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-primary" />
                    Voice Context (Optional but Recommended)
                  </HealthcareCardTitle>
                  <HealthcareCardDescription>
                    Describe your illness or hospitalization in your own words. This helps our AI 
                    understand your situation better and ensures accurate claim processing.
                  </HealthcareCardDescription>
                </HealthcareCardHeader>
                
                <HealthcareCardContent>
                  <VoiceRecorder
                    onTranscript={handleVoiceTranscript}
                    placeholder="Example: I was hospitalized for 4 days due to severe chest pain and breathlessness. The doctor diagnosed me with acute bronchitis and prescribed antibiotics and nebulization treatment..."
                  />
                </HealthcareCardContent>
              </HealthcareCard>
            </motion.div>

            {/* Submit Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <HealthcareCard variant="sage" padding="lg">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Ready to Submit?
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {isReadyToSubmit() 
                        ? "All required documents uploaded. Click to start AI analysis."
                        : "Please upload the required documents (Prescription & Hospital Bill) to continue."
                      }
                    </p>
                  </div>
                  <HealthcareButton
                    variant="hero"
                    onClick={handleSubmit}
                    disabled={!isReadyToSubmit()}
                    className="shrink-0"
                  >
                    <Sparkles className="w-5 h-5" />
                    Start AI Analysis
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

export default NewClaim;
