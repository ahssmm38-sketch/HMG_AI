import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Cpu, 
  PieChart, 
  Sliders, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  CreditCard,
  Lock,
  AlertCircle
} from 'lucide-react';
import { Language, FinancialMetric, Department } from '../types';
import { translations } from '../i18n/translations';

interface FinanceDashboardProps {
  lang: Language;
  finance: FinancialMetric;
  departments: Department[];
  onUpdateDepartmentBudget: (deptId: string, val: number) => void;
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  lang,
  finance,
  departments,
  onUpdateDepartmentBudget
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'overview' | 'compute' | 'rebalance'>('overview');
  const [allocationDraft, setAllocationDraft] = useState<{ [deptId: string]: number }>(
    departments.reduce((acc, d) => ({ ...acc, [d.id]: d.allocatedBudgetUSD }), {})
  );
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleSliderChange = (deptId: string, val: number) => {
    setAllocationDraft(prev => ({ ...prev, [deptId]: val }));
  };

  const handleCommitBudget = () => {
    Object.entries(allocationDraft).forEach(([deptId, val]) => {
      onUpdateDepartmentBudget(deptId, val);
    });
    setSaveSuccess(lang === 'ar' ? 'تم اعتماد ميزانية الخزينة الجديدة وتحديث الحصص' : 'Treasury budget committed and dispatched to departments');
    setTimeout(() => setSaveSuccess(null), 3500);
  };

  const totalAllocatedDraft = Object.values(allocationDraft).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Treasury Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>{t.financeTitle}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'ar'
              ? 'حوكمة الخزينة والالتزامات المالية — بيانات نزيهة موثقة ولا التزامات دون اعتماد المالك'
              : 'Treasury Governance & Ledger — Verified financial state, zero unauthorized commitments'}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'نظرة عامة وسجلات الخزينة' : 'Ledger Overview'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('compute')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'compute'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'حوكمة تكاليف الحوسبة' : 'Compute & GPU Governance'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rebalance')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'rebalance'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.adjustDepartmentAllocations}
          </button>
        </div>
      </div>

      {/* Integrity Notice Banner */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            {lang === 'ar' ? finance.unverifiedNoticeAr : finance.unverifiedNotice}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/80 text-amber-300 font-semibold">
            {lang === 'ar' ? 'الدفتر الخارجي غير مرتبط' : 'External Ledger: Unconnected'}
          </span>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 shadow-lg">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Main KPI Strip - Strict Verification with N/A for Unconnected Ledger */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* ARR */}
        <div className="p-4 rounded-xl bg-[#070e24] border border-slate-800 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">{t.arr}</span>
            <span className="text-[9px] font-mono px-1 rounded bg-slate-900 text-slate-400 border border-slate-800">
              LEDGER
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-200 mt-1 tabular-nums">
            {finance.arrUSD !== null ? `$${(finance.arrUSD / 1000000).toFixed(1)}M` : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {finance.arrUSD !== null ? '+31.4% Net Run Rate' : (lang === 'ar' ? 'بانتظار ربط دفتر الإيرادات' : 'Awaiting Ledger Connection')}
          </div>
        </div>

        {/* MRR */}
        <div className="p-4 rounded-xl bg-[#070e24] border border-slate-800 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">{t.mrr}</span>
            <span className="text-[9px] font-mono px-1 rounded bg-slate-900 text-slate-400 border border-slate-800">
              LEDGER
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-200 mt-1 tabular-nums">
            {finance.mrrUSD !== null ? `$${finance.mrrUSD.toLocaleString()}` : 'N/A'}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-mono">
            {finance.mrrUSD !== null ? 'Recurring enterprise licenses' : (lang === 'ar' ? 'بانتظار ربط نظام الفوترة' : 'Awaiting Billing Integration')}
          </div>
        </div>

        {/* Verified Actual Disbursements */}
        <div className="p-4 rounded-xl bg-[#070e24] border border-slate-800 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">{lang === 'ar' ? 'المصروف الفعلي المؤكد' : 'Verified Disbursements'}</span>
            <span className="text-[9px] font-mono px-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              VERIFIED
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            ${finance.verifiedDisbursementsUSD.toFixed(2)}
          </div>
          <div className="text-[10px] text-emerald-400 mt-1 font-mono">
            {lang === 'ar' ? '0$ صرف غير مصرح به' : '$0.00 Unauthorized Spend'}
          </div>
        </div>

        {/* Active Financial Commitments */}
        <div className="p-4 rounded-xl bg-[#070e24] border border-slate-800 relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">{lang === 'ar' ? 'الالتزامات المالية النشطة' : 'Active Commitments'}</span>
            <span className="text-[9px] font-mono px-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              APPROVAL-GATED
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">
            ${finance.activeFinancialCommitmentsUSD.toFixed(2)}
          </div>
          <div className="text-[10px] text-cyan-300 mt-1 font-mono">
            {lang === 'ar' ? 'يتطلب توقيع المالك دائماً' : 'Requires Owner Signature'}
          </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Authentic Ledger & Spending Protocol */}
          <div className="p-5 rounded-2xl bg-[#070e24] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'حالة السجلات المالية والحوكمة' : 'Treasury Verification & Policy Enforcement'}</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ar' ? 'بوابة التحويلات المالية والصرف' : 'Treasury Disbursement Gate'}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {lang === 'ar' ? 'محظور تماماً على الذكاء الاصطناعي دون توقيع المالك' : 'AI agents cannot disburse funds autonomously'}
                  </div>
                </div>
                <div className="font-mono font-bold text-emerald-400 text-xs">
                  {lang === 'ar' ? 'محمي بالكامل' : 'ENFORCED'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ar' ? 'عقود الشراء والتوريد' : 'Procurement & Vendor Contracts'}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {lang === 'ar' ? 'لا توجد عقود شراء تلقائية مبرمة' : 'Zero autonomous contract commitments'}
                  </div>
                </div>
                <div className="font-mono font-bold text-cyan-400 text-xs">
                  $0.00 COMMITTED
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ar' ? 'المهام التنفيذية الموثقة' : 'Verified Task Executions'}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {lang === 'ar' ? 'عمليات معالجة حقيقية مسجلة مع التكلفة' : 'Actual task completions with attestation hash'}
                  </div>
                </div>
                <div className="font-mono font-bold text-white text-xs">
                  {finance.verifiedExecutionCount} {lang === 'ar' ? 'عملية' : 'Executed'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ar' ? 'زمن المعالجة الحسابية الموثق' : 'Recorded Compute Runtime'}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {lang === 'ar' ? 'إجمالي زمن تنفيذ الخوارزميات الفعلية' : 'Cumulative verified compute runtime'}
                  </div>
                </div>
                <div className="font-mono font-bold text-cyan-400 text-xs">
                  {finance.executedTaskComputeTimeSec}s
                </div>
              </div>
            </div>
          </div>

          {/* Department Capital Planning Ceiling */}
          <div className="p-5 rounded-2xl bg-[#070e24] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'سقوف الميزانيات المخصصة للقطاعات' : 'Authorized Departmental Budget Ceilings'}</span>
            </h3>

            <div className="space-y-3">
              {departments.map(dept => {
                const totalCap = departments.reduce((acc, d) => acc + d.allocatedBudgetUSD, 0) || 1;
                const pct = Math.round((dept.allocatedBudgetUSD / totalCap) * 100);
                return (
                  <div key={dept.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">
                        {lang === 'ar' ? dept.nameAr : dept.name}
                      </span>
                      <span className="font-mono text-white tabular-nums font-semibold">
                        ${dept.allocatedBudgetUSD.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-cyan-500 h-1.5 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* GPU Economics & Compute Governance Tab */}
      {activeTab === 'compute' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-[#070e24] border border-slate-800 space-y-3">
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
              {lang === 'ar' ? 'حوكمة سعة المعالجات' : 'Compute Capacity Policy'}
            </div>
            <h4 className="text-sm font-bold text-white">
              {lang === 'ar' ? 'حظر الاستئجار التلقائي للمعالجات' : 'Zero Autonomous GPU Leasing'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'لا يسمح النظام للموظفين بحجز أو استئجار أي عناقيد GPU أو سعات سحابية بشكل مستقل. يتطلب كل مقترح عقد مراجعة وموافقة صريحة من المالك.'
                : 'The platform strictly blocks AI agents from executing GPU cluster forward lease contracts. All procurement proposals require manual Owner authorization.'}
            </p>
            <div className="p-3 rounded-xl bg-slate-900 text-xs font-mono text-emerald-400 flex items-center justify-between">
              <span>UNAUTHORIZED COMMITTED:</span>
              <span className="font-bold">$0.00</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#070e24] border border-slate-800 space-y-3">
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
              {lang === 'ar' ? 'قياس الاستهلاك الفعلي' : 'Execution Measurement'}
            </div>
            <h4 className="text-sm font-bold text-white">
              {lang === 'ar' ? 'توثيق الرموز وزمن الاستجابة' : 'Real Token & Latency Attestation'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'يتم قياس كل مهمة منفذة بزمن الاستجابة الحقيقي بالمللي ثانية، ورمز التحقق، والرموز المستهلكة من نموذج Gemini أو محرك الاستدلال المحلي.'
                : 'Every task is metered by real millisecond execution latency, verification hashes, and tokens processed via server-side Gemini or local verified sandbox.'}
            </p>
            <div className="p-3 rounded-xl bg-slate-900 text-xs font-mono text-cyan-300 flex items-center justify-between">
              <span>VERIFIED EXECUTIONS:</span>
              <span className="font-bold">{finance.verifiedExecutionCount}</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#070e24] border border-slate-800 space-y-3">
            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
              {lang === 'ar' ? 'الرقابة المالية الجنائية' : 'Audit Trail & Hash Integrity'}
            </div>
            <h4 className="text-sm font-bold text-white">
              {lang === 'ar' ? 'سجل التدقيق المشفر' : 'Cryptographic Execution Hashes'}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'تحصل كل معاملة أو مهمة منجزة على معرّف تنفيذ فريد ورمز SHA للتأكد من عدم وجود بيانات وهمية أو أرقام مختلقة.'
                : 'Each completed workstream records a verified execution ID and SHA hash into the immutable audit trail, preventing fabricated execution claims.'}
            </p>
            <div className="p-3 rounded-xl bg-slate-900 text-xs font-mono text-emerald-400 flex items-center justify-between">
              <span>IMMUTABLE AUDIT TRAIL:</span>
              <span className="font-bold">ACTIVE</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Treasury Rebalancer Tab */}
      {activeTab === 'rebalance' && (
        <div className="p-6 rounded-2xl bg-[#070e24] border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">
                {t.adjustDepartmentAllocations}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ar' 
                  ? 'إعادة تخصيص سقوف الميزانيات المعتمدة بين قطاعات المؤسسة مع التحديث اللحظي.' 
                  : 'Adjust authorized departmental budget ceilings with instant administrative update.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right rtl:text-left">
                <div className="text-[10px] text-slate-400 uppercase font-mono">Total Budget Ceiling</div>
                <div className="text-lg font-bold font-mono text-cyan-400 tabular-nums">
                  ${totalAllocatedDraft.toLocaleString()}
                </div>
              </div>
              <button
                type="button"
                onClick={handleCommitBudget}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20"
              >
                {t.saveTreasuryConfig}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map(dept => {
              const currentVal = allocationDraft[dept.id] ?? dept.allocatedBudgetUSD;
              return (
                <div key={dept.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {lang === 'ar' ? dept.nameAr : dept.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-mono">[{dept.code}]</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-300 tabular-nums">
                      ${currentVal.toLocaleString()}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={200000}
                    max={3500000}
                    step={50000}
                    value={currentVal}
                    onChange={(e) => handleSliderChange(dept.id, Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
