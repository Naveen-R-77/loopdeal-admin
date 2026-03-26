import React, { useState, useEffect, useRef } from "react";
import { Bot, Send, User, RotateCcw, ShieldCheck, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
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
          <div className="p-3 bg-primary rounded-2xl shadow-lg ring-4 ring-primary/10">
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
           <Button variant="outline" size="sm" className="gap-2 text-[10px] font-bold" onClick={() => setMessages([messages[0]])}>
            <RotateCcw className="h-3 w-3" /> CLEAR HISTORY
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full overflow-hidden">
        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col border bg-card shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <CardHeader className="py-3 border-b bg-muted/30">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Secure Enterprise Chat
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 p-0 overflow-hidden relative bg-card">
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
                      <Avatar className={`h-10 w-10 border-2 font-black shadow-sm ${
                        message.role === "assistant" 
                          ? "border-primary bg-primary text-white" 
                          : "border-muted-foreground/20 bg-muted text-foreground"
                      }`}>
                        {message.role === "assistant" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                      </Avatar>
                      <div className={`flex flex-col max-w-[80%] ${message.role === "user" ? "items-end" : ""}`}>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          message.role === "assistant"
                            ? "bg-muted text-foreground border rounded-tl-none font-medium"
                            : "bg-primary text-primary-foreground rounded-tr-none font-medium"
                        }`}>
                          {message.content}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1 px-1 font-bold tracking-wider">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                    <Avatar className="h-10 w-10 border-2 border-primary bg-primary">
                      <Bot className="h-5 w-5 text-white animate-bounce" />
                    </Avatar>
                    <div className="bg-muted p-4 rounded-2xl rounded-tl-none border flex gap-1 items-center">
                      <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce" />
                    </div>
                  </motion.div>
                )}
                {/* Scroll Target */}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-4 bg-muted/10 border-t">
             <div className="flex w-full items-center gap-3 bg-background rounded-full p-1 pl-4 border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
              <input
                placeholder="Ask the Agent about store policies..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="rounded-full h-10 w-10 p-0 bg-primary hover:bg-primary/90 text-white transition-colors"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Sidebar Panel */}
        <div className="space-y-6">
          <Card className="border bg-card shadow-sm relative overflow-hidden group">
            <div className="absolute -bottom-2 -left-2 p-2 opacity-5 rotate-12 transition-transform group-hover:scale-125">
              <Zap className="h-16 w-16 text-primary" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black tracking-widest uppercase text-muted-foreground">Usage Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Ask about Shipping Policies",
                "Query CCTV installation rules",
                "Check Warranty periods",
                "Verify Refund guidelines"
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-foreground cursor-pointer font-medium hover:text-primary transition-colors" onClick={() => setInput(tip)}>
                  <ChevronRight className="h-3 w-3 mt-0.5 text-primary shrink-0" />
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
