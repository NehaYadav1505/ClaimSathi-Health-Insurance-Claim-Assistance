import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Mic, MicOff, Volume2, Globe } from "lucide-react";
import { HealthcareButton } from "@/components/ui/healthcare-button";
import { HealthcareCard } from "@/components/ui/healthcare-card";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिंदी" },
  { code: "bh", label: "भोजपुरी" },
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your HealthClaim Assistant. How can I help you today? I can explain claim terms, guide you through the process, or answer questions about your coverage.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("en");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        en: "Thank you for your question. I'm here to help you understand your health insurance claim process. Could you please provide more details about your concern?",
        hi: "आपके प्रश्न के लिए धन्यवाद। मैं आपकी स्वास्थ्य बीमा दावा प्रक्रिया को समझने में मदद करने के लिए यहाँ हूँ। कृपया अपनी चिंता के बारे में अधिक विवरण दें।",
        bh: "रउआ सवाल खातिर धन्यवाद। हम रउआ के स्वास्थ्य बीमा दावा प्रक्रिया समझे में मदद करे खातिर इहाँ बानी। कृपया अपना समस्या के बारे में आउर बतावल जाव।",
      };

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponses[language],
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "en" ? "en-US" : language === "hi" ? "hi-IN" : "hi-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-elevated flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]"
          >
            <HealthcareCard variant="elevated" padding="none" className="overflow-hidden">
              {/* Header */}
              <div className="bg-primary p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-primary-foreground font-semibold">HealthClaim Assistant</h3>
                    <p className="text-primary-foreground/70 text-xs">Always here to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Language Selector */}
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="appearance-none bg-primary-foreground/20 text-primary-foreground text-xs rounded-lg px-2 py-1 pr-6 cursor-pointer"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code} className="text-foreground">
                          {lang.label}
                        </option>
                      ))}
                    </select>
                    <Globe className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-primary-foreground pointer-events-none" />
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-primary-foreground/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-primary-foreground" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[320px] overflow-y-auto p-4 space-y-4 bg-background">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.isBot
                          ? "bg-card text-card-foreground rounded-tl-sm"
                          : "bg-primary text-primary-foreground rounded-tr-sm"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      {message.isBot && (
                        <button
                          onClick={() => speakMessage(message.text)}
                          className="mt-2 flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <Volume2 className="w-3 h-3" />
                          Listen
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-surface-elevated">
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleVoice}
                    className={`p-2.5 rounded-xl transition-colors ${
                      isListening
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <HealthcareButton
                    onClick={handleSend}
                    size="icon"
                    disabled={!input.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </HealthcareButton>
                </div>
              </div>
            </HealthcareCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
