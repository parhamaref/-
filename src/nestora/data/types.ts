export const PROPERTY_TYPES = [
  'Luxury Villa',
  'Apartment',
  'Penthouse',
  'Waterfront Residence',
  'Estate',
  'Townhouse',
] as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const LISTING_STATUSES = ['for-sale', 'for-rent'] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

export const INQUIRY_TYPES = [
  'General enquiry',
  'Property enquiry',
  'Private viewing',
  'Consultation request',
  'Selling enquiry',
] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const INQUIRY_STATUSES = ['new', 'in-review', 'contacted', 'closed'] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  property_type: PropertyType;
  listing_status: ListingStatus;
  price: number;
  currency: string;
  location_name: string;
  city: string;
  region: string;
  country: string;
  /** Street-level address is private and only surfaced inside the admin console. */
  address: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  lot_area_sqft: number | null;
  year_built: number | null;
  featured: boolean;
  published: boolean;
  main_image: string;
  gallery_images: string[];
  amenities: string[];
  features: string[];
  agent_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  name: string;
  slug: string;
  role: string;
  email: string;
  phone: string;
  profile_image: string;
  biography: string;
  specialties: string[];
  service_areas: string[];
  published: boolean;
  created_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  inquiry_type: InquiryType;
  preferred_location: string;
  property_type: string;
  budget_min: number | null;
  budget_max: number | null;
  purchase_timeline: string;
  property_id: string | null;
  property_label: string;
  message: string;
  status: InquiryStatus;
  /** Consultation leads capture the preferred way to be contacted. */
  preferred_contact: string;
  created_at: string;
}

export interface Favorite {
  id: string;
  owner_id: string;
  property_id: string;
  created_at: string;
}

export interface SiteSettings {
  brand_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  currency: string;
  hero_image: string;
  hero_image_alt: string;
  cta_image: string;
  cta_image_alt: string;
  about_image: string;
}

export interface Database {
  version: number;
  properties: Property[];
  agents: Agent[];
  inquiries: Inquiry[];
  favorites: Favorite[];
  settings: SiteSettings;
}

export type SortKey = 'featured' | 'newest' | 'price-asc' | 'price-desc';

export interface PropertyFilters {
  q?: string;
  location?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  minArea?: number;
  status?: string;
  sort?: SortKey;
  page?: number;
  perPage?: number;
}

export const PRICE_MIN = 100_000;
export const PRICE_MAX = 5_000_000;

export const SORT_OPTIONS: Array<{ value: SortKey; label: string }> = [
  { value: 'featured', label: 'Featured first' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export const TIMELINE_OPTIONS = [
  'Immediately',
  'Within 3 months',
  'Within 6 months',
  'Within 12 months',
  'Just exploring',
] as const;

export const CONTACT_METHODS = ['Email', 'Phone', 'WhatsApp', 'Video call'] as const;
