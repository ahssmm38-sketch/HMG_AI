import React from 'react';
import { Crown, Cpu, Users, Kanban, MessagesSquare, Menu } from 'lucide-react';
import { Language, NavTab } from '../types';
import { translations } from '../i18n/translations';

interface MobileBottomNavProps {
  lang: Language;
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenFullMenu: () => void;
  pendingApprovalsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  lang,
  activeTab,
  onSelectTab,
  onOpenFullMenu,
  pendingApprovalsCount
}) => {
  const t = translations[lang];

  const primaryMobileTabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'owner', label: lang === 'ar' ? 'المالك' : 'Owner', icon: Crown, badge: pendingApprovalsCount },
    { id: 'ceo', label: lang === 'ar' ? 'الرئيس' : 'CEO', icon: Cpu },
    { id: 'directory', label: lang === 'ar' ? 'الموظفون' : 'AI Team', icon: Users },
    { id: 'projects', label: lang === 'ar' ? 'المشاريع' : 'Projects', icon: Kanban },
    { id: 'meeting', label: lang === 'ar' ? 'المجلس' : 'Boardroom', icon: MessagesSquare },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#030712]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around safe-area-bottom">
      {primaryMobileTabs.map(item => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors min-w-[56px] ${
              isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-amber-500 text-[9px] font-bold text-slate-950 flex items-center justify-center ring-1 ring-[#030712] tabular-nums">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 whitespace-nowrap">{item.label}</span>
          </button>
        );
      })}

      <button
        type="button"
        onClick={onOpenFullMenu}
        className="flex flex-col items-center justify-center py-1 px-2 rounded-lg text-slate-400 hover:text-slate-200 min-w-[56px]"
      >
        <Menu className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 whitespace-nowrap">{lang === 'ar' ? 'المزيد' : 'More'}</span>
      </button>
    </nav>
  );
};
