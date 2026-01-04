"use client";

import { useState, useRef, useEffect } from "react";
import { sendMessage } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "ai";
  content: string;
};

// ... (keep getUserId function as is)
// Generate or retrieve a unique user ID for this browser session
function getUserId(): string {
  if (typeof window === "undefined") return "user-default";

  let userId = localStorage.getItem("career_counsellor_user_id");
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem("career_counsellor_user_id", userId);
  }
  return userId;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: "Hi! I'm your AI Career Counsellor. Tell me about your interests (e.g., 'I like maths') and I'll suggest some career paths!" }
  ]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>("user-default");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize user ID on client side
  useEffect(() => {
    setUserId(getUserId());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await sendMessage(userMsg, userId);
      setMessages((prev) => [...prev, { role: "ai", content: response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", content: "Something went wrong. Please check logs." }]);
    } finally {
      setLoading(false);
    }
  };

  // Clear chat and reset session
  const handleClearChat = () => {
    // Generate new user ID to start fresh session
    const newUserId = `user-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    localStorage.setItem("career_counsellor_user_id", newUserId);
    setUserId(newUserId);
    setMessages([
      { role: "ai", content: "Hi! I'm your AI Career Counsellor. Tell me about your interests and I'll suggest some career paths!" }
    ]);
  };

  return (
    <main className="flex min-h-screen flex-col bg-white text-gray-900 font-sans">
      <header className="p-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center font-bold text-white shadow-md">
              AI
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Career Counsellor
            </h1>
          </div>
          <button
            onClick={handleClearChat}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            New Chat
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-4xl w-full mx-auto p-4 space-y-6 overflow-y-auto pb-24">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-6 py-4 shadow-sm ${msg.role === "user"
                ? "bg-emerald-700 text-white rounded-br-sm shadow-emerald-100"
                : "bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-sm"
                }`}
            >
              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-4 last:mb-0 leading-relaxed">{children}</p>,
                      a: ({ href, children }) => (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-800 underline font-medium">
                          {children}
                        </a>
                      ),
                      ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-2 border-b pb-2">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-4 text-emerald-800">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-3 text-gray-700">{children}</h3>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-emerald-200 pl-4 italic my-4 text-gray-600">{children}</blockquote>,
                      table: ({ children }) => <div className="overflow-x-auto my-4 rounded-lg border border-gray-200"><table className="min-w-full divide-y divide-gray-200">{children}</table></div>,
                      thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
                      tbody: ({ children }) => <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>,
                      tr: ({ children }) => <tr>{children}</tr>,
                      th: ({ children }) => <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{children}</th>,
                      td: ({ children }) => <td className="px-4 py-3 text-sm text-gray-700">{children}</td>,
                      code: ({ children }) => <code className="bg-gray-100 rounded px-1 py-0.5 font-mono text-sm text-pink-600">{children}</code>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-sm px-5 py-4 flex gap-2 items-center shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gray-100">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex gap-3">
          <input
            type="text"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-gray-400 text-gray-900 shadow-sm"
            placeholder="I like solving problems..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30"
          >
            Send
          </button>
        </form>
        <div className="max-w-4xl mx-auto mt-2 text-xs text-gray-400 text-center">
          Session: {userId.substring(0, 20)}...
        </div>
      </div>
    </main>
  );
}
