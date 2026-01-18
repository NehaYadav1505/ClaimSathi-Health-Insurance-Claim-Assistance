import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, FileText, Brain, Lock, CheckCircle, Globe } from "lucide-react";
import { HealthcareButton } from "@/components/ui/healthcare-button";
import { HealthcareCard, HealthcareCardHeader, HealthcareCardTitle, HealthcareCardDescription, HealthcareCardContent } from "@/components/ui/healthcare-card";
import VoiceButton from "@/components/voice/VoiceButton";
import Header from "@/components/layout/Header";
import ChatBot from "@/components/chatbot/ChatBot";

const consentTexts = {
  en: {
    title: "Data Privacy Consent",
    subtitle: "We care about your privacy. Please review and accept our data usage terms.",
    intro: "To process your health insurance claim, we need your consent to access and analyze certain information:",
    items: [
      {
        icon: FileText,
        title: "Document Access",
        description: "We will access your uploaded medical documents including prescriptions, bills, and lab reports to verify your claim."
      },
      {
        icon: Brain,
        title: "AI Analysis",
        description: "Our AI system will analyze your documents to assess eligibility. All AI decisions are advisory and reviewed by our team."
      },
      {
        icon: Lock,
        title: "Data Security",
        description: "Your data is encrypted and stored securely. We never share your information with third parties without explicit consent."
      }
    ],
    agreement: "I understand and agree to the terms above. I consent to the processing of my health information for claim assessment purposes.",
    button: "Accept & Continue",
    footer: "Protected under DPDP Act 2023"
  },
  hi: {
    title: "डेटा गोपनीयता सहमति",
    subtitle: "हम आपकी गोपनीयता का ध्यान रखते हैं। कृपया हमारे डेटा उपयोग की शर्तों की समीक्षा करें और स्वीकार करें।",
    intro: "आपके स्वास्थ्य बीमा दावे को संसाधित करने के लिए, हमें कुछ जानकारी तक पहुंचने और विश्लेषण करने के लिए आपकी सहमति की आवश्यकता है:",
    items: [
      {
        icon: FileText,
        title: "दस्तावेज़ पहुंच",
        description: "हम आपके दावे को सत्यापित करने के लिए आपके अपलोड किए गए चिकित्सा दस्तावेजों जैसे प्रिस्क्रिप्शन, बिल और लैब रिपोर्ट तक पहुंचेंगे।"
      },
      {
        icon: Brain,
        title: "AI विश्लेषण",
        description: "हमारी AI प्रणाली पात्रता का आकलन करने के लिए आपके दस्तावेजों का विश्लेषण करेगी। सभी AI निर्णय सलाहकार हैं और हमारी टीम द्वारा समीक्षा की जाती है।"
      },
      {
        icon: Lock,
        title: "डेटा सुरक्षा",
        description: "आपका डेटा एन्क्रिप्टेड है और सुरक्षित रूप से संग्रहीत है। हम स्पष्ट सहमति के बिना तीसरे पक्ष के साथ आपकी जानकारी कभी साझा नहीं करते।"
      }
    ],
    agreement: "मैं उपरोक्त शर्तों को समझता/समझती हूं और सहमत हूं। मैं दावा मूल्यांकन उद्देश्यों के लिए अपनी स्वास्थ्य जानकारी के प्रसंस्करण के लिए सहमति देता/देती हूं।",
    button: "स्वीकार करें और जारी रखें",
    footer: "DPDP अधिनियम 2023 के तहत संरक्षित"
  },
  bh: {
    title: "डेटा गोपनीयता सहमति",
    subtitle: "हम रउआ के गोपनीयता के ध्यान रखेला। कृपया हमार डेटा उपयोग के शर्त के समीक्षा करीं आ स्वीकार करीं।",
    intro: "रउआ के स्वास्थ्य बीमा दावा के प्रोसेस करे खातिर, हमके कुछ जानकारी तक पहुँचे आ विश्लेषण करे खातिर रउआ के सहमति चाहीं:",
    items: [
      {
        icon: FileText,
        title: "दस्तावेज़ पहुँच",
        description: "हम रउआ के दावा के सत्यापित करे खातिर रउआ के अपलोड कइल चिकित्सा दस्तावेज जइसे प्रिस्क्रिप्शन, बिल आ लैब रिपोर्ट तक पहुँचब।"
      },
      {
        icon: Brain,
        title: "AI विश्लेषण",
        description: "हमार AI सिस्टम पात्रता के आकलन करे खातिर रउआ के दस्तावेज के विश्लेषण करी। सब AI निर्णय सलाहकार बा आ हमार टीम द्वारा समीक्षा होला।"
      },
      {
        icon: Lock,
        title: "डेटा सुरक्षा",
        description: "रउआ के डेटा एन्क्रिप्टेड बा आ सुरक्षित तरीका से संग्रहीत बा। हम स्पष्ट सहमति के बिना तीसरा पक्ष के साथ रउआ के जानकारी कबहुँ साझा ना करीं।"
      }
    ],
    agreement: "हम ऊपर के शर्त के समझेला आ सहमत बानी। हम दावा मूल्यांकन उद्देश्य खातिर अपन स्वास्थ्य जानकारी के प्रसंस्करण खातिर सहमति देत बानी।",
    button: "स्वीकार करीं आ जारी रखीं",
    footer: "DPDP अधिनियम 2023 के तहत संरक्षित"
  }
};

const languages = [
  { code: "en" as const, label: "English" },
  { code: "hi" as const, label: "हिंदी" },
  { code: "bh" as const, label: "भोजपुरी" },
];

const Consent = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<"en" | "hi" | "bh">("en");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consentLogged, setConsentLogged] = useState(false);

  const content = consentTexts[language];

  const handleSubmit = async () => {
    if (!agreed) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setConsentLogged(true);
    
    // Show confirmation briefly before navigating
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  const getFullText = () => {
    return `${content.intro} ${content.items.map(item => `${item.title}: ${item.description}`).join(". ")} ${content.agreement}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <HealthcareCard variant="elevated" padding="lg">
                <HealthcareCardHeader className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <HealthcareCardTitle className="text-2xl">{content.title}</HealthcareCardTitle>
                  <HealthcareCardDescription>
                    {content.subtitle}
                  </HealthcareCardDescription>
                </HealthcareCardHeader>

                <HealthcareCardContent>
                  {/* Language Selector */}
                  <div className="flex items-center justify-center gap-2 mb-8">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <div className="flex bg-muted rounded-lg p-1">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            language === lang.code
                              ? "bg-surface-elevated text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Voice Button */}
                  <div className="flex justify-center mb-8">
                    <VoiceButton 
                      text={getFullText()} 
                      language={language === "bh" ? "hi" : language}
                    />
                  </div>

                  {/* Consent Content */}
                  <div className="space-y-6">
                    <p className="text-foreground">{content.intro}</p>

                    <div className="space-y-4">
                      {content.items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <HealthcareCard variant="sage" padding="sm" className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <item.icon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </HealthcareCard>
                        </motion.div>
                      ))}
                    </div>

                    {/* Agreement Checkbox */}
                    <div className="pt-4 border-t border-border">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative mt-0.5">
                          <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-6 h-6 rounded-lg border-2 transition-all ${
                            agreed 
                              ? "bg-primary border-primary" 
                              : "border-border group-hover:border-primary/50"
                          }`}>
                            {agreed && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-full h-full flex items-center justify-center"
                              >
                                <CheckCircle className="w-4 h-4 text-primary-foreground" />
                              </motion.div>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-foreground leading-relaxed">
                          {content.agreement}
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <HealthcareButton
                      onClick={handleSubmit}
                      className="w-full"
                      size="lg"
                      disabled={!agreed || isSubmitting || consentLogged}
                      variant={consentLogged ? "success" : "default"}
                    >
                      {consentLogged ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Consent Recorded
                        </>
                      ) : isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        />
                      ) : (
                        content.button
                      )}
                    </HealthcareButton>

                    {/* Footer */}
                    <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />
                      {content.footer}
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

export default Consent;
