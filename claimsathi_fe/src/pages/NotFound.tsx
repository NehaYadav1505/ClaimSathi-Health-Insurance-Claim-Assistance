import { useState } from "react";
import { Upload, Brain, CheckCircle, Download } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Upload Documents",
    description:
      "Securely upload your medical documents in one combined PDF.",
    icon: Upload,
  },
  {
    step: "02",
    title: "AI Analysis",
    description:
      "Our AI verifies eligibility, policy rules, and hospital networks.",
    icon: Brain,
  },
  {
    step: "03",
    title: "Get Decision",
    description:
      "Receive a clear decision with detailed reimbursement explanation.",
    icon: CheckCircle,
  },
  {
    step: "04",
    title: "Download Report",
    description:
      "Download a professional claim report for your records.",
    icon: Download,
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-block mb-4 rounded-full border px-4 py-1 text-sm text-primary">
            Simple Process
          </span>
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground">
            A guided, transparent process designed to reduce stress and
            confusion.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Progress line */}
          <div className="hidden md:block absolute top-14 left-0 right-0 h-[2px] bg-muted" />
          <motion.div
            className="hidden md:block absolute top-14 left-0 h-[2px] bg-primary"
            animate={{ width: `${(activeStep + 1) * 25}%` }}
            transition={{ ease: "easeInOut", duration: 0.4 }}
          />

          <div className="grid md:grid-cols-4 gap-10">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isActive = index <= activeStep;

              return (
                <motion.div
                  key={item.step}
                  onClick={() => setActiveStep(index)}
                  whileHover={{ y: -6 }}
                  className="cursor-pointer text-center relative"
                >
                  {/* Step Number */}
                  <span
                    className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded-full ${isActive
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {item.step}
                  </span>

                  {/* Icon */}
                  <div
                    className={`mx-auto mb-6 w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive
                        ? "bg-primary text-white shadow-lg scale-110"
                        : "bg-card text-primary"
                      }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <h3
                    className={`font-semibold text-lg mb-2 transition-colors ${isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                  >
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};



export default HowItWorks;

