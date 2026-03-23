import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, User, RotateCcw, ShieldCheck, Database, Zap, ExternalLink, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { RAG_API_URL } from "@/config";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const AIAgent = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I am the LoopDeal AI Intelligence Agent. I have access to your enterprise knowledge base, policies, and store guidelines. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const query = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add immediate placeholder for assistant
    const assistantId = (Date.now() + 1).toString();
    const assistantPlaceholder: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      const response = await fetch(`${RAG_API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error("Agent connection failed.");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n\n");
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.replace("data: ", ""));
                if (data.chunk) {
                  fullContent += data.chunk;
                  // Update the specific message content
                  setMessages((prev) => 
                    prev.map((msg) => 
                      msg.id === assistantId ? { ...msg, content: fullContent } : msg
                    )
                  );
                } else if (data.error) {
                   toast.error("Agent Processing Error", { description: data.error });
                }
              } catch (e) {
                // Ignore parse errors from partial chunks
              }
            }
          }
        }
      }
    } catch (error) {
      toast.error("Cloud Connection Error", {
        description: "Verify that the LoopDeal RAG Agent backend is active on port 8000.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#C41E22] rounded-2xl shadow-lg ring-4 ring-red-500/10">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight italic">LoopDeal Intelligence Hub</h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              RAG-Powered Enterprise Agent
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="gap-2 text-[10px] font-bold border-white/10" onClick={() => setMessages([messages[0]])}>
            <RotateCcw className="h-3 w-3" /> CLEAR HISTORY
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full overflow-hidden">
        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col border-white/5 bg-black/40 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C41E22] to-transparent opacity-50" />
          
          <CardHeader className="py-3 border-b border-white/5 bg-white/5">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#C41E22]" /> Secure Enterprise Chat
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden relative">
            <ScrollArea className="h-full p-6">
              <div className="space-y-6 pb-4">
                <AnimatePresence initial={false}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className={`h-10 w-10 border-2 font-black ${
                        message.role === "assistant" 
                          ? "border-[#C41E22] bg-[#C41E22] text-white" 
                          : "border-white/10 bg-white/10 text-white"
                      }`}>
                        {message.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                      </Avatar>
                      <div className={`flex flex-col max-w-[80%] ${message.role === "user" ? "items-end" : ""}`}>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                          message.role === "assistant"
                            ? "bg-white/5 text-white/90 border border-white/5 rounded-tl-none"
                            : "bg-[#C41E22] text-white rounded-tr-none"
                        }`}>
                          {message.content}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 px-1 opacity-50">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                    <Avatar className="h-10 w-10 border-2 border-[#C41E22] bg-[#C41E22]">
                      <Bot className="h-5 w-5 text-white animate-bounce" />
                    </Avatar>
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1 items-center">
                      <span className="h-2 w-2 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 bg-white/40 rounded-full animate-bounce" />
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-4 bg-white/5 border-t border-white/5">
            <div className="flex w-full items-center gap-3 bg-black/40 rounded-full p-1 pl-4 border border-white/10 focus-within:border-[#C41E22]/50 transition-all shadow-inner">
              <input
                placeholder="Ask the Agent about store policies..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-muted-foreground outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="rounded-full h-10 w-10 p-0 bg-[#C41E22] hover:bg-[#A3161A] transition-colors"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Sidebar Panel */}
        <div className="space-y-6">
          <Card className="border-white/5 bg-black/40 shadow-xl overflow-hidden relative">
             <div className="absolute top-0 right-0 p-2 opacity-5">
              <Database className="h-20 w-20" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black tracking-widest uppercase opacity-50 flex items-center gap-2">
                <Database className="h-3 w-3" /> System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-xs font-medium opacity-70">Core Engine</span>
                <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-500 border-none font-bold italic">LLAMA-3.2</Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-xs font-medium opacity-70">Knowledge Base</span>
                <Badge variant="outline" className="text-[9px] bg-blue-500/10 text-blue-500 border-none font-bold italic">ACTIVE</Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-xs font-medium opacity-70">Vector DB</span>
                <Badge variant="outline" className="text-[9px] bg-purple-500/10 text-purple-500 border-none font-bold italic">CHROMADB</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-black/40 shadow-xl relative overflow-hidden group">
            <div className="absolute -bottom-2 -left-2 p-2 opacity-5 rotate-12 transition-transform group-hover:scale-125">
              <Zap className="h-16 w-16 text-[#C41E22]" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black tracking-widest uppercase opacity-50">Usage Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Ask about Shipping Policies",
                "Query CCTV installation rules",
                "Check Warranty periods",
                "Verify Refund guidelines"
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs opacity-80 cursor-pointer hover:text-[#C41E22] transition-colors" onClick={() => setInput(tip)}>
                  <ChevronRight className="h-3 w-3 mt-0.5 text-[#C41E22]" />
                  <span>{tip}</span>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default AIAgent;
