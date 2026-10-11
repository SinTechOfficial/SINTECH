import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  Copy,
  CornerDownLeft,
  Maximize2,
  MessageSquare,
  Minimize2,
  RefreshCw,
  Send,
  Sparkles,
  Terminal,
  X
} from "lucide-react";
import { generateSinResponse, type SinBotResponse } from "../lib/sinBotKnowledge";
import { track } from "../lib/analytics";

interface Message {
  id: string;
  sender: "user" | "sin";
  text: string;
  timestamp: string;
  suggestions?: string[];
  category?: string;
}

// Custom Markdown formatter supporting code blocks, bold text, bullets, and internal links
function MarkdownMessage({ content }: { content: string }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyCode = (codeText: string, index: number) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(codeText);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  // Split content by code blocks ```...```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const lines = part.slice(3, -3).trim().split("\n");
          const language = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : "";
          const codeContent = language ? lines.slice(1).join("\n") : lines.join("\n");

          return (
            <div key={index} className="my-2 overflow-hidden rounded-xl border border-sky-400/25 bg-[#050b18]/90 font-mono text-xs shadow-lg">
              <div className="flex items-center justify-between border-b border-sky-500/20 bg-[#09152e] px-3 py-1.5 text-slate-400">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300">
                  <Terminal size={12} /> {language || "code"}
                </span>
                <button
                  type="button"
                  onClick={() => copyCode(codeContent, index)}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check size={12} className="text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto p-3 text-[#d3e3fd] leading-normal scrollbar-thin">
                <code>{codeContent}</code>
              </pre>
            </div>
          );
        }

        // Parse paragraphs, markdown headers, bolding, lists and links
        const paragraphs = part.split("\n\n");
        return (
          <div key={index} className="space-y-1.5">
            {paragraphs.map((p, pIdx) => {
              if (!p.trim()) return null;

              // Headers: ### Title
              if (p.startsWith("### ")) {
                return (
                  <h4 key={pIdx} className="font-heading text-sm font-bold text-white pt-1">
                    {p.replace("### ", "")}
                  </h4>
                );
              }
              if (p.startsWith("#### ")) {
                return (
                  <h5 key={pIdx} className="font-heading text-xs font-bold text-cyan-300 pt-1">
                    {p.replace("#### ", "")}
                  </h5>
                );
              }

              // Bullet points
              if (p.includes("\n* ") || p.startsWith("* ")) {
                const items = p.split("\n* ").map(item => item.replace(/^\*\s*/, ""));
                return (
                  <ul key={pIdx} className="list-disc pl-4 space-y-1 text-slate-200">
                    {items.map((item, iIdx) => (
                      <li key={iIdx}>
                        <FormatInline text={item} />
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={pIdx} className="text-slate-200">
                  <FormatInline text={p} />
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// Formats **bold**, `code`, and [link](/path)
function FormatInline({ text }: { text: string }) {
  // Regex to split by markdown links [label](url), bold **word**, inline `code`
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(parseBoldAndCode(text.substring(lastIndex, match.index), lastIndex));
    }
    const label = match[1];
    const url = match[2];

    if (url.startsWith("/")) {
      parts.push(
        <Link
          key={match.index}
          href={url}
          className="inline-flex items-center gap-0.5 font-semibold text-cyan-300 underline underline-offset-2 hover:text-white transition-colors"
        >
          {label}
        </Link>
      );
    } else {
      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 font-semibold text-cyan-300 underline underline-offset-2 hover:text-white transition-colors"
        >
          {label}
        </a>
      );
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(parseBoldAndCode(text.substring(lastIndex), lastIndex));
  }

  return <>{parts}</>;
}

function parseBoldAndCode(subtext: string, baseKey: number): React.ReactNode[] {
  const chunks = subtext.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return chunks.map((chunk, idx) => {
    const key = `${baseKey}-${idx}`;
    if (chunk.startsWith("**") && chunk.endsWith("**")) {
      return <strong key={key} className="font-bold text-white">{chunk.slice(2, -2)}</strong>;
    }
    if (chunk.startsWith("`") && chunk.endsWith("`")) {
      return <code key={key} className="rounded bg-sky-950/70 border border-sky-400/20 px-1 py-0.5 font-mono text-[11px] text-cyan-300">{chunk.slice(1, -1)}</code>;
    }
    return chunk;
  });
}

export function SinChatbot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialMessage: Message = {
    id: "welcome",
    sender: "sin",
    text: `Hello! I am **SIN**, SinTech's intelligent technical assistant. 

I know **everything about SinTech** — our 6 core services, founders & 15+ specialists, project engagement models, and delivery timelines. 

I can also help solve **software engineering problems**, debug React/Node/SQL errors, and advise on system design.

How can I help you today?`,
    timestamp: "Just now",
    suggestions: [
      "What services do you offer?",
      "How do I start a project?",
      "Help me fix a CORS error",
      "Meet the SinTech team",
      "Flutter vs React Native"
    ]
  };

  const [messages, setMessages] = useState<Message[]>([initialMessage]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isTyping]);

  if (!mounted) return null;

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: "Just now"
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    track("chatbot_query", { query: query.slice(0, 40) });

    // Natural bot response delay
    setTimeout(() => {
      const botResponse: SinBotResponse = generateSinResponse(query);
      const sinMsg: Message = {
        id: `sin-${Date.now()}`,
        sender: "sin",
        text: botResponse.reply,
        timestamp: "Just now",
        suggestions: botResponse.suggestions,
        category: botResponse.category
      };
      setMessages(prev => [...prev, sinMsg]);
      setIsTyping(false);
    }, 450);
  };

  const resetChat = () => {
    setMessages([initialMessage]);
    setInput("");
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <aside aria-label="SinTech Chatbot" className="fixed bottom-5 right-5 z-50">
        {!isOpen && (
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              track("chatbot_open");
            }}
            aria-label="Open SIN AI Chatbot"
            aria-expanded={false}
            className="group relative flex items-center gap-2.5 rounded-full border border-sky-400/40 bg-gradient-to-r from-[#0b1733] via-[#0d1f42] to-[#0b1733] p-2 sm:px-4 sm:py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(56,189,248,0.35)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-cyan-300 hover:shadow-[0_10px_45px_rgba(14,165,233,0.6)] focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {/* Animated Glow Aura */}
            <span className="absolute -inset-1 -z-10 rounded-full bg-gradient-to-r from-cyan-500/20 via-sky-400/30 to-blue-600/20 blur-md group-hover:blur-lg transition-all" />

            {/* Glowing 3D Emblem Avatar */}
            <div className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sky-400/20 to-blue-600/30 border border-sky-300/40 shadow-inner">
              <img
                src={`${import.meta.env.BASE_URL}images/sintech-emblem-3d.webp`}
                alt="SIN AI"
                width={28}
                height={28}
                className="h-6 w-auto object-contain animate-float-slow drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0b1733] animate-pulse" />
            </div>

            {/* Label on larger screens */}
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-sm text-white tracking-wide">SIN</span>
                <span className="rounded bg-sky-500/20 px-1 py-0.2 text-[9px] font-mono font-bold text-cyan-300 border border-sky-400/30">AI</span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium leading-none">Ask anything</span>
            </div>
          </button>
        )}
      </aside>

      {/* Main Glassmorphic Chat Window */}
      {isOpen && (
        <section
          aria-label="SIN Chatbot dialog"
          className={`fixed bottom-4 right-4 z-50 flex flex-col overflow-hidden rounded-3xl border border-sky-400/35 bg-[#070e20]/95 shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_40px_rgba(14,165,233,0.22)] backdrop-blur-2xl transition-all duration-300 ${
            isExpanded
              ? "w-[min(650px,calc(100vw-32px))] h-[min(750px,calc(100vh-40px))]"
              : "w-[min(420px,calc(100vw-32px))] h-[min(620px,calc(100vh-80px))]"
          }`}
        >
          {/* Header */}
          <div className="relative flex items-center justify-between border-b border-sky-500/20 bg-gradient-to-r from-[#0d1d3d] via-[#09152e] to-[#0d1d3d] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-600/30 border border-sky-400/40 shadow-inner">
                <img
                  src={`${import.meta.env.BASE_URL}images/sintech-emblem-3d.webp`}
                  alt="SIN Avatar"
                  width={26}
                  height={26}
                  className="h-6 w-auto object-contain drop-shadow-[0_0_10px_rgba(56,189,248,0.7)]"
                />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#09152e]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-base font-extrabold text-white">SIN</h3>
                  <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 border border-cyan-400/30">
                    Navigator
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1.5 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Website & Software Problem Solver
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={resetChat}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RefreshCw size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(prev => !prev)}
                className="hidden sm:grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                title={isExpanded ? "Collapse window" : "Expand window"}
                aria-label={isExpanded ? "Collapse window" : "Expand window"}
              >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                title="Close chat"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-sky-500/20">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 sm:p-4 shadow-lg ${
                    msg.sender === "user"
                      ? "rounded-tr-xs bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 text-white font-medium shadow-[0_4px_16px_rgba(14,165,233,0.3)]"
                      : "rounded-tl-xs border border-sky-400/25 bg-[#0a152d]/90 text-slate-200 shadow-[0_8px_25px_rgba(0,0,0,0.4)] backdrop-blur-md"
                  }`}
                >
                  <MarkdownMessage content={msg.text} />
                </div>

                {/* Suggestions Pills underneath Bot response */}
                {msg.sender === "sin" && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
                    {msg.suggestions.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleSend(s)}
                        className="rounded-full border border-sky-400/30 bg-[#0d1d3d]/70 px-2.5 py-1 text-xs text-sky-200 hover:bg-sky-500/20 hover:border-cyan-300 hover:text-white transition-all shadow-sm"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-xs border border-sky-400/20 bg-[#0a152d]/80 px-4 py-3 w-fit text-slate-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-sky-400 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" />
                <span className="text-xs text-slate-400 ml-1 font-mono">SIN is analyzing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="border-t border-sky-500/20 bg-[#070e20] p-3 sm:p-4">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask SIN about services, team, or any code problem..."
                  className="w-full rounded-full border border-sky-400/30 bg-[#0a162e] px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-400 shadow-inner focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 transition-all"
                  aria-label="Your message to SIN"
                />
                {input.trim() && (
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-full bg-cyan-400 text-slate-950 transition-transform hover:scale-110 active:scale-95"
                    aria-label="Send message"
                  >
                    <Send size={13} className="ml-0.5" />
                  </button>
                )}
              </div>

              {!input.trim() && (
                <button
                  type="submit"
                  disabled
                  className="grid h-10 w-10 place-items-center rounded-full border border-sky-500/20 bg-sky-950/40 text-slate-500 cursor-not-allowed"
                  aria-label="Send message disabled"
                >
                  <Send size={15} />
                </button>
              )}
            </form>

            <div className="mt-2 flex items-center justify-between px-2 text-[10px] text-slate-400">
              <span>SIN AI · Powered by SinTech Knowledge Base</span>
              <Link href="/contact" className="hover:text-cyan-300 underline transition-colors">
                Book Consultation
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
