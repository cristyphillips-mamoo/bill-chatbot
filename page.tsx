"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ─── SVG Logo ──────────────────────────────────────────────────────────────

function PmbLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="10" fill="#2A9D8F" />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="white"
        fontSize="16"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        PmB
      </text>
    </svg>
  );
}

// ─── Bill Avatar ────────────────────────────────────────────────────────────

function BillAvatar({ emoji }: { emoji: string }) {
  return (
    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-pmb-navy to-pmb-blue flex items-center justify-center text-white font-bold text-sm shadow-md">
      {emoji ? (
        <span className="text-lg">{emoji}</span>
      ) : (
        <span className="text-base">B</span>
      )}
    </div>
  );
}

// ─── Typing Indicator ───────────────────────────────────────────────────────

function TypingIndicator({ emoji }: { emoji: string }) {
  return (
    <div className="flex items-end gap-2 message-appear">
      <BillAvatar emoji={emoji} />
      <div className="bg-white border border-pmb-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ─────────────────────────────────────────────────────────

function MessageBubble({
  message,
  billEmoji,
  billName,
}: {
  message: Message;
  billEmoji: string;
  billName: string;
}) {
  const isUser = message.role === "user";
  const timeStr = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isUser) {
    return (
      <div className="flex justify-end items-end gap-2 message-appear">
        <div className="flex flex-col items-end max-w-[75%]">
          <div className="bg-pmb-teal text-white px-4 py-3 rounded-2xl rounded-br-sm shadow-sm">
            <p className="message-content text-sm leading-relaxed">
              {message.content}
            </p>
          </div>
          <span className="text-xs text-gray-400 mt-1 mr-1">{timeStr}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 message-appear">
      <BillAvatar emoji={billEmoji} />
      <div className="flex flex-col items-start max-w-[78%]">
        <span className="text-xs font-semibold text-pmb-navy ml-1 mb-1">
          {billName || "Bill"} · PmB Concierge
        </span>
        <div className="bg-white border border-pmb-border px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
          <p className="message-content text-sm leading-relaxed text-gray-800">
            {message.content}
          </p>
        </div>
        <span className="text-xs text-gray-400 mt-1 ml-1">{timeStr}</span>
      </div>
    </div>
  );
}

// ─── Disclaimer Banner ──────────────────────────────────────────────────────

function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-start gap-3">
      <span className="text-amber-500 text-lg mt-0.5 flex-shrink-0">⚠️</span>
      <p className="text-xs text-amber-800 flex-1">
        <strong>SIMULATION NOTICE:</strong> This is an educational simulation
        for a law school AI &amp; Data Governance course. Do not enter any real
        personal or financial information. All data is treated as fictional
        placeholder data for simulation purposes only.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-amber-600 flex-shrink-0 text-lg leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}

// ─── Feature Badge ──────────────────────────────────────────────────────────

const FEATURES = [
  { num: 1, label: "Website Access" },
  { num: 2, label: "Unlimited Time" },
  { num: 3, label: "Custom Persona" },
  { num: 4, label: "Style Matching" },
  { num: 5, label: "Figure Mimicry" },
  { num: 6, label: "Info Elicitation" },
  { num: 7, label: "Negotiation" },
  { num: 8, label: "Payment Memory" },
];

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function BillChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [billName, setBillName] = useState("Bill");
  const [billEmoji, setBillEmoji] = useState("");
  const [showFeatures, setShowFeatures] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Detect Bill's name and emoji from messages
  useEffect(() => {
    const lastAssistantMsg = [...messages]
      .reverse()
      .find((m) => m.role === "assistant");
    if (!lastAssistantMsg) return;
    const content = lastAssistantMsg.content;

    // Detect preferred name
    if (/billie/i.test(content) && !billName.includes("illie"))
      setBillName("Billie");
    else if (/billy/i.test(content) && !billName.includes("illy"))
      setBillName("Billy");

    // Detect emoji choice from conversation
    const emojiMatch = content.match(/you chose?\s*([^\s,!.]+)/i);
    if (emojiMatch && !billEmoji) setBillEmoji(emojiMatch[1]);
  }, [messages, billName, billEmoji]);

  // Start session — trigger first message from Bill
  const startSession = useCallback(async () => {
    setHasStarted(true);
    setIsLoading(true);

    const initMessages = [
      {
        role: "user" as const,
        content:
          "[SESSION START] Please greet the customer and begin the session.",
      },
    ];

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: initMessages }),
      });

      if (!response.ok) throw new Error("API error");

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      const billMsgId = `msg-${Date.now()}`;
      setMessages([
        {
          id: billMsgId,
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages([
          {
            id: billMsgId,
            role: "assistant",
            content: accumulated,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error("Error starting session:", err);
      setMessages([
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content:
            "Hello! I'm Bill, your PmB AI customer service concierge. I'm having a small technical hiccup — please refresh the page to start our session. I can't wait to help you! 😊",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, []);

  useEffect(() => {
    startSession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Send a user message
  const sendMessage = useCallback(
    async (overrideContent?: string) => {
      const content = overrideContent ?? input.trim();
      if (!content || isLoading || sessionEnded) return;

      const userMsg: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      // Build message history for API (exclude init placeholder)
      const apiMessages = [...messages, userMsg]
        .filter((m) => m.content !== "[SESSION START] Please greet the customer and begin the session.")
        .map((m) => ({ role: m.role, content: m.content }));

      // Also pass the init message at the start so Bill has context
      const fullApiMessages = [
        {
          role: "user" as const,
          content: "[SESSION START] Please greet the customer and begin the session.",
        },
        ...apiMessages,
      ];

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: fullApiMessages }),
        });

        if (!response.ok) throw new Error("API error");

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        const billMsgId = `msg-${Date.now()}-bill`;

        setMessages((prev) => [
          ...prev,
          {
            id: billMsgId,
            role: "assistant",
            content: "",
            timestamp: new Date(),
          },
        ]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          accumulated += decoder.decode(value, { stream: true });
          setMessages((prev) => [
            ...prev.slice(0, -1),
            {
              id: billMsgId,
              role: "assistant",
              content: accumulated,
              timestamp: new Date(),
            },
          ]);
        }
      } catch (err) {
        console.error("Error sending message:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content:
              "I'm so sorry — I ran into a brief technical hiccup! Could you repeat that? I'm all ears and ready to help. 😊",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [input, isLoading, sessionEnded, messages]
  );

  // End session — request summary from Bill
  const endSession = useCallback(async () => {
    if (isLoading) return;
    setSessionEnded(true);
    await sendMessage(
      "Please generate a complete session summary for everything we've discussed and accomplished today."
    );
  }, [isLoading, sendMessage]);

  // Reset everything
  const resetSession = useCallback(() => {
    setMessages([]);
    setInput("");
    setIsLoading(false);
    setSessionEnded(false);
    setBillName("Bill");
    setBillEmoji("");
    setHasStarted(false);
    setTimeout(() => startSession(), 100);
  }, [startSession]);

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  return (
    <div className="flex flex-col h-screen bg-pmb-gray">
      {/* ── Header ── */}
      <header className="flex-shrink-0 bg-pmb-navy shadow-lg z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Logo + Brand */}
          <div className="flex items-center gap-3">
            <PmbLogo size={38} />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-white font-bold text-lg tracking-tight">
                  Pay My Bills
                </span>
                <span className="text-pmb-teal text-xs font-semibold uppercase tracking-widest">
                  PmB
                </span>
              </div>
              <p className="text-blue-200 text-xs">
                Your Personal Billing Concierge
              </p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFeatures((f) => !f)}
              className="text-blue-200 hover:text-white text-xs px-3 py-1.5 rounded-lg border border-blue-700 hover:border-blue-400 transition-colors hidden sm:flex items-center gap-1"
            >
              <span>8 Features</span>
              <span className="text-pmb-teal">▾</span>
            </button>
            <button
              onClick={endSession}
              disabled={isLoading || sessionEnded || messages.length < 2}
              className="text-xs px-3 py-1.5 rounded-lg bg-blue-800 hover:bg-blue-700 text-blue-100 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-blue-700"
            >
              End Session
            </button>
            <button
              onClick={resetSession}
              className="text-xs px-3 py-1.5 rounded-lg bg-pmb-teal hover:bg-pmb-tealdark text-white font-semibold transition-colors shadow-sm"
            >
              New Session
            </button>
          </div>
        </div>

        {/* Feature badges panel */}
        {showFeatures && (
          <div className="border-t border-blue-800 bg-pmb-navydark">
            <div className="max-w-4xl mx-auto px-4 py-2 flex flex-wrap gap-2">
              {FEATURES.map((f) => (
                <span
                  key={f.num}
                  className="text-xs bg-blue-900 text-pmb-teal border border-blue-700 rounded-full px-3 py-1"
                >
                  <span className="text-blue-400 font-bold">{f.num}.</span>{" "}
                  {f.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ── Disclaimer ── */}
      <DisclaimerBanner />

      {/* ── Chat Window ── */}
      <main className="flex-1 overflow-hidden flex flex-col max-w-4xl w-full mx-auto">
        {/* Session ended banner */}
        {sessionEnded && (
          <div className="flex-shrink-0 bg-pmb-teallight border-b border-pmb-teal/30 px-4 py-2 flex items-center justify-between">
            <p className="text-sm text-pmb-tealdark font-medium">
              ✅ Session ended — summary generated above. Start a new session to
              continue.
            </p>
            <button
              onClick={resetSession}
              className="text-xs bg-pmb-teal text-white px-3 py-1 rounded-lg hover:bg-pmb-tealdark transition-colors"
            >
              New Session →
            </button>
          </div>
        )}

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto chat-scroll px-4 py-6 space-y-4"
        >
          {/* Empty state */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pmb-navy to-pmb-teal flex items-center justify-center shadow-xl">
                <span className="text-4xl">💼</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-pmb-navy">
                  Connecting to Bill...
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Your PmB AI concierge is starting up
                </p>
              </div>
              <div className="flex gap-1">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          {/* Message list */}
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              billEmoji={billEmoji}
              billName={billName}
            />
          ))}

          {/* Typing indicator */}
          {isLoading && messages.length > 0 && (
            <TypingIndicator emoji={billEmoji} />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Input Area ── */}
        <div className="flex-shrink-0 border-t border-pmb-border bg-white px-4 py-3">
          {sessionEnded ? (
            <div className="text-center py-2">
              <p className="text-gray-400 text-sm mb-2">
                This session has ended.
              </p>
              <button
                onClick={resetSession}
                className="bg-pmb-teal hover:bg-pmb-tealdark text-white font-semibold px-6 py-2 rounded-xl transition-colors text-sm shadow-sm"
              >
                Start New Session
              </button>
            </div>
          ) : (
            <div className="flex items-end gap-3">
              <div className="flex-1 bg-pmb-gray border border-pmb-border rounded-2xl px-4 py-3 focus-within:border-pmb-teal focus-within:ring-1 focus-within:ring-pmb-teal transition-all">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isLoading
                      ? "Bill is typing..."
                      : "Type your message… (Enter to send, Shift+Enter for newline)"
                  }
                  disabled={isLoading}
                  rows={1}
                  className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none leading-relaxed max-h-28"
                  style={{ minHeight: "24px" }}
                />
              </div>
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 w-11 h-11 bg-pmb-teal hover:bg-pmb-tealdark disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                aria-label="Send message"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22 11 13 2 9l20-7z" />
                </svg>
              </button>
            </div>
          )}

          {/* Footer note */}
          {!sessionEnded && (
            <p className="text-center text-xs text-gray-400 mt-2">
              Educational simulation — use fake/placeholder data only ·{" "}
              <span className="text-pmb-teal font-medium">Pay My Bills</span>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
