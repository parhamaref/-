/**
 * @file RequestMeasurementsModal.tsx
 * Modal to dispatch a formal anatomical measurement verification request to the client.
 * Allows selecting specific body parameters, urgency levels, and tailoring instructions.
 */

import React, { useState } from 'react';
import {
  X,
  Ruler,
  AlertTriangle,
  AlertCircle,
  Check,
  HelpCircle,
  Clock,
  Sparkles,
  FileText,
} from 'lucide-react';
import { MeasurementRequestPayload } from '../../../types/communication.types';

export interface RequestMeasurementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  orderNumber?: string;
  garmentName?: string;
  onRequest: (payload: MeasurementRequestPayload) => void;
}

const COMMON_MEASUREMENT_FIELDS = [
  'Chest Circumference',
  'Natural Waist Circumference',
  'Hip Circumference',
  'Shoulder Width',
  'Right Shoulder Slope',
  'Left Shoulder Slope',
  'Armhole Depth',
  'Sleeve Outer Inseam',
  'Neck Circumference',
  'Bicep Girth',
  'Trouser Outseam Length',
  'Inside Leg (Inseam)',
];

export const RequestMeasurementsModal: React.FC<RequestMeasurementsModalProps> = ({
  isOpen,
  onClose,
  customerName,
  orderNumber,
  garmentName,
  onRequest,
}) => {
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'Right Shoulder Slope',
    'Armhole Depth',
  ]);
  const [urgency, setUrgency] = useState<'Standard' | 'Urgent' | 'Critical Before Cutting'>('Urgent');
  const [tailorNote, setTailorNote] = useState(
    'Please verify with a flexible tailor tape while wearing a lightweight shirt, standing with natural posture.'
  );
  const [customFieldInput, setCustomFieldInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleAddCustomField = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customFieldInput.trim()) {
      e.preventDefault();
      const val = customFieldInput.trim();
      if (!selectedFields.includes(val)) {
        setSelectedFields([...selectedFields, val]);
      }
      setCustomFieldInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFields.length === 0) {
      setError('Please select at least one anatomical measurement field to verify.');
      return;
    }

    onRequest({
      fieldsRequested: selectedFields,
      urgency,
      tailorNote: tailorNote.trim(),
      status: 'pending',
      unit: 'cm',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#0D0D0D] border border-[#2B2B2B] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] bg-[#141414] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-mono uppercase tracking-wider text-white font-medium">
                Request Anatomical Measurements
              </h3>
              <p className="text-[11px] text-neutral-400 font-sans">
                Prompt {customerName} for tailored dimension clarification ({orderNumber || 'General Fitting'}).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xs hover:bg-[#222] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs font-mono">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xs flex items-center gap-2 text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Garment Association Summary */}
          {garmentName && (
            <div className="p-3 bg-[#141414] border border-[#222] rounded-xs flex items-center justify-between text-neutral-300 text-xs">
              <span>Target Garment:</span>
              <span className="text-amber-400 font-bold">{garmentName}</span>
            </div>
          )}

          {/* 1. Urgency Level */}
          <div>
            <label className="block text-xs uppercase text-neutral-300 mb-1.5">
              Urgency / Production Milestone
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Standard', desc: 'Routine fitting check' },
                { id: 'Urgent', desc: 'Workshop awaiting reply' },
                { id: 'Critical Before Cutting', desc: 'Cloth cutting paused' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setUrgency(item.id as any)}
                  className={`p-2.5 rounded-xs border text-left cursor-pointer transition-colors ${
                    urgency === item.id
                      ? item.id === 'Critical Before Cutting'
                        ? 'border-rose-500 bg-rose-950/30 text-rose-200'
                        : 'border-amber-400 bg-amber-400/10 text-white font-bold'
                      : 'border-[#222] bg-[#141414] text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="block font-bold text-[11px]">{item.id}</span>
                  <span className="text-[9px] text-neutral-500 block mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Select Fields Needed */}
          <div className="space-y-2">
            <label className="block text-xs uppercase text-neutral-300 flex items-center justify-between">
              <span>Select Anatomical Fields to Verify ({selectedFields.length} Selected)</span>
              <span className="text-amber-400 text-[10px]">Click to toggle</span>
            </label>

            <div className="grid grid-cols-2 gap-1.5">
              {COMMON_MEASUREMENT_FIELDS.map((field) => {
                const isSelected = selectedFields.includes(field);
                return (
                  <button
                    key={field}
                    type="button"
                    onClick={() => toggleField(field)}
                    className={`p-2 rounded-xs border text-left text-[11px] transition-colors cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400/15 text-white font-medium'
                        : 'border-[#222] bg-[#141414] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="truncate">{field}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              placeholder="Or add custom measurement parameter and press Enter..."
              value={customFieldInput}
              onChange={(e) => setCustomFieldInput(e.target.value)}
              onKeyDown={handleAddCustomField}
              className="w-full px-3 py-1.5 bg-[#141414] border border-[#2B2B2B] rounded-xs text-white text-xs placeholder:text-neutral-600 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {/* 3. Tailor Instructions */}
          <div>
            <label className="block text-xs uppercase text-neutral-300 mb-1.5">
              Tailoring Instructions & Measurement Guide Note
            </label>
            <textarea
              rows={3}
              value={tailorNote}
              onChange={(e) => setTailorNote(e.target.value)}
              className="w-full px-3 py-2 bg-[#141414] border border-[#2B2B2B] rounded-xs text-white text-xs font-sans focus:border-amber-400 focus:outline-none leading-relaxed"
            />
            <p className="text-[10px] text-neutral-500 mt-1">
              This message and interactive input form will be rendered directly in {customerName}'s chat and portal.
            </p>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#222] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-xs bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Ruler className="w-3.5 h-3.5" />
              Send Measurement Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
