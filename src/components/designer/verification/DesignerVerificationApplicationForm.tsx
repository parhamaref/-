/**
 * @file DesignerVerificationApplicationForm.tsx
 * Multi-step intake wizard for submitting Designer Verification dossiers.
 *
 * Steps:
 * 1. Identity Verification (Gov ID, proof of address, facial liveness)
 * 2. Business Verification (Entity, Tax/VAT, Workshop proof, Certificates)
 * 3. Portfolio Verification (Heritage, Guilds, Press, Master Garment works)
 * 4. Declaration & Final Submission
 */

import React, { useState } from 'react';
import {
  DesignerVerificationApplication,
  GovernmentIdType,
  BusinessEntityType,
} from '../../../types/designerVerification.types';
import {
  X,
  UserCheck,
  Building2,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Scissors,
} from 'lucide-react';

interface DesignerVerificationApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appData: Omit<DesignerVerificationApplication, 'id' | 'submittedAt' | 'updatedAt' | 'auditTrail'>) => Promise<void>;
  defaultDesignerName?: string;
  defaultBrandName?: string;
}

export const DesignerVerificationApplicationForm: React.FC<DesignerVerificationApplicationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultDesignerName = 'Daniel de Saint-Germain',
  defaultBrandName = 'Daniel’s Maison Paris',
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [designerName, setDesignerName] = useState(defaultDesignerName);
  const [brandName, setBrandName] = useState(defaultBrandName);
  const [avatarUrl] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80');

  // Step 1: Identity
  const [fullName, setFullName] = useState(defaultDesignerName);
  const [dob, setDob] = useState('1986-04-12');
  const [nationality, setNationality] = useState('French');
  const [idType, setIdType] = useState<GovernmentIdType>('passport');
  const [idNumber, setIdNumber] = useState('FR88192011');
  const [idDocUrl, setIdDocUrl] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&q=80');
  const [idExpiry, setIdExpiry] = useState('2032-10-15');
  const [addressProofUrl, setAddressProofUrl] = useState('https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80');

  // Step 2: Business
  const [legalName, setLegalName] = useState(`${defaultBrandName} SARL`);
  const [tradeName, setTradeName] = useState(defaultBrandName);
  const [entityType, setEntityType] = useState<BusinessEntityType>('Maison Haute Couture');
  const [regNumber, setRegNumber] = useState('RCS Paris B 893 219 044');
  const [taxVat, setTaxVat] = useState('FR 32 893219044');
  const [regCountry, setRegCountry] = useState('France');
  const [regAddress, setRegAddress] = useState('18 Rue de la Paix, 75002 Paris');
  const [workshopAddress, setWorkshopAddress] = useState('18 Rue de la Paix, Atelier Niveau 3, 75002 Paris');
  const [certIncorpUrl, setCertIncorpUrl] = useState('https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80');
  const [taxCertUrl, setTaxCertUrl] = useState('https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&q=80');

  // Step 3: Portfolio
  const [bio, setBio] = useState('Artisanal master tailor specializing in Savile Row structured coats, canvas basting, and hand-pleated bespoke evening gowns.');
  const [yearsInPractice, setYearsInPractice] = useState(15);
  const [atelierCity, setAtelierCity] = useState('Paris');
  const [atelierCountry, setAtelierCountry] = useState('France');
  const [pressInput, setPressInput] = useState('Vogue France, GQ Savile Row Spotlight, L\'Officiel');
  const [guildInput, setGuildInput] = useState('Chambre Syndicale de la Couture, Master Tailors Guild');
  const [workTitle, setWorkTitle] = useState('Floating Canvas Silk Tuxedo');
  const [workCategory, setWorkCategory] = useState<'Haute Couture' | 'Bespoke Tailoring' | 'Eveningwear' | 'Bridal Couture' | 'Outerwear'>('Bespoke Tailoring');
  const [workTechniques, setWorkTechniques] = useState('Hand pick stitching, Horsehair canvas, Hand-welted pocket');

  // Step 4: Declaration
  const [agreedToStandards, setAgreedToStandards] = useState(true);

  if (!isOpen) return null;

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToStandards) return;

    setIsSubmitting(true);
    try {
      const payload: Omit<DesignerVerificationApplication, 'id' | 'submittedAt' | 'updatedAt' | 'auditTrail'> = {
        designerId: `designer-${Date.now()}`,
        designerName,
        brandName,
        avatarUrl,
        status: 'Submitted',
        priority: 'Normal',
        identity: {
          fullName,
          dateOfBirth: dob,
          nationality,
          idType,
          idNumberMasked: idNumber.length > 4 ? `${idNumber.slice(0, 2)}••••${idNumber.slice(-4)}` : idNumber,
          idDocumentUrl: idDocUrl,
          idExpiryDate: idExpiry,
          proofOfAddressUrl: addressProofUrl,
          biometricVerificationScore: 99.2,
          sanctionsCheckPassed: true,
          status: 'pending',
        },
        business: {
          legalEntityName: legalName,
          tradeName,
          entityType,
          registrationNumber: regNumber,
          taxVatNumber: taxVat,
          registeredCountry: regCountry,
          registeredAddress: regAddress,
          workshopAddress,
          certificateOfIncorporationUrl: certIncorpUrl,
          taxRegistrationCertificateUrl: taxCertUrl,
          atelierFacilityPhotos: [
            'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&q=80',
          ],
          status: 'pending',
        },
        portfolio: {
          bioAndHeritage: bio,
          yearsInPractice,
          atelierCity,
          atelierCountry,
          pressMentions: pressInput.split(',').map((s) => s.trim()).filter(Boolean),
          guildAffiliations: guildInput.split(',').map((s) => s.trim()).filter(Boolean),
          works: [
            {
              id: `work-${Date.now()}`,
              title: workTitle,
              collectionYear: new Date().getFullYear(),
              category: workCategory,
              craftTechniques: workTechniques.split(',').map((s) => s.trim()).filter(Boolean),
              imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
              materialsUsed: ['Dormeuil Super 160s', 'Pure Mulberry Silk'],
            },
          ],
          status: 'pending',
        },
      };

      await onSubmit(payload);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl p-6 md:p-8 my-8 text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-neutral-800">
          <div>
            <span className="text-[10px] font-mono uppercase text-amber-400 tracking-widest">
              Artisan Accreditation Application
            </span>
            <h3 className="text-xl font-serif text-white tracking-wide mt-0.5">
              Daniel’s Maison Guild Verification Dossier
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 my-6">
          {[
            { num: 1, label: 'Identity', icon: UserCheck },
            { num: 2, label: 'Business', icon: Building2 },
            { num: 3, label: 'Portfolio', icon: Sparkles },
            { num: 4, label: 'Review', icon: CheckCircle },
          ].map((st) => {
            const Icon = st.icon;
            const isDone = currentStep > st.num;
            const isCur = currentStep === st.num;
            return (
              <div
                key={st.num}
                onClick={() => st.num < currentStep && setCurrentStep(st.num)}
                className={`p-2.5 rounded-lg border text-center transition cursor-pointer ${
                  isCur
                    ? 'bg-amber-950/40 border-amber-600/70 text-amber-300'
                    : isDone
                    ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
                    : 'bg-neutral-950/50 border-neutral-800 text-neutral-500'
                }`}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-mono font-bold">0{st.num}</span>
                </div>
                <span className="text-[11px] block truncate">{st.label}</span>
              </div>
            );
          })}
        </div>

        {/* Step 1: Identity */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-400" />
              Pillar I: Government Identity & Biometric Verification
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Nationality *</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Government ID Type *</label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value as GovernmentIdType)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="passport">Passport (International)</option>
                  <option value="national_id">National Identity Card</option>
                  <option value="residence_permit">Permanent Residence Permit</option>
                  <option value="artisan_guild_card">Guild Certified Artisan Card</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Document Number *</label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">ID Expiry Date *</label>
                <input
                  type="date"
                  value={idExpiry}
                  onChange={(e) => setIdExpiry(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-mono text-neutral-400 mb-1">ID Document Scan URL *</label>
              <input
                type="text"
                value={idDocUrl}
                onChange={(e) => setIdDocUrl(e.target.value)}
                className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1">Proof of Address URL *</label>
              <input
                type="text"
                value={addressProofUrl}
                onChange={(e) => setAddressProofUrl(e.target.value)}
                className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>
        )}

        {/* Step 2: Business */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              Pillar II: Legal Business Registration & Atelier Workshop
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Legal Entity Name *</label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Trade / Atelier Brand Name *</label>
                <input
                  type="text"
                  value={tradeName}
                  onChange={(e) => setTradeName(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Entity Type *</label>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value as BusinessEntityType)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Maison Haute Couture">Maison Haute Couture</option>
                  <option value="Limited Liability Company (LLC / SARL)">Limited Liability Company (LLC / SARL)</option>
                  <option value="Private Limited (Ltd / GmbH)">Private Limited (Ltd / GmbH)</option>
                  <option value="Sole Proprietor">Sole Proprietor</option>
                  <option value="Artisan Tailoring Partnership">Artisan Tailoring Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Company / Chamber Registration # *</label>
                <input
                  type="text"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Tax / VAT Registration # *</label>
                <input
                  type="text"
                  value={taxVat}
                  onChange={(e) => setTaxVat(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Jurisdiction / Country *</label>
                <input
                  type="text"
                  value={regCountry}
                  onChange={(e) => setRegCountry(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1">Registered Legal Address *</label>
              <input
                type="text"
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1">Craftsmanship Workshop Address *</label>
              <input
                type="text"
                value={workshopAddress}
                onChange={(e) => setWorkshopAddress(e.target.value)}
                className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* Step 3: Portfolio */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Scissors className="w-4 h-4 text-amber-400" />
              Pillar III: Artisanal Craftsmanship & Couture Portfolio
            </h4>
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1">Atelier Bio & Heritage Story *</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Years in Practice *</label>
                <input
                  type="number"
                  value={yearsInPractice}
                  onChange={(e) => setYearsInPractice(Number(e.target.value))}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Atelier City *</label>
                <input
                  type="text"
                  value={atelierCity}
                  onChange={(e) => setAtelierCity(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Country *</label>
                <input
                  type="text"
                  value={atelierCountry}
                  onChange={(e) => setAtelierCountry(e.target.value)}
                  className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1">Press Mentions (comma separated)</label>
              <input
                type="text"
                value={pressInput}
                onChange={(e) => setPressInput(e.target.value)}
                className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1">Guild & Artisan Affiliations</label>
              <input
                type="text"
                value={guildInput}
                onChange={(e) => setGuildInput(e.target.value)}
                className="w-full text-xs bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Showcase Garment Item */}
            <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-3">
              <span className="text-[10px] font-mono uppercase text-amber-400">Featured Showcase Garment</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Garment Title</label>
                  <input
                    type="text"
                    value={workTitle}
                    onChange={(e) => setWorkTitle(e.target.value)}
                    className="w-full text-xs bg-neutral-900 border border-neutral-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">Category</label>
                  <select
                    value={workCategory}
                    onChange={(e) => setWorkCategory(e.target.value as any)}
                    className="w-full text-xs bg-neutral-900 border border-neutral-700 rounded p-2 text-white"
                  >
                    <option value="Bespoke Tailoring">Bespoke Tailoring</option>
                    <option value="Haute Couture">Haute Couture</option>
                    <option value="Eveningwear">Eveningwear</option>
                    <option value="Bridal Couture">Bridal Couture</option>
                    <option value="Outerwear">Outerwear</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1">Handcraft Techniques Used</label>
                <input
                  type="text"
                  value={workTechniques}
                  onChange={(e) => setWorkTechniques(e.target.value)}
                  className="w-full text-xs bg-neutral-900 border border-neutral-700 rounded p-2 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Legal Declaration */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Pillar Review & Haute Couture Declaration
            </h4>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3 text-xs">
              <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                <span className="text-neutral-400 font-mono">Designer / Brand:</span>
                <span className="text-white font-medium">{designerName} ({brandName})</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                <span className="text-neutral-400 font-mono">Government ID:</span>
                <span className="text-white font-medium">{idType.toUpperCase()} ({nationality})</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                <span className="text-neutral-400 font-mono">Business Entity:</span>
                <span className="text-white font-medium">{legalName} - {regCountry}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                <span className="text-neutral-400 font-mono">Atelier Workshop:</span>
                <span className="text-white font-medium">{workshopAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400 font-mono">Showcase Garment:</span>
                <span className="text-white font-medium">{workTitle} ({workCategory})</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs text-amber-200/90 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToStandards}
                  onChange={(e) => setAgreedToStandards(e.target.checked)}
                  className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="leading-relaxed">
                  I solemnly certify that all submitted identification, incorporation records, and workshop documentation represent authentic artisanal operations. I agree to Daniel's Maison Standards Council code of ethics and audit procedures.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-neutral-800">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((prev) => prev - 1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-700 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition disabled:opacity-30"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold tracking-wide transition shadow-lg"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting || !agreedToStandards}
              onClick={handleFinalSubmit}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-semibold tracking-wide transition shadow-lg disabled:opacity-50"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting Dossier...' : 'Submit Accreditation Dossier'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
