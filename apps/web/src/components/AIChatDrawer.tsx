import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Users,
  Zap,
} from 'lucide-react';
import { VFBadge, VFButton, cn } from '@vidyamaxx/ui';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  category?: string;
  suggestedActions?: { label: string; action: string }[];
}

const PRESET_PROMPTS = [
  {
    title: 'Match Teacher Proxy',
    desc: 'Find proxy for Dr. Sharma (Physics, Period 3)',
    category: 'Timetable',
    icon: CalendarCheck,
    prompt: 'Find an available substitute teacher for Dr. Rajesh Sharma who is on leave during Period 3 (Physics - Lab 204).',
  },
  {
    title: 'Lesson Plan Generator',
    desc: 'Generate 45-min lesson plan for Class 9',
    category: 'Academics',
    icon: BookOpen,
    prompt: 'Generate an interactive 45-minute lesson plan for Class 9 Mathematics on "Quadratic Equations and Real-World Modeling" with Bloom\'s taxonomy objectives.',
  },
  {
    title: 'Fee Defaulter Risk',
    desc: 'Predict high risk quarterly defaulters',
    category: 'Finance',
    icon: CreditCard,
    prompt: 'Run fee defaulter predictive analysis for Q2 across Classes 9 to 12 and identify top 5 accounts requiring automated WhatsApp reminders.',
  },
  {
    title: 'Attendance Risk Radar',
    desc: 'Identify students below 75% threshold',
    category: 'Attendance',
    icon: Users,
    prompt: 'Scan daily biometric attendance records and generate an alert list for students with consecutive unexcused absences this week.',
  },
];

const KNOWLEDGE_RESPONSES: Record<string, string> = {
  proxy: `**AI Teacher Proxy Analysis — Period 3 (09:30 AM - 10:15 AM)**

**Teacher on Leave**: Dr. Rajesh Sharma (HOD Physics)
**Class**: Class 10-A | **Room**: Physics Lab 204

✅ **Recommended Substitution Match:**
1. **Mrs. Sunita Verma** (Senior PGT Mathematics)
   - *Free during Period 3*: Yes (No scheduled class)
   - *Department Match*: Science & Mathematics
   - *Workload Impact*: 23 / 28 weekly periods (Optimal capacity)

2. **Alternative Backup**: **Mr. Subhash Das** (Computer Science)
   - *Free during Period 3*: Yes
   - *Location Proximity*: Lab 3 (Adjacent wing)

Would you like me to automatically assign **Mrs. Sunita Verma** and broadcast the substitution SMS to Class 10-A?`,

  lesson: `**Structured 45-Minute Lesson Plan**
**Subject**: Mathematics (Class 9) | **Topic**: Quadratic Equations

### 🎯 1. Learning Objectives (Bloom's Taxonomy)
- **Recall & Identify**: Standard form $ax^2 + bx + c = 0$ ($a \\neq 0$).
- **Apply**: Factorization and quadratic formula to solve real-world trajectory problems.
- **Analyze**: Determine the nature of roots using the discriminant ($D = b^2 - 4ac$).

---

### ⏱️ 2. Classroom Time Breakdown
- **00:00 – 00:08**: Concept hook — projectile motion of a basketball & standard equation setup.
- **00:08 – 00:22**: Teacher demonstration with 2 guided step-by-step examples on whiteboard.
- **00:22 – 00:35**: Peer-pairing worksheet activity (3 challenge questions with peer grading).
- **00:35 – 00:45**: Rapid 3-question formative assessment quiz & homework assignment handout.

### 📝 3. Homework Assignment
- NCERT Exercise 4.2: Questions 1 through 6.
- Challenge Problem: Find dimensions of a rectangular garden with perimeter 36m and area 80m².`,

  fee: `**Quarterly Fee Defaulter Risk Radar — Q2 Analysis**

📊 **Telemetry Summary**:
- Total Invoiced: **₹1.84 Crore**
- Total Collected: **₹1.62 Crore (88.0%)**
- Overdue Balance: **₹22.14 Lakhs** across 48 student accounts.

⚠️ **Top 3 High-Risk Profiles Requiring Immediate Attention:**
1. **ADM-2024-089** — Class 10-A | Dues: **₹24,500** (Overdue: 38 days) | Guardian: Mr. Alok Saxena
2. **ADM-2023-112** — Class 12-Sci | Dues: **₹31,000** (Overdue: 42 days) | Guardian: Mrs. Reena Mehta
3. **ADM-2025-044** — Class 9-B | Dues: **₹18,500** (Overdue: 29 days) | Guardian: Mr. Pankaj Joshi

💡 **Recommended Action**: 1-Click WhatsApp reminder broadcast with direct UPI payment link has been queued.`,

  attendance: `**Chronic Absenteeism & Biometric Radar Report**

🎯 **Campus Compliance Metric**: Today's Overall Attendance is **94.5%** (2,316 / 2,451 students present).

🚩 **Alerts Triggered (Students Below 75% CBSE Minimum Requirement):**
1. **Rohan Gupta** (Class 6-B) — Current: **68.2%** (3 consecutive unexcused days).
2. **Kavya Patel** (Class 11-Sci) — Current: **71.0%** (Medical certificate pending review).
3. **Devansh Singh** (Class 9-A) — Current: **73.5%** (Frequent Monday absences).

✨ **Automated Remediation**:
- Instant SMS alert drafted for parents.
- Notification dispatched to Class Teacher for counseling intervention.`,
};

export interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatDrawer({ isOpen, onClose }: AIChatDrawerProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "Hello! I'm your **VidyaMaxx AI Copilot**. I have real-time contextual access to your institution's admissions, students, faculty timetables, fees, and examination telemetry. How can I assist you today?",
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Context response matching
    let responseText =
      "I've processed your query against VidyaMaxx's institutional database. All system metrics indicate nominal operations. Let me know if you would like me to generate detailed reports or initiate automated workflows.";

    const lower = query.toLowerCase();
    if (lower.includes('proxy') || lower.includes('substitute') || lower.includes('sharma') || lower.includes('leave')) {
      responseText = KNOWLEDGE_RESPONSES.proxy;
    } else if (lower.includes('lesson') || lower.includes('math') || lower.includes('quadratic') || lower.includes('plan')) {
      responseText = KNOWLEDGE_RESPONSES.lesson;
    } else if (lower.includes('fee') || lower.includes('defaulter') || lower.includes('dues') || lower.includes('payment')) {
      responseText = KNOWLEDGE_RESPONSES.fee;
    } else if (lower.includes('attendance') || lower.includes('absent') || lower.includes('radar') || lower.includes('biometric')) {
      responseText = KNOWLEDGE_RESPONSES.attendance;
    }

    setTimeout(() => {
      const aiMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: String(Date.now()),
        sender: 'ai',
        text: 'Conversation history cleared. Ready for your next institutional query.',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Slide-over Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative w-full max-w-xl h-full bg-card border-l border-border shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="h-[64px] px-5 border-b border-border bg-card flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shadow-xs">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-foreground tracking-tight leading-none">
                      Vidya<span className="text-primary">Maxx AI</span> Copilot
                    </h2>
                    <VFBadge variant="success" className="text-[10px] px-1.5 py-0">
                      Live
                    </VFBadge>
                  </div>
                  <p className="text-xs text-muted-foreground font-semibold mt-0.5">
                    Institution Telemetry & Automated Workflow Engine
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleClearHistory}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                  title="Clear Chat"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Context Bar */}
            <div className="px-5 py-2.5 bg-muted/30 border-b border-border/70 flex items-center justify-between text-xs text-muted-foreground shrink-0">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-foreground">Synced to Active Campus:</span>
                <span className="font-bold text-primary">Main Wing (2026–2027)</span>
              </div>
              <span className="text-[11px] font-mono font-semibold bg-muted px-2 py-0.5 rounded border border-border">
                Shift + K
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar bg-background/50">
              {messages.map((msg) => {
                const isAI = msg.sender === 'ai';
                return (
                  <div
                    key={msg.id}
                    className={cn('flex gap-3 group', isAI ? 'items-start' : 'items-start flex-row-reverse')}
                  >
                    <div
                      className={cn(
                        'h-8 w-8 rounded-md flex items-center justify-center shrink-0 border mt-0.5 shadow-2xs',
                        isAI
                          ? 'bg-primary/10 border-primary/20 text-primary'
                          : 'bg-muted border-border text-foreground'
                      )}
                    >
                      {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>

                    <div className={cn('flex flex-col max-w-[85%]', isAI ? 'items-start' : 'items-end')}>
                      <div
                        className={cn(
                          'p-4 rounded-md text-sm leading-relaxed whitespace-pre-wrap relative',
                          isAI
                            ? 'bg-card border border-border text-foreground shadow-2xs rounded-tl-xs'
                            : 'bg-primary text-primary-foreground font-medium rounded-tr-xs shadow-xs'
                        )}
                      >
                        {msg.text}

                        {isAI && (
                          <div className="mt-3 pt-2.5 border-t border-border/60 flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground font-semibold">
                              VidyaMaxx Neural Model v2.4
                            </span>
                            <button
                              onClick={() => handleCopy(msg.id, msg.text)}
                              className="text-[11px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-muted cursor-pointer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="h-3 w-3 text-success" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground font-semibold mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-3 items-center text-muted-foreground text-xs font-semibold">
                  <div className="h-8 w-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Sparkles className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="bg-card border border-border px-3.5 py-2.5 rounded-md flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompt Chips */}
            <div className="p-4 border-t border-border bg-card shrink-0 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-primary" />
                  Recommended Action Prompts
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {PRESET_PROMPTS.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p.prompt)}
                      disabled={isTyping}
                      className="p-2.5 rounded-md border border-border bg-muted/40 hover:bg-muted/90 text-left transition-all hover:border-zinc-700 group flex flex-col justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-extrabold text-foreground leading-tight truncate">
                          {p.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground truncate mt-1">
                        {p.desc}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Chat Input Field */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 pt-1"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask VidyaMaxx AI anything about students, staff, timetable, fees..."
                    className="w-full h-10 pl-4 pr-10 rounded-md bg-background border border-border text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground text-xs font-bold pointer-events-none">
                    ↵
                  </div>
                </div>

                <VFButton
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  size="md"
                  className="h-10 px-4 rounded-md shrink-0"
                >
                  <Send className="h-4 w-4" />
                </VFButton>
              </form>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
