export type Language = 'en' | 'ar';

export type NavTab = 
  | 'owner' 
  | 'ceo' 
  | 'directory' 
  | 'departments' 
  | 'projects' 
  | 'meeting' 
  | 'analytics' 
  | 'finance' 
  | 'permissions' 
  | 'audit'
  | 'integrity';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

// Exact task states required by integrity policy
export type TaskStatus = 
  | 'PLANNED'
  | 'REQUIRES_OWNER_APPROVAL'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'SIMULATED'
  | 'CANCELLED';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type ExecutionMode = 'REAL_EXECUTION' | 'LOCAL_COMPUTATION' | 'SIMULATED';

export type StorageStatus = 'DATABASE_VERIFIED' | 'SERVER_SQLITE_PERSISTENT' | 'LOCAL_BROWSER_CACHE_ONLY';

export interface TaskExecutionEvidence {
  execution_id: string;
  service_or_tool_used: string;
  started_at: string;
  completed_at: string;
  execution_time_ms: number;
  actual_output: Record<string, any>;
  verification_status: 'VERIFIED_SUCCESS' | 'EXECUTION_FAILED' | 'HALTED_BY_OWNER' | 'CANCELLED';
  actual_cost: string;
  verification_hash: string;
  executorId: string;
  executorName: string;
  executorRole: string;
  summary: string;
  summaryAr: string;
  inputs?: Record<string, any>;
  execution_mode?: ExecutionMode;
  storage_status?: StorageStatus;
  database_target?: string;
  taskTitle?: string;
  taskTitleAr?: string;
}

export interface StoredExecutionRecord {
  execution_id: string;
  task_id: string;
  task_title: string;
  task_title_ar: string;
  executor_id: string;
  executor_name: string;
  executor_role: string;
  service_or_tool_used: string;
  started_at: string;
  completed_at: string;
  execution_time_ms: number;
  inputs_json: string;
  outputs_json: string;
  verification_status: string;
  verification_hash: string;
  actual_cost: string;
  execution_mode: ExecutionMode;
  storage_status: StorageStatus;
  database_target: string;
  summary: string;
  summary_ar: string;
  created_at: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  titleAr: string;
  assignedToId: string;
  status: TaskStatus;
  priority: PriorityLevel;
  computeCostUSD: number;
  requiresOwnerSignoff: boolean;
  dueDate: string;
  payload?: {
    actionType: string;
    parameters?: Record<string, any>;
  };
  evidence?: TaskExecutionEvidence;
  errorReason?: string;
}

export interface CEOChatMessage {
  id: string;
  sender: 'owner' | 'ceo';
  text: string;
  timestamp: string;
  orchestrationPlan?: {
    strategySummary: string;
    tasks: Array<{
      title: string;
      titleAr: string;
      assignedToId: string;
      departmentId: string;
      priority: PriorityLevel;
      requiresOwnerSignoff: boolean;
      estimatedCostUSD: number;
      payload?: {
        actionType: string;
        parameters?: Record<string, any>;
      };
    }>;
  };
  isOrchestrated?: boolean;
}

export interface AIEmployee {
  id: string;
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  departmentId: string;
  departmentName: string;
  departmentNameAr: string;
  seniority: string;
  seniorityAr: string;
  modelCore: string;
  avatar: string;
  status: 'active' | 'in_meeting' | 'evaluating' | 'idle';
  computeUsage: number;
  tokenBurnDaily: number;
  decisionThresholdUSD: number;
  directReportsCount: number;
  bio: string;
  bioAr: string;
  keyCapabilities: string[];
  keyCapabilitiesAr: string[];
  currentTask: string;
  currentTaskAr: string;
  requiresApprovalFor: string[];
  requiresApprovalForAr: string[];
  efficiencyRating: number;
  isRealAgentCallable: boolean;
}

export interface Department {
  id: string;
  name: string;
  nameAr: string;
  code: string;
  headEmployeeId: string;
  agentCount: number;
  allocatedBudgetUSD: number;
  spentBudgetUSD: number;
  activeProjectsCount: number;
  efficiencyScore: number;
  description: string;
  descriptionAr: string;
}

export interface Project {
  id: string;
  title: string;
  titleAr: string;
  departmentId: string;
  leadEmployeeId: string;
  status: 'in_progress' | 'pending_approval' | 'completed' | 'blocked' | 'planned';
  priority: PriorityLevel;
  progress: number;
  budgetUSD: number;
  spentUSD: number;
  deadline: string;
  description: string;
  descriptionAr: string;
  sensitiveDecisionPending?: boolean;
}

export interface PendingApproval {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterNameAr: string;
  requesterRole: string;
  requesterRoleAr: string;
  requesterAvatar?: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  financialImpactUSD: number;
  riskLevel: RiskLevel;
  status: ApprovalStatus;
  timestamp: string;
  departmentId: string;
  category: 'treasury' | 'deployment' | 'safety' | 'procurement';
  ownerFeedback?: string;
}

export interface MeetingMessage {
  id: string;
  senderId: string;
  timestamp: string;
  text: string;
  textAr: string;
  stance: 'pro' | 'con' | 'risk' | 'neutral' | 'resolution';
  confidenceScore: number;
  isRealAgentCall?: boolean;
}

export interface MeetingAgenda {
  id: string;
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  status: 'scheduled' | 'in_session' | 'adjourned';
  date: string;
  participants: string[];
  messages: MeetingMessage[];
  bindingResolution?: string;
  bindingResolutionAr?: string;
}

// Financial metrics strictly adhering to verified values and displaying N/A when external ledgers are unconnected
export interface FinancialMetric {
  arrUSD: number | null; // null => N/A
  mrrUSD: number | null; // null => N/A
  monthlyRevenueUSD: number | null; // null => N/A
  computeSpendMonthUSD: number | null; // null => N/A
  netMarginPercent: number | null; // null => N/A
  runwayMonths: number | null; // null => N/A
  enterpriseValuationUSD: number | null; // null => N/A
  verifiedDisbursementsUSD: number; // actual confirmed disbursements in app
  activeFinancialCommitmentsUSD: number; // actual confirmed commitments
  executedTaskComputeTimeSec: number;
  verifiedExecutionCount: number;
  unverifiedNotice: string;
  unverifiedNoticeAr: string;
}

export interface RolePermissionTier {
  tier: number;
  title: string;
  titleAr: string;
  spendingLimitUSD: number;
  canDeployProduction: boolean;
  canSignContracts: boolean;
  canHaltSwarm: boolean;
  canModifySafetyGuardrails: boolean;
  canDisburseTreasury: boolean;
  description: string;
  descriptionAr: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  actionAr: string;
  category: 'governance' | 'financial' | 'security' | 'model';
  hash: string;
  status: 'verified' | 'flagged';
  evidenceId?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  time: string;
  type: 'approval' | 'security' | 'milestone' | 'system';
  read: boolean;
  actionRequired?: boolean;
  approvalId?: string;
}

export interface IntegrityFeatureStatus {
  id: string;
  category: 'ai_engine' | 'governance' | 'tasks' | 'financials' | 'infrastructure' | 'persistence';
  name: string;
  nameAr: string;
  status: 'REAL_VERIFIED' | 'LOCAL_EXECUTION' | 'SIMULATED' | 'NOT_YET_CONNECTED';
  description: string;
  descriptionAr: string;
  evidence: string;
  evidenceAr: string;
}
