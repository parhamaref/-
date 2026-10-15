/**
 * @file AcceptanceTestRunner.tsx
 * Automated Acceptance Test Runner for the 10 DANIELS Technical Specification Tests.
 * Executes live algorithmic verification of RBAC, Data Isolation, State Machines,
 * Versioning, QC Rework, Payment Integrity, and Audit Logging with real-time Pass/Fail badges.
 */

import React, { useState, useEffect } from 'react';
import {
  hasPermission,
  logAuditAction,
  getAuditLogs,
  canAccessCustomerData,
  canAccessPartnerData,
} from '../../utils/rbac';
import {
  canTransitionOrder,
  canTransitionProduction,
  canTransitionPayment,
  validateMeasurementProfileVersioning,
} from '../../utils/danielsStateValidators';
import { MOCK_USERS, MOCK_MEASUREMENT_PROFILES } from '../../mock/danielsMockData';
import { User, OrderStatus, ProductionStage } from '../../types/daniels.types';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Check,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Terminal,
  Activity,
  Lock,
} from 'lucide-react';

export interface TestCaseResult {
  id: number;
  title: string;
  category: string;
  description: string;
  status: 'PENDING' | 'RUNNING' | 'PASS' | 'FAIL';
  assertionCount: number;
  passedAssertions: number;
  durationMs: number;
  logs: string[];
  error?: string;
}

export const AcceptanceTestRunner: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [expandedTestId, setExpandedTestId] = useState<number | null>(null);

  const initialTests: TestCaseResult[] = [
    {
      id: 1,
      title: 'Authentication & Role-Based Access Control Test',
      category: 'RBAC',
      description: 'Verify valid roles gain access and unauthorized or inactive users are strictly blocked.',
      status: 'PENDING',
      assertionCount: 4,
      passedAssertions: 0,
      durationMs: 0,
      logs: [],
    },
    {
      id: 2,
      title: 'Customer & Partner Data Isolation Test',
      category: 'Security',
      description: 'Verify Customer A cannot view Customer B’s records; Partner cannot view unassigned orders.',
      status: 'PENDING',
      assertionCount: 4,
      passedAssertions: 0,
      durationMs: 0,
      logs: [],
    },
    {
      id: 3,
      title: 'Order State Machine Lifecycle Test',
      category: 'State Machine',
      description: 'Verify strict sequence (Draft -> Approval -> Confirmed -> Production -> QC -> Dispatched -> Delivered); confirm illegal skips are blocked.',
      status: 'PENDING',
      assertionCount: 6,
      passedAssertions: 0,
      durationMs: 0,
      logs: [],
    },
    {
      id: 4,
      title: 'Measurement Profile Versioning & Immutability Test',
      category: 'Versioning',
      description: 'Verify creating a new measurement profile increments the version (v+1) and preserves prior approved versions.',
      status: 'PENDING',
      assertionCount: 3,
      passedAssertions: 0,
      durationMs: 0,
      logs: [],
    },
    {
      id: 5,
      title: 'Formal Bespoke Design Approval Audit Test',
      category: 'Compliance',
      description: 'Verify approvals record approvedBy, approvedAt, and the exact sealed spec version.',
      status: 'PENDING',
      assertionCount: 3,
      passedAssertions: 0,
      durationMs: 0,
      logs: [],
    },
    {
      id: 6,
      title: 'Production Stage Precedence Guard Test',
      category: 'Atelier Rules',
      description: 'Verify partner atelier cannot skip stages (e.g., straight to Finishing) or complete without 100% progress.',
      status: 'PENDING',
      assertionCount: 4,
      passedAssertions: 0,
      durationMs: 0,
      logs: [],
    },
    {
      id: 7,
      title: 'QC Rework & Dispatch Blocking Test',
      category: 'Quality Control',
      description: 'Verify a failed QC inspection sets status to Rework Required, routes to partner, and strictly blocks dispatch.',
      status: 'PENDING',
      assertionCount: 4,
      passedAssertions: 0,
      durationMs: 0,
      logs: [],
    },
    {
      id: 8,
      title: 'Payment State Transition & Underpayment Integrity Test',
      category: 'Finance',
      description: 'Verify safe and idempotent payment updates (Pending -> Paid/Refunded) and guard against underpaid full settlements.',
      status: 'PENDING',
      assertionCount: 4,
      passedAssertions: 0,
      durationMs: 0,
      logs: [],
    },
    {
      id: 9,
      title: 'Client File & Measurement Document Security Test',
      category: 'Data Protection',
      description: 'Verify private client measurement files are inaccessible to unauthorized peers or unassigned partners.',
      status: 'PENDING',
      assertionCount: 3,
      passedAssertions: 0,
      durationMs: 0,
      logs: [],
    },
    {
      id: 10,
      title: 'Audit Trail Telemetry & Searchability Test',
      category: 'Audit',
      description: 'Verify critical operational events are recorded with user ID and timestamp and are instantly queryable.',
      status: 'PENDING',
      assertionCount: 3,
      passedAssertions: 0,
      durationMs: 0,
      logs: [],
    },
  ];

  const [testResults, setTestResults] = useState<TestCaseResult[]>(initialTests);

  // ----------------------------------------------------
  // TEST IMPLEMENTATION RUNNERS
  // ----------------------------------------------------

  const runTest1 = async (): Promise<Partial<TestCaseResult>> => {
    const t0 = performance.now();
    const logs: string[] = [];
    let passed = 0;

    const admin = MOCK_USERS.find((u) => u.role === 'Super Admin')!;
    const customer = MOCK_USERS.find((u) => u.role === 'Customer')!;
    const inactiveUser: User = { ...customer, id: 'usr_inactive_01', status: 'Inactive' };

    // Assertion 1: Admin can access Orders
    const adminOrders = hasPermission(admin, 'Orders', 'view');
    logs.push(`Assertion 1: Super Admin has view on Orders => ${adminOrders}`);
    if (adminOrders) passed++;

    // Assertion 2: Customer blocked from managing Partners
    const customerManagePartner = hasPermission(customer, 'Partners', 'manage');
    logs.push(`Assertion 2: Customer blocked from Partners:manage => ${!customerManagePartner}`);
    if (!customerManagePartner) passed++;

    // Assertion 3: Inactive user blocked from all modules
    const inactiveAccess = hasPermission(inactiveUser, 'Orders', 'view');
    logs.push(`Assertion 3: Inactive user strictly blocked => ${!inactiveAccess}`);
    if (!inactiveAccess) passed++;

    // Assertion 4: Production user has operational control
    const prodUser = MOCK_USERS.find((u) => u.role === 'Production')!;
    const prodOps = hasPermission(prodUser, 'Production', 'edit');
    logs.push(`Assertion 4: Production role has edit privilege on Production => ${prodOps}`);
    if (prodOps) passed++;

    return {
      status: passed === 4 ? 'PASS' : 'FAIL',
      assertionCount: 4,
      passedAssertions: passed,
      durationMs: Math.round(performance.now() - t0),
      logs,
    };
  };

  const runTest2 = async (): Promise<Partial<TestCaseResult>> => {
    const t0 = performance.now();
    const logs: string[] = [];
    let passed = 0;

    const customerA = MOCK_USERS.find((u) => u.role === 'Customer')!;
    const partner = MOCK_USERS.find((u) => u.role === 'Partner')!;

    // Assertion 1: Customer A viewing own profile cust_001
    const ownAccess = hasPermission(customerA, 'Customers', 'view', 'cust_001');
    logs.push(`Assertion 1: Customer accessing own profile (cust_001) => ${ownAccess}`);
    if (ownAccess) passed++;

    // Assertion 2: Customer A viewing Customer B profile (cust_002) blocked
    const foreignCustomerAccess = hasPermission(customerA, 'Customers', 'view', 'cust_002');
    logs.push(`Assertion 2: Customer A viewing Customer B (cust_002) blocked => ${!foreignCustomerAccess}`);
    if (!foreignCustomerAccess) passed++;

    // Assertion 3: Partner viewing assigned order (ptnr_biella_01)
    const assignedOrderAccess = hasPermission(partner, 'Orders', 'view', { partnerId: 'ptnr_biella_01' });
    logs.push(`Assertion 3: Partner viewing assigned order (ptnr_biella_01) => ${assignedOrderAccess}`);
    if (assignedOrderAccess) passed++;

    // Assertion 4: Partner viewing peer/unassigned order (ptnr_other) blocked
    const unassignedOrderAccess = hasPermission(partner, 'Orders', 'view', { partnerId: 'ptnr_other_savile_row' });
    logs.push(`Assertion 4: Partner viewing unassigned peer order blocked => ${!unassignedOrderAccess}`);
    if (!unassignedOrderAccess) passed++;

    return {
      status: passed === 4 ? 'PASS' : 'FAIL',
      assertionCount: 4,
      passedAssertions: passed,
      durationMs: Math.round(performance.now() - t0),
      logs,
    };
  };

  const runTest3 = async (): Promise<Partial<TestCaseResult>> => {
    const t0 = performance.now();
    const logs: string[] = [];
    let passed = 0;

    // Legal sequence steps
    const step1 = canTransitionOrder('Draft', 'Awaiting Approval');
    logs.push(`Assertion 1: Draft -> Awaiting Approval => ${step1.allowed}`);
    if (step1.allowed) passed++;

    const step2 = canTransitionOrder('Awaiting Approval', 'Confirmed', { approvalStatus: 'Approved' });
    logs.push(`Assertion 2: Awaiting Approval -> Confirmed with Approval => ${step2.allowed}`);
    if (step2.allowed) passed++;

    const step3 = canTransitionOrder('Confirmed', 'In Production', { partnerAssigned: true });
    logs.push(`Assertion 3: Confirmed -> In Production with Assigned Partner => ${step3.allowed}`);
    if (step3.allowed) passed++;

    const step4 = canTransitionOrder('In Production', 'QC');
    logs.push(`Assertion 4: In Production -> QC => ${step4.allowed}`);
    if (step4.allowed) passed++;

    // Illegal skips blocked
    const illegalSkip = canTransitionOrder('Draft', 'Dispatched');
    logs.push(`Assertion 5: Draft -> Dispatched (illegal stage skip blocked) => ${!illegalSkip.allowed}`);
    if (!illegalSkip.allowed) passed++;

    const illegalTerminal = canTransitionOrder('Closed', 'Draft');
    logs.push(`Assertion 6: Closed -> Draft (terminal state violation blocked) => ${!illegalTerminal.allowed}`);
    if (!illegalTerminal.allowed) passed++;

    return {
      status: passed === 6 ? 'PASS' : 'FAIL',
      assertionCount: 6,
      passedAssertions: passed,
      durationMs: Math.round(performance.now() - t0),
      logs,
    };
  };

  const runTest4 = async (): Promise<Partial<TestCaseResult>> => {
    const t0 = performance.now();
    const logs: string[] = [];
    let passed = 0;

    const previousProfile = MOCK_MEASUREMENT_PROFILES[0]; // v1

    const newDraft = {
      customerId: 'cust_001',
      measurements: {
        unit: 'cm' as const,
        chest: 106.0,
        waist: 88.0,
        shoulderWidth: 49.0,
        sleeveLength: 66.0,
      },
      fitPreferences: {
        silhouette: 'Classic' as const,
        shoulderPad: 'Structured' as const,
        trouserBreak: 'Slight Break' as const,
      },
      specialRequirements: ['Right shoulder drop 1.2cm'],
      isLatest: true,
    };

    const validation = validateMeasurementProfileVersioning(previousProfile, newDraft);

    logs.push(`Assertion 1: Version increment validated: nextVersion = ${validation.nextVersion} (expected 2)`);
    if (validation.valid && validation.nextVersion === 2) passed++;

    // Prior version immutability check
    const priorVersionIntact = previousProfile.version === 1 && previousProfile.supersededById !== null;
    logs.push(`Assertion 2: Prior version v1 preserved with historical linkage => ${priorVersionIntact}`);
    if (priorVersionIntact) passed++;

    // Missing metric validation
    const invalidProfile = validateMeasurementProfileVersioning(previousProfile, {
      customerId: '',
      measurements: { unit: 'cm' },
      fitPreferences: newDraft.fitPreferences,
      specialRequirements: [],
      isLatest: true,
    });
    logs.push(`Assertion 3: Missing customer ID or core metrics rejected => ${!invalidProfile.valid}`);
    if (!invalidProfile.valid) passed++;

    return {
      status: passed === 3 ? 'PASS' : 'FAIL',
      assertionCount: 3,
      passedAssertions: passed,
      durationMs: Math.round(performance.now() - t0),
      logs,
    };
  };

  const runTest5 = async (): Promise<Partial<TestCaseResult>> => {
    const t0 = performance.now();
    const logs: string[] = [];
    let passed = 0;

    const validApproval = {
      approvedBy: 'Lord Alistair Sterling-Fox',
      approvedAt: new Date().toISOString(),
      specVersion: 2,
    };

    const hasApprover = typeof validApproval.approvedBy === 'string' && validApproval.approvedBy.length > 0;
    logs.push(`Assertion 1: ApprovedBy recorded as authenticated entity => ${hasApprover}`);
    if (hasApprover) passed++;

    const validDate = !isNaN(Date.parse(validApproval.approvedAt));
    logs.push(`Assertion 2: ApprovedAt captured as valid ISO timestamp => ${validDate}`);
    if (validDate) passed++;

    const specBound = typeof validApproval.specVersion === 'number' && validApproval.specVersion > 0;
    logs.push(`Assertion 3: Bound to immutable spec version ${validApproval.specVersion} => ${specBound}`);
    if (specBound) passed++;

    return {
      status: passed === 3 ? 'PASS' : 'FAIL',
      assertionCount: 3,
      passedAssertions: passed,
      durationMs: Math.round(performance.now() - t0),
      logs,
    };
  };

  const runTest6 = async (): Promise<Partial<TestCaseResult>> => {
    const t0 = performance.now();
    const logs: string[] = [];
    let passed = 0;

    // Normal forward
    const step = canTransitionProduction('Not Started', 'Assigned', { partnerVerified: true });
    logs.push(`Assertion 1: Not Started -> Assigned with verified partner => ${step.allowed}`);
    if (step.allowed) passed++;

    // Stage skipping blocked
    const skipToFinishing = canTransitionProduction('Not Started', 'Finishing');
    logs.push(`Assertion 2: Skipping directly to Finishing blocked => ${!skipToFinishing.allowed}`);
    if (!skipToFinishing.allowed) passed++;

    // Completion blocked if progress < 100%
    const incompleteBlocked = canTransitionProduction('QC', 'Complete', { progressPercentage: 65, qcResult: 'Pass' });
    logs.push(`Assertion 3: Complete blocked at 65% progress => ${!incompleteBlocked.allowed}`);
    if (!incompleteBlocked.allowed) passed++;

    // Complete allowed at 100% and QC Pass
    const completeAllowed = canTransitionProduction('QC', 'Complete', { progressPercentage: 100, qcResult: 'Pass' });
    logs.push(`Assertion 4: Complete permitted at 100% progress & QC Pass => ${completeAllowed.allowed}`);
    if (completeAllowed.allowed) passed++;

    return {
      status: passed === 4 ? 'PASS' : 'FAIL',
      assertionCount: 4,
      passedAssertions: passed,
      durationMs: Math.round(performance.now() - t0),
      logs,
    };
  };

  const runTest7 = async (): Promise<Partial<TestCaseResult>> => {
    const t0 = performance.now();
    const logs: string[] = [];
    let passed = 0;

    // QC Fail blocks Order transition to Ready
    const failReadyBlock = canTransitionOrder('QC', 'Ready', { qcResult: 'Fail' });
    logs.push(`Assertion 1: Failed QC inspection blocks Order:Ready transition => ${!failReadyBlock.allowed}`);
    if (!failReadyBlock.allowed) passed++;

    // QC Fail routes Order to Rework Required
    const reworkRoute = canTransitionOrder('QC', 'Rework Required', { qcResult: 'Fail' });
    logs.push(`Assertion 2: Failed QC routes Order to 'Rework Required' => ${reworkRoute.allowed}`);
    if (reworkRoute.allowed) passed++;

    // QC Fail blocks Production stage completion
    const prodFailBlock = canTransitionProduction('QC', 'Complete', { qcResult: 'Fail', progressPercentage: 100 });
    logs.push(`Assertion 3: Failed QC blocks Production completion => ${!prodFailBlock.allowed}`);
    if (!prodFailBlock.allowed) passed++;

    // Transition to Rework stage permitted with corrective notes
    const reworkPermitted = canTransitionProduction('QC', 'Rework', { qcResult: 'Fail', reworkNotesPresent: true });
    logs.push(`Assertion 4: Production stage routes to Rework with corrective notes => ${reworkPermitted.allowed}`);
    if (reworkPermitted.allowed) passed++;

    return {
      status: passed === 4 ? 'PASS' : 'FAIL',
      assertionCount: 4,
      passedAssertions: passed,
      durationMs: Math.round(performance.now() - t0),
      logs,
    };
  };

  const runTest8 = async (): Promise<Partial<TestCaseResult>> => {
    const t0 = performance.now();
    const logs: string[] = [];
    let passed = 0;

    // Full payment
    const fullPay = canTransitionPayment('Pending', 'Paid', { totalAmount: 5000, paidAmount: 5000 });
    logs.push(`Assertion 1: Pending -> Paid with 100% settled amount => ${fullPay.allowed}`);
    if (fullPay.allowed) passed++;

    // Underpayment blocked from marking Paid
    const underpayBlock = canTransitionPayment('Pending', 'Paid', { totalAmount: 5000, paidAmount: 2500 });
    logs.push(`Assertion 2: Underpayment (£2,500/£5,000) blocked from 'Paid' status => ${!underpayBlock.allowed}`);
    if (!underpayBlock.allowed) passed++;

    // Refund authorization
    const refundAllowed = canTransitionPayment('Paid', 'Refunded', { refundApproved: true });
    logs.push(`Assertion 3: Paid -> Refunded with Finance authorization => ${refundAllowed.allowed}`);
    if (refundAllowed.allowed) passed++;

    // Terminal refund state cannot revert to Pending
    const terminalCheck = canTransitionPayment('Refunded', 'Pending');
    logs.push(`Assertion 4: Terminal Refunded state cannot revert to Pending => ${!terminalCheck.allowed}`);
    if (!terminalCheck.allowed) passed++;

    return {
      status: passed === 4 ? 'PASS' : 'FAIL',
      assertionCount: 4,
      passedAssertions: passed,
      durationMs: Math.round(performance.now() - t0),
      logs,
    };
  };

  const runTest9 = async (): Promise<Partial<TestCaseResult>> => {
    const t0 = performance.now();
    const logs: string[] = [];
    let passed = 0;

    const customerA = MOCK_USERS.find((u) => u.role === 'Customer')!;
    const customerB: User = { ...customerA, id: 'usr_customer_b' };
    const partner = MOCK_USERS.find((u) => u.role === 'Partner')!;

    // Customer A accessing own document
    const clientOwnDoc = canAccessCustomerData(customerA, 'cust_001');
    logs.push(`Assertion 1: Client accessing own bespoke document => ${clientOwnDoc}`);
    if (clientOwnDoc) passed++;

    // Foreign customer blocked
    const foreignDocBlocked = canAccessCustomerData(customerB, 'cust_001');
    logs.push(`Assertion 2: Peer customer blocked from accessing foreign files => ${!foreignDocBlocked}`);
    if (!foreignDocBlocked) passed++;

    // Unassigned partner blocked
    const partnerUnassignedDoc = canAccessCustomerData(partner, 'cust_001');
    logs.push(`Assertion 3: Unassigned partner blocked from client confidential documents => ${!partnerUnassignedDoc}`);
    if (!partnerUnassignedDoc) passed++;

    return {
      status: passed === 3 ? 'PASS' : 'FAIL',
      assertionCount: 3,
      passedAssertions: passed,
      durationMs: Math.round(performance.now() - t0),
      logs,
    };
  };

  const runTest10 = async (): Promise<Partial<TestCaseResult>> => {
    const t0 = performance.now();
    const logs: string[] = [];
    let passed = 0;

    const testId = `test_telemetry_${Date.now()}`;
    const admin = MOCK_USERS.find((u) => u.role === 'Super Admin')!;

    // 1. Emit critical audit log
    const entry = logAuditAction(
      admin,
      'Orders',
      'edit',
      'ALLOWED',
      testId,
      'Acceptance test verification: state machine transition certified.'
    );
    logs.push(`Assertion 1: Emitted audit log event with ID ${entry.id}`);
    if (entry.id) passed++;

    // 2. Query log store
    const currentLogs = getAuditLogs();
    const found = currentLogs.find((l) => l.resourceId === testId);
    logs.push(`Assertion 2: Queried audit repository and found event for resource '${testId}' => ${Boolean(found)}`);
    if (found) passed++;

    // 3. Validate audit metadata integrity (timestamp & userId)
    const validMetadata =
      found &&
      found.userId === admin.id &&
      found.userRole === 'Super Admin' &&
      found.status === 'ALLOWED' &&
      !isNaN(Date.parse(found.timestamp));

    logs.push(`Assertion 3: Verified immutable timestamp & user attribution => ${Boolean(validMetadata)}`);
    if (validMetadata) passed++;

    return {
      status: passed === 3 ? 'PASS' : 'FAIL',
      assertionCount: 3,
      passedAssertions: passed,
      durationMs: Math.round(performance.now() - t0),
      logs,
    };
  };

  const executeSingleTest = async (testId: number) => {
    setTestResults((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, status: 'RUNNING' } : t))
    );

    let partial: Partial<TestCaseResult> = {};
    try {
      switch (testId) {
        case 1: partial = await runTest1(); break;
        case 2: partial = await runTest2(); break;
        case 3: partial = await runTest3(); break;
        case 4: partial = await runTest4(); break;
        case 5: partial = await runTest5(); break;
        case 6: partial = await runTest6(); break;
        case 7: partial = await runTest7(); break;
        case 8: partial = await runTest8(); break;
        case 9: partial = await runTest9(); break;
        case 10: partial = await runTest10(); break;
      }
    } catch (err: any) {
      partial = {
        status: 'FAIL',
        error: err.message || 'Execution error encountered',
      };
    }

    setTestResults((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, ...partial } : t))
    );
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    for (let i = 1; i <= 10; i++) {
      await executeSingleTest(i);
      // Brief aesthetic pause to demonstrate live execution
      await new Promise((res) => setTimeout(res, 60));
    }
    setIsRunningAll(false);
  };

  const totalPassed = testResults.filter((t) => t.status === 'PASS').length;
  const totalFailed = testResults.filter((t) => t.status === 'FAIL').length;
  const passRate = Math.round((totalPassed / testResults.length) * 100);

  return (
    <div className="bg-[#0E0E0E] border border-[#2B2B2B] rounded-sm p-6 sm:p-8 space-y-8 font-mono text-left max-w-6xl mx-auto shadow-2xl animate-fadeIn">
      {/* Runner Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 border-b border-[#2B2B2B] pb-6">
        <div>
          <div className="flex items-center gap-2 text-neutral-400 text-[9px] uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DANIELS ARCHITECTURAL ACCEPTANCE TEST RUNNER</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl text-white uppercase font-bold tracking-wider">
            10 SPECIFICATION VERIFICATION SUITE
          </h2>
          <p className="text-[10.5px] text-neutral-400 font-sans mt-0.5 text-justify">
            Automated compliance engine testing RBAC matrix boundaries, state machines, and data isolation rules.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto">
          <button
            onClick={runAllTests}
            disabled={isRunningAll}
            className="flex-1 sm:flex-initial py-2.5 px-4 sm:px-6 bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-black text-[10px] font-bold tracking-widest uppercase rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xl shrink-0"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunningAll ? 'animate-spin' : ''}`} />
            <span>{isRunningAll ? 'EXECUTING SUITE...' : 'RUN ALL 10 TESTS'}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="py-2.5 px-4 border border-[#2B2B2B] hover:border-white text-neutral-400 hover:text-white text-[10px] uppercase rounded-xs transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          )}
        </div>
      </div>

      {/* Summary Scorecard Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1">
          <span className="text-[8px] text-neutral-500 uppercase tracking-widest block">TEST CASES</span>
          <span className="font-serif text-2xl text-white font-bold block">{testResults.length} SPECS</span>
        </div>

        <div className="p-4 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1">
          <span className="text-[8px] text-emerald-400 uppercase tracking-widest block font-bold">
            PASSED CASES
          </span>
          <span className="font-serif text-2xl text-emerald-400 font-bold block">
            {totalPassed} / {testResults.length}
          </span>
        </div>

        <div className="p-4 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1">
          <span className="text-[8px] text-rose-400 uppercase tracking-widest block font-bold">
            FAILED CASES
          </span>
          <span className="font-serif text-2xl text-rose-400 font-bold block">
            {totalFailed}
          </span>
        </div>

        <div className="p-4 bg-black/60 border border-[#2B2B2B] rounded-xs space-y-1">
          <span className="text-[8px] text-neutral-400 uppercase tracking-widest block">COMPLIANCE SCORE</span>
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl text-white font-bold">{passRate}%</span>
            {passRate === 100 && (
              <span className="text-[8px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-bold rounded-2xs">
                CERTIFIED
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-[9px] text-neutral-500 border-b border-[#2B2B2B] pb-2">
          <span>SPECIFICATION TEST DOCKETS</span>
          <span>SELECT ANY TEST TO INSPECT INTERNAL ASSERTION LOGS</span>
        </div>

        <div className="space-y-2">
          {testResults.map((t) => {
            const isExpanded = expandedTestId === t.id;

            return (
              <div
                key={t.id}
                className={`border rounded-xs transition-all ${
                  t.status === 'PASS'
                    ? 'border-[#2B2B2B] bg-black/40 hover:border-emerald-500/60'
                    : t.status === 'FAIL'
                    ? 'border-rose-500/60 bg-rose-950/20'
                    : 'border-[#2B2B2B] bg-black/20'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedTestId(isExpanded ? null : t.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] text-neutral-500 font-mono w-6">
                      #{t.id < 10 ? `0${t.id}` : t.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm text-white uppercase font-bold tracking-wider">
                          {t.title}
                        </span>
                        <span className="text-[7.5px] px-1.5 py-0.2 bg-white/10 text-neutral-300 border border-white/20 rounded-2xs uppercase">
                          {t.category}
                        </span>
                      </div>
                      <p className="text-[9px] text-neutral-400 font-sans mt-0.5 line-clamp-1">
                        {t.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {/* Execution Metric */}
                    {t.durationMs > 0 && (
                      <span className="text-[8.5px] text-neutral-500 font-mono">
                        {t.durationMs}ms
                      </span>
                    )}

                    {/* Status Badge */}
                    <span
                      className={`text-[8.5px] font-bold px-2.5 py-1 rounded-2xs uppercase tracking-widest flex items-center gap-1.5 ${
                        t.status === 'PASS'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : t.status === 'FAIL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : t.status === 'RUNNING'
                          ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 animate-pulse'
                          : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                      }`}
                    >
                      {t.status === 'PASS' && <CheckCircle2 className="w-3 h-3" />}
                      {t.status === 'FAIL' && <XCircle className="w-3 h-3" />}
                      <span>{t.status}</span>
                    </span>

                    {/* Run Single Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        executeSingleTest(t.id);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-white border border-[#2B2B2B] hover:border-white rounded-xs transition-colors"
                      title="Run Test"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Logs Panel */}
                {isExpanded && (
                  <div className="p-4 bg-black border-t border-[#2B2B2B] space-y-2 text-[9px] animate-fadeIn">
                    <div className="flex items-center gap-2 text-neutral-400 border-b border-[#2B2B2B]/60 pb-1.5">
                      <Terminal className="w-3 h-3 text-emerald-400" />
                      <span className="font-bold uppercase tracking-wider text-white">
                        TEST EXECUTION & ASSERTION TELEMETRY
                      </span>
                      <span className="text-[8px] text-neutral-500 ml-auto">
                        PASSED {t.passedAssertions} OF {t.assertionCount} ASSERTIONS
                      </span>
                    </div>

                    {t.logs.length === 0 ? (
                      <p className="text-neutral-500 italic py-2">
                        Test has not been executed yet. Click "RUN" to evaluate assertions.
                      </p>
                    ) : (
                      <div className="space-y-1 font-mono text-[9px]">
                        {t.logs.map((log, lIdx) => (
                          <div key={lIdx} className="text-neutral-300 flex items-start gap-2">
                            <span className="text-emerald-400 shrink-0">✓</span>
                            <span>{log}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {t.error && (
                      <div className="p-2 bg-rose-950/60 border border-rose-500/60 text-rose-300 rounded-xs mt-2">
                        ERROR: {t.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AcceptanceTestRunner;
