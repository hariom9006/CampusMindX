import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Trash2,
  BrainCircuit,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../services/api';

/**
 * Custom lightweight Markdown & Table Renderer for Assistant Responses
 */
function MarkdownContent({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let inTable = false;
  let tableHeader = [];
  let tableRows = [];

  const flushTable = (key) => {
    if (inTable && tableHeader.length > 0) {
      elements.push(
        <div key={`table-${key}`} className="my-3 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70 shadow-inner">
          <table className="w-full text-[11px] text-left">
            <thead className="bg-slate-900/90 text-slate-300 font-semibold border-b border-slate-800">
              <tr>
                {tableHeader.map((h, i) => (
                  <th key={i} className="px-3 py-2 border-r border-slate-800/60 last:border-r-0">
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-900/40 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 border-r border-slate-800/40 last:border-r-0">
                      {formatInlineMarkdown(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      inTable = false;
      tableHeader = [];
      tableRows = [];
    }
  };

  const formatInlineMarkdown = (text) => {
    if (!text) return text;
    // Replace **bold** with <strong>
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-white tracking-wide">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx} className="italic text-slate-400">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];

    // Table row detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
      // Check if it's separator row like | :--- | :--- |
      if (cells.every((c) => c.trim().match(/^:?-+:?$/))) {
        continue;
      }
      if (!inTable) {
        inTable = true;
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable(idx);
    }

    // Headings
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={idx} className="text-xs font-bold text-cyan-300 uppercase tracking-wider mt-3 mb-1.5 flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 text-cyan-400" />
          <span>{line.replace('### ', '')}</span>
        </h4>
      );
    } else if (line.startsWith('#### ')) {
      elements.push(
        <h5 key={idx} className="text-xs font-semibold text-slate-200 mt-2 mb-1">
          {line.replace('#### ', '')}
        </h5>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const cleanLine = line.replace(/^[-*]\s+/, '');
      elements.push(
        <div key={idx} className="flex items-start gap-2 my-1 text-xs text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
          <div className="flex-1">{formatInlineMarkdown(cleanLine)}</div>
        </div>
      );
    } else if (line.match(/^\d+\.\s+/)) {
      const numMatch = line.match(/^(\d+)\.\s+/);
      const cleanLine = line.replace(/^\d+\.\s+/, '');
      elements.push(
        <div key={idx} className="flex items-start gap-2 my-1.5 text-xs text-slate-300">
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 shrink-0 font-bold">
            {numMatch[1]}
          </span>
          <div className="flex-1">{formatInlineMarkdown(cleanLine)}</div>
        </div>
      );
    } else if (line.trim().length > 0) {
      elements.push(
        <p key={idx} className="my-1.5 text-xs leading-relaxed text-slate-200">
          {formatInlineMarkdown(line)}
        </p>
      );
    }
  }

  if (inTable) {
    flushTable('end');
  }

  return <div className="space-y-1">{elements}</div>;
}

export default function AIChat({
  role = 'student',
  studentContext = null,
  initialPrompts = null,
  title = 'CampusMind AI Assistant',
  subtitle = null
}) {
  const defaultInitialPrompts = {
    student: [
      "What is affecting my academic performance?",
      "What subjects need more attention?",
      "What is my attendance status?",
      "What skills am I missing for Full Stack Development?",
      "What should I study this week?",
      "Why did the system recommend Node.js?",
      "Show my academic trend."
    ],
    faculty: [
      "Which students need attention?",
      "What is the class attendance trend?",
      "Which subject has the lowest average performance?",
      "Give me a cohort summary of BCA Semester 5."
    ],
    admin: [
      "What is the university academic health?",
      "Which department has the highest retention and performance?"
    ]
  };

  const samplePrompts = initialPrompts || defaultInitialPrompts[role] || defaultInitialPrompts.student;

  const defaultGreeting = {
    id: 'welcome-msg',
    sender: 'assistant',
    text: role === 'faculty'
      ? "Welcome Dr. Sunita Kulkarni. I am **CampusMind AI**, your Faculty Intelligence Assistant. I have indexed active continuous assessments, lab attendances, and early-warning indicators across BCA Semester 5. How can I assist your student advisory today?"
      : role === 'admin'
      ? "Greetings, Academic Administrator. I am **CampusMind AI**, your Institutional Analytics Assistant. I monitor university retention rates, department performance benchmarks, and campus intervention metrics."
      : "Hello Aarav! I'm **CampusMind AI**, your Explainable Academic and Career Advisor. I have analyzed your Semester 5 metrics (Overall Performance: 71%, Attendance: 68%, Academic Support Indicator: Medium). Ask me about your predictive drivers, attendance recovery, skill gaps, or this week's prioritized study plan.",
    timestamp: "Just now",
    factors: role === 'student' ? [
      { name: "Academic Support Indicator", value: "Medium", impact: "Early Guidance" },
      { name: "Current Attendance", value: "68%", impact: "Shortage Alert" }
    ] : [],
    actionSuggestion: role === 'student' ? "Review your prioritized weekly study plan or attendance recovery classes." : null,
    suggestedFollowUps: samplePrompts.slice(0, 3)
  };

  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(`campusmind_chat_${role}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [defaultGreeting];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  // Sync to session storage
  useEffect(() => {
    try {
      sessionStorage.setItem(`campusmind_chat_${role}`, JSON.stringify(messages));
    } catch {}
  }, [messages, role]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend = null) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    setLastQuery(query);
    setHasError(false);

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const studentId = studentContext?._id || '22BCA1042';
      const response = await apiService.sendChatMessage(query, {
        role,
        studentId,
        conversationId
      });

      if (response && response.conversationId) {
        setConversationId(response.conversationId);
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        intent: response.intent,
        factors: response.factors || [],
        dataPoints: response.dataPoints || [],
        actionSuggestion: response.actionSuggestion || null,
        suggestedFollowUps: response.suggestedFollowUps || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setHasError(true);
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: "⚠️ I encountered an issue connecting to the CampusMind AI service. Please check your connection or retry.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = () => {
    if (lastQuery) {
      handleSend(lastQuery);
    }
  };

  const handleClearHistory = async () => {
    try {
      await apiService.clearChatHistory({ role });
    } catch {}
    setMessages([defaultGreeting]);
    setConversationId(null);
    sessionStorage.removeItem(`campusmind_chat_${role}`);
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Determine active follow-up questions from the latest assistant message
  const lastAiMessage = [...messages].reverse().find((m) => m.sender === 'assistant');
  const activeSuggestedPrompts = lastAiMessage?.suggestedFollowUps?.length > 0
    ? lastAiMessage.suggestedFollowUps
    : samplePrompts;

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/90 flex flex-col h-[700px] shadow-2xl overflow-hidden bg-slate-950/80 backdrop-blur-xl">
      {/* ChatGPT-style Header */}
      <div className="px-5 py-3.5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-purple-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white tracking-tight">{title}</h3>
              <span className="text-[10px] font-mono bg-cyan-950/90 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40 font-semibold">
                XAI Neural Core
              </span>
              <span className="text-[9px] font-mono uppercase bg-purple-950/80 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                {role}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {subtitle || (role === 'student' ? 'Context: Aarav Sharma (22BCA1042) • BCA Semester 5' : role === 'faculty' ? 'Context: Dr. Sunita Kulkarni • School of Computing & IT' : 'Context: Institutional Intelligence')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 border border-transparent hover:border-slate-700 transition-all text-xs"
            title="Clear conversation history"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
            <span className="hidden sm:inline text-[11px]">Clear</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-950 to-blue-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div
                className={`group relative max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed transition-all ${
                  isUser
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_4px_20px_rgba(6,182,212,0.25)] rounded-tr-none border border-cyan-400/20'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-800/90 rounded-tl-none shadow-xl hover:border-slate-700/80'
                }`}
              >
                {/* Message Body */}
                <div className="prose prose-invert max-w-none">
                  {isUser ? (
                    <div className="font-medium whitespace-pre-wrap">{msg.text}</div>
                  ) : (
                    <MarkdownContent content={msg.text} />
                  )}
                </div>

                {/* Factors Attribution Pills (Explainability Layer) */}
                {msg.factors && msg.factors.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                      <BrainCircuit className="w-3 h-3 text-cyan-400" />
                      <span>Model Feature Attributions:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.factors.map((f, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700/70 text-slate-300 text-[11px]"
                        >
                          <span className="font-semibold text-slate-200">{f.name}:</span>
                          <span className="font-mono text-cyan-300">{f.value}</span>
                          {f.impact && (
                            <span className={`text-[10px] ml-1 px-1.5 py-0.2 rounded font-mono ${
                              f.impact.toLowerCase().includes('high') || f.impact.toLowerCase().includes('critical')
                                ? 'bg-red-950/80 text-red-300 border border-red-800/40'
                                : f.impact.toLowerCase().includes('medium') || f.impact.toLowerCase().includes('moderate')
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/40'
                            }`}>
                              {f.impact}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actionable Guidance Banner */}
                {msg.actionSuggestion && (
                  <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/50 border border-cyan-500/30 text-[11px] text-cyan-200 flex items-center justify-between gap-2 shadow-inner">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-pulse" />
                      <span>{msg.actionSuggestion}</span>
                    </div>
                  </div>
                )}

                {/* Metadata & Copy action footer */}
                <div className="mt-2.5 pt-1.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/40">
                  <span className="font-mono text-slate-400">{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center gap-1"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 border border-blue-500/40 text-blue-300 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                  <User className="w-4 h-4 text-blue-300" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-3 animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-cyan-400 animate-spin" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 rounded-tl-none shadow-md flex items-center gap-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[11px] text-cyan-300/90 font-medium">
                Correlating academic records & synthesizing explainable factors...
              </span>
            </div>
          </div>
        )}

        {/* Error retry banner */}
        {hasError && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>Network error or service unavailable.</span>
            </div>
            <button
              onClick={handleRetry}
              className="px-2.5 py-1 rounded-lg bg-red-900/60 hover:bg-red-800 text-white font-medium text-[11px] transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-Up Prompts Bar */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/70 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] uppercase font-mono text-cyan-400/80 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Suggestions:</span>
        </span>
        {activeSuggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-[11px] px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 transition-all shrink-0 active:scale-95 shadow-sm"
          >
            {p}
          </button>
        ))}
      </div>

      {/* ChatGPT-style Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-900/80 backdrop-blur-md flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              role === 'faculty'
                ? "Ask about cohort risks, attendance trends, or course bottlenecks..."
                : role === 'admin'
                ? "Ask about university retention, institutional health, or department metrics..."
                : "Ask CampusMind AI about your grades, attendance clearance, or career roadmap..."
            }
            className="w-full pl-4 pr-10 py-3 text-xs rounded-xl glass-input text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 border border-slate-800"
          />
        </div>
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="p-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] shrink-0 active:scale-95"
          title="Send query"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
