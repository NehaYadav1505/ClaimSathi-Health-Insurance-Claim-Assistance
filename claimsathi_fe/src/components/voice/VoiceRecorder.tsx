import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, RotateCcw, CheckCircle } from "lucide-react";
import { HealthcareButton } from "@/components/ui/healthcare-button";
import { HealthcareCard } from "@/components/ui/healthcare-card";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
}

const VoiceRecorder = ({ onTranscript, placeholder }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [hasRecording, setHasRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startRecording = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setTranscript((prev) => prev + transcriptPart + " ");
          } else {
            interimTranscript += transcriptPart;
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setHasRecording(true);
      };

      recognitionRef.current.start();
      setIsRecording(true);
    } else {
      alert("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setHasRecording(true);
  };

  const resetRecording = () => {
    setTranscript("");
    setHasRecording(false);
  };

  const confirmTranscript = () => {
    onTranscript(transcript);
  };

  return (
    <HealthcareCard variant="sage" className="space-y-4">
      {/* Recording Controls */}
      <div className="flex items-center justify-center gap-4">
        <AnimatePresence mode="wait">
          {!isRecording && !hasRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <HealthcareButton
                onClick={startRecording}
                size="iconLg"
                variant="voice"
                className="relative"
              >
                <Mic className="w-6 h-6" />
                <motion.span
                  className="absolute -bottom-8 text-sm text-muted-foreground whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Tap to speak
                </motion.span>
              </HealthcareButton>
            </motion.div>
          )}

          {isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-4"
            >
              {/* Voice Wave Animation */}
              <div className="flex items-center gap-1 h-12">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    animate={{
                      height: ["12px", "32px", "12px"],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>
              <HealthcareButton onClick={stopRecording} variant="destructive" size="icon">
                <Square className="w-4 h-4" />
              </HealthcareButton>
              <span className="text-sm text-muted-foreground">Recording... tap to stop</span>
            </motion.div>
          )}

          {hasRecording && !isRecording && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex gap-2"
            >
              <HealthcareButton onClick={resetRecording} variant="outline" size="icon">
                <RotateCcw className="w-4 h-4" />
              </HealthcareButton>
              <HealthcareButton onClick={startRecording} variant="secondary" size="icon">
                <Play className="w-4 h-4" />
              </HealthcareButton>
              <HealthcareButton onClick={confirmTranscript} variant="success" size="icon">
                <CheckCircle className="w-4 h-4" />
              </HealthcareButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Transcript Display */}
      {(transcript || placeholder) && (
        <div className="mt-6">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Your Voice Context
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={placeholder || "Your spoken words will appear here..."}
            className="w-full min-h-[100px] p-4 rounded-xl bg-surface-elevated border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>
      )}
    </HealthcareCard>
  );
};

export default VoiceRecorder;
