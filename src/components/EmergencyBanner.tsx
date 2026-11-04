import React from 'react';
import { AlertOctagon, Power, Play } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface EmergencyBannerProps {
  lang: Language;
  onEmergencyResume: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({ lang, onEmergencyResume }) => {
  const t = translations[lang];

  return (
    <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border-b border-rose-600/60 px-4 py-3 text-white shadow-xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-600 text-white shadow-md">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-wide flex items-center gap-2">
              <span>{t.emergencyActive}</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-rose-500/30 border border-rose-400">
                Tier 0 Veto Engaged
              </span>
            </div>
            <p className="text-xs text-rose-200 mt-0.5">
              {lang === 'ar' 
                ? 'تم إيقاف كافة مهام الاستدلال، ونشر النماذج، والتحويلات المالية تلقائياً بقرار المالك.' 
                : 'All autonomous model inference, code commits, and financial disbursements are frozen.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEmergencyResume}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-rose-50 text-rose-950 font-bold text-xs shadow-md transition-all whitespace-nowrap"
        >
          <Play className="w-4 h-4 text-rose-600 fill-rose-600" />
          <span>{t.resumeSwarm}</span>
        </button>
      </div>
    </div>
  );
};
