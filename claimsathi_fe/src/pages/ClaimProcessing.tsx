import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  Shield, 
  Building2, 
  Brain,
  FileSearch,
  Loader2,
  ArrowRight
} from "lucide-react";
import { HealthcareButton } from "@/components/ui/healthcare-button";
import { HealthcareCard, HealthcareCardContent } from "@/components/ui/healthcare-card";
import Header from "@/components/layout/Header";
import ChatBot from "@/components/chatbot/ChatBot";

interface Agent {
  id: string;
  name: string;
  description: string;
  icon: typeof Shield;
  status: "pending" | "processing" | "complete";
  message: string;
}

const ClaimProcessing = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "verification",
      name: "Verification Agent",
      description: "Matching prescription details with lab reports",
      icon: FileSearch,
      status: "pending",
      message: "Waiting to start..."
    },
    {
      id: "eligibility",
      name: "Eligibility Agent",
      description: "Checking co-payment, room rent & policy limits",
      icon: Shield,
      status: "pending",
      message: "Waiting to start..."
    },
    {
      id: "hospital",
      name: "Hospital Validator",
      description: "Verifying network status & hospital credentials",
      icon: Building2,
      status: "pending",
      message: "Waiting to start..."
    },
    {
      id: "reasoning",
      name: "AI Reasoning Engine",
      description: "Synthesizing findings & generating decision",
      icon: Brain,
      status: "pending",
      message: "Waiting to start..."
    }
  ]);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const processingMessages = {
    verification: [
      "Extracting text from prescription...",
      "Comparing diagnosis with lab findings...",
      "Cross-referencing medication with symptoms...",
      "Verification successful ✓"
    ],
    eligibility: [
      "Checking policy coverage limits...",
      "Calculating room rent entitlement...",
      "Verifying co-payment terms...",
      "Eligibility confirmed ✓"
    ],
    hospital: [
      "Looking up hospital in network database...",
      "Verifying hospital registration...",
      "Checking preferred provider status...",
      "Network hospital verified ✓"
    ],
    reasoning: [
      "Analyzing all agent findings...",
      "Calculating reimbursement amount...",
      "Generating detailed explanation...",
      "Decision ready ✓"
    ]
  };

  useEffect(() => {
    if (currentAgentIndex >= agents.length) {
      setIsComplete(true);
      return;
    }

    const currentAgent = agents[currentAgentIndex];
    const messages = processingMessages[currentAgent.id as keyof typeof processingMessages];
    let messageIndex = 0;

    // Set to processing
    setAgents(prev => prev.map((agent, idx) => 
      idx === currentAgentIndex 
        ? { ...agent, status: "processing", message: messages[0] }
        : agent
    ));

    // Cycle through messages
    const messageInterval = setInterval(() => {
      messageIndex++;
      if (messageIndex < messages.length) {
        setAgents(prev => prev.map((agent, idx) => 
          idx === currentAgentIndex 
            ? { ...agent, message: messages[messageIndex] }
            : agent
        ));
      }
    }, 800);

    // Complete after delay
    const completeTimeout = setTimeout(() => {
      clearInterval(messageInterval);
      setAgents(prev => prev.map((agent, idx) => 
        idx === currentAgentIndex 
          ? { ...agent, status: "complete", message: messages[messages.length - 1] }
          : agent
      ));
      setCurrentAgentIndex(prev => prev + 1);
    }, 3200);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(completeTimeout);
    };
  }, [currentAgentIndex]);

  const handleViewDecision = () => {
    navigate("/claim-decision");
  };

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
              className="text-center mb-12"
            >
              <div className="w-20 h-20 rounded-2xl bg-card flex items-center justify-center mx-auto mb-6">
                <Brain className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                AI Audit in Progress
              </h1>
              <p className="text-muted-foreground">
                Our AI agents are carefully analyzing your claim documents
              </p>
            </motion.div>

            {/* Agent Cards */}
            <div className="space-y-4 mb-8">
              {agents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HealthcareCard
                    variant={
                      agent.status === "complete" ? "success" :
                      agent.status === "processing" ? "elevated" :
                      "outline"
                    }
                    padding="sm"
                    className={`transition-all duration-300 ${
                      agent.status === "processing" ? "ring-2 ring-primary/20" : ""
                    }`}
                  >
                    <HealthcareCardContent>
                      <div className="flex items-center gap-4">
                        {/* Status Indicator */}
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          agent.status === "complete" ? "bg-success/20" :
                          agent.status === "processing" ? "bg-primary/10" :
                          "bg-muted"
                        }`}>
                          {agent.status === "complete" ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            >
                              <CheckCircle className="w-7 h-7 text-success" />
                            </motion.div>
                          ) : agent.status === "processing" ? (
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                              <agent.icon className="w-7 h-7 text-primary" />
                            </motion.div>
                          ) : (
                            <agent.icon className="w-7 h-7 text-muted-foreground" />
                          )}
                        </div>

                        {/* Agent Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold transition-colors ${
                            agent.status === "pending" ? "text-muted-foreground" : "text-foreground"
                          }`}>
                            {agent.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {agent.description}
                          </p>
                          
                          {/* Processing Message */}
                          <AnimatePresence mode="wait">
                            {(agent.status === "processing" || agent.status === "complete") && (
                              <motion.div
                                key={agent.message}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="mt-2"
                              >
                                <p className={`text-sm font-medium flex items-center gap-2 ${
                                  agent.status === "complete" ? "text-success" : "text-primary"
                                }`}>
                                  {agent.status === "processing" && (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  )}
                                  {agent.message}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Status Badge */}
                        <div className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${
                          agent.status === "complete" ? "bg-success/10 text-success" :
                          agent.status === "processing" ? "bg-primary/10 text-primary" :
                          "bg-muted text-muted-foreground"
                        }`}>
                          {agent.status === "complete" ? "Complete" :
                           agent.status === "processing" ? "Processing" :
                           "Pending"}
                        </div>
                      </div>
                    </HealthcareCardContent>
                  </HealthcareCard>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium text-foreground">
                  {Math.round((currentAgentIndex / agents.length) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${(currentAgentIndex / agents.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>

            {/* Complete Action */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <HealthcareCard variant="success" padding="lg">
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, delay: 0.2 }}
                        className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4"
                      >
                        <CheckCircle className="w-8 h-8 text-success" />
                      </motion.div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        Analysis Complete!
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        All AI agents have finished reviewing your claim. 
                        Your decision is ready.
                      </p>
                      <HealthcareButton
                        variant="hero"
                        onClick={handleViewDecision}
                        className="group"
                      >
                        View Claim Decision
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </HealthcareButton>
                    </div>
                  </HealthcareCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default ClaimProcessing;
