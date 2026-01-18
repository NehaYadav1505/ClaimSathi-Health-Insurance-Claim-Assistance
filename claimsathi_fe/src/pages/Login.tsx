import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ArrowRight, Shield, Mail, Lock } from "lucide-react";
import { HealthcareButton } from "@/components/ui/healthcare-button";
import {
  HealthcareCard,
  HealthcareCardHeader,
  HealthcareCardTitle,
  HealthcareCardDescription,
  HealthcareCardContent,
} from "@/components/ui/healthcare-card";
import Header from "@/components/layout/Header";
import ChatBot from "@/components/chatbot/ChatBot";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // TODO: call backend login API here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/consent");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HealthcareCard variant="elevated" padding="lg">
                <HealthcareCardHeader className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                  <HealthcareCardTitle className="text-2xl">
                    Welcome Back
                  </HealthcareCardTitle>
                  <HealthcareCardDescription>
                    Secure login using your email and password
                  </HealthcareCardDescription>
                </HealthcareCardHeader>

                <HealthcareCardContent>
                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Mail className="w-5 h-5" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                          }}
                          placeholder="Enter your email"
                          className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface-elevated border transition-all duration-200 focus:outline-none focus:ring-2 ${
                            error
                              ? "border-destructive focus:ring-destructive/20"
                              : "border-border focus:border-primary focus:ring-primary/20"
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Lock className="w-5 h-5" />
                        </div>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                          }}
                          placeholder="Enter your password"
                          className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface-elevated border transition-all duration-200 focus:outline-none focus:ring-2 ${
                            error
                              ? "border-destructive focus:ring-destructive/20"
                              : "border-border focus:border-primary focus:ring-primary/20"
                          }`}
                        />
                      </div>
                    </div>

                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive text-center"
                      >
                        {error}
                      </motion.p>
                    )}

                    <HealthcareButton
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting || !email || !password}
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                      ) : (
                        <>
                          Login
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </HealthcareButton>
                  </form>

                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                      <Shield className="w-4 h-4" />
                      <span>Secure & encrypted login</span>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-muted-foreground">
                      Don&apos;t have an account?{" "}
                      <Link
                        to="/register"
                        className="text-primary font-medium hover:underline"
                      >
                        Register now
                      </Link>
                    </p>
                  </div>
                </HealthcareCardContent>
              </HealthcareCard>
            </motion.div>
          </div>
        </div>
      </main>

      <ChatBot />
    </div>
  );
};

export default Login;
