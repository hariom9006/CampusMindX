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
  ChevronRight,
  Database,
  Layers,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/api';

/**
 * Custom lightweight Markdown & Table Renderer for Light Theme
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
        <div key={`table-${key}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                {tableHeader.map((h, i) => (
                  <th key={i} className="px-3 py-2 border-r border-slate-200 last:border-r-0">
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tableRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/70 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 border-r border-slate-100 last:border-r-0">
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
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={idx} className="italic text-slate-600">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];

    // Table detection
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const cells = line.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
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
        <h4 key={idx} className="text-xs font-bold text-indigo-700 uppercase tracking-wider mt-3 mb-1 flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
          <span>{line.replace('### ', '')}</span>
        </h4>
      );
    } else if (line.startsWith('#### ')) {
      elements.push(
        <h5 key={idx} className="text-xs font-bold text-slate-800 mt-2 mb-1">
          {line.replace('#### ', '')}
        </h5>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const cleanLine = line.replace(/^[-*]\s+/, '');
      elements.push(
        <div key={idx} className="flex items-start gap-2 my-1 text-xs text-slate-700">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
          <div className="flex-1 leading-relaxed">{formatInlineMarkdown(cleanLine)}</div>
        </div>
      );
    } else if (line.match(/^\d+\.\s+/)) {
      const numMatch = line.match(/^(\d+)\.\s+/);
      const cleanLine = line.replace(/^\d+\.\s+/, '');
      elements.push(
        <div key={idx} className="flex items-start gap-2 my-1.5 text-xs text-slate-700">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 shrink-0">
            {numMatch[1]}
          </span>
          <div className="flex-1 leading-relaxed">{formatInlineMarkdown(cleanLine)}</div>
        </div>
      );
    } else if (line.trim().length > 0) {
      elements.push(
        <p key={idx} className="my-1.5 text-xs leading-relaxed text-slate-700">
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
  title = 'CampusMind AI',
  subtitle = null
}) {
  const defaultInitialPrompts = {
    student: [
      "Why is my academic risk increasing?",
      "What skills should I learn for Full Stack Development?",
      "Show my performance trend.",
      "Create my weekly study plan.",
      "Which subjects need attention?"
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
      : "Hello Hariom! I'm **CampusMind AI**, your Explainable University Intelligence and Success Advisor. I have evaluated your active academic telemetry (Performance: 84%, Attendance: 71%, Trajectory: Healthy). Ask me anything about your subjects, skill gaps, or this week's study plan.",
    timestamp: "Just now",
    factors: role === 'student' ? [
      { name: "Academic Support Indicator", value: "Healthy", impact: "Optimal" },
      { name: "Current Attendance", value: "71%", impact: "Needs Recovery" }
    ] : [],
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

      if (response && response.reply) {
        if (response.conversationId) setConversationId(response.conversationId);
        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: response.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          factors: response.factors || [],
          actionSuggestion: response.actionSuggestion || null,
          source: "Based on your academic data"
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        // Fallback intelligent response
        generateLocalFallback(query);
      }
    } catch (err) {
      console.warn('Backend Assistant query fallback:', err);
      generateLocalFallback(query);
    } finally {
      setIsTyping(false);
    }
  };

  const generateLocalFallback = (query) => {
    let reply = "";
    const lower = query.toLowerCase();

    if (lower.includes('risk') || lower.includes('performance')) {
      reply = "### Academic Trajectory Analysis\n" +
        "Based on your continuous evaluations, your overall trajectory is **Healthy (84%)**, but DBMS internal marks and 71% attendance are the active sensitivity drivers.\n\n" +
        "| Factor | Current | Benchmark | Status |\n" +
        "| :--- | :--- | :--- | :--- |\n" +
        "| Attendance | 71% | 75% | Action Recommended |\n" +
        "| DBMS Score | 18.5/30 | 22/30 | Developing |\n" +
        "| CGPA Anchor | 8.4 | 7.0 | Strong |\n\n" +
        "Attending the next 3 lab sessions will bring your attendance back above 75%.";
    } else if (lower.includes('skill') || lower.includes('full stack')) {
      reply = "### Full Stack Career Alignment\n" +
        "Your frontend foundation (**HTML, CSS, JavaScript, React**) is assessed as **Strong**. To close your career gap for **Full Stack Developer**, prioritize:\n\n" +
        "- **Node.js & Express.js** runtime internals (25% gap)\n" +
        "- **REST API Architecture & Authentication (JWT/OAuth)**\n" +
        "- **MongoDB Aggregations & Indexing**\n\n" +
        "Your customized 8-Week roadmap has these scheduled in Weeks 2 to 6.";
    } else if (lower.includes('study plan') || lower.includes('weekly')) {
      reply = "### Recommended Study Plan This Week\n" +
        "1. **Tuesday 4:00 PM**: Attend DBMS Normalization TA clinic (Room 304).\n" +
        "2. **Wednesday**: Complete pending Dijkstra algorithm lab submission.\n" +
        "3. **Friday 6:00 PM**: Review Node.js Event Loop module on the roadmap.";
    } else {
      reply = `### CampusMind Intelligence Synthesis\n` +
        `I analyzed your question regarding *"${query}"* against your BCA Semester 5 telemetry.\n\n` +
        `- Continuous performance average is holding at **84%**.\n` +
        `- Core competency recommendations are updated daily by the CM-XAI Engine.\n\n` +
        `Would you like me to generate a tailored step-by-step remediation plan?`;
    }

    const aiMsg = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: "Based on your academic data"
    };
    setMessages((prev) => [...prev, aiMsg]);
  };

  const handleClear = () => {
    setMessages([defaultGreeting]);
    try {
      sessionStorage.removeItem(`campusmind_chat_${role}`);
    } catch {}
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="glass-panel rounded-[26px] border border-slate-200/80 shadow-[0_12px_35px_-8px_rgba(99,102,241,0.08)] bg-white/90 backdrop-blur-xl flex flex-col h-[700px] max-h-[82vh] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 px-6 border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-pink-50/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                {title}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                Aurora Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {subtitle || "Explainable conversational intelligence calibrated to your curriculum"}
            </p>
          </div>
        </div>

        <button
          onClick={handleClear}
          title="Clear Conversation"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs mt-1">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-[22px] p-4 transition-all ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-indigo-500/20 rounded-tr-sm'
                  : 'glass-card bg-white/95 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-tl-sm'
              }`}
            >
              {/* Header inside assistant card */}
              {msg.sender === 'assistant' && (
                <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100 text-[11px] text-slate-400">
                  <span className="font-bold text-indigo-600 flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    <span>{msg.source || "Based on your academic data"}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1 hover:text-slate-700 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Message text */}
              {msg.sender === 'assistant' ? (
                <MarkdownContent content={msg.text} />
              ) : (
                <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </p>
              )}

              {/* Suggested follow-ups inside initial greeting */}
              {msg.suggestedFollowUps && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Suggested prompts
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestedFollowUps.map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(p)}
                        className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-xl transition-all text-left"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-xs">
                H
              </div>
            )}
          </div>
        ))}

        {/* AI Thinking Animation */}
        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="glass-card bg-white/95 rounded-[22px] px-4 py-3 border border-slate-200/90 shadow-xs flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-pink-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span>CampusMind AI is analyzing student telemetry...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips (Always visible above input) */}
      <div className="px-6 py-2 border-t border-slate-100 bg-slate-50/70 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
        <span className="text-[10px] font-extrabold uppercase text-slate-400 shrink-0">
          Prompts:
        </span>
        {samplePrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handleSend(prompt)}
            className="text-[11px] font-medium text-slate-700 hover:text-indigo-700 bg-white hover:bg-indigo-50/60 border border-slate-200/80 hover:border-indigo-200 px-3 py-1 rounded-full transition-all shrink-0 shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 px-6 border-t border-slate-100 bg-white flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask CampusMind AI anything about your academic telemetry..."
          className="flex-1 glass-input rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-indigo-500/20"
        />
        <button
          type="submit"
          disabled={!input.trim() || isTyping}
          className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-md shadow-indigo-500/25 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
