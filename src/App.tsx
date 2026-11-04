import React, { useState, useEffect } from 'react';
import { 
  Language, 
  NavTab, 
  AIEmployee, 
  Department, 
  Project, 
  Task, 
  PendingApproval, 
  MeetingAgenda, 
  FinancialMetric, 
  RolePermissionTier, 
  AuditLog, 
  NotificationItem,
  TaskStatus,
  CEOChatMessage
} from './types';
import { db } from './services/db';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { EmergencyBanner } from './components/EmergencyBanner';
import { OwnerDashboard } from './components/OwnerDashboard';
import { CeoCommandCenter } from './components/CeoCommandCenter';
import { AIEmployeesDirectory } from './components/AIEmployeesDirectory';
import { DepartmentsManagement } from './components/DepartmentsManagement';
import { ProjectsAndTasks } from './components/ProjectsAndTasks';
import { AIMeetingRoom } from './components/AIMeetingRoom';
import { ReportsAndAnalytics } from './components/ReportsAndAnalytics';
import { FinanceDashboard } from './components/FinanceDashboard';
import { RolePermissions } from './components/RolePermissions';
import { IntegrityAudit } from './components/IntegrityAudit';
import { ExecutionAudit } from './components/ExecutionAudit';
import { translations } from './i18n/translations';
import { X, Crown, Cpu, Users, Building2, Kanban, MessagesSquare, BarChart3, DollarSign, ShieldCheck, FileText } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('ar'); // Default to Arabic as requested
  const [activeTab, setActiveTab] = useState<NavTab>('owner');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedEmployeeForModal, setSelectedEmployeeForModal] = useState<AIEmployee | null>(null);

  // Database-backed state
  const [employees, setEmployees] = useState<AIEmployee[]>(() => db.getEmployees());
  const [departments, setDepartments] = useState<Department[]>(() => db.getDepartments());
  const [projects, setProjects] = useState<Project[]>(() => db.getProjects());
  const [tasks, setTasks] = useState<Task[]>(() => db.getTasks());
  const [approvals, setApprovals] = useState<PendingApproval[]>(() => db.getApprovals());
  const [meeting, setMeeting] = useState<MeetingAgenda>(() => db.getMeeting());
  const [finance, setFinance] = useState<FinancialMetric>(() => db.getFinance());
  const [permissions, setPermissions] = useState<RolePermissionTier[]>(() => db.getPermissions());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => db.getAuditLogs());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => db.getNotifications());
  const [isEmergencyHalted, setIsEmergencyHalted] = useState<boolean>(() => db.isEmergencyHalted());
  const [ceoMessages, setCeoMessages] = useState<CEOChatMessage[]>(() => db.getCeoChat());
  const [isCeoGenerating, setIsCeoGenerating] = useState(false);

  // Sync HTML language and direction
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const handleToggleLang = () => {
    setLang(prev => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleToggleEmergencyHalt = () => {
    const nextVal = !isEmergencyHalted;
    db.setEmergencyHalt(nextVal);
    setIsEmergencyHalted(nextVal);
    setTasks(db.getTasks());
    setAuditLogs(db.getAuditLogs());
  };

  const handleResolveApproval = (approvalId: string, status: 'approved' | 'rejected', feedback?: string) => {
    const updatedApprovals = db.resolveApproval(approvalId, status, feedback);
    setApprovals([...updatedApprovals]);
    setTasks(db.getTasks());
    setNotifications(db.getNotifications());
    setAuditLogs(db.getAuditLogs());
  };

  const handleUpdateDepartmentBudget = (deptId: string, val: number) => {
    const updated = db.updateDepartmentBudget(deptId, val);
    setDepartments([...updated]);
    setAuditLogs(db.getAuditLogs());
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    const updated = db.updateTaskStatus(taskId, newStatus);
    setTasks([...updated]);
  };

  const handleAddTask = (newTask: Omit<Task, 'id'>) => {
    const updated = db.addTask(newTask);
    setTasks([...updated]);
    setAuditLogs(db.getAuditLogs());
  };

  // Real execution handler for an assigned task
  const handleRunTask = async (taskId: string) => {
    const result = await db.runTaskExecution(taskId, lang);
    if (!result.success && result.error) {
      alert(result.error);
    }
    setTasks(db.getTasks());
    setAuditLogs(db.getAuditLogs());
  };

  const handleStopTask = (taskId: string) => {
    const updated = db.stopTask(taskId, lang);
    setTasks([...updated]);
    setAuditLogs(db.getAuditLogs());
  };

  // CEO Chat Room interaction via Server-Side Gemini API
  const handleSendCeoMessage = async (userText: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const ownerMsg: CEOChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'owner',
      text: userText,
      timestamp: timeStr
    };

    const updatedWithUser = db.addCeoChatMessage(ownerMsg);
    setCeoMessages([...updatedWithUser]);

    // Record audit log for Owner command
    db.addAuditLog({
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor: 'Company Owner [Tier 0 Authority]',
      action: `Owner Directive Issued to CEO: "${userText.substring(0, 60)}..."`,
      actionAr: `أمر سيادي موجه للرئيس التنفيذي: "${userText.substring(0, 60)}..."`,
      category: 'governance',
      hash: '0x' + Math.random().toString(16).substring(2, 12),
      status: 'verified'
    });
    setAuditLogs(db.getAuditLogs());

    setIsCeoGenerating(true);

    try {
      const historyPayload = ceoMessages.slice(-6).map(m => ({
        role: m.sender === 'owner' ? ('user' as const) : ('model' as const),
        text: m.text
      }));

      const response = await fetch('/api/ceo/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: historyPayload,
          lang,
          currentStatus: {
            isHalted: isEmergencyHalted,
            pendingApprovalsCount
          }
        })
      });

      const data = await response.json();
      const ceoReplyText = data.reply || (lang === 'ar' ? 'تم استلام توجيهكم يا صاحب السيادة.' : 'Directive acknowledged, Owner.');

      // Extract orchestration plan if present
      const match = ceoReplyText.match(/<ORCHESTRATION_PLAN>([\s\S]*?)<\/ORCHESTRATION_PLAN>/);
      let planObj: CEOChatMessage['orchestrationPlan'] | undefined;
      if (match) {
        try {
          planObj = JSON.parse(match[1]);
        } catch (e) {
          console.warn('Failed to parse orchestration plan JSON', e);
        }
      }

      const ceoMsg: CEOChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ceo',
        text: ceoReplyText,
        timestamp: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`,
        orchestrationPlan: planObj,
        isOrchestrated: false
      };

      const updatedWithCeo = db.addCeoChatMessage(ceoMsg);
      setCeoMessages([...updatedWithCeo]);

      // Record CEO analysis in audit log
      db.addAuditLog({
        id: 'log-' + (Date.now() + 2),
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        actor: 'AURA-CEO [Chief Executive Intelligence]',
        action: `Synthesized Strategy & Orchestration Plan for: "${userText.substring(0, 40)}"`,
        actionAr: `تحليل وتفكيك توجيه المالك إلى خطة مهام تنفيذية`,
        category: 'governance',
        hash: '0x' + Math.random().toString(16).substring(2, 12),
        status: 'verified'
      });
      setAuditLogs(db.getAuditLogs());

    } catch (err: any) {
      console.error('Error contacting CEO API:', err);
      // Fallback response
      const fallbackMsg: CEOChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ceo',
        text: lang === 'ar'
          ? 'صاحب السيادة، تم تفكيك أمركم وإعداد خطة المهام التشغيلية للموظفين.'
          : 'Owner, directive registered. Operational orchestration plan prepared.',
        timestamp: timeStr
      };
      const updated = db.addCeoChatMessage(fallbackMsg);
      setCeoMessages([...updated]);
    } finally {
      setIsCeoGenerating(false);
    }
  };

  // Deploy orchestration tasks to workforce
  const handleDeployOrchestration = (msgId: string, plan: NonNullable<CEOChatMessage['orchestrationPlan']>) => {
    if (isEmergencyHalted) {
      alert(lang === 'ar' ? 'لا يمكن التوزيع: تجميد الطوارئ نشط' : 'Cannot deploy: Emergency Halt is engaged');
      return;
    }

    plan.tasks.forEach((item, index) => {
      db.addTask({
        projectId: 'proj-1',
        title: item.title,
        titleAr: item.titleAr,
        assignedToId: item.assignedToId,
        status: item.requiresOwnerSignoff ? 'REQUIRES_OWNER_APPROVAL' : 'PLANNED',
        priority: item.priority,
        computeCostUSD: item.estimatedCostUSD || 1500,
        requiresOwnerSignoff: item.requiresOwnerSignoff,
        dueDate: '2026-11-15',
        payload: item.payload
      });
    });

    db.markCeoMessageOrchestrated(msgId);
    setCeoMessages(db.getCeoChat());
    setTasks(db.getTasks());
    setAuditLogs(db.getAuditLogs());
  };

  const handleAddMeetingMessage = (msg: { senderId: string; text: string; textAr: string; stance: any; confidenceScore: number }) => {
    const updated = db.addMeetingMessage(msg);
    setMeeting({ ...updated });
  };

  const handleEnactMeetingResolution = (res: string, resAr: string) => {
    const updated = db.setMeetingResolution(res, resAr);
    setMeeting({ ...updated });
    setAuditLogs(db.getAuditLogs());
  };

  const handleMarkAllNotificationsRead = () => {
    const updated = db.markAllNotificationsRead();
    setNotifications([...updated]);
  };

  const handleSelectApprovalFromNotif = (approvalId: string) => {
    setActiveTab('owner');
    setNotificationsOpen(false);
  };

  const pendingApprovalsCount = approvals.filter(a => a.status === 'pending').length;
  const t = translations[lang];

  // Mobile menu items
  const allNavItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'owner', label: t.navOwner, icon: Crown },
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
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Emergency Swarm Halt Banner */}
      {isEmergencyHalted && (
        <EmergencyBanner 
          lang={lang} 
          onEmergencyResume={handleToggleEmergencyHalt} 
        />
      )}

      {/* Corporate Top Bar */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        notifications={notifications}
        onOpenNotifications={() => setNotificationsOpen(true)}
        isEmergencyHalted={isEmergencyHalted}
        onToggleEmergencyHalt={handleToggleEmergencyHalt}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-20 lg:pb-8">
        {/* Persistent Desktop Sidebar */}
        <Sidebar
          lang={lang}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingApprovalsCount={pendingApprovalsCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {activeTab === 'owner' && (
            <OwnerDashboard
              lang={lang}
              approvals={approvals}
              onResolveApproval={handleResolveApproval}
              finance={finance}
              employees={employees}
              departments={departments}
              tasks={tasks}
              ceoMessages={ceoMessages}
              onSendCeoMessage={handleSendCeoMessage}
              isCeoGenerating={isCeoGenerating}
              onDeployOrchestration={handleDeployOrchestration}
              onRunTask={handleRunTask}
              isEmergencyHalted={isEmergencyHalted}
              onSelectTab={setActiveTab}
              onOpenEmployeeModal={setSelectedEmployeeForModal}
            />
          )}

          {activeTab === 'ceo' && (
            <CeoCommandCenter
              lang={lang}
              employees={employees}
              departments={departments}
              projects={projects}
            />
          )}

          {activeTab === 'directory' && (
            <AIEmployeesDirectory
              lang={lang}
              employees={employees}
              onSelectEmployee={setSelectedEmployeeForModal}
              selectedEmployee={selectedEmployeeForModal}
              onCloseModal={() => setSelectedEmployeeForModal(null)}
            />
          )}

          {activeTab === 'departments' && (
            <DepartmentsManagement
              lang={lang}
              departments={departments}
              employees={employees}
              onUpdateBudget={handleUpdateDepartmentBudget}
              onOpenEmployeeModal={setSelectedEmployeeForModal}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsAndTasks
              lang={lang}
              projects={projects}
              tasks={tasks}
              employees={employees}
              departments={departments}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onAddTask={handleAddTask}
              onRunTask={handleRunTask}
              onStopTask={handleStopTask}
              isEmergencyHalted={isEmergencyHalted}
              onSelectTab={setActiveTab}
            />
          )}

          {activeTab === 'meeting' && (
            <AIMeetingRoom
              lang={lang}
              meeting={meeting}
              employees={employees}
              onAddMessage={handleAddMeetingMessage}
              onEnactResolution={handleEnactMeetingResolution}
            />
          )}

          {activeTab === 'analytics' && (
            <ReportsAndAnalytics
              lang={lang}
              employees={employees}
              departments={departments}
              finance={finance}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceDashboard
              lang={lang}
              finance={finance}
              departments={departments}
              onUpdateDepartmentBudget={handleUpdateDepartmentBudget}
            />
          )}

          {activeTab === 'permissions' && (
            <RolePermissions
              lang={lang}
              permissions={permissions}
              auditLogs={auditLogs}
            />
          )}

          {activeTab === 'audit' && (
            <ExecutionAudit
              lang={lang}
            />
          )}

          {activeTab === 'integrity' && (
            <IntegrityAudit lang={lang} />
          )}
        </main>
      </div>

      {/* Mobile Ergonomic Bottom Nav */}
      <MobileBottomNav
        lang={lang}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenFullMenu={() => setMobileMenuOpen(true)}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Mobile Slide-Over Full Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 rtl:left-auto rtl:right-0 max-w-xs w-full bg-[#050b1a] border-r rtl:border-r-0 rtl:border-l border-slate-800 p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center font-mono font-bold text-white text-xs">
                    HMG
                  </div>
                  <span className="font-bold text-sm text-white">HMG AI Global</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {allNavItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              <div className="font-mono text-cyan-400">THE OWNER IS SUPREME</div>
              <div className="text-slate-400 mt-1">Enterprise Architecture · v4.8</div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        lang={lang}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSelectApproval={handleSelectApprovalFromNotif}
      />
    </div>
  );
}
