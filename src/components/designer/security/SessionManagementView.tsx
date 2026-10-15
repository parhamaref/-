/**
 * @file SessionManagementView.tsx
 * Real-time Active Session Inspector & Emergency Revocation Kill-Switch.
 * Monitors token cryptographic fingerprints, active pings, and remote session termination.
 */

import React, { useState } from 'react';
import {
  KeyRound,
  ShieldAlert,
  LogOut,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  AlertOctagon,
  CheckCircle,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useSecurityStore } from '../../../stores/securityStore';
import { ActiveSession } from '../../../types/security.types';

export const SessionManagementView: React.FC = () => {
  const { sessions, terminateSession, terminateAllOtherSessions } = useSecurityStore();

  const [confirmTerminateAll, setConfirmTerminateAll] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  const otherSessions = sessions.filter((s) => !s.isCurrent);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-purple-400" />;
      case 'tablet':
        return <Tablet className="w-5 h-5 text-cyan-400" />;
      default:
        return <Laptop className="w-5 h-5 text-amber-400" />;
    }
  };

  const handleTerminateAll = () => {
    const killedCount = terminateAllOtherSessions();
    setConfirmTerminateAll(false);
    setSuccessBanner(`Terminated ${killedCount} remote session tokens immediately.`);
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  const handleSingleTerminate = (session: ActiveSession) => {
    try {
      terminateSession(session.id);
      setSuccessBanner(`Session on ${session.deviceName} was terminated.`);
      setTimeout(() => setSuccessBanner(''), 4000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error terminating session.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-mono text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-5">
        <div>
          <div className="flex items-center gap-2 text-white text-[10px] uppercase tracking-widest mb-1">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>SESSION RUNTIME SENTINEL</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-white font-bold uppercase tracking-wider">
            Active Atelier Sessions
          </h3>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Cryptographic authentication tokens currently active across browsers, mobile apps, and workshop kiosks.
          </p>
        </div>

        {otherSessions.length > 0 && (
          <button
            onClick={() => setConfirmTerminateAll(true)}
            className="self-start sm:self-auto px-4 py-2.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/80 text-rose-300 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-rose-950/20"
          >
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>Terminate All Other Sessions</span>
          </button>
        )}
      </div>

      {/* Success Banner */}
      {successBanner && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Confirmation Modal for Terminate All */}
      {confirmTerminateAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121212] border border-rose-500/50 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                  Emergency Revocation Kill-Switch
                </h4>
                <span className="text-xs text-rose-300 font-mono">Immediate global sign-out</span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              This action will instantly invalidate{' '}
              <strong className="text-white">{otherSessions.length} active sessions</strong> across
              all remote workstations, mobile devices, and fitting showroom tablets. Only your current
              session will remain authenticated.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmTerminateAll(false)}
                className="px-4 py-2 border border-neutral-700 text-neutral-300 hover:text-white text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleTerminateAll}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Terminate All Other Sessions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Cards */}
      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={`p-5 rounded-2xl border transition-all ${
              session.isCurrent
                ? 'bg-[#151515] border-amber-500/40 shadow-lg shadow-amber-500/5'
                : 'bg-[#0E0E0E] border-[#222] hover:border-neutral-700'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#2B2B2B] flex items-center justify-center shrink-0">
                  {getDeviceIcon(session.deviceType)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-white text-sm">
                      {session.deviceName}
                    </h4>

                    {session.isCurrent && (
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider">
                        CURRENT ACTIVE SESSION
                      </span>
                    )}

                    <span className="text-[10px] text-neutral-400 font-mono">
                      Role: <span className="text-neutral-200">{session.role}</span>
                    </span>
                  </div>

                  <div className="text-xs text-neutral-400 font-sans">
                    {session.browser}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-neutral-400" />
                      <span>{session.location}</span>
                    </span>
                    <span>IP: {session.ipAddress}</span>
                    <span className="flex items-center gap-1 font-mono text-[10px] text-amber-400/80">
                      Token: {session.tokenFingerprint}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <Clock className="w-3 h-3" />
                      <span>{session.lastPing}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="self-start md:self-center">
                {session.isCurrent ? (
                  <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold font-mono">
                    ● ACTIVE STREAM
                  </span>
                ) : (
                  <button
                    onClick={() => handleSingleTerminate(session)}
                    className="px-3.5 py-1.5 border border-rose-500/30 hover:border-rose-500/60 bg-rose-500/10 text-rose-400 text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Terminate</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
