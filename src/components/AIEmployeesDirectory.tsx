import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  X,
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Language, AIEmployee } from '../types';
import { translations } from '../i18n/translations';

interface AIEmployeesDirectoryProps {
  lang: Language;
  employees: AIEmployee[];
  onSelectEmployee: (emp: AIEmployee) => void;
  selectedEmployee: AIEmployee | null;
  onCloseModal: () => void;
}

export const AIEmployeesDirectory: React.FC<AIEmployeesDirectoryProps> = ({
  lang,
  employees,
  onSelectEmployee,
  selectedEmployee,
  onCloseModal
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: string; text: string }[]>([]);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.nameAr.includes(searchQuery) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.roleAr.includes(searchQuery) ||
      emp.departmentName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDeptFilter === 'all' || emp.departmentId === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !selectedEmployee) return;

    const userText = chatMessage;
    setChatMessage('');
    setChatLog(prev => [...prev, { sender: 'Owner', text: userText }]);

    // Simulated executive response from this specific AI employee
    setTimeout(() => {
      let reply = '';
      if (lang === 'ar') {
        reply = `تم استلام توجيهكم يا صاحب السيادة. أنا (${selectedEmployee.nameAr}) أقوم فوراً بمعايرة الإجراءات ضمن صلاحياتي وإحالة أي متطلب حساس لموافقتكم الكريمة.`;
      } else {
        reply = `Directive acknowledged, Owner. As ${selectedEmployee.role}, I am synchronizing our autonomous routines to prioritize this directive within authorized guardrails.`;
      }
      setChatLog(prev => [...prev, { sender: selectedEmployee.name, text: reply }]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-5 h-5 text-cyan-400" />
            <span>{t.directoryTitle}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.directorySubtitle}
          </p>
        </div>

        {/* Search & Dept Selector */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.search}
              className="w-full text-xs bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 rtl:pl-3 rtl:pr-9 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={selectedDeptFilter}
            onChange={(e) => setSelectedDeptFilter(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">{t.filterAll}</option>
            <option value="dept-rd">{lang === 'ar' ? 'البحوث والذكاء العميق' : 'Deep Intelligence & R&D'}</option>
            <option value="dept-sales">{lang === 'ar' ? 'العمليات التجارية' : 'Commercial Operations'}</option>
            <option value="dept-eng">{lang === 'ar' ? 'الهندسة والبنية التحتية' : 'Engineering & Cloud'}</option>
            <option value="dept-fin">{lang === 'ar' ? 'المالية العامة' : 'Global Finance'}</option>
            <option value="dept-sec">{lang === 'ar' ? 'الأمن والحوكمة' : 'Security & Trust'}</option>
            <option value="dept-prod">{lang === 'ar' ? 'المنتجات وتجربة المستخدم' : 'Product & UX'}</option>
            <option value="dept-people">{lang === 'ar' ? 'إدارة الكفاءات والمواءمة' : 'Talent & Culture'}</option>
            <option value="dept-data">{lang === 'ar' ? 'البيانات وتدفقات المعرفة' : 'Big Data & Pipelines'}</option>
          </select>
        </div>
      </div>

      {/* 8 AI Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredEmployees.map(emp => {
          return (
            <div
              key={emp.id}
              onClick={() => onSelectEmployee(emp)}
              className="rounded-xl bg-[#070e24] border border-slate-800 hover:border-cyan-600/50 p-4 transition-all duration-200 flex flex-col justify-between cursor-pointer group hover:shadow-xl hover:shadow-cyan-950/20"
            >
              <div>
                {/* Avatar & Status */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="relative">
                    {emp.avatar ? (
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-xl object-cover ring-2 ring-cyan-500/30 group-hover:ring-cyan-400 transition-all"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-700 via-blue-800 to-slate-900 flex items-center justify-center text-white font-extrabold text-base ring-2 ring-cyan-500/30">
                        {emp.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 px-1.5 py-0.2 rounded bg-slate-950 text-[9px] font-mono text-cyan-400 border border-cyan-800/60">
                      {emp.seniority.includes('Principal') || emp.seniority.includes('Chief') ? 'EXEC' : 'LEAD'}
                    </div>
                  </div>

                  <div className="text-right rtl:text-left">
                    <span className="text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                      {emp.status}
                    </span>
                    <div className="text-[11px] font-mono font-bold text-cyan-400 mt-1 tabular-nums">
                      {emp.efficiencyRating}% {lang === 'ar' ? 'كفاءة' : 'EFF'}
                    </div>
                  </div>
                </div>

                {/* Name & Role */}
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {lang === 'ar' ? emp.nameAr : emp.name}
                  </h3>
                  <p className="text-xs text-cyan-400 font-medium mt-0.5 leading-snug">
                    {lang === 'ar' ? emp.roleAr : emp.role}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {lang === 'ar' ? emp.departmentNameAr : emp.departmentName}
                  </p>
                </div>

                {/* Current Autonomous Directive */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">
                    {lang === 'ar' ? 'المهمة الجارية' : 'Active Directive'}
                  </div>
                  <p className="text-[11px] text-slate-200 mt-0.5 line-clamp-2 leading-relaxed">
                    {lang === 'ar' ? emp.currentTaskAr : emp.currentTask}
                  </p>
                </div>
              </div>

              {/* Bottom Meta: Model Core & Threshold */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono text-[10px]">{t.modelArchitecture}</span>
                  <span className="text-slate-200 font-mono text-[10px] truncate max-w-[130px]" title={emp.modelCore}>
                    {emp.modelCore.split('-')[1] || emp.modelCore}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 text-[10px]">{t.decisionThreshold}</span>
                  <span className="text-amber-400 font-mono font-semibold text-[11px] tabular-nums">
                    ${emp.decisionThresholdUSD.toLocaleString()}
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 group-hover:border-cyan-600/40 text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>{t.viewProfile}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed AI Employee Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1128] border border-cyan-800/60 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5">
            {/* Close Button */}
            <button
              type="button"
              onClick={onCloseModal}
              className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-start gap-4">
              {selectedEmployee.avatar ? (
                <img
                  src={selectedEmployee.avatar}
                  alt={selectedEmployee.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover ring-2 ring-cyan-500/40 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-800 flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {selectedEmployee.name.substring(0, 2).toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">
                    {lang === 'ar' ? selectedEmployee.nameAr : selectedEmployee.name}
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                    {lang === 'ar' ? selectedEmployee.seniorityAr : selectedEmployee.seniority}
                  </span>
                </div>
                <p className="text-xs text-cyan-400 font-medium mt-0.5">
                  {lang === 'ar' ? selectedEmployee.roleAr : selectedEmployee.role} · {lang === 'ar' ? selectedEmployee.departmentNameAr : selectedEmployee.departmentName}
                </p>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  CORE: {selectedEmployee.modelCore}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300 leading-relaxed">
              {lang === 'ar' ? selectedEmployee.bioAr : selectedEmployee.bio}
            </div>

            {/* Governance & Owner Approval Trigger Conditions */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-600/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{t.governanceBoundaries}</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {lang === 'ar' 
                  ? `الحد المالي الذاتي: $${selectedEmployee.decisionThresholdUSD.toLocaleString()}. أي قرار يتجاوز هذا المبلغ أو يمس القرارات التالية يتطلب اعتماد المالك صراحة:` 
                  : `Autonomous Limit: $${selectedEmployee.decisionThresholdUSD.toLocaleString()}. Decisions beyond this amount or affecting the following require explicit Owner authorization:`}
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-amber-200/90 pl-1">
                {(lang === 'ar' ? selectedEmployee.requiresApprovalForAr : selectedEmployee.requiresApprovalFor).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Capabilities */}
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase font-mono mb-2">
                {lang === 'ar' ? 'القدرات التخصصية الأساسية' : 'Key Core Capabilities'}
              </div>
              <div className="flex flex-wrap gap-2">
                {(lang === 'ar' ? selectedEmployee.keyCapabilitiesAr : selectedEmployee.keyCapabilities).map((cap, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Sovereign Query / Directive Simulator */}
            <div className="pt-3 border-t border-slate-800/80 space-y-3">
              <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                <span>{lang === 'ar' ? 'استجواب أو توجيه مباشر من المالك' : 'Direct Owner Inquiry & Directive'}</span>
              </div>

              {chatLog.length > 0 && (
                <div className="max-h-36 overflow-y-auto space-y-2 p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                  {chatLog.map((c, i) => (
                    <div key={i} className={`flex flex-col ${c.sender === 'Owner' ? 'items-end' : 'items-start'}`}>
                      <span className="text-[9px] text-slate-500 font-mono mb-0.5">{c.sender}</span>
                      <div className={`p-2 rounded-lg max-w-[85%] ${
                        c.sender === 'Owner' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200'
                      }`}>
                        {c.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={lang === 'ar' ? 'اكتب أمراً أو استفساراً لهذا المسؤول الذكي...' : `Send direct directive to ${selectedEmployee.name}...`}
                  className="flex-1 text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  disabled={!chatMessage.trim()}
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-bold transition-colors"
                >
                  {lang === 'ar' ? 'إرسال' : 'Dispatch'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
