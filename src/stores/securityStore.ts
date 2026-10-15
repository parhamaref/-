/**
 * @file securityStore.ts
 * Enterprise reactive store for Daniel’s Maison Atelier Security & Settings.
 * Provides complete data management for Two-Factor Authentication, Login History,
 * Device Management, Session Management, Activity Audit Logs, Privacy Controls,
 * and Security Notification Preferences.
 */

import { useState, useEffect } from 'react';
import {
  TwoFactorState,
  LoginHistoryEntry,
  ManagedDevice,
  ActiveSession,
  ActivityLogEntry,
  PrivacySettings,
  SecurityNotificationPreferences,
  SecurityWorkspaceTab,
  TwoFactorMethod,
  ActivityCategory,
  ActivitySeverity,
  LoginAttemptStatus,
} from '../types/security.types';

// Mock realistic initial backup codes
const DEFAULT_BACKUP_CODES = [
  'DNL-8492-X91A',
  'DNL-3910-K28F',
  'DNL-7721-P94C',
  'DNL-1094-M83R',
  'DNL-5529-T44Q',
  'DNL-9302-W12B',
  'DNL-4819-H76S',
  'DNL-6204-V33Z',
];

const INITIAL_2FA_STATE: TwoFactorState = {
  isEnabled: true,
  method: 'totp',
  secretKey: 'JBSWY3DPEHPK3PXP-MDAN-2026',
  qrCodeSvgData: 'otpauth://totp/MaisonDaniels:daniel%40daniels-atelier.co.uk?secret=JBSWY3DPEHPK3PXP&issuer=MaisonDaniels',
  backupCodes: DEFAULT_BACKUP_CODES,
  usedBackupCodes: ['DNL-8492-X91A'],
  lastVerifiedAt: '2026-10-12T19:30:00Z',
  phoneNumber: '+44 7700 900482',
  securityKeys: [
    {
      id: 'key-yubikey-5c',
      name: 'YubiKey 5C NFC (Atelier Vault)',
      addedAt: '2026-03-15T11:20:00Z',
      lastUsedAt: '2026-10-11T09:14:00Z',
      credentialId: 'cred_daniels_fido2_8492019a',
    },
    {
      id: 'key-touch-id',
      name: 'MacBook Pro Touch ID (Master Studio)',
      addedAt: '2026-01-10T14:00:00Z',
      lastUsedAt: '2026-10-13T08:15:00Z',
      credentialId: 'cred_daniels_touchid_9921',
    },
  ],
  gracePeriodDays: 14,
};

const INITIAL_LOGIN_HISTORY: LoginHistoryEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-10-13T08:15:22Z',
    ipAddress: '82.165.197.42',
    location: {
      city: 'London',
      country: 'United Kingdom',
      countryCode: 'GB',
      flag: '🇬🇧',
    },
    device: {
      type: 'desktop',
      model: 'MacBook Pro M3 Max',
      os: 'macOS Sonoma 14.6',
      browser: 'Safari 17.5',
    },
    status: 'SUCCESS',
    riskScore: 2,
    isCurrent: true,
    mfaMethodUsed: 'totp',
  },
  {
    id: 'log-002',
    timestamp: '2026-10-13T06:40:11Z',
    ipAddress: '185.192.68.10',
    location: {
      city: 'London',
      country: 'United Kingdom',
      countryCode: 'GB',
      flag: '🇬🇧',
    },
    device: {
      type: 'mobile',
      model: 'iPhone 15 Pro',
      os: 'iOS 17.6',
      browser: 'Daniel’s Maison Atelier App 2.4',
    },
    status: 'SUCCESS',
    riskScore: 4,
    isCurrent: false,
    mfaMethodUsed: 'totp',
  },
  {
    id: 'log-003',
    timestamp: '2026-10-12T21:18:45Z',
    ipAddress: '93.184.216.34',
    location: {
      city: 'Paris',
      country: 'France',
      countryCode: 'FR',
      flag: '🇫🇷',
    },
    device: {
      type: 'desktop',
      model: 'iMac Pro 27"',
      os: 'macOS Monterey 12.7',
      browser: 'Chrome 124.0',
    },
    status: 'SUCCESS',
    riskScore: 12,
    isCurrent: false,
    mfaMethodUsed: 'totp',
  },
  {
    id: 'log-004',
    timestamp: '2026-10-12T14:02:19Z',
    ipAddress: '194.26.29.112',
    location: {
      city: 'Bucharest',
      country: 'Romania',
      countryCode: 'RO',
      flag: '🇷🇴',
    },
    device: {
      type: 'desktop',
      model: 'Generic Linux x86_64',
      os: 'Linux Ubuntu',
      browser: 'Headless Chrome / Automated',
    },
    status: 'SUSPICIOUS_BLOCKED',
    riskScore: 98,
    isCurrent: false,
    failureReason: 'Anomaly detected: automated crawler signature and IP blacklisted on Cloudflare threat radar.',
  },
  {
    id: 'log-005',
    timestamp: '2026-10-11T16:45:00Z',
    ipAddress: '151.101.65.140',
    location: {
      city: 'Milan',
      country: 'Italy',
      countryCode: 'IT',
      flag: '🇮🇹',
    },
    device: {
      type: 'tablet',
      model: 'iPad Pro 12.9"',
      os: 'iPadOS 17.5',
      browser: 'Mobile Safari',
    },
    status: 'CHALLENGE_MFA',
    riskScore: 28,
    isCurrent: false,
    mfaMethodUsed: 'totp',
  },
  {
    id: 'log-006',
    timestamp: '2026-10-10T09:12:33Z',
    ipAddress: '82.165.197.42',
    location: {
      city: 'London',
      country: 'United Kingdom',
      countryCode: 'GB',
      flag: '🇬🇧',
    },
    device: {
      type: 'desktop',
      model: 'MacBook Pro M3 Max',
      os: 'macOS Sonoma 14.6',
      browser: 'Safari 17.5',
    },
    status: 'SUCCESS',
    riskScore: 2,
    isCurrent: false,
    mfaMethodUsed: 'security_key',
  },
  {
    id: 'log-007',
    timestamp: '2026-10-09T22:04:18Z',
    ipAddress: '109.70.100.24',
    location: {
      city: 'Frankfurt',
      country: 'Germany',
      countryCode: 'DE',
      flag: '🇩🇪',
    },
    device: {
      type: 'desktop',
      model: 'Windows 11 Workstation',
      os: 'Windows 11',
      browser: 'Firefox 125.0',
    },
    status: 'FAILED',
    riskScore: 74,
    isCurrent: false,
    failureReason: 'Invalid secondary TOTP challenge passcode submitted (3 attempts exhausted).',
  },
];

const INITIAL_DEVICES: ManagedDevice[] = [
  {
    id: 'dev-01',
    deviceName: 'MacBook Pro M3 Max — Daniel Studio',
    deviceType: 'desktop',
    os: 'macOS Sonoma 14.6',
    browser: 'Safari 17.5',
    ipAddress: '82.165.197.42',
    location: 'Mayfair, London, UK',
    firstAuthorized: '2026-01-05T10:00:00Z',
    lastActive: 'Just now (Active)',
    isCurrentDevice: true,
    trustedUntil: '2026-11-15T00:00:00Z',
    status: 'active',
    fingerprint: 'fp_a9b1c8_m3max_london',
  },
  {
    id: 'dev-02',
    deviceName: 'iPhone 15 Pro — Daniel Primary Handset',
    deviceType: 'mobile',
    os: 'iOS 17.6',
    browser: 'Daniel’s Maison Atelier Native App',
    ipAddress: '185.192.68.10',
    location: 'London, UK (Cellular)',
    firstAuthorized: '2026-02-14T15:30:00Z',
    lastActive: '1 hour ago',
    isCurrentDevice: false,
    trustedUntil: '2026-12-01T00:00:00Z',
    status: 'active',
    fingerprint: 'fp_772e01_iphone15p_uk',
  },
  {
    id: 'dev-03',
    deviceName: 'iPad Pro 12.9" — VIP Fitting Salon Terminal',
    deviceType: 'tablet',
    os: 'iPadOS 17.5',
    browser: 'Mobile Safari (Kiosk Mode)',
    ipAddress: '82.165.197.48',
    location: 'Daniel’s Maison Showroom, London',
    firstAuthorized: '2026-03-01T09:00:00Z',
    lastActive: 'Yesterday at 16:45',
    isCurrentDevice: false,
    trustedUntil: '2026-10-30T00:00:00Z',
    status: 'active',
    fingerprint: 'fp_9934bb_ipadpro_salon',
  },
  {
    id: 'dev-04',
    deviceName: 'iMac Pro 27" — Paris Fashion Week Atelier Desk',
    deviceType: 'desktop',
    os: 'macOS Monterey 12.7',
    browser: 'Chrome 124.0',
    ipAddress: '93.184.216.34',
    location: 'Rue Saint-Honoré, Paris, France',
    firstAuthorized: '2026-06-20T12:00:00Z',
    lastActive: '2 days ago',
    isCurrentDevice: false,
    trustedUntil: '2026-10-25T00:00:00Z',
    status: 'active',
    fingerprint: 'fp_44c921_imac_paris',
  },
  {
    id: 'dev-05',
    deviceName: 'Savile Row CAD Pattern Cutting Terminal',
    deviceType: 'terminal',
    os: 'Ubuntu LTS 24.04',
    browser: 'Chromium Embedded',
    ipAddress: '82.165.197.90',
    location: 'Workshop Cutting Room 2, London',
    firstAuthorized: '2026-04-10T08:00:00Z',
    lastActive: '3 days ago',
    isCurrentDevice: false,
    trustedUntil: '2026-11-01T00:00:00Z',
    status: 'active',
    fingerprint: 'fp_1188aa_cutter_linux',
  },
];

const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: 'sess-curr-01',
    tokenFingerprint: 'md_tok_8492f..91a0 (SHA-256)',
    deviceId: 'dev-01',
    deviceName: 'MacBook Pro M3 Max — Daniel Studio',
    deviceType: 'desktop',
    ipAddress: '82.165.197.42',
    location: 'Mayfair, London, UK',
    browser: 'Safari 17.5 / macOS',
    createdTime: '2026-10-13T08:15:22Z',
    expiresTime: '2026-10-20T08:15:22Z (7 days)',
    lastPing: 'Active right now',
    isCurrent: true,
    role: 'Master Creative Director & Founder',
  },
  {
    id: 'sess-02',
    tokenFingerprint: 'md_tok_1094b..33ff (SHA-256)',
    deviceId: 'dev-02',
    deviceName: 'iPhone 15 Pro — Daniel Primary Handset',
    deviceType: 'mobile',
    ipAddress: '185.192.68.10',
    location: 'London, UK (Cellular)',
    browser: 'Daniel’s Maison iOS App 2.4',
    createdTime: '2026-10-13T06:40:11Z',
    expiresTime: '2026-11-13T06:40:11Z (30 days)',
    lastPing: '52 minutes ago',
    isCurrent: false,
    role: 'Master Creative Director & Founder',
  },
  {
    id: 'sess-03',
    tokenFingerprint: 'md_tok_5521e..84cc (SHA-256)',
    deviceId: 'dev-03',
    deviceName: 'iPad Pro 12.9" — VIP Fitting Salon Terminal',
    deviceType: 'tablet',
    ipAddress: '82.165.197.48',
    location: 'Daniel’s Maison Showroom, London',
    browser: 'Mobile Safari 17.5',
    createdTime: '2026-10-12T09:00:00Z',
    expiresTime: '2026-10-19T09:00:00Z (6 days)',
    lastPing: 'Yesterday at 16:45',
    isCurrent: false,
    role: 'Showroom Fitting Specialist',
  },
  {
    id: 'sess-04',
    tokenFingerprint: 'md_tok_7741d..99ee (SHA-256)',
    deviceId: 'dev-04',
    deviceName: 'iMac Pro 27" — Paris Fashion Week Atelier Desk',
    deviceType: 'desktop',
    ipAddress: '93.184.216.34',
    location: 'Rue Saint-Honoré, Paris, France',
    browser: 'Chrome 124.0 / macOS',
    createdTime: '2026-10-11T14:30:00Z',
    expiresTime: '2026-10-18T14:30:00Z (5 days)',
    lastPing: '2 days ago',
    isCurrent: false,
    role: 'International Liaison & Lead Designer',
  },
];

const INITIAL_ACTIVITY_LOGS: ActivityLogEntry[] = [
  {
    id: 'act-001',
    timestamp: '2026-10-13T08:18:44Z',
    category: 'AUTH',
    actor: {
      name: 'Daniel',
      role: 'Master Creative Director',
      email: 'daniel@daniels-atelier.co.uk',
      initials: 'D',
    },
    action: 'Session Authentication Succeeded',
    details: 'Completed biometric Touch ID + TOTP challenge on authorized studio device.',
    severity: 'INFO',
    ipAddress: '82.165.197.42',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
    metadata: {
      authMethod: 'WebAuthn Touch ID',
      device: 'MacBook Pro M3 Max',
      riskScore: 2,
    },
    verifiedSignature: 'sig_ed25519_88a910bf2e',
  },
  {
    id: 'act-002',
    timestamp: '2026-10-13T07:45:10Z',
    category: 'FINANCE',
    actor: {
      name: 'Daniel',
      role: 'Master Creative Director',
      email: 'daniel@daniels-atelier.co.uk',
      initials: 'D',
    },
    action: 'Exported Financial Invoices Ledger',
    details: 'Generated and encrypted CSV report covering 24 atelier invoices (£184,500 total volume).',
    severity: 'NOTICE',
    ipAddress: '82.165.197.42',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    metadata: {
      exportFormat: 'CSV',
      recordsCount: 24,
      totalVolumeGBP: 184500,
    },
    verifiedSignature: 'sig_ed25519_9941a3bc01',
  },
  {
    id: 'act-003',
    timestamp: '2026-10-12T19:30:00Z',
    category: 'SECURITY',
    actor: {
      name: 'Daniel',
      role: 'Master Creative Director',
      email: 'daniel@daniels-atelier.co.uk',
      initials: 'D',
    },
    action: 'Two-Factor Authentication Re-verified',
    details: 'Security audit routine: tested TOTP algorithm and verified active backup code pool.',
    severity: 'INFO',
    ipAddress: '82.165.197.42',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    metadata: {
      backupCodesRemaining: 7,
      authenticatorApp: 'Google Authenticator / 1Password',
    },
    verifiedSignature: 'sig_ed25519_110294fc99',
  },
  {
    id: 'act-004',
    timestamp: '2026-10-12T14:02:20Z',
    category: 'SECURITY',
    actor: {
      name: 'System Security Radar',
      role: 'Automated Threat Guard',
      email: 'security-bot@daniels-atelier.co.uk',
      initials: 'SG',
    },
    action: 'Suspicious Brute-Force Attempt Quarantined',
    details: 'Blocked rogue automated IP 194.26.29.112 attempting unauthorized admin API query.',
    severity: 'CRITICAL',
    ipAddress: '194.26.29.112',
    userAgent: 'Headless Chrome / Automated Script',
    metadata: {
      originGeo: 'Bucharest, RO',
      threatScore: 98,
      actionTaken: 'IP Firewall Ban 72h',
    },
    verifiedSignature: 'sig_ed25519_critical_00918',
  },
  {
    id: 'act-005',
    timestamp: '2026-10-11T15:20:18Z',
    category: 'ORDERS',
    actor: {
      name: 'Elena Rostova',
      role: 'Head of Client Concierge',
      email: 'elena@daniels-atelier.co.uk',
      initials: 'ER',
    },
    action: 'Biometric Fit Dossier Dispatched to Cutting Room',
    details: 'Commission #ORD-2026-894 (Savile Row Tuxedo) customer measurements released to Master Tailor.',
    severity: 'INFO',
    ipAddress: '82.165.197.48',
    userAgent: 'iPadOS / Safari',
    metadata: {
      orderId: 'ORD-2026-894',
      clientAnonymizedId: 'PATRON-9812',
      pointsOfFit: 18,
    },
    verifiedSignature: 'sig_ed25519_448831efaa',
  },
  {
    id: 'act-006',
    timestamp: '2026-10-10T11:10:05Z',
    category: 'API',
    actor: {
      name: 'Daniel',
      role: 'Master Creative Director',
      email: 'daniel@daniels-atelier.co.uk',
      initials: 'D',
    },
    action: 'Rotated ERP Production Sync API Key',
    details: 'Regenerated read-write token for Atelier Savile Row Fabric Loom telemetry webhook.',
    severity: 'WARNING',
    ipAddress: '82.165.197.42',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    metadata: {
      keyId: 'md_live_erp_sync_2026_rev3',
      previousKeyRevoked: true,
    },
    verifiedSignature: 'sig_ed25519_881923bcdd',
  },
  {
    id: 'act-007',
    timestamp: '2026-10-09T18:00:00Z',
    category: 'PRIVACY',
    actor: {
      name: 'Daniel',
      role: 'Master Creative Director',
      email: 'daniel@daniels-atelier.co.uk',
      initials: 'D',
    },
    action: 'Updated Atelier Privacy & Data Retention Policy',
    details: 'Enforced UK HMRC 7-year audit retention and automatic 90-day purging of bespoke consultation videos.',
    severity: 'NOTICE',
    ipAddress: '82.165.197.42',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    metadata: {
      retentionYears: 7,
      consultationVideoRetentionDays: 90,
    },
    verifiedSignature: 'sig_ed25519_330092ad11',
  },
];

const INITIAL_PRIVACY_SETTINGS: PrivacySettings = {
  atelierVisibility: 'PUBLIC',
  maskClientContactInfo: true,
  clientMeasurementRetentionMonths: 36,
  consultationMediaRetentionDays: 90,
  financialRecordRetentionYears: 7,
  anonymizeCompletedOrdersAfterMonths: 24,
  allowAnonymizedMarketplaceBenchmarking: true,
  enableAuditLoggingToClient: false,
  exportDataFormat: 'ENCRYPTED_ZIP',
};

const INITIAL_NOTIFICATION_PREFS: SecurityNotificationPreferences = {
  alertOnNewLogin: true,
  alertOnUnrecognizedDevice: true,
  alertOn2faChange: true,
  alertOnPasswordChange: true,
  alertOnPayoutAccountChange: true,
  alertOnRoleChange: true,
  alertOnBulkExport: true,
  notifyChannels: {
    in_app: true,
    email: true,
    sms: true,
    push: true,
  },
  quietHoursEnabled: true,
  quietHoursStart: '23:00',
  quietHoursEnd: '07:30',
  digestFrequency: 'INSTANT',
};

class SecurityStore {
  private activeTab: SecurityWorkspaceTab = '2fa';
  private twoFactor: TwoFactorState = INITIAL_2FA_STATE;
  private loginHistory: LoginHistoryEntry[] = INITIAL_LOGIN_HISTORY;
  private devices: ManagedDevice[] = INITIAL_DEVICES;
  private sessions: ActiveSession[] = INITIAL_SESSIONS;
  private activityLogs: ActivityLogEntry[] = INITIAL_ACTIVITY_LOGS;
  private privacy: PrivacySettings = INITIAL_PRIVACY_SETTINGS;
  private notificationPrefs: SecurityNotificationPreferences = INITIAL_NOTIFICATION_PREFS;

  // Filter states
  private loginSearch = '';
  private loginStatusFilter: LoginAttemptStatus | 'ALL' = 'ALL';
  private activityCategoryFilter: ActivityCategory | 'ALL' = 'ALL';
  private activitySeverityFilter: ActivitySeverity | 'ALL' = 'ALL';
  private activitySearch = '';

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('daniels_security_store_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.twoFactor) this.twoFactor = parsed.twoFactor;
        if (parsed.privacy) this.privacy = parsed.privacy;
        if (parsed.notificationPrefs) this.notificationPrefs = parsed.notificationPrefs;
        if (parsed.devices) this.devices = parsed.devices;
        if (parsed.sessions) this.sessions = parsed.sessions;
        if (parsed.loginHistory) this.loginHistory = parsed.loginHistory;
        if (parsed.activityLogs) this.activityLogs = parsed.activityLogs;
      }
    } catch {
      // ignore
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(
        'daniels_security_store_v1',
        JSON.stringify({
          twoFactor: this.twoFactor,
          privacy: this.privacy,
          notificationPrefs: this.notificationPrefs,
          devices: this.devices,
          sessions: this.sessions,
          loginHistory: this.loginHistory,
          activityLogs: this.activityLogs,
        })
      );
    } catch {
      // ignore
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((fn) => fn());
  }

  // Getters
  public getActiveTab(): SecurityWorkspaceTab {
    return this.activeTab;
  }

  public setActiveTab(tab: SecurityWorkspaceTab) {
    this.activeTab = tab;
    this.notify();
  }

  public getTwoFactor(): TwoFactorState {
    return this.twoFactor;
  }

  public getLoginHistory(): LoginHistoryEntry[] {
    return this.loginHistory;
  }

  public getDevices(): ManagedDevice[] {
    return this.devices;
  }

  public getSessions(): ActiveSession[] {
    return this.sessions;
  }

  public getActivityLogs(): ActivityLogEntry[] {
    return this.activityLogs;
  }

  public getPrivacySettings(): PrivacySettings {
    return this.privacy;
  }

  public getNotificationPreferences(): SecurityNotificationPreferences {
    return this.notificationPrefs;
  }

  // Filter Getters & Setters
  public getLoginFilters() {
    return {
      search: this.loginSearch,
      status: this.loginStatusFilter,
    };
  }

  public setLoginFilters(search: string, status: LoginAttemptStatus | 'ALL') {
    this.loginSearch = search;
    this.loginStatusFilter = status;
    this.notify();
  }

  public getActivityFilters() {
    return {
      category: this.activityCategoryFilter,
      severity: this.activitySeverityFilter,
      search: this.activitySearch,
    };
  }

  public setActivityFilters(
    category: ActivityCategory | 'ALL',
    severity: ActivitySeverity | 'ALL',
    search: string
  ) {
    this.activityCategoryFilter = category;
    this.activitySeverityFilter = severity;
    this.activitySearch = search;
    this.notify();
  }

  public getFilteredLoginHistory(): LoginHistoryEntry[] {
    return this.loginHistory.filter((entry) => {
      if (this.loginStatusFilter !== 'ALL' && entry.status !== this.loginStatusFilter) {
        return false;
      }
      if (this.loginSearch.trim()) {
        const q = this.loginSearch.toLowerCase();
        const matchesIp = entry.ipAddress.toLowerCase().includes(q);
        const matchesCity = entry.location.city.toLowerCase().includes(q);
        const matchesCountry = entry.location.country.toLowerCase().includes(q);
        const matchesDevice = entry.device.model.toLowerCase().includes(q);
        const matchesBrowser = entry.device.browser.toLowerCase().includes(q);
        if (!matchesIp && !matchesCity && !matchesCountry && !matchesDevice && !matchesBrowser) {
          return false;
        }
      }
      return true;
    });
  }

  public getFilteredActivityLogs(): ActivityLogEntry[] {
    return this.activityLogs.filter((entry) => {
      if (this.activityCategoryFilter !== 'ALL' && entry.category !== this.activityCategoryFilter) {
        return false;
      }
      if (this.activitySeverityFilter !== 'ALL' && entry.severity !== this.activitySeverityFilter) {
        return false;
      }
      if (this.activitySearch.trim()) {
        const q = this.activitySearch.toLowerCase();
        const matchesAction = entry.action.toLowerCase().includes(q);
        const matchesDetails = entry.details.toLowerCase().includes(q);
        const matchesActor = entry.actor.name.toLowerCase().includes(q);
        const matchesIp = entry.ipAddress.toLowerCase().includes(q);
        if (!matchesAction && !matchesDetails && !matchesActor && !matchesIp) {
          return false;
        }
      }
      return true;
    });
  }

  // 2FA Actions
  public toggleTwoFactor(enabled: boolean, verificationCode?: string) {
    if (enabled && verificationCode && verificationCode.length !== 6) {
      throw new Error('Please enter a valid 6-digit TOTP verification code.');
    }
    this.twoFactor = {
      ...this.twoFactor,
      isEnabled: enabled,
      lastVerifiedAt: new Date().toISOString(),
    };
    this.addActivityLog({
      category: 'SECURITY',
      action: enabled ? 'Two-Factor Authentication Enabled' : 'Two-Factor Authentication Disabled',
      details: enabled
        ? 'Activated TOTP authentication with Google Authenticator / 1Password verification.'
        : 'Two-Factor protection was turned off. Security alert dispatched to primary email.',
      severity: enabled ? 'INFO' : 'CRITICAL',
    });
    this.notify();
  }

  public setTwoFactorMethod(method: TwoFactorMethod) {
    this.twoFactor = {
      ...this.twoFactor,
      method,
    };
    this.addActivityLog({
      category: 'SECURITY',
      action: `2FA Primary Method Changed to ${method.toUpperCase()}`,
      details: `Switched verification channel to ${method.replace('_', ' ').toUpperCase()}.`,
      severity: 'NOTICE',
    });
    this.notify();
  }

  public generateNewSecretKey(): { secretKey: string; qrCodeSvgData: string } {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let newSecret = '';
    for (let i = 0; i < 16; i++) {
      newSecret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const formatted = `${newSecret}-MDAN-${new Date().getFullYear()}`;
    const qrCodeSvgData = `otpauth://totp/MaisonDaniels:daniel%40daniels-atelier.co.uk?secret=${newSecret}&issuer=MaisonDaniels`;
    this.twoFactor = {
      ...this.twoFactor,
      secretKey: formatted,
      qrCodeSvgData,
    };
    this.notify();
    return { secretKey: formatted, qrCodeSvgData };
  }

  public regenerateBackupCodes(): string[] {
    const newCodes: string[] = [];
    const hex = '0123456789ABCDEF';
    for (let i = 0; i < 8; i++) {
      const part1 = Math.floor(1000 + Math.random() * 9000);
      let part2 = '';
      for (let j = 0; j < 4; j++) {
        part2 += hex.charAt(Math.floor(Math.random() * hex.length));
      }
      newCodes.push(`DNL-${part1}-${part2}`);
    }
    this.twoFactor = {
      ...this.twoFactor,
      backupCodes: newCodes,
      usedBackupCodes: [],
    };
    this.addActivityLog({
      category: 'SECURITY',
      action: 'Emergency Backup Codes Regenerated',
      details: 'Old backup recovery codes invalidated; 8 new cryptographic recovery codes generated.',
      severity: 'NOTICE',
    });
    this.notify();
    return newCodes;
  }

  public addSecurityKey(name: string): void {
    const newKey = {
      id: `key-${Date.now()}`,
      name: name || 'FIDO2 Hardware Key',
      addedAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
      credentialId: `cred_md_${Math.random().toString(36).substring(2, 10)}`,
    };
    this.twoFactor = {
      ...this.twoFactor,
      securityKeys: [...this.twoFactor.securityKeys, newKey],
    };
    this.addActivityLog({
      category: 'SECURITY',
      action: `Hardware Security Key Registered: ${newKey.name}`,
      details: 'Registered WebAuthn credential for hardware authentication.',
      severity: 'INFO',
    });
    this.notify();
  }

  public removeSecurityKey(id: string): void {
    const target = this.twoFactor.securityKeys.find((k) => k.id === id);
    this.twoFactor = {
      ...this.twoFactor,
      securityKeys: this.twoFactor.securityKeys.filter((k) => k.id !== id),
    };
    this.addActivityLog({
      category: 'SECURITY',
      action: `Hardware Security Key Removed: ${target?.name || id}`,
      details: 'Hardware WebAuthn credential unregistered from atelier vault.',
      severity: 'WARNING',
    });
    this.notify();
  }

  // Device Management Actions
  public revokeDevice(deviceId: string): void {
    const target = this.devices.find((d) => d.id === deviceId);
    if (!target) return;
    this.devices = this.devices.map((d) =>
      d.id === deviceId ? { ...d, status: 'revoked', lastActive: 'Revoked' } : d
    );
    // Also remove associated active sessions
    this.sessions = this.sessions.filter((s) => s.deviceId !== deviceId);

    this.addActivityLog({
      category: 'SECURITY',
      action: `Authorized Device Revoked: ${target.deviceName}`,
      details: `Revoked certificate trust and terminated all token sessions for ${target.deviceType} (${target.ipAddress}).`,
      severity: 'WARNING',
    });
    this.notify();
  }

  public renameDevice(deviceId: string, newName: string): void {
    this.devices = this.devices.map((d) =>
      d.id === deviceId ? { ...d, deviceName: newName } : d
    );
    this.sessions = this.sessions.map((s) =>
      s.deviceId === deviceId ? { ...s, deviceName: newName } : s
    );
    this.notify();
  }

  public trustDeviceFor30Days(deviceId: string): void {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    this.devices = this.devices.map((d) =>
      d.id === deviceId
        ? { ...d, trustedUntil: futureDate.toISOString() }
        : d
    );
    this.notify();
  }

  // Session Management Actions
  public terminateSession(sessionId: string): void {
    const target = this.sessions.find((s) => s.id === sessionId);
    if (!target) return;
    if (target.isCurrent) {
      throw new Error('Cannot terminate your active current session from this button.');
    }
    this.sessions = this.sessions.filter((s) => s.id !== sessionId);
    this.addActivityLog({
      category: 'AUTH',
      action: `Session Terminated: ${target.deviceName}`,
      details: `Killed active token fingerprint ${target.tokenFingerprint} (${target.ipAddress}).`,
      severity: 'NOTICE',
    });
    this.notify();
  }

  public terminateAllOtherSessions(): number {
    const otherSessionsCount = this.sessions.filter((s) => !s.isCurrent).length;
    this.sessions = this.sessions.filter((s) => s.isCurrent);
    this.addActivityLog({
      category: 'SECURITY',
      action: 'Emergency Revocation: All Other Sessions Terminated',
      details: `Terminated ${otherSessionsCount} active sessions across all remote ateliers, mobile handsets, and showroom terminals.`,
      severity: 'CRITICAL',
    });
    this.notify();
    return otherSessionsCount;
  }

  // Privacy Settings Actions
  public updatePrivacySettings(partial: Partial<PrivacySettings>): void {
    this.privacy = { ...this.privacy, ...partial };
    this.addActivityLog({
      category: 'PRIVACY',
      action: 'Privacy & Data Retention Settings Modified',
      details: 'Updated atelier visibility, customer data retention thresholds, or contact masking rules.',
      severity: 'INFO',
    });
    this.notify();
  }

  // Notification Preferences Actions
  public updateNotificationPreferences(
    partial: Partial<SecurityNotificationPreferences>
  ): void {
    this.notificationPrefs = { ...this.notificationPrefs, ...partial };
    this.addActivityLog({
      category: 'SYSTEM',
      action: 'Security Notification Preferences Updated',
      details: 'Adjusted real-time security alert channels, quiet hours, or dispatch frequencies.',
      severity: 'INFO',
    });
    this.notify();
  }

  // Activity Log creation helper
  public addActivityLog(params: {
    category: ActivityCategory;
    action: string;
    details: string;
    severity: ActivitySeverity;
    metadata?: Record<string, unknown>;
  }): void {
    const newEntry: ActivityLogEntry = {
      id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      category: params.category,
      actor: {
        name: 'Daniel',
        role: 'Master Creative Director',
        email: 'daniel@daniels-atelier.co.uk',
        initials: 'D',
      },
      action: params.action,
      details: params.details,
      severity: params.severity,
      ipAddress: '82.165.197.42',
      userAgent: navigator.userAgent || 'Daniel’s Maison Workspace Desktop',
      metadata: params.metadata,
      verifiedSignature: `sig_ed25519_${Math.random().toString(36).substring(2, 10)}`,
    };
    this.activityLogs = [newEntry, ...this.activityLogs];
    this.notify();
  }

  // Export CSV Helpers
  public exportActivityLogsCsv(): void {
    const rows = [
      ['Timestamp', 'Category', 'Severity', 'Actor Name', 'Actor Email', 'Action', 'Details', 'IP Address', 'Signature'],
      ...this.activityLogs.map((log) => [
        log.timestamp,
        log.category,
        log.severity,
        log.actor.name,
        log.actor.email,
        `"${log.action.replace(/"/g, '""')}"`,
        `"${log.details.replace(/"/g, '""')}"`,
        log.ipAddress,
        log.verifiedSignature || 'N/A',
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `maison_daniels_activity_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public exportLoginHistoryCsv(): void {
    const rows = [
      ['Timestamp', 'Status', 'IP Address', 'City', 'Country', 'Device', 'OS', 'Browser', 'Risk Score', 'Failure Reason'],
      ...this.loginHistory.map((item) => [
        item.timestamp,
        item.status,
        item.ipAddress,
        item.location.city,
        item.location.country,
        `"${item.device.model.replace(/"/g, '""')}"`,
        `"${item.device.os.replace(/"/g, '""')}"`,
        `"${item.device.browser.replace(/"/g, '""')}"`,
        item.riskScore.toString(),
        `"${(item.failureReason || '').replace(/"/g, '""')}"`,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `maison_daniels_login_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public downloadGdprDataArchive(): void {
    const fullPayload = {
      atelier: 'Daniel’s Maison',
      exportDate: new Date().toISOString(),
      compliance: 'UK GDPR / Data Protection Act 2018',
      twoFactorStatus: this.twoFactor.isEnabled,
      activeSessions: this.sessions,
      authorizedDevices: this.devices,
      privacySettings: this.privacy,
      securityNotificationPreferences: this.notificationPrefs,
      recentAuditLogs: this.activityLogs,
      recentLoginAudit: this.loginHistory,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(fullPayload, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `maison_daniels_privacy_archive_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    this.addActivityLog({
      category: 'PRIVACY',
      action: 'Downloaded Complete Atelier GDPR Data Archive',
      details: 'Exported comprehensive JSON archive of atelier sessions, devices, and audit records.',
      severity: 'NOTICE',
    });
  }
}

export const securityStore = new SecurityStore();

export function useSecurityStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return securityStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  return {
    activeTab: securityStore.getActiveTab(),
    setActiveTab: (tab: SecurityWorkspaceTab) => securityStore.setActiveTab(tab),
    twoFactor: securityStore.getTwoFactor(),
    loginHistory: securityStore.getLoginHistory(),
    devices: securityStore.getDevices(),
    sessions: securityStore.getSessions(),
    activityLogs: securityStore.getActivityLogs(),
    privacy: securityStore.getPrivacySettings(),
    notificationPrefs: securityStore.getNotificationPreferences(),

    // Filters
    loginFilters: securityStore.getLoginFilters(),
    setLoginFilters: (s: string, st: LoginAttemptStatus | 'ALL') =>
      securityStore.setLoginFilters(s, st),
    activityFilters: securityStore.getActivityFilters(),
    setActivityFilters: (
      c: ActivityCategory | 'ALL',
      sev: ActivitySeverity | 'ALL',
      s: string
    ) => securityStore.setActivityFilters(c, sev, s),

    filteredLoginHistory: securityStore.getFilteredLoginHistory(),
    filteredActivityLogs: securityStore.getFilteredActivityLogs(),

    // Actions
    toggleTwoFactor: (enabled: boolean, code?: string) =>
      securityStore.toggleTwoFactor(enabled, code),
    setTwoFactorMethod: (m: TwoFactorMethod) => securityStore.setTwoFactorMethod(m),
    generateNewSecretKey: () => securityStore.generateNewSecretKey(),
    regenerateBackupCodes: () => securityStore.regenerateBackupCodes(),
    addSecurityKey: (name: string) => securityStore.addSecurityKey(name),
    removeSecurityKey: (id: string) => securityStore.removeSecurityKey(id),

    revokeDevice: (id: string) => securityStore.revokeDevice(id),
    renameDevice: (id: string, name: string) => securityStore.renameDevice(id, name),
    trustDeviceFor30Days: (id: string) => securityStore.trustDeviceFor30Days(id),

    terminateSession: (id: string) => securityStore.terminateSession(id),
    terminateAllOtherSessions: () => securityStore.terminateAllOtherSessions(),

    updatePrivacySettings: (p: Partial<PrivacySettings>) =>
      securityStore.updatePrivacySettings(p),
    updateNotificationPreferences: (p: Partial<SecurityNotificationPreferences>) =>
      securityStore.updateNotificationPreferences(p),

    exportActivityLogsCsv: () => securityStore.exportActivityLogsCsv(),
    exportLoginHistoryCsv: () => securityStore.exportLoginHistoryCsv(),
    downloadGdprDataArchive: () => securityStore.downloadGdprDataArchive(),
  };
}
