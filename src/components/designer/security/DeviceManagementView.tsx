/**
 * @file DeviceManagementView.tsx
 * Manage authorized workstations, mobile devices, and showroom terminals.
 * Allows renaming, extending 30-day trust certificates, and instant revocation.
 */

import React, { useState } from 'react';
import {
  Laptop,
  Smartphone,
  Tablet,
  Monitor,
  ShieldCheck,
  ShieldX,
  Edit2,
  Clock,
  MapPin,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Fingerprint,
} from 'lucide-react';
import { useSecurityStore } from '../../../stores/securityStore';
import { ManagedDevice } from '../../../types/security.types';

export const DeviceManagementView: React.FC = () => {
  const { devices, revokeDevice, renameDevice, trustDeviceFor30Days } = useSecurityStore();

  const [editingDeviceId, setEditingDeviceId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [revokingDevice, setRevokingDevice] = useState<ManagedDevice | null>(null);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-5 h-5 text-purple-400" />;
      case 'tablet':
        return <Tablet className="w-5 h-5 text-cyan-400" />;
      case 'terminal':
        return <Monitor className="w-5 h-5 text-emerald-400" />;
      default:
        return <Laptop className="w-5 h-5 text-amber-400" />;
    }
  };

  const handleStartRename = (device: ManagedDevice) => {
    setEditingDeviceId(device.id);
    setEditNameValue(device.deviceName);
  };

  const handleSaveRename = (deviceId: string) => {
    if (editNameValue.trim()) {
      renameDevice(deviceId, editNameValue.trim());
    }
    setEditingDeviceId(null);
  };

  const handleConfirmRevoke = () => {
    if (revokingDevice) {
      revokeDevice(revokingDevice.id);
      setRevokingDevice(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn font-mono text-left">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-5">
        <div>
          <div className="flex items-center gap-2 text-white text-[10px] uppercase tracking-widest mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>CERTIFICATE TRUST REGISTRY</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl text-white font-bold uppercase tracking-wider">
            Authorized Atelier Devices
          </h3>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            Hardware units authorized to access Daniel’s Maison pattern archives, financials, and CRM.
          </p>
        </div>

        <div className="text-xs text-neutral-400">
          <span className="text-white font-bold">{devices.filter((d) => d.status === 'active').length}</span> active
          hardware units
        </div>
      </div>

      {/* Revoke Confirmation Modal */}
      {revokingDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#121212] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
                <ShieldX className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                  Revoke Device Authorization
                </h4>
                <span className="text-xs text-rose-300 font-mono">Immediate session termination</span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              Are you sure you want to revoke trust for{' '}
              <strong className="text-white">{revokingDevice.deviceName}</strong>? Any open
              sessions on this device will be immediately invalidated and require full MFA re-authentication.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRevokingDevice(null)}
                className="px-4 py-2 border border-neutral-700 text-neutral-300 hover:text-white text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRevoke}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
              >
                Revoke Device
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Device List Cards */}
      <div className="space-y-4">
        {devices.map((device) => {
          const isRevoked = device.status === 'revoked';
          return (
            <div
              key={device.id}
              className={`p-5 rounded-2xl border transition-all ${
                device.isCurrentDevice
                  ? 'bg-[#151515] border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : isRevoked
                  ? 'bg-[#090909] border-[#1C1C1C] opacity-60'
                  : 'bg-[#0E0E0E] border-[#222] hover:border-neutral-700'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Device Identity */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#181818] border border-[#2B2B2B] flex items-center justify-center shrink-0">
                    {getDeviceIcon(device.deviceType)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {editingDeviceId === device.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editNameValue}
                            onChange={(e) => setEditNameValue(e.target.value)}
                            className="px-2 py-1 bg-black border border-amber-500 rounded text-xs text-white font-bold"
                          />
                          <button
                            onClick={() => handleSaveRename(device.id)}
                            className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingDeviceId(null)}
                            className="p-1 text-neutral-400 hover:bg-neutral-800 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-bold text-white text-sm">
                            {device.deviceName}
                          </h4>
                          <button
                            onClick={() => handleStartRename(device)}
                            className="text-neutral-500 hover:text-neutral-300 p-1"
                            title="Rename Device"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {device.isCurrentDevice && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider">
                          THIS DEVICE
                        </span>
                      )}

                      {isRevoked ? (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold uppercase tracking-wider">
                          REVOKED
                        </span>
                      ) : (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-wider">
                          AUTHORIZED
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-neutral-400 font-sans">
                      {device.os} • {device.browser}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-neutral-400" />
                        <span>{device.location}</span>
                      </span>
                      <span>IP: {device.ipAddress}</span>
                      <span className="flex items-center gap-1">
                        <Fingerprint className="w-3 h-3 text-neutral-400" />
                        <span className="font-mono text-[10px]">{device.fingerprint}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                  {!isRevoked && (
                    <>
                      <button
                        onClick={() => trustDeviceFor30Days(device.id)}
                        className="px-3 py-1.5 bg-[#181818] hover:bg-[#222] border border-[#333] text-neutral-300 text-xs rounded-lg transition-colors flex items-center gap-1.5"
                        title="Extend 30-Day Biometric Trust Certificate"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Trust 30 Days</span>
                      </button>

                      {!device.isCurrentDevice && (
                        <button
                          onClick={() => setRevokingDevice(device)}
                          className="px-3 py-1.5 border border-rose-500/30 hover:border-rose-500/60 bg-rose-500/10 text-rose-400 text-xs rounded-lg transition-colors flex items-center gap-1.5"
                          title="Revoke Device"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Revoke</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
