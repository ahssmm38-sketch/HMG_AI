import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldAlert, Cpu, Check } from 'lucide-react';
import { Language, NotificationItem } from '../types';
import { translations } from '../i18n/translations';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectApproval: (approvalId: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  lang,
  notifications,
  onMarkAllRead,
  onSelectApproval
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="absolute inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-md bg-[#0a1128] border-l rtl:border-l-0 rtl:border-r border-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">{t.notificationsTitle}</h2>
              <p className="text-xs text-slate-400">
                {notifications.filter(n => !n.read).length} {t.pendingCount}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 rounded hover:bg-slate-800/60"
              >
                {t.markAllRead}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No notifications recorded
              </div>
            ) : (
              notifications.map(notif => {
                const getIcon = () => {
                  switch (notif.type) {
                    case 'approval':
                      return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
                    case 'security':
                      return <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />;
                    case 'milestone':
                      return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
                    default:
                      return <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />;
                  }
                };

                return (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border transition-all ${
                      notif.read
                        ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                        : 'bg-slate-900/90 border-slate-700/80 text-slate-200 shadow-sm ring-1 ring-cyan-500/10'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {getIcon()}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-semibold text-white truncate">
                            {lang === 'ar' ? notif.titleAr : notif.title}
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {lang === 'ar' ? notif.messageAr : notif.message}
                        </p>

                        {notif.actionRequired && notif.approvalId && (
                          <div className="mt-2.5 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                onSelectApproval(notif.approvalId!);
                                onClose();
                              }}
                              className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-semibold transition-colors"
                            >
                              {lang === 'ar' ? 'مراجعة واعتماد المالك' : 'Review & Authorize'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
