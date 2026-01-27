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

  // ✅ WORKING LOGIN HANDLER
  const handleLoginSubmit = async () => {
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // ❌ Login failed
      if (!response.ok) {
        setError(data.message || "Login failed");
        setIsSubmitting(false);
        return;
      }

      // ✅ Login success
      console.log("LOGIN SUCCESS:", data);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/consent");
    } catch (err) {
      setError("Backend not reachable");
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

                <HealthcareCardContent className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        placeholder="Enter your email"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="text-sm text-red-600 text-center">{error}</p>
                  )}

                  {/* Login Button */}
                  <HealthcareButton
                    type="button"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting || !email || !password}
                    onClick={handleLoginSubmit}
                  >
                    {isSubmitting ? (
                      "Logging in..."
                    ) : (
                      <>
                        Login <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </HealthcareButton>

                  <div className="pt-4 border-t text-center text-sm text-muted-foreground flex justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    Secure & encrypted login
                  </div>

                  <p className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      to="/register"
                      className="text-primary font-medium hover:underline"
                    >
                      Register now
                    </Link>
                  </p>
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
