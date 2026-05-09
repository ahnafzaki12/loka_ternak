"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Bot, Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: "msg-1",
    role: "assistant",
    content: "Halo! Saya adalah AI Assistant LokaTernak. Ada yang bisa saya bantu hari ini terkait manajemen peternakan Anda?",
    timestamp: new Date()
  }
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const newAiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Ini adalah simulasi respons dari AI Assistant. Fitur integrasi AI sebenarnya belum terhubung dengan backend. Namun, Anda dapat melihat desain antarmuka yang modern dan responsif ini siap digunakan!",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, newAiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleClearChat = () => {
    setMessages(initialMessages);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full max-w-5xl mx-auto flex flex-col p-4 md:p-8">
      {/* Header */}
      <header className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm mb-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">AI Assistant</h1>
            <p className="text-sm text-gray-500 font-medium">Tanya apa saja tentang LokaTernak</p>
          </div>
        </div>
        <button 
          onClick={handleClearChat}
          className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
          title="Reset Percakapan"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </header>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-50/50 rounded-3xl border border-gray-100 overflow-hidden flex flex-col shadow-inner relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div 
                key={msg.id} 
                className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
              >
                <div className={cn("flex max-w-[85%] md:max-w-[75%] gap-3 md:gap-4", isUser ? "flex-row-reverse" : "flex-row")}>
                  {/* Avatar */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                    isUser 
                      ? "bg-gray-900 text-white" 
                      : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                  )}>
                    {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col gap-1 min-w-[120px]">
                    <div className={cn(
                      "px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-sm",
                      isUser 
                        ? "bg-gray-900 text-white rounded-tr-sm" 
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                    )}>
                      {msg.content}
                    </div>
                    <span className={cn(
                      "text-[11px] font-medium text-gray-400 px-1",
                      isUser ? "text-right" : "text-left"
                    )}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex w-full justify-start">
              <div className="flex max-w-[85%] gap-3 md:gap-4 flex-row">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="px-5 py-4 rounded-2xl bg-white border border-gray-100 rounded-tl-sm flex items-center gap-1 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100 z-10 backdrop-blur-md bg-white/80">
          <form 
            onSubmit={handleSend}
            className="flex items-end gap-3 max-w-4xl mx-auto"
          >
            <div className="flex-1 relative group">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Ketik pesan Anda di sini..."
                className="w-full resize-none bg-gray-50 border border-gray-200 rounded-2xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-[15px] text-gray-700 min-h-[52px] max-h-[160px]"
                rows={1}
                style={{ 
                  height: "auto",
                  minHeight: "52px",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={cn(
                "p-3.5 rounded-xl flex items-center justify-center transition-all flex-shrink-0 h-[52px] w-[52px]",
                input.trim() && !isTyping
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </form>
          <div className="text-center mt-3">
             <p className="text-[11px] text-gray-400 font-medium">AI Assistant dapat membuat kesalahan. Harap periksa kembali informasi penting.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
