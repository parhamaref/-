/**
 * @file security.types.ts
 * Enterprise type definitions for the Daniel’s Maison Atelier Security & Settings Module.
 * Covers Two-Factor Authentication, Login History, Device Management, Session Management,
 * Activity Audit Logs, Privacy Compliance, and Security Notification Preferences.
 */

export type TwoFactorMethod = 'totp' | 'sms' | 'security_key';

export interface SecurityKeyItem {
  id: string;
  name: string;
  addedAt: string;
  lastUsedAt: string;
  credentialId: string;
}

export interface TwoFactorState {
  isEnabled: boolean;
  method: TwoFactorMethod;
  secretKey: string;
  qrCodeSvgData: string;
  backupCodes: string[];
  usedBackupCodes: string[];
  lastVerifiedAt: string;
  phoneNumber?: string;
  securityKeys: SecurityKeyItem[];
  gracePeriodDays: number;
}

export type LoginAttemptStatus = 'SUCCESS' | 'FAILED' | 'CHALLENGE_MFA' | 'SUSPICIOUS_BLOCKED';

export interface LoginHistoryEntry {
  id: string;
  timestamp: string;
  ipAddress: string;
  location: {
    city: string;
    country: string;
    countryCode: string;
    flag: string;
  };
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    model: string;
    os: string;
    browser: string;
  };
  status: LoginAttemptStatus;
  riskScore: number; // 0 - 100
  isCurrent: boolean;
  failureReason?: string;
  mfaMethodUsed?: TwoFactorMethod;
}

export interface ManagedDevice {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'terminal';
  os: string;
  browser: string;
  ipAddress: string;
  location: string;
  firstAuthorized: string;
  lastActive: string;
  isCurrentDevice: boolean;
  trustedUntil: string;
  status: 'active' | 'revoked';
  fingerprint: string;
}

export interface ActiveSession {
  id: string;
  tokenFingerprint: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'terminal';
  ipAddress: string;
  location: string;
  browser: string;
  createdTime: string;
  expiresTime: string;
  lastPing: string;
  isCurrent: boolean;
  role: string;
}

export type ActivityCategory =
  | 'AUTH'
  | 'SECURITY'
  | 'FINANCE'
  | 'CATALOG'
  | 'ORDERS'
  | 'PRIVACY'
  | 'SYSTEM'
  | 'API';

export type ActivitySeverity = 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL';

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  category: ActivityCategory;
  actor: {
    name: string;
    role: string;
    email: string;
    initials: string;
  };
  action: string;
  details: string;
  severity: ActivitySeverity;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, unknown>;
  verifiedSignature?: string;
}

export interface PrivacySettings {
  atelierVisibility: 'PUBLIC' | 'VERIFIED_ONLY' | 'PRIVATE_BESPOKE';
  maskClientContactInfo: boolean;
  clientMeasurementRetentionMonths: number;
  consultationMediaRetentionDays: number;
  financialRecordRetentionYears: number;
  anonymizeCompletedOrdersAfterMonths: number;
  allowAnonymizedMarketplaceBenchmarking: boolean;
  enableAuditLoggingToClient: boolean;
  exportDataFormat: 'JSON' | 'CSV' | 'ENCRYPTED_ZIP';
}

export interface SecurityNotificationPreferences {
  alertOnNewLogin: boolean;
  alertOnUnrecognizedDevice: boolean;
  alertOn2faChange: boolean;
  alertOnPasswordChange: boolean;
  alertOnPayoutAccountChange: boolean;
  alertOnRoleChange: boolean;
  alertOnBulkExport: boolean;
  notifyChannels: {
    in_app: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  digestFrequency: 'INSTANT' | 'DAILY_DIGEST' | 'WEEKLY_SECURITY_RECAP';
}

export type SecurityWorkspaceTab =
  | '2fa'
  | 'login_history'
  | 'devices'
  | 'sessions'
  | 'activity_logs'
  | 'privacy'
  | 'notifications';
