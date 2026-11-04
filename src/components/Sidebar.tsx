import React from 'react';
import { 
  Crown, 
  Cpu, 
  Users, 
  Building2, 
  Kanban, 
  MessagesSquare, 
  BarChart3, 
  DollarSign, 
  ShieldCheck, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { Language, NavTab } from '../types';
import { translations } from '../i18n/translations';

interface SidebarProps {
  lang: Language;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingApprovalsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  lang,
  activeTab,
  onSelectTab,
  pendingApprovalsCount
}) => {
  const t = translations[lang];

  const navigationItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number; highlight?: boolean }[] = [
    { id: 'owner', label: t.navOwner, icon: Crown, badge: pendingApprovalsCount, highlight: true },
    { id: 'ceo', label: t.navCeo, icon: Cpu },
    { id: 'directory', label: t.navDirectory, icon: Users },
    { id: 'departments', label: t.navDepartments, icon: Building2 },
    { id: 'projects', label: t.navProjects, icon: Kanban },
    { id: 'meeting', label: t.navMeeting, icon: MessagesSquare },
    { id: 'analytics', label: t.navAnalytics, icon: BarChart3 },
    { id: 'finance', label: t.navFinance, icon: DollarSign },
    { id: 'permissions', label: t.navPermissions, icon: ShieldCheck },
    { id: 'audit', label: t.navAudit, icon: FileText },
    { id: 'integrity', label: t.navIntegrity, icon: ShieldCheck }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-[#050b1a] border-r rtl:border-r-0 rtl:border-l border-slate-800/80 p-4 shrink-0 h-[calc(100vh-61px)] sticky top-[61px]">
      {/* Sovereign Governance Label */}
      <div className="px-3 py-2 mb-3 rounded-lg bg-cyan-950/30 border border-cyan-800/30">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 shrink-0" />
          <span>{lang === 'ar' ? 'السلطة العليا' : 'Supreme Oversight'}</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
          {t.authorityNotice}
        </p>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1">
        {navigationItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/50 text-cyan-300 border border-cyan-700/50 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                }`} />
                <span className="truncate whitespace-nowrap">{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 tabular-nums">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="mt-auto pt-3 border-t border-slate-800/80 text-[11px] text-slate-500">
        <div className="flex items-center justify-between font-mono text-[10px]">
          <span>STATUS: NOMINAL</span>
          <span className="text-cyan-400">8/8 CORES</span>
        </div>
        <div className="mt-1 text-slate-400 truncate">
          v4.8 Enterprise · Supabase Ready
        </div>
      </div>
    </aside>
  );
};
