import React, { useState } from 'react';
import { 
  MessagesSquare, 
  Send, 
  Gavel, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Users,
  Mic,
  Clock
} from 'lucide-react';
import { Language, MeetingAgenda, AIEmployee } from '../types';
import { translations } from '../i18n/translations';

interface AIMeetingRoomProps {
  lang: Language;
  meeting: MeetingAgenda;
  employees: AIEmployee[];
  onAddMessage: (msg: { senderId: string; text: string; textAr: string; stance: any; confidenceScore: number }) => void;
  onEnactResolution: (resolution: string, resolutionAr: string) => void;
}

export const AIMeetingRoom: React.FC<AIMeetingRoomProps> = ({
  lang,
  meeting,
  employees,
  onAddMessage,
  onEnactResolution
}) => {
  const t = translations[lang];
  const [ownerInput, setOwnerInput] = useState('');
  const [resolutionInput, setResolutionInput] = useState('');
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [isSimulatingResponse, setIsSimulatingResponse] = useState(false);

  const handleSendOwnerComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerInput.trim()) return;

    const query = ownerInput;
    setOwnerInput('');

    // Add owner message
    onAddMessage({
      senderId: 'owner',
      text: `OWNER DIRECTIVE: ${query}`,
      textAr: `توجيه المالك المباشر: ${query}`,
      stance: 'neutral',
      confidenceScore: 100
    });

    // Simulate smart executive AI reply
    setIsSimulatingResponse(true);
    setTimeout(() => {
      onAddMessage({
        senderId: 'emp-4', // Tariq responds from Finance
        text: 'Tariq Al-Mansoor: Incorporating Owner directive into our treasury sensitivity matrix. Recalibrating Q4 liquidity reserve to absorb cluster commit while defending our 40% net margin threshold.',
        textAr: 'طارق المنصور: ندمج توجيه المالك مباشرة في مصفوفة حساسية الخزينة. نعيد موازنة الاحتياطي النقدي للربع الرابع لاستيعاب التزام المعالجات مع حماية هامش الـ 40%.',
        stance: 'pro',
        confidenceScore: 98
      });
      setIsSimulatingResponse(false);
    }, 1200);
  };

  const handleEnact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionInput.trim()) return;

    onEnactResolution(
      resolutionInput,
      lang === 'ar' ? resolutionInput : `قرار ملزم: ${resolutionInput}`
    );
    setResolutionInput('');
    setIsResolutionModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Executive Boardroom Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#06183a] via-[#092353] to-[#041228] border border-cyan-800/50 p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs mb-2">
              <MessagesSquare className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'مجلس الإدارة التنفيذي الذكي' : 'Autonomous AI Boardroom'}</span>
              <span className="text-slate-500">·</span>
              <span className={`font-mono uppercase font-bold text-[10px] px-2 py-0.5 rounded ${
                meeting.status === 'in_session' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}>
                {meeting.status.replace('_', ' ')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {lang === 'ar' ? meeting.titleAr : meeting.title}
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {lang === 'ar' ? meeting.summaryAr : meeting.summary}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {meeting.status === 'in_session' && (
              <button
                type="button"
                onClick={() => setIsResolutionModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Gavel className="w-4 h-4" />
                <span>{t.castResolution}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Boardroom Layout: Participants on Left/Top, Deliberation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Attendees Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'أعضاء المجلس الحاضرون' : 'Active Board Members'}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#070e24] border border-slate-800 space-y-3">
            {meeting.participants.map(partId => {
              const emp = employees.find(e => e.id === partId);
              if (!emp) return null;
              return (
                <div key={emp.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                  {emp.avatar ? (
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-500/20 shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-cyan-800 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {emp.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {lang === 'ar' ? emp.nameAr : emp.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {lang === 'ar' ? emp.roleAr : emp.role}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Owner Seat */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2.5 p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-cyan-500 text-slate-950 font-extrabold text-xs flex items-center justify-center shrink-0">
                👑
              </div>
              <div>
                <div className="text-xs font-bold text-cyan-300">{t.currentRole}</div>
                <div className="text-[10px] text-amber-300 font-mono">SUPREME VETO SEAT</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Deliberation Transcript */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{t.liveDeliberation}</span>
            </h3>
            {meeting.bindingResolution && (
              <span className="text-xs font-mono text-emerald-400 font-semibold px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                RESOLUTION ENACTED
              </span>
            )}
          </div>

          <div className="rounded-2xl bg-[#070e24] border border-slate-800 p-5 space-y-4 max-h-[550px] overflow-y-auto">
            {meeting.messages.map(msg => {
              const isOwner = msg.senderId === 'owner';
              const senderEmp = employees.find(e => e.id === msg.senderId);

              const getStanceBadge = () => {
                if (isOwner) {
                  return (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
                      OWNER SOVEREIGN
                    </span>
                  );
                }
                switch (msg.stance) {
                  case 'pro':
                    return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">PRO-COMMIT</span>;
                  case 'con':
                    return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800">SECURITY CONDITIONAL</span>;
                  case 'risk':
                    return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">TREASURY RISK</span>;
                  default:
                    return null;
                }
              };

              return (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border transition-all space-y-2 ${
                    isOwner
                      ? 'bg-cyan-950/30 border-cyan-700/60 shadow-md ring-1 ring-cyan-500/20'
                      : 'bg-slate-900/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {isOwner ? t.currentRole : (lang === 'ar' ? senderEmp?.nameAr : senderEmp?.name)}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">[{msg.timestamp}]</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStanceBadge()}
                      {!isOwner && (
                        <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                          {msg.confidenceScore}% {t.confidenceIndex}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {lang === 'ar' ? msg.textAr : msg.text}
                  </p>
                </div>
              );
            })}

            {isSimulatingResponse && (
              <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-cyan-400 font-mono flex items-center gap-2 animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span>AI Department Heads synthesizing Owner inquiry...</span>
              </div>
            )}
          </div>

          {/* Owner Intervention Input */}
          <form onSubmit={handleSendOwnerComment} className="flex gap-2">
            <input
              type="text"
              value={ownerInput}
              onChange={(e) => setOwnerInput(e.target.value)}
              placeholder={t.ownerInterventionPlaceholder}
              className="flex-1 text-xs bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            />
            <button
              type="submit"
              disabled={!ownerInput.trim()}
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مداخلة المالك' : 'Interject'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Binding Resolution Modal */}
      {isResolutionModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1128] border border-amber-600/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <Gavel className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-white">
                {lang === 'ar' ? 'إصدار قرار المالك السيادي الملزم' : 'Enact Sovereign Owner Resolution'}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'سيقوم قرارك بإنهاء المداولة فوراً واعتماد التوجيه لجميع الأقسام، وتوثيق القرار في السجل المشفر.'
                : 'Your resolution will instantly settle the departmental debate, bind all AI executives to the directive, and adjourn the boardroom.'}
            </p>

            <form onSubmit={handleEnact} className="space-y-4">
              <textarea
                value={resolutionInput}
                onChange={(e) => setResolutionInput(e.target.value)}
                placeholder="e.g. Authorize $250k cluster commit with mandatory HSM hardware encryption attestation prior to client workload provisioning."
                rows={4}
                className="w-full text-xs bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResolutionModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-400 hover:text-white"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={!resolutionInput.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold text-xs"
                >
                  {t.castResolution}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
