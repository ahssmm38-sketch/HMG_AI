import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Crown, 
  Check, 
  X, 
  Lock, 
  FileText, 
  AlertTriangle, 
  Search, 
  ExternalLink,
  Hash,
  Sliders
} from 'lucide-react';
import { Language, RolePermissionTier, AuditLog } from '../types';
import { translations } from '../i18n/translations';

interface RolePermissionsProps {
  lang: Language;
  permissions: RolePermissionTier[];
  auditLogs: AuditLog[];
}

export const RolePermissions: React.FC<RolePermissionsProps> = ({
  lang,
  permissions,
  auditLogs
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'matrix' | 'audit'>('matrix');
  const [auditSearch, setAuditSearch] = useState('');
  const [tiers, setTiers] = useState<RolePermissionTier[]>(permissions);

  const filteredLogs = auditLogs.filter(l => 
    l.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
    l.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    l.actionAr.includes(auditSearch) ||
    l.hash.includes(auditSearch)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>{t.permissionsTitle}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.permissionsSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'matrix'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'مصفوفة الصلاحيات' : 'Authority Matrix'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.navAudit}
          </button>
        </div>
      </div>

      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Sovereign Guarantee Callout */}
          <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 text-xs flex items-start gap-3">
            <Crown className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-sm">
                {lang === 'ar' ? 'مبدأ السيادة المطلقة للمالك' : 'First Principle: The Owner Holds Absolute Command'}
              </div>
              <p className="text-slate-300 mt-1 leading-relaxed">
                {lang === 'ar'
                  ? 'تم تصميم بنية HMG AI بحيث لا يمكن لأي ذكاء اصطناعي ذاتي — بما في ذلك الرئيس التنفيذي الذكي — تجاوز قرارات المالك أو ترقية النماذج أو المساس بالخزينة بشكل منفرد. يتم توثيق أي محاولة انتهاك فوراً في السجل المشفر.'
                  : 'HMG AI’s architecture guarantees that no autonomous model, including the AI CEO, can override Owner directives, deploy unvetted models, or unilaterally liquidate treasury assets. All escalation attempts are cryptographically checked.'}
              </p>
            </div>
          </div>

          {/* RBAC Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map(tier => {
              const isOwner = tier.tier === 0;

              return (
                <div
                  key={tier.tier}
                  className={`rounded-2xl p-5 border flex flex-col justify-between space-y-4 ${
                    isOwner
                      ? 'bg-gradient-to-b from-cyan-950/40 to-[#070e24] border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                      : 'bg-[#070e24] border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isOwner ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-cyan-400 border border-slate-800'
                      }`}>
                        TIER {tier.tier}
                      </span>
                      {isOwner && <Crown className="w-4 h-4 text-amber-400" />}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {lang === 'ar' ? tier.titleAr : tier.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {lang === 'ar' ? tier.descriptionAr : tier.description}
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <div className="text-[10px] text-slate-400 font-mono uppercase">{t.spendingLimit}</div>
                      <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5 tabular-nums">
                        {tier.spendingLimitUSD >= 100000000 
                          ? (lang === 'ar' ? 'سلطة غير محدودة' : 'Unlimited Authority') 
                          : `$${tier.spendingLimitUSD.toLocaleString()}`}
                      </div>
                    </div>

                    {/* Permissions checklist */}
                    <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">{t.productionDeployPerm}</span>
                        {tier.canDeployProduction ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">{t.signContractsPerm}</span>
                        {tier.canSignContracts ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">{t.haltSwarmPerm}</span>
                        {tier.canHaltSwarm ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">{t.modifyGuardrailsPerm}</span>
                        {tier.canModifySafetyGuardrails ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">{t.disburseTreasuryPerm}</span>
                        {tier.canDisburseTreasury ? (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-slate-600 shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                    {isOwner ? 'CONSTITUTIONALLY SUPREME' : 'STRICT ENFORCEMENT ACTIVE'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tamper-evident Audit Logs View */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-cyan-400" />
                <span>{t.auditLogsTitle}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.auditLogsSubtitle}
              </p>
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search actor, action, or SHA-256 hash..."
                className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="rounded-2xl bg-[#070e24] border border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Timestamp (UTC)</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Action Summary</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 font-mono">Proof Hash</th>
                    <th className="py-3 px-4">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                        {log.actor}
                      </td>
                      <td className="py-3.5 px-4 leading-relaxed max-w-md">
                        {lang === 'ar' ? log.actionAr : log.action}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                          {log.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {log.hash}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>VERIFIED</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
