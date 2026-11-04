import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Sliders, 
  Check, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Language, Department, AIEmployee } from '../types';
import { translations } from '../i18n/translations';

interface DepartmentsManagementProps {
  lang: Language;
  departments: Department[];
  employees: AIEmployee[];
  onUpdateBudget: (deptId: string, newAllocatedUSD: number) => void;
  onOpenEmployeeModal: (emp: AIEmployee) => void;
}

export const DepartmentsManagement: React.FC<DepartmentsManagementProps> = ({
  lang,
  departments,
  employees,
  onUpdateBudget,
  onOpenEmployeeModal
}) => {
  const t = translations[lang];
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [newBudgetVal, setNewBudgetVal] = useState<number>(0);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  const startEdit = (dept: Department) => {
    setEditingDeptId(dept.id);
    setNewBudgetVal(dept.allocatedBudgetUSD);
  };

  const handleSaveBudget = (deptId: string) => {
    onUpdateBudget(deptId, newBudgetVal);
    setEditingDeptId(null);
    setSavedSuccess(lang === 'ar' ? 'تم تحديث الميزانية بنجاح وتوثيقها في سجل التدقيق' : 'Budget updated and recorded in audit trail');
    setTimeout(() => setSavedSuccess(null), 3500);
  };

  const totalAllocated = departments.reduce((acc, d) => acc + d.allocatedBudgetUSD, 0);
  const totalSpent = departments.reduce((acc, d) => acc + d.spentBudgetUSD, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>{t.departmentsTitle}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.departmentsSubtitle}
          </p>
        </div>

        {/* Global Summary */}
        <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400">{lang === 'ar' ? 'إجمالي الميزانيات:' : 'Total Allocated:'} </span>
            <span className="font-mono font-bold text-white tabular-nums">${totalAllocated.toLocaleString()}</span>
          </div>
          <span className="text-slate-700">|</span>
          <div>
            <span className="text-slate-400">{lang === 'ar' ? 'إجمالي الصرف:' : 'Total Spent:'} </span>
            <span className="font-mono font-bold text-cyan-400 tabular-nums">${totalSpent.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 shadow-lg">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map(dept => {
          const head = employees.find(e => e.id === dept.headEmployeeId);
          const percentSpent = Math.min(100, Math.round((dept.spentBudgetUSD / dept.allocatedBudgetUSD) * 100));
          const isEditing = editingDeptId === dept.id;

          return (
            <div
              key={dept.id}
              className="rounded-2xl bg-[#070e24] border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4 shadow-sm"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                      {dept.code}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-1.5">
                      {lang === 'ar' ? dept.nameAr : dept.name}
                    </h3>
                  </div>

                  <div className="text-right rtl:text-left">
                    <span className="text-xs font-mono font-bold text-cyan-400 tabular-nums">
                      {dept.efficiencyScore}%
                    </span>
                    <div className="text-[9px] text-slate-500 uppercase font-mono">
                      {lang === 'ar' ? 'مؤشر الكفاءة' : 'EFFICIENCY'}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {lang === 'ar' ? dept.descriptionAr : dept.description}
                </p>

                {/* Head of Department Pill */}
                {head && (
                  <div 
                    onClick={() => onOpenEmployeeModal(head)}
                    className="mt-3 p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {head.avatar ? (
                        <img
                          src={head.avatar}
                          alt={head.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-cyan-800 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          {head.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {lang === 'ar' ? head.nameAr : head.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {lang === 'ar' ? 'قائد القطاع' : 'Department Lead AI'}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono shrink-0">→</span>
                  </div>
                )}
              </div>

              {/* Metrics & Budget */}
              <div className="pt-3 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.agentCapacity}</span>
                  </span>
                  <span className="font-mono font-bold text-slate-200 tabular-nums">
                    {dept.agentCount} {lang === 'ar' ? 'وكيل' : 'agents'}
                  </span>
                </div>

                {/* Budget Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">
                      ${dept.spentBudgetUSD.toLocaleString()} / ${dept.allocatedBudgetUSD.toLocaleString()}
                    </span>
                    <span className="text-slate-300 font-bold">{percentSpent}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-1.5 rounded-full ${
                        percentSpent > 85 ? 'bg-amber-400' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${percentSpent}%` }}
                    />
                  </div>
                </div>

                {/* Reallocation Slider / Button */}
                {isEditing ? (
                  <div className="p-3 rounded-xl bg-slate-950 border border-cyan-800/60 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-cyan-400 font-medium">
                        {lang === 'ar' ? 'تعديل ميزانية القسم:' : 'Set Budget:'}
                      </span>
                      <span className="font-mono font-bold text-white tabular-nums">
                        ${newBudgetVal.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={200000}
                      max={4000000}
                      step={50000}
                      value={newBudgetVal}
                      onChange={(e) => setNewBudgetVal(Number(e.target.value))}
                      className="w-full accent-cyan-500"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingDeptId(null)}
                        className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        {t.cancel}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveBudget(dept.id)}
                        className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-lg"
                      >
                        {t.save}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startEdit(dept)}
                    className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{t.reallocateBudget}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
