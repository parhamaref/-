/**
 * @file designerVerification.types.ts
 * Type Definitions for Daniel’s Maison Designer Verification System.
 *
 * Core Statuses:
 * - Submitted
 * - Under Review
 * - More Information Required
 * - Approved
 * - Rejected
 *
 * Verification Pillars:
 * - Identity Verification
 * - Business Verification
 * - Portfolio Verification
 */

export type VerificationStatus =
  | 'Submitted'
  | 'Under Review'
  | 'More Information Required'
  | 'Approved'
  | 'Rejected';

export type PillarStatus = 'unverified' | 'pending' | 'verified' | 'rejected' | 'flagged';

export type GovernmentIdType =
  | 'passport'
  | 'national_id'
  | 'residence_permit'
  | 'artisan_guild_card';

export type BusinessEntityType =
  | 'Sole Proprietor'
  | 'Limited Liability Company (LLC / SARL)'
  | 'Private Limited (Ltd / GmbH)'
  | 'Maison Haute Couture'
  | 'Artisan Tailoring Partnership';

export interface IdentityVerificationData {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  idType: GovernmentIdType;
  idNumberMasked: string;
  idDocumentUrl: string;
  idExpiryDate: string;
  proofOfAddressUrl: string;
  biometricVerificationScore?: number; // e.g. 98.6%
  sanctionsCheckPassed: boolean;
  status: PillarStatus;
  verifiedAt?: string;
  reviewerNotes?: string;
}

export interface BusinessVerificationData {
  legalEntityName: string;
  tradeName: string;
  entityType: BusinessEntityType;
  registrationNumber: string;
  taxVatNumber: string;
  registeredCountry: string;
  registeredAddress: string;
  workshopAddress: string;
  certificateOfIncorporationUrl: string;
  taxRegistrationCertificateUrl: string;
  atelierFacilityPhotos: string[];
  status: PillarStatus;
  verifiedAt?: string;
  reviewerNotes?: string;
}

export interface PortfolioWorkItem {
  id: string;
  title: string;
  collectionYear: number;
  category: 'Haute Couture' | 'Bespoke Tailoring' | 'Eveningwear' | 'Bridal Couture' | 'Outerwear';
  craftTechniques: string[];
  imageUrl: string;
  materialsUsed: string[];
  clientDescription?: string;
}

export interface PortfolioVerificationData {
  bioAndHeritage: string;
  yearsInPractice: number;
  atelierCity: string;
  atelierCountry: string;
  pressMentions: string[];
  guildAffiliations: string[];
  works: PortfolioWorkItem[];
  status: PillarStatus;
  verifiedAt?: string;
  reviewerNotes?: string;
}

export interface VerificationAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: 'Designer' | 'Standards Council' | 'Chief Curator';
  fromStatus: VerificationStatus | 'Draft';
  toStatus: VerificationStatus;
  comment: string;
}

export interface QueryRequirementItem {
  id: string;
  field: string;
  requirement: string;
  fulfilled: boolean;
  designerResponse?: string;
  documentUrl?: string;
}

export interface MoreInformationQuery {
  requestedAt: string;
  requestedBy: string;
  notes: string;
  deadlineDate: string;
  items: QueryRequirementItem[];
  designerRespondedAt?: string;
  designerExplanation?: string;
}

export interface DesignerVerificationApplication {
  id: string;
  designerId: string;
  designerName: string;
  brandName: string;
  avatarUrl: string;
  submittedAt: string;
  updatedAt: string;
  status: VerificationStatus;
  priority: 'High' | 'Normal' | 'VIP';
  assignedReviewer?: string;
  assignedReviewerRole?: string;

  // 3 Verification Pillars
  identity: IdentityVerificationData;
  business: BusinessVerificationData;
  portfolio: PortfolioVerificationData;

  // Active query if 'More Information Required'
  activeQuery?: MoreInformationQuery;

  // Accreditation seal once Approved
  accreditationDetails?: {
    sealNumber: string; // e.g. MD-ATELIER-2026-784
    tier: 'Maison Accredited' | 'Master Craftsman' | 'Haute Couture Guild';
    approvedAt: string;
    approvedBy: string;
    expiresAt: string;
    badgeUrl?: string;
  };

  // Rejection record if Rejected
  rejectionDetails?: {
    rejectedAt: string;
    rejectedBy: string;
    reasonCode: 'INSUFFICIENT_PROOFS' | 'SANCTIONS_FLAG' | 'CRAFTSMANSHIP_MISMATCH' | 'DOCUMENT_EXPIRED' | 'UNRESOLVED_QUERY';
    reasonSummary: string;
    appealAllowed: boolean;
    reapplicationEligibleDate: string;
  };

  auditTrail: VerificationAuditLog[];
}
