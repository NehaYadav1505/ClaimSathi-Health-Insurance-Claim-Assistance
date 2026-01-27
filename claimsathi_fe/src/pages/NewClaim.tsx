import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
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
  status: "uploading" | "complete" | "error";
  extractedData?: {
    prescription?: string;
    labReports?: string;
    hospitalBills?: string;
    policyDetails?: string;
    missingInformation?: string;
  };
}


const NewClaim = () => {
  const navigate = useNavigate();
  // Using a record to allow multiple files in one list if needed, or just one.
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({});
  const [voiceContext, setVoiceContext] = useState("");
  const [claimId, setClaimId] = useState<string | null>(null);
  // NEW: Real backend call to your Upload API
  const handleFileUpload = async (file: File) => {
    const fileId = "doc-" + Date.now();
    
    setUploadedFiles(prev => ({
      ...prev, [fileId]: { name: file.name, status: "uploading" }
    }));

    const formData = new FormData();
    formData.append("claimDocument", file); // Key must match your backend Multer setting

    try {
      const response = await fetch("http://localhost:3000/claim/analyze-document", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      
      if (data.success) {
        // Store the MongoDB ID to pass to the processing page
        setClaimId(data.claimId);

        
        setUploadedFiles(prev => ({
          ...prev,
          [fileId]: { 
            name: file.name, 
            status: "complete", 
            extractedData: data.claimSummary 
          }
        }));
      }
    } catch (error) {
      setUploadedFiles(prev => ({ ...prev, [fileId]: { ...prev[fileId], status: "error" } }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const updated = { ...prev };
      delete updated[fileId];
      return updated;
    });
  };

  const handleVoiceTranscript = (text: string) => {
    setVoiceContext(text);
  };

  const isReadyToSubmit = () => {
    // Returns true if there is at least one completed file
    return Object.values(uploadedFiles).some(file => file.status === "complete");
  };

 const handleSubmit = () => {
   
  if (!claimId) return;
  navigate("/claim-processing", { state: { claimId } });
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
                Upload your medical documents for a thorough AI assessment
              </p>
            </motion.div>

            {/* Unified Document Upload Section */}
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
                    Medical Documents
                  </HealthcareCardTitle>
                  <HealthcareCardDescription>
                    Upload your prescription, hospital bills, or lab reports (PDF)
                  </HealthcareCardDescription>
                </HealthcareCardHeader>

                <HealthcareCardContent>
                  <div className="space-y-4">
                    {/* The Single Upload Box - Only shows if no file is uploading/complete or to add more */}
                    <label className="group relative border-2 border-dashed border-muted-foreground/20 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FileText className="w-7 h-7 text-primary" />
                      </div>
                      <p className="text-base font-semibold">Click to upload document</p>
                      <p className="text-xs text-muted-foreground mt-1">Supports PDF, JPG, PNG</p>
                    </label>

                    {/* List of Uploaded Files */}
                    <AnimatePresence>
                      {Object.entries(uploadedFiles).map(([id, file]) => (
                        <motion.div
                          key={id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                        >
                          <HealthcareCard variant={file.status === "complete" ? "success" : "sage"} padding="sm">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="shrink-0">
                                  {file.status === "complete" ? (
                                    <CheckCircle className="w-5 h-5 text-success" />
                                  ) : (
                                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{file.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {file.status === "uploading" && "Uploading..."}
                                    {file.status === "complete" && "Analysis verified"}
                                  </p>
                                </div>
                              </div>
                              <button onClick={() => handleRemoveFile(id)} className="p-1 hover:bg-muted rounded">
                                <X className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>

                            {/* Show Extracted Data inside the card when complete */}
                            {file.status === "complete" && file.extractedData && (
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-white/50 p-2 rounded border border-success/20">
                                {/* <div><span className="text-muted-foreground">Hospital:</span> {file.extractedData.hospital}</div>
                                <div><span className="text-muted-foreground">Diagnosis:</span> {file.extractedData.diagnosis}</div>
                                <div><span className="text-muted-foreground">Date:</span> {file.extractedData.date}</div>
                                <div><span className="text-muted-foreground">Amount:</span> {file.extractedData.amount}</div> */}
                              </div>
                            )}
                          </HealthcareCard>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </HealthcareCardContent>
              </HealthcareCard>
            </motion.div>

            {/* Voice Context Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              <HealthcareCard variant="elevated" padding="lg">
                <HealthcareCardHeader>
                  <HealthcareCardTitle className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-primary" />
                    Voice Context (Optional)
                  </HealthcareCardTitle>
                  <HealthcareCardDescription>
                    Explain your situation in your own words to help AI processing.
                  </HealthcareCardDescription>
                </HealthcareCardHeader>
                <HealthcareCardContent>
                  <VoiceRecorder onTranscript={handleVoiceTranscript} />
                </HealthcareCardContent>
              </HealthcareCard>
            </motion.div>

            {/* Submit Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <HealthcareCard variant="sage" padding="lg">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Ready to Submit?
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {isReadyToSubmit()
                        ? "Document analysis complete. You can now submit your claim."
                        : "Please upload at least one document to proceed."
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