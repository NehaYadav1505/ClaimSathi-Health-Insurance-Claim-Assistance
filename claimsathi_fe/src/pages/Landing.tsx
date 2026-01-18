import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Shield, 
  FileCheck, 
  Brain, 
  MessageCircle, 
  ArrowRight,
  CheckCircle,
  Lock,
  Heart
} from "lucide-react";
import { HealthcareButton } from "@/components/ui/healthcare-button";
import { HealthcareCard, HealthcareCardContent } from "@/components/ui/healthcare-card";
import Header from "@/components/layout/Header";
import ChatBot from "@/components/chatbot/ChatBot";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Landing = () => {
  const steps = [
    {
      icon: FileCheck,
      title: "Upload Documents",
      description: "Share your prescription, bills, and reports securely"
    },
    {
      icon: MessageCircle,
      title: "Add Voice Context",
      description: "Describe your situation in your own words"
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our caring AI reviews and verifies your claim"
    },
    {
      icon: Shield,
      title: "Clear Decision",
      description: "Receive transparent explanation of your coverage"
    }
  ];

  const features = [
    "Transparent AI-powered claim analysis",
    "Voice-enabled assistance in multiple languages",
    "Plain-language explanations, not legal jargon",
    "DPDP compliant with full data privacy"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-card/50 rounded-full px-4 py-2 mb-8">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Trusted by 50,000+ families
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
            >
              Health Claims, Explained with{" "}
              <span className="text-primary">Care</span>
              <br />
              — Not Confusion
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Our AI-powered platform processes your insurance claims with empathy and 
              transparency. No more confusing paperwork or unexplained deductions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register">
                <HealthcareButton variant="hero" className="group">
                  Start New Claim
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </HealthcareButton>
              </Link>
              <Link to="/how-it-works">
                <HealthcareButton variant="outline" size="lg">
                  Learn How It Works
                </HealthcareButton>
              </Link>
            </motion.div>
          </div>

          {/* Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <HealthcareCard variant="elevated" padding="lg" className="bg-gradient-to-br from-card/40 to-card/20">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">
                    Your health journey, protected
                  </h2>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-success mt-0.5 shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-success/20 to-accent/10 rounded-3xl flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-center"
                    >
                      <Heart className="w-24 h-24 text-primary mx-auto mb-4" />
                      <p className="text-lg font-medium text-foreground">Care-First Approach</p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </HealthcareCard>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-surface/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A simple, transparent process designed with your peace of mind at the center
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {steps.map((step, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <HealthcareCard 
                  variant="elevated" 
                  className="h-full relative overflow-hidden group hover:shadow-elevated transition-shadow"
                >
                  <HealthcareCardContent>
                    <div className="absolute top-4 right-4 text-6xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                      {index + 1}
                    </div>
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl bg-card flex items-center justify-center mb-4">
                        <step.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </HealthcareCardContent>
                </HealthcareCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <HealthcareCard variant="sage" padding="xl">
              <div className="text-center">
                <Lock className="w-12 h-12 text-primary mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Your Privacy, Our Priority
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  We're fully compliant with the Digital Personal Data Protection (DPDP) Act. 
                  Your health information is encrypted, secure, and never shared without your 
                  explicit consent.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="flex items-center gap-2 bg-surface-elevated rounded-full px-4 py-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">DPDP Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 bg-surface-elevated rounded-full px-4 py-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">End-to-End Encryption</span>
                  </div>
                  <div className="flex items-center gap-2 bg-surface-elevated rounded-full px-4 py-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">AI is Advisory Only</span>
                  </div>
                </div>
              </div>
            </HealthcareCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to simplify your claims?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of families who trust HealthClaim AI for transparent, 
              stress-free insurance processing.
            </p>
            <Link to="/register">
              <HealthcareButton 
                variant="secondary" 
                size="xl"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5" />
              </HealthcareButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">
                ClaimSathi
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 HealthClaim AI. All rights reserved. Caring for your claims with compassion.
            </p>
          </div>
        </div>
      </footer>

      <ChatBot />
    </div>
  );
};

export default Landing;
