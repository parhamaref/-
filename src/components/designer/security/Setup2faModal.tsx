/**
 * @file Setup2faModal.tsx
 * Interactive modal for configuring Time-Based One-Time Password (TOTP)
 * Authenticator app integration with QR code visualization and backup code generation.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  X,
  Copy,
  Check,
  QrCode,
  KeyRound,
  Download,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { useSecurityStore } from '../../../stores/securityStore';

interface Setup2faModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Setup2faModal: React.FC<Setup2faModalProps> = ({ isOpen, onClose }) => {
  const { twoFactor, toggleTwoFactor, generateNewSecretKey, regenerateBackupCodes } =
    useSecurityStore();
  const [step, setStep] = useState<'scan' | 'verify' | 'backup'>('scan');
  const [verificationCode, setVerificationCode] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCodes, setCopiedCodes] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(twoFactor.secretKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyBackupCodes = () => {
    navigator.clipboard.writeText(twoFactor.backupCodes.join('\n'));
    setCopiedCodes(true);
    setTimeout(() => setCopiedCodes(false), 2000);
  };

  const handleDownloadBackupCodes = () => {
    const text = `DANIEL’S MAISON — ATELIER VAULT RECOVERY CODES\nGenerated: ${new Date().toISOString()}\nAccount: daniel@daniels-atelier.co.uk\n\n${twoFactor.backupCodes
      .map((c, i) => `[${i + 1}] ${c}`)
      .join('\n')}\n\nKEEP THESE CODES IN AN ENCRYPTED KEYCHAIN OR PHYSICAL SAFE.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daniels-2fa-backup-codes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim().length !== 6) {
      setErrorMsg('Please enter a 6-digit verification code.');
      return;
    }
    setErrorMsg('');
    try {
      toggleTwoFactor(true, verificationCode.trim());
      setStep('backup');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Invalid code.');
    }
  };

  const handleFinish = () => {
    onClose();
    setStep('scan');
    setVerificationCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0D0D0D] border border-[#2D2D2D] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 relative shadow-2xl text-left font-mono">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-[#222] pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-white uppercase tracking-wider">
              Configure Two-Factor Authentication
            </h3>
            <p className="text-xs text-neutral-400 font-sans">
              Protect your atelier financials, private customer measurements, and bespoke orders.
            </p>
          </div>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-wider">
          <div
            className={`py-1.5 rounded-lg border ${
              step === 'scan'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold'
                : 'border-neutral-800 text-neutral-500'
            }`}
          >
            1. Scan QR
          </div>
          <div
            className={`py-1.5 rounded-lg border ${
              step === 'verify'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold'
                : 'border-neutral-800 text-neutral-500'
            }`}
          >
            2. Verify Code
          </div>
          <div
            className={`py-1.5 rounded-lg border ${
              step === 'backup'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 font-bold'
                : 'border-neutral-800 text-neutral-500'
            }`}
          >
            3. Backup Codes
          </div>
        </div>

        {/* STEP 1: SCAN QR */}
        {step === 'scan' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#141414] border border-[#252525] p-5 rounded-xl">
              {/* Simulated High-Res SVG QR Code */}
              <div className="w-40 h-40 bg-white p-3 rounded-lg flex flex-col items-center justify-center shrink-0 shadow-inner">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  shapeRendering="crispEdges"
                >
                  <rect width="100" height="100" fill="#FFFFFF" />
                  {/* Position detection markers */}
                  <rect x="5" y="5" width="26" height="26" fill="#000000" />
                  <rect x="9" y="9" width="18" height="18" fill="#FFFFFF" />
                  <rect x="13" y="13" width="10" height="10" fill="#000000" />

                  <rect x="69" y="5" width="26" height="26" fill="#000000" />
                  <rect x="73" y="9" width="18" height="18" fill="#FFFFFF" />
                  <rect x="77" y="13" width="10" height="10" fill="#000000" />

                  <rect x="5" y="69" width="26" height="26" fill="#000000" />
                  <rect x="9" y="73" width="18" height="18" fill="#FFFFFF" />
                  <rect x="13" y="77" width="10" height="10" fill="#000000" />

                  {/* Decorative QR matrix pattern */}
                  <rect x="36" y="8" width="6" height="6" fill="#000000" />
                  <rect x="46" y="14" width="6" height="6" fill="#000000" />
                  <rect x="56" y="8" width="6" height="6" fill="#000000" />
                  <rect x="40" y="24" width="8" height="6" fill="#000000" />
                  <rect x="12" y="38" width="6" height="6" fill="#000000" />
                  <rect x="22" y="44" width="8" height="6" fill="#000000" />
                  <rect x="36" y="38" width="6" height="14" fill="#000000" />
                  <rect x="46" y="46" width="14" height="6" fill="#000000" />
                  <rect x="66" y="38" width="6" height="14" fill="#000000" />
                  <rect x="78" y="44" width="8" height="8" fill="#000000" />
                  <rect x="44" y="64" width="12" height="6" fill="#000000" />
                  <rect x="38" y="76" width="8" height="12" fill="#000000" />
                  <rect x="56" y="72" width="6" height="18" fill="#000000" />
                  <rect x="70" y="66" width="18" height="6" fill="#000000" />
                  <rect x="80" y="78" width="12" height="12" fill="#000000" />
                </svg>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-neutral-300 font-sans leading-relaxed">
                  Open your preferred authenticator app (e.g.{' '}
                  <strong className="text-white">Google Authenticator</strong>,{' '}
                  <strong className="text-white">1Password</strong>, or{' '}
                  <strong className="text-white">Apple Keychain</strong>) and scan the QR code.
                </p>
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Can't scan? Use Manual Secret Key:
                  </span>
                  <div className="flex items-center gap-2 bg-[#090909] border border-[#333] px-3 py-2 rounded-lg font-mono text-xs text-amber-300 select-all">
                    <span className="truncate flex-1">{twoFactor.secretKey}</span>
                    <button
                      onClick={handleCopyKey}
                      className="text-neutral-400 hover:text-white transition-colors"
                      title="Copy Secret Key"
                    >
                      {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => generateNewSecretKey()}
                className="text-[11px] text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Regenerate Key</span>
              </button>
              <button
                type="button"
                onClick={() => setStep('verify')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
              >
                Proceed to Verification →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: VERIFY CODE */}
        {step === 'verify' && (
          <form onSubmit={handleVerify} className="space-y-5">
            <p className="text-xs text-neutral-300 font-sans">
              Enter the 6-digit temporary verification code displayed in your authenticator app to activate two-factor enforcement:
            </p>

            <div className="space-y-2">
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                6-Digit Security Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000 000"
                autoFocus
                className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 bg-[#121212] border border-[#333] rounded-xl text-amber-400 focus:outline-none focus:border-amber-500/80 transition-all placeholder:text-neutral-700"
              />
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-lg">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('scan')}
                className="px-4 py-2 border border-neutral-700 text-neutral-300 hover:text-white text-xs rounded-lg transition-colors"
              >
                ← Back to QR
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
              >
                Verify & Activate
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: BACKUP RECOVERY CODES */}
        {step === 'backup' && (
          <div className="space-y-5">
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2.5">
              <Check className="w-5 h-5 shrink-0" />
              <span>Two-factor authentication is now active for your atelier account!</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Emergency Recovery Codes (Save Securely)
                </label>
                <button
                  onClick={() => regenerateBackupCodes()}
                  className="text-[10px] text-amber-400 hover:underline"
                >
                  Regenerate
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans">
                If you ever lose access to your device, each code can be used once to access the atelier:
              </p>

              <div className="grid grid-cols-2 gap-2 bg-[#141414] border border-[#262626] p-4 rounded-xl font-mono text-xs text-amber-300">
                {twoFactor.backupCodes.map((code, idx) => (
                  <div key={idx} className="flex items-center gap-2 py-1 px-2 bg-black/40 rounded border border-neutral-800">
                    <span className="text-[9px] text-neutral-600 select-none">#{idx + 1}</span>
                    <span className="select-all">{code}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyBackupCodes}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-200 rounded-lg transition-colors"
              >
                {copiedCodes ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCodes ? 'Copied Codes' : 'Copy All Codes'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadBackupCodes}
                className="flex items-center gap-1.5 px-3.5 py-2 border border-neutral-700 hover:border-neutral-500 text-xs text-neutral-200 rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="ml-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
