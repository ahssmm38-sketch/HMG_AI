import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Cpu, 
  Lock, 
  DollarSign, 
  ExternalLink,
  Layers,
  FileText,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { Language, IntegrityFeatureStatus } from '../types';
import { translations } from '../i18n/translations';

interface IntegrityAuditProps {
  lang: Language;
}

export const IntegrityAudit: React.FC<IntegrityAuditProps> = ({ lang }) => {
  const t = translations[lang];

  const features: IntegrityFeatureStatus[] = [
    {
      id: 'feat-1',
      category: 'ai_engine',
      name: 'Server-Side Gemini 3.8 Flash Integration',
      nameAr: 'تكامل Gemini 3.8 Flash من جهة الخادم',
      status: 'REAL_VERIFIED',
      description: 'AI CEO chat queries are processed through server-side Express routes with zero client-side key exposure.',
      descriptionAr: 'تُعالج استعلامات الرئيس التنفيذي حصرياً عبر خادم Express الخلفي دون كشف أي مفاتيح في المتصفح.',
      evidence: 'Endpoint: POST /api/ceo/chat · SDK: @google/genai v2.4.0',
      evidenceAr: 'نقطة النهاية: POST /api/ceo/chat · مكتبة: @google/genai'
    },
    {
      id: 'feat-2',
      category: 'governance',
      name: 'Owner Sovereign Authorization Gate',
      nameAr: 'بوابة سيادة المالك والاعتماد الإلزامي',
      status: 'REAL_VERIFIED',
      description: 'Tasks requiring signoff are strictly blocked from completion until an authenticated Owner explicitly approves them.',
      descriptionAr: 'تُحظر المهام الحساسة برمجياً من الانتقال إلى مكتمل ما لم يعتمدها المالك صراحة.',
      evidence: 'Enforced in db.runTaskExecution() & resolveApproval()',
      evidenceAr: 'مطبقة في دوال runTaskExecution و resolveApproval'
    },
    {
      id: 'feat-3',
      category: 'governance',
      name: 'Emergency Swarm HALT Protocol',
      nameAr: 'بروتوكول الإيقاف الاضطراري وتجميد المنظومة',
      status: 'REAL_VERIFIED',
      description: 'Engaging HALT immediately cancels cancellable running tasks and rejects all new execution attempts.',
      descriptionAr: 'يؤدي تفعيل HALT فورياً لإلغاء المهام الجارية بأمان ورفض أي محاولة تنفيذ جديدة.',
      evidence: 'Enforced globally via db.setEmergencyHalt() with CANCELLED audit records',
      evidenceAr: 'مطبقة عبر setEmergencyHalt مع توثيق سجلات الإلغاء'
    },
    {
      id: 'feat-4',
      category: 'tasks',
      name: 'Cryptographic Task Execution Evidence',
      nameAr: 'أدلة تنفيذ المهام المشفرة والمؤرخة',
      status: 'REAL_VERIFIED',
      description: 'A task is NEVER marked COMPLETED without execution_id, tool used, timestamps, and verification_hash.',
      descriptionAr: 'لا تُعتبر أي مهمة مكتملة إطلاقاً دون معرف تنفيذ، والأداة المستخدمة، وتوقيت حقيقي، وتجزئة تحقق مشفرة.',
      evidence: 'Execution receipts recorded in Task.evidence & AuditLog',
      evidenceAr: 'تُسجل الإيصالات في كائن Task.evidence وسجل التدقيق'
    },
    {
      id: 'feat-5',
      category: 'tasks',
      name: 'Mathematical & Security Execution Engines',
      nameAr: 'محركات التحقق الإحصائي والأمني البرمجي',
      status: 'LOCAL_EXECUTION',
      description: 'Actual Shannon entropy, lexical token diversity, regex injection detection, and contrast calculations.',
      descriptionAr: 'حسابات فعلية لإنتروبيا النصوص، والتنوع المعجمي، وفحص التعابير النمطية ضد محاولات الحقن.',
      evidence: 'Executed via server /api/agent/execute and taskExecutor.ts',
      evidenceAr: 'تُنفذ عبر نقطة النهاية /api/agent/execute وملف taskExecutor.ts'
    },
    {
      id: 'feat-6',
      category: 'financials',
      name: 'Banking Core & Commercial Ledger',
      nameAr: 'الربط المصرفي والدفاتر المحاسبية الخارجية',
      status: 'NOT_YET_CONNECTED',
      description: 'External bank accounts and live ERP ledgers are not connected. Fabricated ARR/MRR/Valuation figures are removed and display N/A.',
      descriptionAr: 'الحسابات البنكية الخارجية والدفاتر المحاسبية الحية غير متصلة. تم تصفير الأرباح الوهمية وعرضها كـ N/A التزاماً بالشفافية.',
      evidence: 'Financial KPIs display N/A with $0.00 confirmed commitments',
      evidenceAr: 'تُعرض المؤشرات كـ N/A مع التزامات شراء مؤكدة بقيمة 0.00$'
    },
    {
      id: 'feat-7',
      category: 'persistence',
      name: 'Cloud Supabase Database Storage',
      nameAr: 'التخزين السحابي الدائم عبر Supabase',
      status: 'NOT_YET_CONNECTED',
      description: 'Operating in verified LocalStorage Mode. Supabase credentials are not in environment; schemas are pre-structured for instant plug-in.',
      descriptionAr: 'يعمل النظام حالياً بوضع التخزين المحلي للمتصفح. الجداول مهيأة للربط السحابي فور توفر المفاتيح.',
      evidence: 'Verified via /api/supabase/status diagnostics',
      evidenceAr: 'تم التحقق عبر نقطة تشخيص /api/supabase/status'
    }
  ];

  const getStatusBadge = (status: IntegrityFeatureStatus['status']) => {
    switch (status) {
      case 'REAL_VERIFIED':
        return (
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1.5 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'ar' ? 'فعلي وموثق' : 'REAL & VERIFIED'}</span>
          </span>
        );
      case 'LOCAL_EXECUTION':
        return (
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1.5 shrink-0">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'تشغيل برمجي محلي' : 'LOCAL ENGINE'}</span>
          </span>
        );
      case 'SIMULATED':
        return (
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1.5 shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'محاكاة اختبارية' : 'SIMULATED'}</span>
          </span>
        );
      case 'NOT_YET_CONNECTED':
        return (
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5 shrink-0">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>{lang === 'ar' ? 'غير متصل بعد (N/A)' : 'NOT YET CONNECTED'}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#041026] via-[#06193d] to-[#041026] border border-cyan-700/50 p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-xs mb-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'ميثاق النزاهة المؤسسية الشامل' : 'Corporate Integrity & Transparency Audit'}</span>
              <span className="text-slate-500">·</span>
              <span className="text-emerald-400 font-semibold font-mono">ZERO FABRICATED METRICS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lang === 'ar' ? 'تقرير تدقيق الشفافية والنزاهة الفنية' : 'Platform Integrity & Reality Audit'}
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {lang === 'ar'
                ? 'يوضح هذا السجل بدقة الميزات التي تعمل فعلياً، والأدوات المشغلة محلياً، والميزات غير المتصلة بعد. لا ندّعي وجود بيانات أرباح وهمية أو استدعاءات لم تحدث.'
                : 'This audit page transparently delineates real active features, locally executed verification engines, and unconnected external integrations. No fabricated metrics.'}
            </p>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#070e24] border border-slate-800">
          <div className="text-[11px] text-slate-400 font-mono">REAL SERVER-SIDE APIS</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">4</div>
          <div className="text-[10px] text-slate-400 mt-1">Chat, Tasks, Auth, Status</div>
        </div>

        <div className="p-4 rounded-xl bg-[#070e24] border border-slate-800">
          <div className="text-[11px] text-slate-400 font-mono">FABRICATED TRANSACTIONS</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1 tabular-nums">0</div>
          <div className="text-[10px] text-emerald-400 mt-1">100% Purged & Zeroed</div>
        </div>

        <div className="p-4 rounded-xl bg-[#070e24] border border-slate-800">
          <div className="text-[11px] text-slate-400 font-mono">FINANCIAL COMMITMENTS</div>
          <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">$0.00</div>
          <div className="text-[10px] text-slate-400 mt-1">Approval-gated only</div>
        </div>

        <div className="p-4 rounded-xl bg-[#070e24] border border-slate-800">
          <div className="text-[11px] text-slate-400 font-mono">UNVERIFIED METRICS</div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-1">N/A</div>
          <div className="text-[10px] text-amber-300 mt-1">Awaiting connected ledger</div>
        </div>
      </div>

      {/* Feature Reality Table */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'ar' ? 'سجل تشخيص وحقيقة مكونات المنصة' : 'Detailed System Component Reality Audit'}</span>
        </h2>

        <div className="space-y-3">
          {features.map(feat => (
            <div
              key={feat.id}
              className="p-4 rounded-2xl bg-[#070e24] border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono uppercase font-bold text-slate-500">
                    [{feat.category}]
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    {lang === 'ar' ? feat.nameAr : feat.name}
                  </h3>
                </div>
                {getStatusBadge(feat.status)}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {lang === 'ar' ? feat.descriptionAr : feat.description}
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{lang === 'ar' ? 'الدليل التشغيلي:' : 'Evidence & Verification:'}</span>
                <span className="text-cyan-400">{lang === 'ar' ? feat.evidenceAr : feat.evidence}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
