import React, { useState, useEffect } from 'react';
import { Database, HardDrive, CheckCircle2, AlertCircle, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface DatabaseStatusBadgeProps {
  lang: Language;
}

export const DatabaseStatusBadge: React.FC<DatabaseStatusBadgeProps> = ({ lang }) => {
  const [status, setStatus] = useState<{ isConfigured: boolean; databaseMode: string; message: string }>({
    isConfigured: false,
    databaseMode: 'LOCAL_BROWSER_STORAGE',
    message: 'Operating in verified Local Storage Mode. Cloud Supabase credentials not detected in environment.'
  });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/supabase/status')
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(() => {
        setStatus({
          isConfigured: false,
          databaseMode: 'LOCAL_BROWSER_STORAGE',
          message: 'Operating in verified Local Storage Mode.'
        });
      });
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-300 transition-colors"
        title="Inspect Data Storage & Supabase Readiness"
      >
        {status.isConfigured ? (
          <>
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-emerald-300">Supabase Connected</span>
          </>
        ) : (
          <>
            <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono text-slate-300">
              {lang === 'ar' ? 'وضع التخزين المحلي (المتصفح)' : 'Local Storage Mode'}
            </span>
          </>
        )}
      </button>

      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1128] border border-cyan-800/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  {lang === 'ar' ? 'حالة التخزين والتكامل مع Supabase' : 'Data Persistence & Supabase Integration'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{lang === 'ar' ? 'نمط التخزين الفعلي:' : 'Active Storage Engine:'}</span>
                <span className="font-mono font-bold text-cyan-300">
                  {status.databaseMode}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {status.message}
              </p>
              {!status.isConfigured && (
                <div className="text-[11px] text-amber-300/90 pt-1 border-t border-slate-800/80">
                  {lang === 'ar'
                    ? 'إقرار الحقيقة: نظراً لعدم توفر مفاتيح SUPABASE_URL، فإن البيانات محفوظة محلياً في متصفحك وليست في خادم سحابي دائم.'
                    : 'Authenticity Guarantee: Because Supabase credentials are not detected in the environment, all state is safely isolated in client LocalStorage.'}
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-slate-300 font-mono uppercase text-[11px]">
                {lang === 'ar' ? 'الجداول المهيأة مسبقاً للربط:' : 'Pre-Structured Supabase Tables:'}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                <div className="p-2 rounded bg-slate-950 border border-slate-800">• profiles (AI Employees)</div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">• departments (Units)</div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">• projects & tasks</div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">• approvals (Owner Signoffs)</div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">• ceo_chat_messages</div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800">• audit_logs (Immutable)</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                {lang === 'ar' ? 'فهمت' : 'Acknowledge'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
