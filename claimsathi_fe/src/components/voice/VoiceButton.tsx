import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, Loader2 } from "lucide-react";
import { HealthcareButton } from "@/components/ui/healthcare-button";

interface VoiceButtonProps {
  text: string;
  language?: "en" | "hi" | "bh";
  className?: string;
}

const VoiceButton = ({ text, language = "en", className }: VoiceButtonProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "en" ? "en-US" : "hi-IN";
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <HealthcareButton
      variant="voice"
      size="sm"
      onClick={isSpeaking ? stop : speak}
      className={className}
    >
      {isSpeaking ? (
        <>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
          </motion.div>
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" />
          <span>🔊 Listen</span>
        </>
      )}
    </HealthcareButton>
  );
};

export default VoiceButton;
