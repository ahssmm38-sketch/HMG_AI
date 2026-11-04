import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ShieldAlert, 
  Play, 
  RefreshCw,
  Crown,
  FileCheck,
  Zap
} from 'lucide-react';
import { 
  Language, 
  CEOChatMessage, 
  AIEmployee, 
  Task, 
  PriorityLevel 
} from '../types';
import { translations } from '../i18n/translations';

interface CeoChatRoomProps {
  lang: Language;
  employees: AIEmployee[];
  messages: CEOChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isGenerating: boolean;
  onDeployOrchestration: (msgId: string, plan: NonNullable<CEOChatMessage['orchestrationPlan']>) => void;
  onRunTask: (taskId: string) => Promise<void>;
  isEmergencyHalted: boolean;
  recentlyExecutedTaskId?: string | null;
}

export const CeoChatRoom: React.FC<CeoChatRoomProps> = ({
  lang,
  employees,
  messages,
  onSendMessage,
  isGenerating,
  onDeployOrchestration,
  onRunTask,
  isEmergencyHalted,
  recentlyExecutedTaskId
}) => {
  const t = translations[lang];
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    const text = inputText;
    setInputText('');
    await onSendMessage(text);
  };

  const parseOrchestrationFromText = (text: string) => {
    const match = text.match(/<ORCHESTRATION_PLAN>([\s\S]*?)<\/ORCHESTRATION_PLAN>/);
    if (!match) return null;
    try {
      return JSON.parse(match[1]);
    } catch {
      return null;
    }
  };

  const cleanDisplayContent = (text: string) => {
    return text.replace(/<ORCHESTRATION_PLAN>[\s\S]*?<\/ORCHESTRATION_PLAN>/g, '').trim();
  };

  return (
    <div className="rounded-2xl bg-[#050b1a] border border-cyan-800/40 overflow-hidden shadow-xl flex flex-col h-[580px]">
      {/* CEO Room Header */}
      <div className="p-4 bg-gradient-to-r from-[#061430] to-[#0a1b3f] border-b border-cyan-800/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-slate-950 font-extrabold shadow-md shadow-cyan-500/20">
            <Cpu className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">
                {lang === 'ar' ? 'غرفة محادثة وتوجيه الرئيس التنفيذي (AURA-CEO)' : 'CEO Executive Command Room (AURA-CEO)'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-semibold">
                ACTIVE AI EXECUTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {lang === 'ar' 
                ? 'يدير الشركة، يحلل أوامرك، ويفككها إلى مهام فعلية تُسند لموظفي الذكاء الاصطناعي الثمانية.' 
                : 'Direct conversational interface to the AI CEO for strategic analysis and autonomous task orchestration.'}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-800/40">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 3.8 Flash Engine</span>
        </div>
      </div>

      {/* Emergency Freeze Notice if active */}
      {isEmergencyHalted && (
        <div className="px-4 py-2 bg-rose-950/80 border-b border-rose-800/60 text-xs text-rose-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            {lang === 'ar' 
              ? 'تنبيه: تم تفعيل الإيقاف الاضطراري من قبل المالك. يمكن للمدير التحليل ولكن لا يمكن بدء مهام جديدة حتى رفع التجميد.' 
              : 'Alert: Emergency Halt engaged by Owner. The CEO can analyze, but new task execution is blocked until resumed.'}
          </span>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => {
          const isOwner = msg.sender === 'owner';
          const plan = msg.orchestrationPlan || (msg.sender === 'ceo' ? parseOrchestrationFromText(msg.text) : null);
          const cleanText = cleanDisplayContent(msg.text);

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                {isOwner ? (
                  <>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>{lang === 'ar' ? 'المالك (السلطة العليا)' : 'The Owner'}</span>
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      <span>AURA-CEO</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                  </>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl max-w-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                  isOwner
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'bg-[#09152e] text-slate-100 border border-slate-800 shadow-md ring-1 ring-cyan-500/10'
                }`}
              >
                {cleanText}
              </div>

              {/* Interactive Task Orchestration Card */}
              {plan && plan.tasks && plan.tasks.length > 0 && (
                <div className="mt-3 w-full max-w-3xl p-4 rounded-xl bg-[#061126] border border-cyan-800/60 shadow-lg space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-cyan-900/60">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-bold text-white">
                        {lang === 'ar' ? 'خطة تفكيك وتوزيع المهام المقترحة من الرئيس التنفيذي' : 'CEO Task Orchestration Plan'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                      {plan.tasks.length} {lang === 'ar' ? 'مهام موزعة' : 'Decomposed Tasks'}
                    </span>
                  </div>

                  {plan.strategySummary && (
                    <p className="text-[11px] text-slate-300 italic">
                      "{plan.strategySummary}"
                    </p>
                  )}

                  {/* Task Items */}
                  <div className="space-y-2">
                    {plan.tasks.map((taskItem: any, idx: number) => {
                      const emp = employees.find(e => e.id === taskItem.assignedToId);
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-100">
                                {lang === 'ar' ? taskItem.titleAr : taskItem.title}
                              </span>
                              {taskItem.requiresOwnerSignoff && (
                                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                                  <ShieldAlert className="w-2.5 h-2.5" />
                                  <span>{lang === 'ar' ? 'يتطلب اعتماد المالك' : 'Requires Signoff'}</span>
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span>{lang === 'ar' ? 'المسؤول الذكي:' : 'Assignee:'} </span>
                              <span className="text-cyan-400 font-semibold">
                                {lang === 'ar' ? emp?.nameAr : emp?.name} ({lang === 'ar' ? emp?.roleAr : emp?.role})
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                              {taskItem.priority}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400">
                              ${taskItem.estimatedCostUSD?.toLocaleString() || 1500}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Bar */}
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">
                      STATUS: {msg.isOrchestrated ? 'DEPLOYED TO WORKFORCE' : 'AWAITING OWNER DISPATCH'}
                    </span>

                    {!msg.isOrchestrated ? (
                      <button
                        type="button"
                        onClick={() => onDeployOrchestration(msg.id, plan)}
                        className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{lang === 'ar' ? 'إرسال وتكليف الموظفين فوراً' : 'Deploy Tasks to AI Workforce'}</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{lang === 'ar' ? 'تم تكليف الموظفين بالمهام' : 'Tasks Active in Kanban'}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono animate-pulse p-3 bg-slate-900/60 rounded-xl max-w-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>AURA-CEO analyzing directive and orchestrating tasks...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#061126] border-t border-cyan-800/40 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={lang === 'ar' 
            ? 'أصدر أمراً أو استفساراً استراتيجياً للرئيس التنفيذي (مثال: أطلق مراجعة أمنية لعناقيد الحوسبة ونظم العقود)...' 
            : 'Issue an order or strategic directive to the CEO (e.g. Audit security on GPU clusters and draft banking contract)...'}
          className="flex-1 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isGenerating}
          className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20 shrink-0"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{lang === 'ar' ? 'إصدار الأمر' : 'Dispatch'}</span>
        </button>
      </form>
    </div>
  );
};
