import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Calendar
} from "lucide-react";
import { HealthcareButton } from "@/components/ui/healthcare-button";
import { HealthcareCard, HealthcareCardHeader, HealthcareCardTitle, HealthcareCardContent } from "@/components/ui/healthcare-card";
import Header from "@/components/layout/Header";
import ChatBot from "@/components/chatbot/ChatBot";

const Dashboard = () => {
  const recentClaims = [
    {
      id: "CLM-2024-001",
      date: "Jan 15, 2024",
      hospital: "Apollo Hospital",
      amount: "₹45,000",
      status: "approved",
      statusLabel: "Approved"
    },
    {
      id: "CLM-2024-002",
      date: "Jan 10, 2024",
      hospital: "Max Healthcare",
      amount: "₹28,500",
      status: "processing",
      statusLabel: "Processing"
    },
    {
      id: "CLM-2023-098",
      date: "Dec 28, 2023",
      hospital: "Fortis",
      amount: "₹15,200",
      status: "approved",
      statusLabel: "Approved"
    }
  ];

  const statusConfig = {
    approved: {
      icon: CheckCircle,
      className: "bg-success/10 text-success"
    },
    processing: {
      icon: Clock,
      className: "bg-accent/30 text-primary"
    },
    review: {
      icon: AlertCircle,
      className: "bg-destructive/10 text-destructive"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back,
            </h1>
            <p className="text-muted-foreground">
              Your health claims dashboard. Start a new claim or track existing ones.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              { label: "Total Claims", value: "12", icon: FileText, color: "primary" },
              { label: "Approved", value: "10", icon: CheckCircle, color: "success" },
              { label: "In Progress", value: "2", icon: Clock, color: "accent" },
              { label: "Total Reimbursed", value: "₹2.4L", icon: TrendingUp, color: "primary" }
            ].map((stat, index) => (
              <HealthcareCard key={index} variant="elevated" padding="sm">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    stat.color === "success" ? "bg-success/10" :
                    stat.color === "accent" ? "bg-accent/30" :
                    "bg-primary/10"
                  }`}>
                    <stat.icon className={`w-5 h-5 ${
                      stat.color === "success" ? "text-success" :
                      stat.color === "accent" ? "text-primary" :
                      "text-primary"
                    }`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </HealthcareCard>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* New Claim Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <HealthcareCard variant="sage" padding="lg" className="h-full">
                <HealthcareCardContent className="flex flex-col items-center justify-center text-center h-full min-h-[280px]">
                  <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center mb-6">
                    <Plus className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Start New Claim
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Upload your documents and let our AI guide you through the process
                  </p>
                  <Link to="/new-claim">
                    <HealthcareButton variant="hero" className="group">
                      Begin Claim
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </HealthcareButton>
                  </Link>
                </HealthcareCardContent>
              </HealthcareCard>
            </motion.div>

            {/* Recent Claims */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <HealthcareCard variant="elevated" padding="lg">
                <HealthcareCardHeader>
                  <div className="flex items-center justify-between">
                    <HealthcareCardTitle>Recent Claims</HealthcareCardTitle>
                    <HealthcareButton variant="ghost" size="sm">
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </HealthcareButton>
                  </div>
                </HealthcareCardHeader>
                <HealthcareCardContent>
                  <div className="space-y-4">
                    {recentClaims.map((claim, index) => {
                      const StatusIcon = statusConfig[claim.status as keyof typeof statusConfig].icon;
                      const statusClass = statusConfig[claim.status as keyof typeof statusConfig].className;
                      
                      return (
                        <motion.div
                          key={claim.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <Link to={`/claim/${claim.id}`}>
                            <HealthcareCard 
                              variant="outline" 
                              padding="sm" 
                              className="hover:bg-muted/50 transition-colors cursor-pointer"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-primary" />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-foreground">{claim.hospital}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <span>{claim.id}</span>
                                      <span>•</span>
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {claim.date}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-foreground">{claim.amount}</p>
                                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                                    <StatusIcon className="w-3 h-3" />
                                    {claim.statusLabel}
                                  </div>
                                </div>
                              </div>
                            </HealthcareCard>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </HealthcareCardContent>
              </HealthcareCard>
            </motion.div>
          </div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <HealthcareCard variant="elevated" padding="lg">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Need help with your claim?
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI assistant is available 24/7 to help you understand your coverage 
                    and guide you through the claims process.
                  </p>
                </div>
                <HealthcareButton variant="outline">
                  Chat with Assistant
                </HealthcareButton>
              </div>
            </HealthcareCard>
          </motion.div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default Dashboard;
