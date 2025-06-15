
export type JournalEntryStatus =
  | 'Draft'
  | 'Error'
  | 'Pending Action'
  | 'Rejected'
  | 'Approved'
  | 'Posted';

export type JournalEntrySource = 'GL' | 'AP' | 'AR' | 'Payroll' | 'System';
export type PostedStatusFilter = 'Both' | 'Yes' | 'No';

export interface JournalEntry {
  id: string;
  fiscalYear: string;
  jeNumber: string;
  description: string;
  jeDate: Date;
  source: JournalEntrySource;
  status: JournalEntryStatus;
  workflowRule?: string;
  approvalPendingWith?: string;
  lastApprovalActionOn?: Date;
  useridCreated: string;
  additionalPeriod?: string; // e.g., "Period 13"
  totalDebits: number;
  totalCredits: number;
  isPosted: boolean;
}

// --- Added for Create Journal Entry Page with Lines ---
export interface JournalEntryAccountCode {
  [segmentId: string]: string | undefined; // e.g., { fund: '101', department: 'DPW', object: '5010' }, value can be undefined if not selected
}

export interface JournalEntryLine {
  id: string; // client-side UUID
  accountCodeSelections: JournalEntryAccountCode;
  accountCodeDisplay: string; // The concatenated string for display
  description?: string;
  debit?: number;
  credit?: number;
}

export interface JournalEntryControlsData {
  fiscalYear: string;
  journalEntryNumber: string;
  journalEntryDate: Date;
  additionalPeriod?: string;
  source: JournalEntrySource;
  workflowRule?: string;
  description: string;
  comment?: string;
}

export interface FullJournalEntryFormData {
  controls: JournalEntryControlsData;
  lines: JournalEntryLine[];
}
// --- End Added ---


export const initialJournalEntriesData: JournalEntry[] = [
  {
    id: 'je1',
    fiscalYear: '2025',
    jeNumber: '123456',
    description: 'Monthly Accrual Review',
    jeDate: new Date(Date.UTC(2025, 4, 26)),
    source: 'GL',
    status: 'Draft',
    workflowRule: undefined,
    approvalPendingWith: undefined,
    lastApprovalActionOn: undefined,
    useridCreated: 'Neeraj',
    totalDebits: 1500.00,
    totalCredits: 1500.00,
    isPosted: false,
  },
  {
    id: 'je2',
    fiscalYear: '2025',
    jeNumber: '123436',
    description: 'Project Accounting Finalization',
    jeDate: new Date(Date.UTC(2025, 2, 20)),
    source: 'GL',
    status: 'Posted',
    workflowRule: 'SD_GL_DirectAutoPost',
    approvalPendingWith: undefined,
    lastApprovalActionOn: new Date(Date.UTC(2025, 3, 20, 11, 18)),
    useridCreated: 'Neeraj',
    totalDebits: 25000.00,
    totalCredits: 25000.00,
    isPosted: true,
  },
  {
    id: 'je3',
    fiscalYear: '2025',
    jeNumber: '23445',
    description: 'Vendor Payment Batch JE',
    jeDate: new Date(Date.UTC(2025, 2, 13)),
    source: 'AP',
    status: 'Error',
    workflowRule: 'AP_WORKFLOW',
    approvalPendingWith: undefined,
    lastApprovalActionOn: undefined,
    useridCreated: 'Neeraj',
    totalDebits: 780.50,
    totalCredits: 780.50,
    isPosted: false,
  },
  {
    id: 'je4',
    fiscalYear: '2025',
    jeNumber: '12345',
    description: 'New Accrual JE - January',
    jeDate: new Date(Date.UTC(2025, 0, 1)),
    source: 'AP',
    status: 'Posted',
    workflowRule: 'AP_WORKFLOW',
    approvalPendingWith: undefined,
    lastApprovalActionOn: new Date(Date.UTC(2025, 0, 14, 14, 42)),
    useridCreated: 'Neeraj',
    totalDebits: 1200.00,
    totalCredits: 1200.00,
    isPosted: true,
  },
  {
    id: 'je5',
    fiscalYear: '2025',
    jeNumber: '2000',
    description: 'Payroll Import Staff Rule Adjustment',
    jeDate: new Date(Date.UTC(2025, 1, 20)),
    source: 'Payroll',
    status: 'Pending Action',
    workflowRule: 'OG_GL_Rule1',
    approvalPendingWith: 'Sanket Deshpande (Approver)',
    lastApprovalActionOn: new Date(Date.UTC(2025, 4, 15, 13, 34)),
    useridCreated: 'Neeraj',
    totalDebits: 55000.00,
    totalCredits: 55000.00,
    isPosted: false,
  },
  {
    id: 'je6',
    fiscalYear: '2025',
    jeNumber: '1338',
    description: 'New Payment JE - Utilities',
    jeDate: new Date(Date.UTC(2025, 0, 17)),
    source: 'AP',
    status: 'Error',
    workflowRule: 'AP_WORKFLOW',
    approvalPendingWith: undefined,
    lastApprovalActionOn: undefined,
    useridCreated: 'Neeraj',
    totalDebits: 345.67,
    totalCredits: 345.67,
    isPosted: false,
  },
  {
    id: 'je7',
    fiscalYear: '2025',
    jeNumber: '1335',
    description: 'New Payment JE - Supplies',
    jeDate: new Date(Date.UTC(2025, 0, 14)),
    source: 'AP',
    status: 'Approved',
    workflowRule: 'AP_WORKFLOW',
    approvalPendingWith: undefined,
    lastApprovalActionOn: new Date(Date.UTC(2025, 0, 14, 10, 0)),
    useridCreated: 'Neeraj',
    totalDebits: 88.99,
    totalCredits: 88.99,
    isPosted: false,
  },
  {
    id: 'je8',
    fiscalYear: '2024',
    jeNumber: '99001',
    description: 'Year End Closing Entry',
    jeDate: new Date(Date.UTC(2024, 11, 31)),
    source: 'GL',
    status: 'Posted',
    workflowRule: 'YEAR_END_CLOSE',
    useridCreated: 'Neeraj', // Was 'system'
    lastApprovalActionOn: new Date(Date.UTC(2024, 11, 31, 23, 59)),
    totalDebits: 100000.00,
    totalCredits: 100000.00,
    isPosted: true,
  },
  {
    id: 'je9',
    fiscalYear: '2025',
    jeNumber: '30010',
    description: 'Customer Payment Reversal',
    jeDate: new Date(Date.UTC(2025, 5, 2)),
    source: 'AR',
    status: 'Rejected',
    workflowRule: 'AR_REVERSAL_WF',
    approvalPendingWith: undefined,
    lastApprovalActionOn: new Date(Date.UTC(2025, 5, 3, 9, 15)),
    useridCreated: 'Neeraj',
    totalDebits: 560.00,
    totalCredits: 560.00,
    isPosted: false,
  },
  {
    id: 'je10',
    fiscalYear: '2025',
    jeNumber: '30011',
    description: 'Inter-fund Transfer',
    jeDate: new Date(Date.UTC(2025, 5, 5)),
    source: 'GL',
    status: 'Pending Action',
    workflowRule: 'INTERFUND_TRANSFER_WF',
    approvalPendingWith: 'Finance Director',
    useridCreated: 'Neeraj',
    totalDebits: 75000.00,
    totalCredits: 75000.00,
    isPosted: false,
  },
];

export const fiscalYears = ['2025', '2024', '2023'];
export const jeSources: JournalEntrySource[] = ['GL', 'AP', 'AR', 'Payroll', 'System'];
export const jeStatuses: JournalEntryStatus[] = ['Draft', 'Error', 'Pending Action', 'Rejected', 'Approved', 'Posted'];
export const allUserIds = ['Neeraj', 'amohan', 'sjain', 'apatole', 'mranade', 'system', 'kchen']; // Added Neeraj here for filter consistency
export const workflowRules = ['SD_GL_DirectAutoPost', 'AP_WORKFLOW', 'OG_GL_Rule1', 'YEAR_END_CLOSE', 'AR_REVERSAL_WF', 'INTERFUND_TRANSFER_WF', 'STANDARD_JE_APPROVAL'];
export const approvalPendingWithOptions = ['Sanket Deshpande (Approver)', 'Finance Director', 'Controller', 'Mary Jane (Manager)'];
export const additionalPeriods = ['Period 13', 'Period 14 (Audit)'];
export const postedOptions: PostedStatusFilter[] = ['Both', 'Yes', 'No'];

// Values for "None" options in Select components
export const NONE_ADDITIONAL_PERIOD_VALUE = "_none_additional_period_";
export const NONE_WORKFLOW_RULE_VALUE = "_none_workflow_rule_";

    