import React, { useState } from 'react';
import { 
  Kanban, 
  ListChecks, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  DollarSign, 
  User,
  ArrowRight,
  X,
  Play,
  RotateCw,
  StopCircle,
  FileText
} from 'lucide-react';
import { 
  Language, 
  Project, 
  Task, 
  AIEmployee, 
  Department, 
  TaskStatus, 
  PriorityLevel 
} from '../types';
import { translations } from '../i18n/translations';

interface ProjectsAndTasksProps {
  lang: Language;
  projects: Project[];
  tasks: Task[];
  employees: AIEmployee[];
  departments: Department[];
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onRunTask: (taskId: string) => Promise<void>;
  onStopTask: (taskId: string) => void;
  isEmergencyHalted: boolean;
  onSelectTab: (tab: any) => void;
}

export const ProjectsAndTasks: React.FC<ProjectsAndTasksProps> = ({
  lang,
  projects,
  tasks,
  employees,
  departments,
  onUpdateTaskStatus,
  onAddTask,
  onRunTask,
  onStopTask,
  isEmergencyHalted,
  onSelectTab
}) => {
  const t = translations[lang];
  const [activeSubTab, setActiveSubTab] = useState<'kanban' | 'portfolio'>('kanban');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('all');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskTitleAr, setNewTaskTitleAr] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState(projects[0]?.id || 'proj-1');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState(employees[0]?.id || 'emp-1');
  const [newTaskPriority, setNewTaskPriority] = useState<PriorityLevel>('high');
  const [newTaskRequiresSignoff, setNewTaskRequiresSignoff] = useState(false);

  const filteredTasks = tasks.filter(task => {
    if (selectedDeptFilter === 'all') return true;
    const project = projects.find(p => p.id === task.projectId);
    return project?.departmentId === selectedDeptFilter;
  });

  // Strict integrity states: REQUIRES_OWNER_APPROVAL, PLANNED, RUNNING, COMPLETED, FAILED/CANCELLED
  const columns: { id: TaskStatus; labelEn: string; labelAr: string; count: number }[] = [
    { id: 'REQUIRES_OWNER_APPROVAL', labelEn: 'Requires Owner Signoff', labelAr: 'معلق لاعتماد المالك', count: filteredTasks.filter(t => t.status === 'REQUIRES_OWNER_APPROVAL').length },
    { id: 'PLANNED', labelEn: 'Planned & Ready', labelAr: 'مخطط وجاهز للتنفيذ', count: filteredTasks.filter(t => t.status === 'PLANNED').length },
    { id: 'RUNNING', labelEn: 'Running Inference', labelAr: 'قيد التنفيذ الفعلي', count: filteredTasks.filter(t => t.status === 'RUNNING').length },
    { id: 'COMPLETED', labelEn: 'Completed & Verified', labelAr: 'مكتمل وموثق', count: filteredTasks.filter(t => t.status === 'COMPLETED').length },
    { id: 'FAILED', labelEn: 'Failed / Cancelled', labelAr: 'فشل / ملغى بأمان', count: filteredTasks.filter(t => t.status === 'FAILED' || t.status === 'CANCELLED').length }
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      projectId: newTaskProjectId,
      title: newTaskTitle,
      titleAr: newTaskTitleAr || newTaskTitle,
      assignedToId: newTaskAssignedTo,
      status: newTaskRequiresSignoff ? 'REQUIRES_OWNER_APPROVAL' : 'PLANNED',
      priority: newTaskPriority,
      computeCostUSD: 1500,
      requiresOwnerSignoff: newTaskRequiresSignoff,
      dueDate: '2026-11-20'
    });

    setNewTaskTitle('');
    setNewTaskTitleAr('');
    setIsNewTaskModalOpen(false);
  };

  const handleExecute = async (taskId: string) => {
    setRunningTaskId(taskId);
    await onRunTask(taskId);
    setRunningTaskId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with Subtabs & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Kanban className="w-5 h-5 text-cyan-400" />
            <span>{t.projectsTitle}</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t.projectsSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Subtab Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveSubTab('kanban')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeSubTab === 'kanban'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.tasksTab}
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('portfolio')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeSubTab === 'portfolio'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.projectsTab}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsNewTaskModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addNewTask}</span>
          </button>
        </div>
      </div>

      {isEmergencyHalted && (
        <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800/80 text-xs text-rose-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            {lang === 'ar'
              ? 'تجميد الطوارئ نشط: لا يمكن بدء تنفيذ مهام جديدة أو الترقية للإنتاج حتى استئناف العمليات من قبل المالك.'
              : 'Emergency Halt Active: New task execution and production promotions are frozen until resumed by the Owner.'}
          </span>
        </div>
      )}

      {/* Kanban View */}
      {activeSubTab === 'kanban' && (
        <div className="space-y-4">
          {/* Department Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>{t.department}:</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedDeptFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  selectedDeptFilter === 'all'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {t.filterAll}
              </button>
              {departments.map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDeptFilter(d.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    selectedDeptFilter === d.id
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {lang === 'ar' ? d.nameAr : d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Kanban Columns Grid (5 State Columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {columns.map(col => {
              const colTasks = filteredTasks.filter(t => 
                col.id === 'FAILED' 
                  ? (t.status === 'FAILED' || t.status === 'CANCELLED') 
                  : t.status === col.id
              );
              return (
                <div
                  key={col.id}
                  className="rounded-2xl bg-[#060c1d] border border-slate-800/80 p-3 flex flex-col min-h-[500px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
                    <h3 className="text-xs font-bold text-slate-200">
                      {lang === 'ar' ? col.labelAr : col.labelEn}
                    </h3>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-slate-900 text-slate-400 border border-slate-800 tabular-nums">
                      {col.count}
                    </span>
                  </div>

                  {/* Tasks Cards */}
                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {colTasks.length === 0 ? (
                      <div className="text-center py-10 text-slate-600 text-xs font-mono">
                        No tasks
                      </div>
                    ) : (
                      colTasks.map(task => {
                        const assignedEmployee = employees.find(e => e.id === task.assignedToId);
                        const parentProject = projects.find(p => p.id === task.projectId);
                        const isExecuting = runningTaskId === task.id;

                        return (
                          <div
                            key={task.id}
                            className="p-3 rounded-xl bg-[#0a1128] border border-slate-800 hover:border-slate-700 transition-all space-y-2.5 shadow-sm group"
                          >
                            {/* Project & Priority */}
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] text-cyan-400 font-mono truncate max-w-[130px]">
                                {lang === 'ar' ? parentProject?.titleAr : parentProject?.title}
                              </span>
                              <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${
                                task.priority === 'critical'
                                  ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                                  : task.priority === 'high'
                                  ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}>
                                {task.priority}
                              </span>
                            </div>

                            {/* Title */}
                            <h4 className="text-xs font-bold text-white leading-snug">
                              {lang === 'ar' ? task.titleAr : task.title}
                            </h4>

                            {/* Sensitivity Flag */}
                            {task.requiresOwnerSignoff && (
                              <div className="flex items-center gap-1.5 text-[10px] text-amber-300 font-medium bg-amber-950/30 border border-amber-800/40 px-2 py-1 rounded-lg">
                                <ShieldAlert className="w-3 h-3 shrink-0" />
                                <span>{t.requiresApproval}</span>
                              </div>
                            )}

                            {/* Actual Execution Evidence for Completed Tasks */}
                            {task.evidence && (
                              <div className="p-2 rounded-lg bg-slate-950/90 border border-emerald-800/50 text-[10px] text-slate-300 space-y-1">
                                <div className="flex items-center justify-between text-emerald-400 font-mono font-bold">
                                  <span>VERIFIED ({task.evidence.execution_time_ms}ms)</span>
                                  <span className="text-[9px] truncate max-w-[80px]">{task.evidence.verification_hash}</span>
                                </div>
                                <p className="leading-relaxed">
                                  {lang === 'ar' ? task.evidence.summaryAr : task.evidence.summary}
                                </p>
                                <div className="text-[9px] text-slate-400 font-mono flex items-center justify-between pt-1 border-t border-slate-800">
                                  <span>{task.evidence.service_or_tool_used}</span>
                                  <span className="text-emerald-400">{task.evidence.actual_cost}</span>
                                </div>
                              </div>
                            )}

                            {task.errorReason && (
                              <div className="p-2 rounded bg-rose-950/40 border border-rose-800/50 text-[10px] text-rose-300">
                                {task.errorReason}
                              </div>
                            )}

                            {/* Assigned Employee & Actions */}
                            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-1.5 truncate">
                                {assignedEmployee?.avatar ? (
                                  <img
                                    src={assignedEmployee.avatar}
                                    alt={assignedEmployee.name}
                                    referrerPolicy="no-referrer"
                                    className="w-5 h-5 rounded-full object-cover shrink-0"
                                  />
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-cyan-800 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                                    {assignedEmployee?.name.substring(0, 1)}
                                  </div>
                                )}
                                <span className="text-slate-400 truncate">
                                  {lang === 'ar' ? assignedEmployee?.nameAr : assignedEmployee?.name}
                                </span>
                              </div>

                              {/* Interactive Execution Controls */}
                              {col.id === 'PLANNED' && (
                                <button
                                  type="button"
                                  disabled={isExecuting || isEmergencyHalted}
                                  onClick={() => handleExecute(task.id)}
                                  className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1 disabled:opacity-40"
                                >
                                  {isExecuting ? <RotateCw className="w-2.5 h-2.5 animate-spin" /> : <Play className="w-2.5 h-2.5" />}
                                  <span>{lang === 'ar' ? 'تشغيل' : 'Run'}</span>
                                </button>
                              )}

                              {col.id === 'RUNNING' && (
                                <button
                                  type="button"
                                  onClick={() => onStopTask(task.id)}
                                  className="px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800 text-[10px] font-bold flex items-center gap-1"
                                >
                                  <StopCircle className="w-2.5 h-2.5" />
                                  <span>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</span>
                                </button>
                              )}

                              {col.id === 'REQUIRES_OWNER_APPROVAL' && (
                                <button
                                  type="button"
                                  onClick={() => onSelectTab('owner')}
                                  className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1"
                                >
                                  <ShieldAlert className="w-2.5 h-2.5" />
                                  <span>{lang === 'ar' ? 'اعتماد' : 'Review'}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projects Portfolio View */}
      {activeSubTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map(proj => {
              const lead = employees.find(e => e.id === proj.leadEmployeeId);
              const dept = departments.find(d => d.id === proj.departmentId);

              return (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-[#070e24] border border-slate-800 p-5 space-y-4 hover:border-slate-700 transition-all shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400">
                        {lang === 'ar' ? dept?.nameAr : dept?.name}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1">
                        {lang === 'ar' ? proj.titleAr : proj.title}
                      </h3>
                    </div>

                    <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border shrink-0 ${
                      proj.status === 'completed'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                        : proj.status === 'pending_approval'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800'
                        : 'bg-cyan-950/60 text-cyan-300 border-cyan-800'
                    }`}>
                      {proj.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {lang === 'ar' ? proj.descriptionAr : proj.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">{t.progress}</span>
                      <span className="text-cyan-400 font-bold tabular-nums">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="text-slate-400">
                      <span>{t.lead}: </span>
                      <span className="text-white font-medium">
                        {lang === 'ar' ? lead?.nameAr : lead?.name}
                      </span>
                    </div>
                    <div className="font-mono text-slate-300 font-semibold tabular-nums">
                      ${proj.spentUSD.toLocaleString()} / ${proj.budgetUSD.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create New Task Directive Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a1128] border border-cyan-800/60 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{t.addNewTask}</h3>
              <button
                type="button"
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {lang === 'ar' ? 'عنوان المهمة (إنجليزي)' : 'Directive Title (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Run 128k context stress benchmarks..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {lang === 'ar' ? 'عنوان المهمة (عربي)' : 'Directive Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={newTaskTitleAr}
                  onChange={(e) => setNewTaskTitleAr(e.target.value)}
                  placeholder="مثال: تنفيذ اختبارات المعايرة بسياق 128 ألف رمز..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">{t.assignTo}</label>
                  <select
                    value={newTaskAssignedTo}
                    onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {lang === 'ar' ? emp.nameAr : emp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">{t.priority}</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Standard</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="reqOwner"
                  checked={newTaskRequiresSignoff}
                  onChange={(e) => setNewTaskRequiresSignoff(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500"
                />
                <label htmlFor="reqOwner" className="text-slate-300 cursor-pointer">
                  {lang === 'ar' ? 'يتطلب توقيع المالك قبل التنفيذ النهائي' : 'Requires Owner Signoff Prior to Execution'}
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-3.5 py-2 text-slate-400 hover:text-white"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition-colors"
                >
                  {t.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
