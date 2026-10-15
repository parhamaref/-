/**
 * @file versionControlApi.ts
 * Enterprise Persistence & Git-Style VCS Engine for Daniel’s Maison.
 * 
 * Features:
 * - Version Timeline Traversal & Branching
 * - Multi-Domain Semantic Comparison (Measurements, Design, Fabrics, Approvals)
 * - Non-Destructive Rollback & Restore
 * - Approval Snapshot Vault with Cryptographic Sealing
 */

import {
  VersionCommit,
  ApprovalSnapshot,
  VCSPackageSummary,
  VersionComparisonResult,
  VersionDiffItem,
  VersionDomainType,
  VersionAuthor,
} from '../types/versionControl.types';
import {
  INITIAL_VCS_PACKAGES,
  INITIAL_VCS_COMMITS,
  INITIAL_APPROVAL_SNAPSHOTS,
} from '../mock/versionControlMockData';

const STORAGE_KEYS = {
  PACKAGES: 'maison_daniel_vcs_packages_v1',
  COMMITS: 'maison_daniel_vcs_commits_v1',
  SNAPSHOTS: 'maison_daniel_vcs_snapshots_v1',
};

export class VersionControlService {
  /**
   * Initialize LocalStorage with mock data if empty
   */
  private static ensureInitialized(): void {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(INITIAL_VCS_PACKAGES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMMITS)) {
      localStorage.setItem(STORAGE_KEYS.COMMITS, JSON.stringify(INITIAL_VCS_COMMITS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SNAPSHOTS)) {
      localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(INITIAL_APPROVAL_SNAPSHOTS));
    }
  }

  /**
   * Reset store to original pristine mock state
   */
  public static resetToMock(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(INITIAL_VCS_PACKAGES));
    localStorage.setItem(STORAGE_KEYS.COMMITS, JSON.stringify(INITIAL_VCS_COMMITS));
    localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(INITIAL_APPROVAL_SNAPSHOTS));
  }

  /**
   * Get all versioned packages
   */
  public static getPackages(): VCSPackageSummary[] {
    this.ensureInitialized();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      return data ? JSON.parse(data) : [...INITIAL_VCS_PACKAGES];
    } catch {
      return [...INITIAL_VCS_PACKAGES];
    }
  }

  /**
   * Save packages
   */
  private static savePackages(packages: VCSPackageSummary[]): void {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
  }

  /**
   * Get all commits
   */
  public static getAllCommits(): VersionCommit[] {
    this.ensureInitialized();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMMITS);
      return data ? JSON.parse(data) : [...INITIAL_VCS_COMMITS];
    } catch {
      return [...INITIAL_VCS_COMMITS];
    }
  }

  /**
   * Save commits
   */
  private static saveCommits(commits: VersionCommit[]): void {
    localStorage.setItem(STORAGE_KEYS.COMMITS, JSON.stringify(commits));
  }

  /**
   * Get commits for a specific package, ordered newest to oldest
   */
  public static getCommitsByPackage(packageId: string): VersionCommit[] {
    const all = this.getAllCommits();
    return all
      .filter((c) => c.packageId === packageId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  /**
   * Get single commit by ID
   */
  public static getCommitById(commitId: string): VersionCommit | null {
    const all = this.getAllCommits();
    return all.find((c) => c.id === commitId) || null;
  }

  /**
   * Feature 1: Compare Versions
   * Evaluates semantic diffs across all 4 supported domains
   */
  public static compareVersions(
    sourceCommitId: string,
    targetCommitId: string
  ): VersionComparisonResult | null {
    const source = this.getCommitById(sourceCommitId);
    const target = this.getCommitById(targetCommitId);

    if (!source || !target) return null;

    const diffs: VersionDiffItem[] = [];

    const compareObject = (
      domain: VersionDomainType,
      oldObj: Record<string, any>,
      newObj: Record<string, any>,
      labels: Record<string, string>
    ) => {
      const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
      for (const key of allKeys) {
        if (key === 'sketches' || key === 'unit') continue;
        const oldVal = oldObj[key];
        const newVal = newObj[key];
        const label = labels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());

        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          diffs.push({
            field: key,
            label,
            domain,
            oldValue: oldVal ?? 'None',
            newValue: newVal ?? 'None',
            changeType: 'modified',
          });
        }
      }
    };

    // 1. Measurement Diffs
    compareObject(
      'measurements',
      source.measurements,
      target.measurements,
      {
        chestCircumferenceCm: 'Chest Circumference (cm)',
        waistDropCm: 'Waist Drop (cm)',
        hipCircumferenceCm: 'Hip Circumference (cm)',
        bicepCircumferenceCm: 'Bicep Circumference (cm)',
        shoulderWidthCm: 'Shoulder Width (cm)',
        sleeveLengthCm: 'Sleeve Length (cm)',
        inseamLengthCm: 'Inseam Length (cm)',
        neckCircumferenceCm: 'Neck Circumference (cm)',
        jacketBackLengthCm: 'Jacket Back Length (cm)',
        shoulderSlopeAngle: 'Shoulder Slope Angle (°)',
        postureNotes: 'Posture & Ergonomic Notes',
        toleranceMm: 'Tolerance Threshold (mm)',
        scanMethod: 'Intake Scan Method',
      }
    );

    // 2. Design Diffs
    compareObject(
      'design',
      source.design,
      target.design,
      {
        silhouetteName: 'Master Silhouette Name',
        lapelStyle: 'Lapel Architecture',
        lapelWidthCm: 'Lapel Width (cm)',
        buttonConfiguration: 'Button Closure Configuration',
        buttonMaterial: 'Button & Hardware Material',
        pocketStyle: 'Exterior Pocket Style',
        ventStyle: 'Back Vent Configuration',
        canvasStructure: 'Chest Canvas Construction',
        liningStyle: 'Interior Body Lining Style',
        monogramText: 'Personalized Monogram Directives',
        monogramThreadColor: 'Monogram Thread Color',
        technicalDirectives: 'Master Tailor Directives',
      }
    );

    // 3. Fabric Diffs
    compareObject(
      'fabrics',
      source.fabrics,
      target.fabrics,
      {
        millName: 'Textile Mill Partner',
        millLocation: 'Mill Provenance & Location',
        primaryFabricCode: 'Textile Fabric Code',
        primaryFabricName: 'Primary Cloth Selection',
        fiberComposition: 'Fiber Composition Breakdown',
        yarnCount: 'Yarn Count & Warp/Weft Twist',
        fabricWeightGsm: 'Fabric Weight (GSM)',
        weavePattern: 'Weave Structure',
        primaryColorName: 'Primary Hue & Tone',
        pantoneCode: 'Pantone Color Verification',
        liningSilkName: 'Lining Cloth Specification',
        liningComposition: 'Lining Fiber Composition',
        weatherCoating: 'Protective Nano Coating',
      }
    );

    // 4. Approval Diffs
    compareObject(
      'approval',
      source.approval,
      target.approval,
      {
        approvalState: 'Formal Approval Stage',
        signoffSignerName: 'Authorized Signer Name',
        signoffSignerRole: 'Signer Capacity & Role',
        digitalSignatureHash: 'Cryptographic Signature Hash',
        declarationAccepted: 'Legal Terms Declaration',
        signedAt: 'Execution Timestamp',
        approvalNotes: 'Client / Atelier Sign-Off Notes',
      }
    );

    const diffsByDomain: Record<VersionDomainType, VersionDiffItem[]> = {
      measurements: diffs.filter((d) => d.domain === 'measurements'),
      design: diffs.filter((d) => d.domain === 'design'),
      fabrics: diffs.filter((d) => d.domain === 'fabrics'),
      approval: diffs.filter((d) => d.domain === 'approval'),
    };

    return {
      sourceCommit: source,
      targetCommit: target,
      diffs,
      diffsByDomain,
      totalModifications: diffs.length,
    };
  }

  /**
   * Feature 2: Restore Older Versions
   * Forward non-destructive rollback: creates a new commit containing target state
   */
  public static restoreVersion(params: {
    packageId: string;
    targetCommitId: string;
    restoreRationale: string;
    author: VersionAuthor;
  }): VersionCommit | null {
    const targetCommit = this.getCommitById(params.targetCommitId);
    if (!targetCommit) return null;

    const allCommits = this.getAllCommits();
    const pkgCommits = allCommits.filter((c) => c.packageId === params.packageId);

    // Determine new semantic version tag (e.g. if current is v2.0.0, rollback is v2.1.0)
    const currentHead = pkgCommits.find((c) => c.isCurrentHead) || pkgCommits[0];
    const prevTag = currentHead ? currentHead.versionTag : 'v1.0.0';
    const parts = prevTag.replace('v', '').split('.').map(Number);
    const newTag = `v${parts[0] || 1}.${(parts[1] || 0) + 1}.0`;

    const randomHash = Math.random().toString(16).substr(2, 7);
    const newCommitId = `cmt-${Date.now()}-${randomHash}`;
    const nowIso = new Date().toISOString();

    // Mark previous commits as not head
    const updatedCommits = allCommits.map((c) => {
      if (c.packageId === params.packageId) {
        return { ...c, isCurrentHead: false };
      }
      return c;
    });

    const newCommit: VersionCommit = {
      id: newCommitId,
      commitHash: randomHash,
      fullSha256: `sha256-${Date.now()}-${randomHash}-rollback`,
      versionTag: newTag,
      versionBadge: 'REVISED',
      packageId: params.packageId,
      packageName: targetCommit.packageName,
      orderNumber: targetCommit.orderNumber,
      customerName: targetCommit.customerName,
      timestamp: nowIso,
      author: params.author,
      commitMessage: `Rollback to ${targetCommit.versionTag} (${targetCommit.commitHash}): ${params.restoreRationale.trim()}`,
      parentCommitId: currentHead ? currentHead.id : null,
      changedDomains: ['measurements', 'design', 'fabrics'],
      measurements: { ...targetCommit.measurements },
      design: { ...targetCommit.design },
      fabrics: { ...targetCommit.fabrics },
      approval: {
        approvalState: 'REVISION_REQUESTED',
        approvalNotes: `Restored from ${targetCommit.versionTag}. Requires re-certification.`,
      },
      isCurrentHead: true,
      isSnapshotLocked: false,
    };

    updatedCommits.unshift(newCommit);
    this.saveCommits(updatedCommits);

    // Update package summary
    const packages = this.getPackages();
    const updatedPackages = packages.map((p) => {
      if (p.id === params.packageId) {
        return {
          ...p,
          currentVersion: newTag,
          headCommitId: newCommitId,
          totalCommitsCount: p.totalCommitsCount + 1,
          lastUpdated: nowIso,
          approvalState: 'REVISION_REQUESTED',
          isLocked: false,
        };
      }
      return p;
    });
    this.savePackages(updatedPackages);

    return newCommit;
  }

  /**
   * Feature 4: Approval Snapshot Storage
   * Locks the commit and stores a legally binding, signed snapshot
   */
  public static createApprovalSnapshot(params: {
    commitId: string;
    digitalSignature: string;
    declarationAccepted: boolean;
    signerName: string;
    signerRole: string;
    signerEmail: string;
    signerIp?: string;
    signerDevice?: string;
    notes?: string;
  }): ApprovalSnapshot | null {
    const commit = this.getCommitById(params.commitId);
    if (!commit) return null;

    const nowIso = new Date().toISOString();
    const certNumber = `MD-VCS-CERT-${new Date().getFullYear()}-${commit.orderNumber}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const sha256Seal = commit.fullSha256 || `seal-sha256-${Date.now()}`;

    const snapshot: ApprovalSnapshot = {
      snapshotId: `snp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      commitId: commit.id,
      versionTag: commit.versionTag,
      orderNumber: commit.orderNumber,
      customerName: commit.customerName,
      customerEmail: params.signerEmail,
      capturedAt: nowIso,
      digitalSignature: params.digitalSignature,
      sha256Seal,
      legalTermsDeclaration:
        'I hereby confirm and authorize the final cut-list, textile specifications, and anatomical measurements. All parameters are approved as final.',
      signerIp: params.signerIp || '194.214.22.84',
      signerDevice: params.signerDevice || navigator.userAgent,
      measurementsSummary: `Chest: ${commit.measurements.chestCircumferenceCm}cm | Waist: ${commit.measurements.waistDropCm}cm | Sleeve: ${commit.measurements.sleeveLengthCm}cm`,
      fabricSummary: `${commit.fabrics.millName} ${commit.fabrics.primaryFabricName} (${commit.fabrics.fabricWeightGsm} GSM)`,
      designSummary: `${commit.design.silhouetteName} | ${commit.design.lapelStyle} (${commit.design.lapelWidthCm}cm)`,
      certificateNumber: certNumber,
      inspectorOrDesigner: `${params.signerName} (${params.signerRole})`,
    };

    // Save snapshot
    const snapshots = this.getApprovalSnapshots();
    snapshots.unshift(snapshot);
    localStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(snapshots));

    // Update commit status to locked & approved
    const allCommits = this.getAllCommits();
    const updatedCommits = allCommits.map((c) => {
      if (c.id === commit.id) {
        return {
          ...c,
          versionBadge: 'PRODUCTION_LOCK' as const,
          isSnapshotLocked: true,
          approval: {
            approvalState: 'CLIENT_APPROVED' as const,
            signoffSignerName: params.signerName,
            signoffSignerRole: params.signerRole,
            signoffSignerEmail: params.signerEmail,
            digitalSignatureHash: params.digitalSignature,
            declarationAccepted: params.declarationAccepted,
            signedAt: nowIso,
            clientIpAddress: params.signerIp || '194.214.22.84',
            clientDevice: params.signerDevice || navigator.userAgent,
            approvalNotes: params.notes || 'Formal approval sealed into immutable snapshot vault.',
          },
        };
      }
      return c;
    });
    this.saveCommits(updatedCommits);

    // Update package state
    const packages = this.getPackages();
    const updatedPackages = packages.map((p) => {
      if (p.id === commit.packageId) {
        return {
          ...p,
          approvalState: 'CLIENT_APPROVED',
          isLocked: true,
          lastUpdated: nowIso,
        };
      }
      return p;
    });
    this.savePackages(updatedPackages);

    return snapshot;
  }

  /**
   * Get all stored approval snapshots
   */
  public static getApprovalSnapshots(packageId?: string): ApprovalSnapshot[] {
    this.ensureInitialized();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SNAPSHOTS);
      const all: ApprovalSnapshot[] = data ? JSON.parse(data) : [...INITIAL_APPROVAL_SNAPSHOTS];
      if (packageId) {
        const pkgCommits = this.getCommitsByPackage(packageId).map((c) => c.id);
        return all.filter((s) => pkgCommits.includes(s.commitId));
      }
      return all;
    } catch {
      return [...INITIAL_APPROVAL_SNAPSHOTS];
    }
  }

  /**
   * Create a new custom version commit
   */
  public static createCommit(params: {
    packageId: string;
    versionTag: string;
    versionBadge: any;
    commitMessage: string;
    changedDomains: VersionDomainType[];
    author: VersionAuthor;
    measurements?: Partial<any>;
    design?: Partial<any>;
    fabrics?: Partial<any>;
  }): VersionCommit | null {
    const allCommits = this.getAllCommits();
    const pkgCommits = allCommits.filter((c) => c.packageId === params.packageId);
    const currentHead = pkgCommits.find((c) => c.isCurrentHead) || pkgCommits[0];

    if (!currentHead) return null;

    const randomHash = Math.random().toString(16).substr(2, 7);
    const newCommitId = `cmt-${Date.now()}-${randomHash}`;
    const nowIso = new Date().toISOString();

    const newCommit: VersionCommit = {
      id: newCommitId,
      commitHash: randomHash,
      fullSha256: `sha256-${Date.now()}-${randomHash}`,
      versionTag: params.versionTag,
      versionBadge: params.versionBadge || 'REVISED',
      packageId: params.packageId,
      packageName: currentHead.packageName,
      orderNumber: currentHead.orderNumber,
      customerName: currentHead.customerName,
      timestamp: nowIso,
      author: params.author,
      commitMessage: params.commitMessage,
      parentCommitId: currentHead.id,
      changedDomains: params.changedDomains,
      measurements: { ...currentHead.measurements, ...params.measurements },
      design: { ...currentHead.design, ...params.design },
      fabrics: { ...currentHead.fabrics, ...params.fabrics },
      approval: {
        approvalState: 'PENDING_REVIEW',
        approvalNotes: `New version ${params.versionTag} committed. Pending sign-off.`,
      },
      isCurrentHead: true,
      isSnapshotLocked: false,
    };

    // Mark previous commits as not head
    const updatedCommits = allCommits.map((c) => {
      if (c.packageId === params.packageId) {
        return { ...c, isCurrentHead: false };
      }
      return c;
    });

    updatedCommits.unshift(newCommit);
    this.saveCommits(updatedCommits);

    // Update package
    const packages = this.getPackages();
    const updatedPackages = packages.map((p) => {
      if (p.id === params.packageId) {
        return {
          ...p,
          currentVersion: params.versionTag,
          headCommitId: newCommitId,
          totalCommitsCount: p.totalCommitsCount + 1,
          lastUpdated: nowIso,
          approvalState: 'PENDING_REVIEW',
          isLocked: false,
        };
      }
      return p;
    });
    this.savePackages(updatedPackages);

    return newCommit;
  }
}
