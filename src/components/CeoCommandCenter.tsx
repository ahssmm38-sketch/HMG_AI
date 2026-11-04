import React, { useState } from 'react';
import { 
  Cpu, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  GitBranch, 
  Activity, 
  TrendingUp, 
  Compass, 
  ShieldAlert, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { Language, AIEmployee, Department, Project } from '../types';
import { translations } from '../i18n/translations';

interface CeoCommandCenterProps {
  lang: Language;
  employees: AIEmployee[];
  departments: Department[];
  projects: Project[];
}

export const CeoCommandCenter: React.FC<CeoCommandCenterProps> = ({
  lang,
  employees,
  departments,
  projects
}) => {
  const t = translations[lang];
  const [mandateInput, setMandateInput] = useState('');
  const [broadcastLog, setBroadcastLog] = useState<{ id: string; time: string; text: string; status: string }[]>([
    {
      id: 'm-1',
      time: '09:30 UTC',
      text: lang === 'ar' 
        ? 'التركيز على إغلاق صفقة تحالف البنوك السيادية وتدشين مصفوفة 512 معالج H200 دون انقطاع.' 
        : 'Priority focus on closing Tier-1 GCC Sovereign Banking consortium and commissioning the 512x H200 cluster.',
      status: lang === 'ar' ? 'تم التعميم والتنسيق' : 'Cascaded to 8 Depts'
    }
  ]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mandateInput.trim()) return;

    setIsBroadcasting(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} UTC`;
      setBroadcastLog(prev => [
        {
          id: 'm-' + Date.now(),
          time: timeStr,
          text: mandateInput,
          status: lang === 'ar' ? 'تم التفعيل لكافة الوكلاء' : 'Active Cascading Mandate'
        },
        ...prev
      ]);
      setMandateInput('');
      setIsBroadcasting(false);
      setSuccessBanner(t.mandateBroadcasted);
      setTimeout(() => setSuccessBanner(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* CEO Executive Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#041026] via-[#071d42] to-[#041026] border border-cyan-700/50 p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-xs mb-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>AURA-CEO v5.2</span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400 font-semibold">{t.ceoStatus}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.ceoTitle}
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {t.ceoSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-center min-w-[120px]">
              <div className="text-[10px] text-slate-400 font-medium">{t.strategicAlignmentIndex}</div>
              <div className="text-2xl font-bold font-mono text-cyan-300 tabular-nums">98.4%</div>
              <div className="text-[9px] text-emerald-400 font-mono">NOMINAL SYNC</div>
            </div>
          </div>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-200 text-xs flex items-center gap-3 shadow-lg">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="font-medium">{successBanner}</span>
        </div>
      )}

      {/* Owner Sovereign Mandate Dispatcher */}
      <div className="p-6 rounded-2xl bg-[#070e24] border border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>{t.mandateTitle}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar' 
                ? 'يقوم الرئيس التنفيذي الذكي بتحويل أمر المالك إلى مهام فرعية ويوزعها تلقائياً على رؤساء الأقسام.' 
                : 'The AI CEO immediately parses Owner directives into subordinate milestones across all 8 specialized minds.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleBroadcast} className="space-y-3">
          <textarea
            value={mandateInput}
            onChange={(e) => setMandateInput(e.target.value)}
            placeholder={t.mandatePlaceholder}
            rows={3}
            className="w-full text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />

          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 font-mono">
              TARGET: ALL 8 AI EXECUTIVE UNITS · ZERO DISCORDANCE
            </span>
            <button
              type="submit"
              disabled={isBroadcasting || !mandateInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isBroadcasting ? (lang === 'ar' ? 'جارِ التعميم...' : 'Cascading...') : t.broadcastMandate}</span>
            </button>
          </div>
        </form>

        {/* Recent Mandate Log */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase font-mono">
            {lang === 'ar' ? 'سجل توجيهات المالك السارية' : 'Active Owner Sovereign Mandates'}
          </div>
          {broadcastLog.map(log => (
            <div key={log.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[10px] text-slate-500 font-mono shrink-0">{log.time}</span>
                <span className="text-slate-200 truncate">{log.text}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 shrink-0">
                {log.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Autonomous Department Synthesis & Active Sprints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Alignment Matrix */}
        <div className="p-5 rounded-2xl bg-[#070e24] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'مواءمة الأقسام والتناغم الذاتي' : 'Departmental Synchronization'}</span>
          </h3>

          <div className="space-y-3">
            {departments.map(dept => {
              const head = employees.find(e => e.id === dept.headEmployeeId);
              return (
                <div key={dept.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">
                        {lang === 'ar' ? dept.nameAr : dept.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">[{dept.code}]</span>
                    </div>
                    <span className="font-mono text-cyan-400 font-semibold tabular-nums">
                      {dept.efficiencyScore}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
                      style={{ width: `${dept.efficiencyScore}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{lang === 'ar' ? head?.nameAr : head?.name}</span>
                    <span className="font-mono">{dept.agentCount} {lang === 'ar' ? 'وكيل نشط' : 'agents'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Executive Intelligence Briefings */}
        <div className="p-5 rounded-2xl bg-[#070e24] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>{t.recentBriefings}</span>
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-cyan-400 font-semibold">SYNTHESIS · FINANCE & COMPUTE</span>
                <span className="text-slate-500 font-mono">14m ago</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'رئيس المالية طارق المنصور أجرى عملية تحوط لأسعار المعالجات الرسومية للربع القادم، محققاً وفراً متوقعاً بنسبة 18.2% مقارنة بعقود التجزئة.'
                  : 'Financial controller Tariq Al-Mansoor executed compute lease hedging for next quarter, locking in an estimated 18.2% margin preservation against retail spot fluctuations.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-cyan-400 font-semibold">SYNTHESIS · RESEARCH BREAKTHROUGH</span>
                <span className="text-slate-500 font-mono">42m ago</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'د. إلينا فانس حققت دقة 98.4% في استدلال اللغة العربية للأنظمة السيادية، مع انخفاض استهلاك الذاكرة بنسبة 35% عبر تقطير المعاملات.'
                  : 'Dr. Elena Vance achieved 98.4% accuracy on Sovereign Arabic legal reasoning corpus with 35% reduced memory footprint via FP8 weight distillation.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-cyan-400 font-semibold">SYNTHESIS · COMMERCIAL CLOSING</span>
                <span className="text-slate-500 font-mono">1h ago</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'ماركوس ستيرلينغ يقترب من توقيع اتفاقية ترخيص الذكاء الاصطناعي مع تحالف بنوك الخليج بقيمة 4.8M$ بانتظار اعتماد المالك لحجز السعة.'
                  : 'Marcus Sterling reached final contract drafting with Gulf banking consortium for $4.8M licensing agreement, awaiting Owner capacity signoff.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
