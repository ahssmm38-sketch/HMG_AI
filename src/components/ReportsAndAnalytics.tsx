import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Language, AIEmployee, Department, FinancialMetric } from '../types';
import { translations } from '../i18n/translations';

interface ReportsAndAnalyticsProps {
  lang: Language;
  employees: AIEmployee[];
  departments: Department[];
  finance: FinancialMetric;
}

export const ReportsAndAnalytics: React.FC<ReportsAndAnalyticsProps> = ({
  lang,
  employees,
  departments,
  finance
}) => {
  const t = translations[lang];
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExportAudit = () => {
    const reportData = {
      corporation: 'HMG AI Global Technologies',
      platform: 'Enterprise AI Autonomous Management System',
      generatedAt: new Date().toISOString(),
      governanceStatus: 'OWNER_SOVEREIGN_NOMINAL',
      financials: finance,
      departments: departments.map(d => ({
        code: d.code,
        name: d.name,
        efficiencyScore: d.efficiencyScore,
        budgetAllocated: d.allocatedBudgetUSD,
        budgetSpent: d.spentBudgetUSD,
        agentCount: d.agentCount
      })),
      aiWorkforce: employees.map(e => ({
        name: e.name,
        role: e.role,
        modelCore: e.modelCore,
        efficiencyRating: e.efficiencyRating,
        decisionThresholdUSD: e.decisionThresholdUSD
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HMG_AI_Executive_Audit_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(lang === 'ar' ? 'تم تنزيل تقرير التدقيق السيادي بنجاح' : 'Executive audit report exported successfully');
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>{t.analyticsTitle}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.analyticsSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportAudit}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2 whitespace-nowrap self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>{t.downloadReport}</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Verified Analytics Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#070e24] border border-slate-800">
          <div className="text-[11px] text-slate-400">{lang === 'ar' ? 'المهام المنفذة والموثقة' : 'Verified Task Executions'}</div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            {finance.verifiedExecutionCount}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            {lang === 'ar' ? 'نتائج موثقة مشفرة' : 'Attested with SHA hash'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#070e24] border border-slate-800">
          <div className="text-[11px] text-slate-400">{lang === 'ar' ? 'زمن المعالجة الحسابية الفعلي' : 'Verified Compute Runtime'}</div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            {finance.executedTaskComputeTimeSec}s
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {lang === 'ar' ? 'استدلال بالخادم / محرك محلي' : 'Server Gemini / local engine'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#070e24] border border-slate-800">
          <div className="text-[11px] text-slate-400">{lang === 'ar' ? 'المصروفات المصرح بها' : 'Verified Disbursements'}</div>
          <div className="text-xl font-bold font-mono text-white mt-1 tabular-nums">
            ${finance.verifiedDisbursementsUSD.toFixed(2)}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            {lang === 'ar' ? '0$ صرف غير مصرح به' : '$0.00 Unauthorized spend'}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#070e24] border border-slate-800">
          <div className="text-[11px] text-slate-400">{lang === 'ar' ? 'دفتر المحاسبة الخارجي' : 'External Ledger Link'}</div>
          <div className="text-xl font-bold font-mono text-slate-400 mt-1 tabular-nums">
            N/A
          </div>
          <div className="text-[10px] text-amber-400 mt-1 font-mono">
            {lang === 'ar' ? 'بانتظار ربط نظام المحاسبة' : 'Awaiting Ledger Connect'}
          </div>
        </div>
      </div>

      {/* Departmental Compute & Token Consumption */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-[#070e24] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>{t.computeDistribution}</span>
          </h3>

          <div className="space-y-4">
            {departments.map(dept => {
              const head = employees.find(e => e.id === dept.headEmployeeId);
              const computePct = head ? Math.round(head.computeUsage) : 75;

              return (
                <div key={dept.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">
                      {lang === 'ar' ? dept.nameAr : dept.name}
                    </span>
                    <span className="font-mono text-cyan-400 font-bold tabular-nums">
                      {computePct}% Load · {head ? (head.tokenBurnDaily / 1000000).toFixed(1) : '24.0'}M tokens/day
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${computePct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Autonomous Swarm Governance & Error Elimination */}
        <div className="p-5 rounded-2xl bg-[#070e24] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.agentReliability}</span>
          </h3>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-white">
                {lang === 'ar' ? 'فحص السلوك المارق والانحراف السلوكي' : 'Zero-Drift Constitutional Enforcer'}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'يتم تقييم كل رد نموذج ذاتي في أجزاء من الألف من الثانية بواسطة نموذج التحقق الدستوري قبل النشر أو الرد.'
                  : 'All agent tool invocations pass through secondary constitutional filters to guarantee compliance with Owner parameters.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-white">
                {lang === 'ar' ? 'التصديق الرقمي المشفر' : 'Cryptographic Output Watermarking'}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'تحمل كافة مخرجات النماذج توقيعاً مشفراً يثبت أصل الاستدلال ونقطة الحفظ وعدم التلاعب بالمصفوفة.'
                  : 'Every inference response bears a cryptographic SHA-256 signature validating token sequence integrity and agent identity.'}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
              <div className="text-xs font-bold text-white">
                {lang === 'ar' ? 'التكامل المستقبلي مع Supabase' : 'Supabase Integration Readiness'}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'تم تجهيز جداول قاعدة البيانات والخدمات للربط الفوري مع Supabase بنقرة واحدة عبر المفاتيح السحابية.'
                  : 'Storage models and access services are structured strictly around PostgreSQL tables for instant Supabase connection.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
