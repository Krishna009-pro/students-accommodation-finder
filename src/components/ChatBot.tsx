import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { API_URL } from "@/lib/config";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useProperty } from "@/hooks/useProperties";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your Student Haven Assistant. How can I help you find the perfect home today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();
  const { id } = useParams();
  const { data: property } = useProperty(id);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!currentUser) {
      toast.error("Please login to chat with the AI Assistant");
      return;
    }

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].slice(-10), // Send last 10 messages for context
          propertyContext: property || null
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to get AI response");

      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (error: any) {
      console.error("Chat Error:", error);
      toast.error(error.message || "Failed to connect to AI assistant");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4"
          >
            <Card className="w-[350px] md:w-[400px] h-[500px] flex flex-col shadow-2xl border-primary/20 overflow-hidden bg-card/95 backdrop-blur-sm">
              {/* Header */}
              <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary-foreground/20 rounded-lg">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Student Haven AI</h3>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-[10px] opacity-80 uppercase font-bold tracking-tight">Active Powered by Groq</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-primary-foreground/10 text-primary-foreground">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages */}
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30"
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        m.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-background border border-border shadow-sm rounded-tl-none"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 opacity-70 text-[10px] uppercase font-bold">
                        {m.role === "user" ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                        {m.role === "user" ? "You" : "Assistant"}
                      </div>
                      <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-background border border-border shadow-sm p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-xs text-muted-foreground italic">AI is thinking...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-border bg-background">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    placeholder={currentUser ? "Ask anything about housing..." : "Login to chat"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading || !currentUser}
                    className="flex-1 rounded-xl"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading || !input.trim() || !currentUser}
                    className="rounded-xl"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                {!currentUser && (
                  <p className="text-[10px] text-center mt-2 text-muted-foreground uppercase font-bold letter-spacing-wide">
                    Login required to use AI features
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className={`w-14 h-14 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen ? "rotate-90 bg-destructive hover:bg-destructive" : "hover:scale-110 bg-primary"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="w-6 h-6" /> : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-3 h-3 text-yellow-400" />
            </motion.div>
          </div>
        )}
      </Button>
    </div>
  );
};
