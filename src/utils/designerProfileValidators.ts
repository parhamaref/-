/**
 * @file designerProfileValidators.ts
 * Enterprise validation rules and sanitization for Designer Profile Management.
 * Enforces brand guidelines, URL integrity, email format, phone format, and image constraints.
 */

import { DesignerProfile, PortfolioItem } from '../types/designer.types';

export interface ValidationIssue {
  field: string;
  message: string;
}

export interface ProfileValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  issues: ValidationIssue[];
}

// Regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,20}$/;
const URL_REGEX = /^(https?:\/\/|data:image\/|blob:|\/)[^\s]+$/i;
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validates brand identity inputs.
 */
export function validateBrandName(name?: string): string | null {
  if (!name || !name.trim()) return 'Brand name is required';
  if (name.trim().length < 2) return 'Brand name must be at least 2 characters';
  if (name.trim().length > 80) return 'Brand name cannot exceed 80 characters';
  return null;
}

export function validateDesignerName(name?: string): string | null {
  if (!name || !name.trim()) return 'Designer name is required';
  if (name.trim().length < 2) return 'Designer name must be at least 2 characters';
  if (name.trim().length > 80) return 'Designer name cannot exceed 80 characters';
  return null;
}

export function validateEmail(email?: string): string | null {
  if (!email || !email.trim()) return 'Contact email is required';
  if (!EMAIL_REGEX.test(email.trim())) return 'Invalid email address format';
  return null;
}

export function validatePhone(phone?: string): string | null {
  if (!phone || !phone.trim()) return 'Contact phone is required';
  if (!PHONE_REGEX.test(phone.trim())) return 'Please enter a valid phone number (e.g. +44 20 7946 0888)';
  return null;
}

export function validateUrl(url?: string, label: string = 'URL', required = false): string | null {
  if (!url || !url.trim()) {
    if (required) return `${label} is required`;
    return null;
  }
  if (!URL_REGEX.test(url.trim())) return `Invalid ${label} format. Must be an http/https URL or image data`;
  return null;
}

export function validateBiography(bio?: string): string | null {
  if (!bio || !bio.trim()) return 'Biography is required';
  if (bio.trim().length < 20) return 'Biography is too brief (minimum 20 characters recommended)';
  if (bio.trim().length > 1000) return 'Biography exceeds maximum allowed 1,000 characters';
  return null;
}

export function validateBrandStory(story?: string): string | null {
  if (!story || !story.trim()) return 'Brand story is required for certified atelier profile';
  if (story.trim().length < 30) return 'Brand story must be at least 30 characters';
  if (story.trim().length > 2500) return 'Brand story cannot exceed 2,500 characters';
  return null;
}

export function validateDesignPhilosophy(philosophy?: string): string | null {
  if (!philosophy || !philosophy.trim()) return 'Design philosophy is required';
  if (philosophy.trim().length > 1500) return 'Design philosophy cannot exceed 1,500 characters';
  return null;
}

export function validateStudioLocation(location?: DesignerProfile['studioLocation']): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!location) {
    errors.address = 'Studio address is required';
    errors.city = 'Studio city is required';
    errors.country = 'Studio country is required';
    return errors;
  }
  if (!location.address?.trim()) errors.address = 'Studio street address is required';
  if (!location.city?.trim()) errors.city = 'City is required';
  if (!location.country?.trim()) errors.country = 'Country is required';
  return errors;
}

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  const maxBytes = 10 * 1024 * 1024; // 10MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Unsupported image format. Please upload JPEG, PNG, WebP, or SVG.',
    };
  }

  if (file.size > maxBytes) {
    return {
      isValid: false,
      error: `File size exceeds the 10MB limit (Selected: ${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  return { isValid: true };
}

/**
 * Validates a single portfolio entry.
 */
export function validatePortfolioItem(item: Partial<PortfolioItem>): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!item.title || !item.title.trim()) {
    errors.title = 'Project title is required';
  } else if (item.title.trim().length < 2) {
    errors.title = 'Title must be at least 2 characters';
  }

  if (!item.category) {
    errors.category = 'Category classification is required';
  }

  if (!item.imageUrl || !item.imageUrl.trim()) {
    errors.imageUrl = 'High-resolution project image is required';
  } else if (!URL_REGEX.test(item.imageUrl.trim())) {
    errors.imageUrl = 'Invalid image URL or data string';
  }

  if (!item.description || !item.description.trim()) {
    errors.description = 'Project notes or craftsmanship description is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Comprehensive profile form validation.
 */
export function validateDesignerProfile(profile: Partial<DesignerProfile>): ProfileValidationResult {
  const errors: Record<string, string> = {};
  const issues: ValidationIssue[] = [];

  const addError = (field: string, msg: string | null) => {
    if (msg) {
      errors[field] = msg;
      issues.push({ field, message: msg });
    }
  };

  addError('brandName', validateBrandName(profile.brandName));
  addError('designerName', validateDesignerName(profile.designerName));
  addError('contactEmail', validateEmail(profile.contactEmail));
  addError('phone', validatePhone(profile.phone));
  addError('biography', validateBiography(profile.biography));
  addError('brandStory', validateBrandStory(profile.brandStory));
  addError('designPhilosophy', validateDesignPhilosophy(profile.designPhilosophy));
  addError('logoUrl', validateUrl(profile.logoUrl, 'Logo URL', true));
  addError('coverImageUrl', validateUrl(profile.coverImageUrl, 'Cover Image URL', true));
  addError('avatarUrl', validateUrl(profile.avatarUrl, 'Avatar URL', true));

  if (profile.socialLinks?.website) {
    addError('website', validateUrl(profile.socialLinks.website, 'Website URL'));
  }

  const locationErrors = validateStudioLocation(profile.studioLocation);
  Object.entries(locationErrors).forEach(([locField, msg]) => {
    errors[`location_${locField}`] = msg;
    issues.push({ field: `location_${locField}`, message: msg });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    issues,
  };
}
