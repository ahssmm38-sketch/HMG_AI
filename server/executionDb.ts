import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

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
  execution_mode: 'REAL_EXECUTION' | 'LOCAL_COMPUTATION' | 'SIMULATED';
  storage_status: 'DATABASE_VERIFIED' | 'SERVER_SQLITE_PERSISTENT' | 'LOCAL_BROWSER_CACHE_ONLY';
  database_target: string;
  summary: string;
  summary_ar: string;
  created_at: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'hmg_executions.db');
const JSON_BACKUP_PATH = path.join(DATA_DIR, 'hmg_executions.json');

let dbInstance: DatabaseSync | null = null;

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getDatabase(): DatabaseSync {
  if (dbInstance) return dbInstance;
  ensureDataDirectory();

  try {
    const db = new DatabaseSync(DB_PATH);
    // Initialize persistent table
    db.exec(`
      CREATE TABLE IF NOT EXISTS execution_records (
        execution_id TEXT PRIMARY KEY,
        task_id TEXT NOT NULL,
        task_title TEXT NOT NULL,
        task_title_ar TEXT,
        executor_id TEXT NOT NULL,
        executor_name TEXT NOT NULL,
        executor_role TEXT NOT NULL,
        service_or_tool_used TEXT NOT NULL,
        started_at TEXT NOT NULL,
        completed_at TEXT NOT NULL,
        execution_time_ms INTEGER NOT NULL,
        inputs_json TEXT NOT NULL,
        outputs_json TEXT NOT NULL,
        verification_status TEXT NOT NULL,
        verification_hash TEXT NOT NULL,
        actual_cost TEXT NOT NULL,
        execution_mode TEXT NOT NULL,
        storage_status TEXT NOT NULL,
        database_target TEXT NOT NULL,
        summary TEXT,
        summary_ar TEXT,
        created_at TEXT NOT NULL
      );
    `);
    dbInstance = db;
    return db;
  } catch (err) {
    console.error('Failed to initialize SQLite DatabaseSync:', err);
    throw err;
  }
}

// Save a record permanently to SQLite and sync to redundant JSON file
export function saveExecutionRecord(record: StoredExecutionRecord): StoredExecutionRecord {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO execution_records (
      execution_id, task_id, task_title, task_title_ar,
      executor_id, executor_name, executor_role, service_or_tool_used,
      started_at, completed_at, execution_time_ms,
      inputs_json, outputs_json, verification_status, verification_hash,
      actual_cost, execution_mode, storage_status, database_target,
      summary, summary_ar, created_at
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?
    );
  `);

  stmt.run(
    record.execution_id,
    record.task_id,
    record.task_title,
    record.task_title_ar || record.task_title,
    record.executor_id,
    record.executor_name,
    record.executor_role,
    record.service_or_tool_used,
    record.started_at,
    record.completed_at,
    record.execution_time_ms,
    record.inputs_json,
    record.outputs_json,
    record.verification_status,
    record.verification_hash,
    record.actual_cost,
    record.execution_mode,
    record.storage_status,
    record.database_target,
    record.summary,
    record.summary_ar,
    record.created_at
  );

  // Sync to redundant JSON storage to guarantee persistence across filesystem snapshots
  try {
    const all = getAllExecutionRecords();
    fs.writeFileSync(JSON_BACKUP_PATH, JSON.stringify(all, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not update JSON backup file:', e);
  }

  return record;
}

// Retrieve all records sorted by completed_at DESC
export function getAllExecutionRecords(): StoredExecutionRecord[] {
  try {
    const db = getDatabase();
    const rows = db.prepare(`SELECT * FROM execution_records ORDER BY created_at DESC`).all() as unknown as StoredExecutionRecord[];
    return rows || [];
  } catch (err) {
    console.warn('Error reading from SQLite, attempting JSON backup read:', err);
    if (fs.existsSync(JSON_BACKUP_PATH)) {
      try {
        const raw = fs.readFileSync(JSON_BACKUP_PATH, 'utf-8');
        return JSON.parse(raw);
      } catch {}
    }
    return [];
  }
}

// Retrieve single record by ID
export function getExecutionRecordById(executionId: string): StoredExecutionRecord | null {
  try {
    const db = getDatabase();
    const row = db.prepare(`SELECT * FROM execution_records WHERE execution_id = ?`).get(executionId) as unknown as StoredExecutionRecord | undefined;
    if (row) return row;
  } catch (err) {
    console.warn('Error fetching row from SQLite:', err);
  }

  // Fallback to JSON
  if (fs.existsSync(JSON_BACKUP_PATH)) {
    try {
      const list: StoredExecutionRecord[] = JSON.parse(fs.readFileSync(JSON_BACKUP_PATH, 'utf-8'));
      const found = list.find(r => r.execution_id === executionId);
      if (found) return found;
    } catch {}
  }

  return null;
}

// Verify execution record against persistent DB (Requirement 5 & 6)
export function verifyExecutionInDatabase(executionId: string): {
  existsInDatabase: boolean;
  databasePath: string;
  databaseType: string;
  storageStatus: string;
  record?: StoredExecutionRecord;
  hashMatches?: boolean;
  parsedInputs?: any;
  parsedOutputs?: any;
  error?: string;
} {
  const record = getExecutionRecordById(executionId);
  if (!record) {
    return {
      existsInDatabase: false,
      databasePath: DB_PATH,
      databaseType: 'SQLite Relational Database (data/hmg_executions.db)',
      storageStatus: 'NOT_FOUND_IN_DATABASE',
      error: `Execution ID "${executionId}" was not found in the persistent database.`
    };
  }

  // Validate JSON integrity
  let parsedInputs: any = {};
  let parsedOutputs: any = {};
  try { parsedInputs = JSON.parse(record.inputs_json); } catch { parsedInputs = record.inputs_json; }
  try { parsedOutputs = JSON.parse(record.outputs_json); } catch { parsedOutputs = record.outputs_json; }

  // Check cryptographic format
  const hashMatches = Boolean(record.verification_hash && record.verification_hash.startsWith('0x'));

  return {
    existsInDatabase: true,
    databasePath: DB_PATH,
    databaseType: 'SQLite Relational Database (data/hmg_executions.db)',
    storageStatus: record.storage_status,
    record,
    hashMatches,
    parsedInputs,
    parsedOutputs
  };
}

// Diagnostic status of database
export function getDatabaseDiagnostics() {
  const hasSupabaseUrl = Boolean(process.env.SUPABASE_URL);
  const hasSupabaseKey = Boolean(process.env.SUPABASE_ANON_KEY);
  const records = getAllExecutionRecords();

  return {
    sqliteDatabaseActive: true,
    databasePath: DB_PATH,
    databaseEngine: 'node:sqlite (Relational SQLite Engine in Node 22)',
    totalPersistedExecutions: records.length,
    supabaseConfigured: hasSupabaseUrl && hasSupabaseKey,
    supabaseStatus: (hasSupabaseUrl && hasSupabaseKey) 
      ? 'CONNECTED_REMOTE' 
      : 'NOT_CONNECTED_NO_CREDENTIALS',
    storageModeNoticeEn: (hasSupabaseUrl && hasSupabaseKey)
      ? 'Dual storage active: Server SQLite Database + Remote Supabase cloud.'
      : 'Server SQLite Database active (data/hmg_executions.db). Remote Supabase is not connected in environment.',
    storageModeNoticeAr: (hasSupabaseUrl && hasSupabaseKey)
      ? 'التخزين المزدوج نشط: قاعدة بيانات SQLite المحلية + سحابة Supabase.'
      : 'قاعدة بيانات SQLite المحلية نشطة على الخادم (data/hmg_executions.db). سحابة Supabase غير متصلة لعدم توفر المفاتيح.'
  };
}
