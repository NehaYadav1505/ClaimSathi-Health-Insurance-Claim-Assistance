import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, User, Phone, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { HealthcareButton } from "@/components/ui/healthcare-button";
import { HealthcareCard, HealthcareCardHeader, HealthcareCardTitle, HealthcareCardDescription, HealthcareCardContent } from "@/components/ui/healthcare-card";
import Header from "@/components/layout/Header";
import ChatBot from "@/components/chatbot/ChatBot";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "fullName":
        return value.length < 2 ? "Please enter your full name" : "";
      case "mobile":
        return !/^[6-9]\d{9}$/.test(value) ? "Please enter a valid 10-digit mobile number" : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Please enter a valid email address" : "";
      case "password":
        return value.length < 6 ? "Password must be at least 6 characters" : "";
      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };


  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    console.log("REGISTER SUBMITTED");


    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false); // 👈 ADD THIS
      return;
    }


    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,   // backend expects "name"
          email: formData.email,
          password: formData.password,
          mobile: formData.mobile,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || "Registration failed" });
        return;
      }

      // ✅ SUCCESS → go to login page
      navigate("/login");
    } catch (error) {
      setErrors({ general: "Backend not connected" });
    } finally {
      setIsSubmitting(false);
    }
  };


  const inputClasses = (hasError: boolean) =>
    `w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface-elevated border transition-all duration-200 focus:outline-none focus:ring-2 ${hasError
      ? "border-destructive focus:ring-destructive/20"
      : "border-border focus:border-primary focus:ring-primary/20"
    }`;

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
                  <HealthcareCardTitle className="text-2xl">Create Your Account</HealthcareCardTitle>
                  <HealthcareCardDescription>
                    Join us for a simpler, stress-free claims experience
                  </HealthcareCardDescription>
                </HealthcareCardHeader>

                <HealthcareCardContent>
                  <form className="space-y-5">

                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your full name"
                          className={inputClasses(!!errors.fullName)}
                        />
                      </div>
                      {errors.fullName && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-destructive"
                        >
                          {errors.fullName}
                        </motion.p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="tel"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter 10-digit mobile number"
                          maxLength={10}
                          className={inputClasses(!!errors.mobile)}
                        />
                      </div>
                      {errors.mobile && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-destructive"
                        >
                          {errors.mobile}
                        </motion.p>
                      )}
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        We'll send an OTP for verification
                      </p>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your email"
                          className={inputClasses(!!errors.email)}
                        />
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-destructive"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Create a password"
                          className={`${inputClasses(!!errors.password)} pr-12`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-destructive"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </div>

                    {errors.general && (
                      <p className="text-red-600 text-sm text-center mb-3">
                        {errors.general}
                      </p>
                    )}

                    {/* Submit Button */}
                    <HealthcareButton
                      type="button"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                      onClick={handleSubmit}
                    >

                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </HealthcareButton>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-muted-foreground">
                      Already have an account?{" "}
                      <Link to="/login" className="text-primary font-medium hover:underline">
                        Login here
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

export default Register;
