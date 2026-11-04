import { Shield, Bell, AlertTriangle, Globe, Menu, X, Power } from 'lucide-react';
import { Language, NavTab, NotificationItem } from '../types';
import { translations } from '../i18n/translations';
import { DatabaseStatusBadge } from './DatabaseStatusBadge';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  isEmergencyHalted: boolean;
  onToggleEmergencyHalt: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  pendingApprovalsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  activeTab,
  onSelectTab,
  notifications,
  onOpenNotifications,
  isEmergencyHalted,
  onToggleEmergencyHalt,
  mobileMenuOpen,
  onToggleMobileMenu,
  pendingApprovalsCount
}) => {
  const t = translations[lang];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#030712]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single element brand wordmark with mobile trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            type="button"
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button 
            type="button"
            onClick={() => onSelectTab('owner')}
            className="flex items-center gap-2 text-left rtl:text-right group focus-visible:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/30">
              <span className="font-bold text-white text-base tracking-wider font-mono">HMG</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  {lang === 'ar' ? 'HMG للذكاء الاصطناعي' : 'HMG AI'}
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  Global
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-[200px]">
                {t.brandTagline}
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Authority status & Quick context */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
            <div className="w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-cyan-400/20" />
            <span className="text-slate-300 font-medium">{t.currentRole}</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-400 font-mono text-[11px] font-semibold">{t.roleTier}</span>
          </div>

          <DatabaseStatusBadge lang={lang} />

          {pendingApprovalsCount > 0 && (
            <button
              type="button"
              onClick={() => onSelectTab('owner')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs hover:bg-amber-500/20 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-semibold tabular-nums">{pendingApprovalsCount}</span>
              <span>{t.statPendingApprovals}</span>
            </button>
          )}
        </div>

        {/* Zone 3: Global Actions (Emergency halt, Notifications, Language) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500"
            title={lang === 'en' ? 'التحويل إلى العربية' : 'Switch to English'}
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold uppercase tracking-wider">{lang === 'en' ? 'العربية' : 'EN'}</span>
          </button>

          {/* Notifications Trigger */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500"
            aria-label={t.notifications}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 flex items-center justify-center ring-2 ring-[#030712] tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Emergency Swarm Halt (Owner Tier 0 Capability) */}
          <button
            type="button"
            onClick={onToggleEmergencyHalt}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030712] ${
              isEmergencyHalted 
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/40 ring-2 ring-rose-400' 
                : 'bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 hover:text-rose-100'
            }`}
          >
            <Power className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">
              {isEmergencyHalted ? t.resumeSwarm : t.emergencyHalt}
            </span>
            <span className="sm:hidden font-mono">
              {isEmergencyHalted ? 'HALTED' : 'HALT'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
