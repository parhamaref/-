/**
 * @file TwoFactorAuthView.tsx
 * Comprehensive Two-Factor Authentication workspace.
 * Controls TOTP authenticator status, FIDO2 / YubiKey hardware keys,
 * SMS backup channels, and emergency recovery code archives.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Smartphone,
  Key,
  MessageSquare,
  Lock,
  Download,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useSecurityStore } from '../../../stores/securityStore';
import { Setup2faModal } from './Setup2faModal';
import { TwoFactorMethod } from '../../../types/security.types';

export const TwoFactorAuthView: React.FC = () => {
  const {
    twoFactor,
    toggleTwoFactor,
    setTwoFactorMethod,
    regenerateBackupCodes,
    addSecurityKey,
    removeSecurityKey,
  } = useSecurityStore();

  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [isAddingKey, setIsAddingKey] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [showDisableConfirm, setShowDisableConfirm] = useState(false);

  const remainingCodesCount =
    twoFactor.backupCodes.length - (twoFactor.usedBackupCodes?.length || 0);

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(twoFactor.backupCodes.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleAddKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    addSecurityKey(newKeyName.trim());
    setNewKeyName('');
    setIsAddingKey(false);
  };

  const handleDisable2fa = () => {
    toggleTwoFactor(false);
    setShowDisableConfirm(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn font-mono text-left">
      <Setup2faModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
      />

      {/* Top Banner Status */}
      <div className="bg-gradient-to-r from-[#141414] via-[#101010] to-[#0A0A0A] border border-[#262626] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                twoFactor.isEnabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}
            >
              {twoFactor.isEnabled ? (
                <ShieldCheck className="w-8 h-8" />
              ) : (
                <ShieldAlert className="w-8 h-8" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white uppercase tracking-wider">
                  Two-Factor Authentication (2FA)
                </h3>
                <span
                  className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-widest font-bold border ${
                    twoFactor.isEnabled
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                  }`}
                >
                  {twoFactor.isEnabled ? 'ENFORCED & ACTIVE' : 'DISABLED'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans max-w-2xl leading-relaxed">
                Add an extra layer of biometric or token security to your Daniel’s Maison atelier.
                Requires your master password plus a secondary verification passcode whenever signing in
                or performing high-impact financial and client data exports.
              </p>
              {twoFactor.isEnabled && twoFactor.lastVerifiedAt && (
                <div className="text-[10px] text-neutral-500 pt-1">
                  Last verified:{' '}
                  <span className="text-neutral-300">
                    {new Date(twoFactor.lastVerifiedAt).toLocaleString('en-GB')}
                  </span>{' '}
                  • Active Method:{' '}
                  <span className="text-amber-400 uppercase font-bold">
                    {twoFactor.method}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {twoFactor.isEnabled ? (
              <>
                <button
                  onClick={() => setIsSetupModalOpen(true)}
                  className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl border border-neutral-700 transition-colors"
                >
                  Reconfigure App
                </button>
                <button
                  onClick={() => setShowDisableConfirm(true)}
                  className="px-4 py-2.5 border border-rose-500/30 hover:border-rose-500/60 bg-rose-500/10 text-rose-400 text-xs rounded-xl transition-colors"
                >
                  Disable 2FA
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsSetupModalOpen(true)}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20"
              >
                Enable 2FA Protection Now →
              </button>
            )}
          </div>
        </div>

        {/* Disable Confirmation Dropdown */}
        {showDisableConfirm && (
          <div className="mt-6 p-4 bg-rose-950/40 border border-rose-800/60 rounded-xl space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Are you sure you want to deactivate Two-Factor Authentication?</span>
            </div>
            <p className="text-xs text-rose-200/80 font-sans">
              Deactivating 2FA lowers atelier compliance. Sensitive client bespoke measurements,
              cutting patterns, and Stripe payout routes will rely exclusively on single-password auth.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleDisable2fa}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs rounded-lg font-bold"
              >
                Confirm Deactivation
              </button>
              <button
                onClick={() => setShowDisableConfirm(false)}
                className="px-3.5 py-1.5 border border-neutral-700 text-neutral-300 text-xs rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Methods Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
            Verification Channels
          </h4>
          <span className="text-[11px] text-neutral-400">
            Choose your primary challenge channel
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Method 1: TOTP App */}
          <div
            onClick={() => setTwoFactorMethod('totp')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
              twoFactor.method === 'totp'
                ? 'bg-[#151515] border-amber-500/50 shadow-md shadow-amber-500/5'
                : 'bg-[#0E0E0E] border-[#222] hover:border-neutral-700'
            }`}
          >
            {twoFactor.method === 'totp' && (
              <span className="absolute top-4 right-4 text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase tracking-wider">
                PRIMARY
              </span>
            )}
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <Smartphone className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-white text-sm mb-1">Authenticator App</h5>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-4">
              Time-based one-time codes generated via Google Authenticator, 1Password, or Authy.
            </p>
            <div className="text-[10px] text-neutral-500 font-mono">
              Status: <span className="text-emerald-400">Standard RFC-6238 TOTP</span>
            </div>
          </div>

          {/* Method 2: Hardware Keys */}
          <div
            onClick={() => setTwoFactorMethod('security_key')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
              twoFactor.method === 'security_key'
                ? 'bg-[#151515] border-amber-500/50 shadow-md shadow-amber-500/5'
                : 'bg-[#0E0E0E] border-[#222] hover:border-neutral-700'
            }`}
          >
            {twoFactor.method === 'security_key' && (
              <span className="absolute top-4 right-4 text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase tracking-wider">
                PRIMARY
              </span>
            )}
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Key className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-white text-sm mb-1">Hardware Security Key</h5>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-4">
              Cryptographic FIDO2 / WebAuthn tokens such as YubiKey 5C or Touch ID biometrics.
            </p>
            <div className="text-[10px] text-neutral-500 font-mono">
              Registered:{' '}
              <span className="text-cyan-400">
                {twoFactor.securityKeys.length} active keys
              </span>
            </div>
          </div>

          {/* Method 3: SMS Fallback */}
          <div
            onClick={() => setTwoFactorMethod('sms')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
              twoFactor.method === 'sms'
                ? 'bg-[#151515] border-amber-500/50 shadow-md shadow-amber-500/5'
                : 'bg-[#0E0E0E] border-[#222] hover:border-neutral-700'
            }`}
          >
            {twoFactor.method === 'sms' && (
              <span className="absolute top-4 right-4 text-[9px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase tracking-wider">
                PRIMARY
              </span>
            )}
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h5 className="font-bold text-white text-sm mb-1">SMS Verification Code</h5>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed mb-4">
              One-time passcodes sent via carrier cellular network to registered mobile handset.
            </p>
            <div className="text-[10px] text-neutral-500 font-mono">
              Phone: <span className="text-purple-300">{twoFactor.phoneNumber}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Keys & Backup Codes Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hardware Security Keys List */}
        <div className="bg-[#0E0E0E] border border-[#222] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#222] pb-4">
            <div>
              <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <span>Hardware Security Keys</span>
              </h4>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Physical FIDO2 / WebAuthn tokens for phishing-resistant access.
              </p>
            </div>
            <button
              onClick={() => setIsAddingKey(true)}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-lg flex items-center gap-1.5 border border-neutral-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Key</span>
            </button>
          </div>

          {isAddingKey && (
            <form
              onSubmit={handleAddKeySubmit}
              className="p-4 bg-[#141414] border border-[#333] rounded-xl space-y-3 animate-fadeIn"
            >
              <div className="text-xs text-neutral-300 font-bold">Register New FIDO2 Key</div>
              <input
                type="text"
                placeholder="e.g. YubiKey 5 NFC (Travel Key)"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                autoFocus
                className="w-full px-3 py-2 bg-[#090909] border border-[#333] rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsAddingKey(false)}
                  className="px-3 py-1.5 border border-neutral-700 text-neutral-300 text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg transition-colors"
                >
                  Register Key
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {twoFactor.securityKeys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between p-3.5 bg-[#141414] border border-[#222] rounded-xl"
              >
                <div className="space-y-0.5">
                  <div className="text-xs text-white font-bold">{key.name}</div>
                  <div className="text-[10px] text-neutral-400">
                    Added: {new Date(key.addedAt).toLocaleDateString()} • Last used:{' '}
                    {new Date(key.lastUsedAt).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => removeSecurityKey(key.id)}
                  className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-500/10"
                  title="Remove Security Key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Backup Codes Archive */}
        <div className="bg-[#0E0E0E] border border-[#222] rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#222] pb-4">
            <div>
              <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Backup Recovery Codes</span>
              </h4>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                {remainingCodesCount} of {twoFactor.backupCodes.length} codes remaining. Single-use access.
              </p>
            </div>
            <button
              onClick={() => regenerateBackupCodes()}
              className="px-3 py-1.5 border border-neutral-700 hover:border-neutral-500 text-neutral-300 text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono text-xs">
            {twoFactor.backupCodes.map((code, idx) => {
              const isUsed = twoFactor.usedBackupCodes?.includes(code);
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border flex items-center justify-between ${
                    isUsed
                      ? 'bg-neutral-900/40 border-neutral-800 text-neutral-600 line-through'
                      : 'bg-[#141414] border-[#252525] text-amber-300'
                  }`}
                >
                  <span className="text-[10px] text-neutral-500 select-none">#{idx + 1}</span>
                  <span className="select-all">{code}</span>
                  {isUsed && (
                    <span className="text-[9px] uppercase tracking-wider text-rose-500/80 font-bold ml-1">
                      USED
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCopyCodes}
              className="flex-1 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedCodes ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Codes</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                const text = `DANIEL’S MAISON — BACKUP CODES\n${twoFactor.backupCodes.join('\n')}`;
                const blob = new Blob([text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `daniels-vault-codes-${new Date().toISOString().slice(0, 10)}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex-1 py-2 border border-neutral-700 hover:border-neutral-500 text-neutral-200 text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
