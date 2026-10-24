import { commit, createId, getSnapshot, getVisitorId, resetDatabase } from './store';
import type {
  Agent,
  Inquiry,
  InquiryStatus,
  Property,
  PropertyFilters,
  SiteSettings,
  SortKey,
} from './types';

/**
 * Data access layer. Every call is async and validated, so components exercise real
 * loading/error/success states. The records themselves live in the local store
 * (see store.ts) because this repository has no backend service.
 */

const LATENCY = 200;
const wait = (ms = LATENCY) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface PropertyQueryResult {
  items: Property[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
}

const sorters: Record<SortKey, (a: Property, b: Property) => number> = {
  featured: (a, b) =>
    Number(b.featured) - Number(a.featured) ||
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  newest: (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
};

function applyFilters(properties: Property[], filters: PropertyFilters) {
  const query = filters.q?.trim().toLowerCase();

  return properties.filter((property) => {
    if (query) {
      const haystack = [
        property.title,
        property.location_name,
        property.city,
        property.region,
        property.country,
        property.property_type,
        property.description,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (filters.location && property.location_name !== filters.location) return false;
    if (filters.type && property.property_type !== filters.type) return false;
    if (typeof filters.minPrice === 'number' && property.price < filters.minPrice) return false;
    if (typeof filters.maxPrice === 'number' && property.price > filters.maxPrice) return false;
    if (filters.beds && property.bedrooms < filters.beds) return false;
    if (filters.baths && property.bathrooms < filters.baths) return false;
    if (filters.minArea && property.area_sqft < filters.minArea) return false;
    if (filters.status && property.listing_status !== filters.status) return false;
    return true;
  });
}

export async function queryProperties(
  filters: PropertyFilters = {},
  options: { includeUnpublished?: boolean } = {},
): Promise<PropertyQueryResult> {
  await wait();
  const all = getSnapshot().properties.filter((property) => options.includeUnpublished || property.published);
  const matched = applyFilters(all, filters).sort(sorters[filters.sort ?? 'featured']);

  const perPage = filters.perPage ?? 9;
  const pages = Math.max(1, Math.ceil(matched.length / perPage));
  const page = Math.min(Math.max(filters.page ?? 1, 1), pages);

  return {
    items: matched.slice((page - 1) * perPage, page * perPage),
    total: matched.length,
    page,
    perPage,
    pages,
  };
}

export async function listFeaturedProperties(limit = 4): Promise<Property[]> {
  await wait(140);
  const published = getSnapshot().properties.filter((property) => property.published);
  const featured = published.filter((property) => property.featured);
  const pool = featured.length ? featured : published;
  return pool.slice(0, limit);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  await wait(160);
  return getSnapshot().properties.find((property) => property.slug === slug) ?? null;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  await wait(120);
  return getSnapshot().properties.find((property) => property.id === id) ?? null;
}

export async function listRelatedProperties(property: Property, limit = 3): Promise<Property[]> {
  await wait(180);
  return getSnapshot()
    .properties.filter(
      (candidate) =>
        candidate.published &&
        candidate.id !== property.id &&
        (candidate.property_type === property.property_type ||
          candidate.location_name === property.location_name),
    )
    .slice(0, limit);
}

export async function listLocations(): Promise<string[]> {
  const locations = getSnapshot()
    .properties.filter((property) => property.published)
    .map((property) => property.location_name);
  return Array.from(new Set(locations)).sort();
}

export async function listAgents(): Promise<Agent[]> {
  await wait(150);
  return getSnapshot().agents.filter((agent) => agent.published);
}

export async function getAgentBySlug(slug: string): Promise<Agent | null> {
  await wait(140);
  return getSnapshot().agents.find((agent) => agent.slug === slug) ?? null;
}

export async function listPropertiesByAgent(agentId: string): Promise<Property[]> {
  await wait(140);
  return getSnapshot().properties.filter((property) => property.published && property.agent_id === agentId);
}

export interface InquiryInput {
  name: string;
  email: string;
  phone?: string;
  inquiry_type: Inquiry['inquiry_type'];
  preferred_location?: string;
  property_type?: string;
  budget_min?: number | null;
  budget_max?: number | null;
  purchase_timeline?: string;
  property_id?: string | null;
  message?: string;
  preferred_contact?: string;
}

export function validateInquiry(input: InquiryInput): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!input.name.trim() || input.name.trim().length < 2) errors.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) errors.email = 'Please enter a valid email address.';
  if (input.phone && !/^[+()\-\s\d]{7,}$/.test(input.phone.trim())) errors.phone = 'Please enter a valid phone number.';
  if (input.budget_min != null && input.budget_max != null && input.budget_min > input.budget_max) {
    errors.budget_max = 'The maximum budget must be greater than the minimum.';
  }
  return errors;
}

export async function createInquiry(input: InquiryInput): Promise<Inquiry> {
  const errors = validateInquiry(input);
  if (Object.keys(errors).length) {
    const error = new Error('Please correct the highlighted fields.') as Error & { fields: Record<string, string> };
    error.fields = errors;
    throw error;
  }

  await wait(420);

  const property = input.property_id
    ? getSnapshot().properties.find((candidate) => candidate.id === input.property_id)
    : undefined;

  const inquiry: Inquiry = {
    id: createId('inquiry'),
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone?.trim() ?? '',
    inquiry_type: input.inquiry_type,
    preferred_location: input.preferred_location ?? '',
    property_type: input.property_type ?? '',
    budget_min: input.budget_min ?? null,
    budget_max: input.budget_max ?? null,
    purchase_timeline: input.purchase_timeline ?? '',
    property_id: property?.id ?? null,
    property_label: property ? `${property.title} — ${property.location_name}` : '',
    message: input.message?.trim() ?? '',
    preferred_contact: input.preferred_contact ?? '',
    status: 'new',
    created_at: new Date().toISOString(),
  };

  commit((database) => ({ ...database, inquiries: [inquiry, ...database.inquiries] }));
  return inquiry;
}

export async function listInquiries(): Promise<Inquiry[]> {
  await wait(140);
  return getSnapshot().inquiries;
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<void> {
  await wait(120);
  commit((database) => ({
    ...database,
    inquiries: database.inquiries.map((inquiry) => (inquiry.id === id ? { ...inquiry, status } : inquiry)),
  }));
}

/* ------------------------------------------------------------------ favourites */

export async function listFavoriteIds(): Promise<string[]> {
  const owner = getVisitorId();
  return getSnapshot()
    .favorites.filter((favorite) => favorite.owner_id === owner)
    .map((favorite) => favorite.property_id);
}

export async function toggleFavorite(propertyId: string): Promise<{ saved: boolean }> {
  const owner = getVisitorId();
  const existing = getSnapshot().favorites.find(
    (favorite) => favorite.owner_id === owner && favorite.property_id === propertyId,
  );

  if (existing) {
    commit((database) => ({
      ...database,
      favorites: database.favorites.filter((favorite) => favorite.id !== existing.id),
    }));
    return { saved: false };
  }

  commit((database) => ({
    ...database,
    favorites: [
      {
        id: createId('favorite'),
        owner_id: owner,
        property_id: propertyId,
        created_at: new Date().toISOString(),
      },
      ...database.favorites,
    ],
  }));
  return { saved: true };
}

export async function listFavoriteProperties(): Promise<Property[]> {
  const owner = getVisitorId();
  const favoriteIds = getSnapshot()
    .favorites.filter((favorite) => favorite.owner_id === owner)
    .map((favorite) => favorite.property_id);
  return getSnapshot().properties.filter((property) => favoriteIds.includes(property.id));
}

/* --------------------------------------------------------------------- settings */

export async function getSettings(): Promise<SiteSettings> {
  return getSnapshot().settings;
}

export async function saveSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
  await wait(180);
  commit((database) => ({ ...database, settings: { ...database.settings, ...patch } }));
  return getSnapshot().settings;
}

/* ------------------------------------------------------------------------ admin */

export interface PropertyInput {
  id?: string;
  title: string;
  description: string;
  property_type: Property['property_type'];
  listing_status: Property['listing_status'];
  price: number;
  location_name: string;
  city: string;
  region: string;
  country: string;
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
  slug?: string;
}

export async function saveProperty(input: PropertyInput, slugify: (value: string) => string): Promise<Property> {
  await wait(260);
  const now = new Date().toISOString();
  const { id: inputId, slug: inputSlug, ...fields } = input;
  const existing = inputId ? getSnapshot().properties.find((property) => property.id === inputId) : undefined;
  const slug = inputSlug?.trim() || slugify(input.title) || existing?.slug || createId('property');

  const record: Property = {
    ...fields,
    id: existing?.id ?? createId('property'),
    slug,
    currency: existing?.currency ?? getSnapshot().settings.currency,
    created_at: existing?.created_at ?? now,
    updated_at: now,
  };

  commit((database) => ({
    ...database,
    properties: existing
      ? database.properties.map((property) => (property.id === existing.id ? record : property))
      : [record, ...database.properties],
  }));

  return record;
}

export async function deleteProperty(id: string): Promise<void> {
  await wait(180);
  commit((database) => ({
    ...database,
    properties: database.properties.filter((property) => property.id !== id),
    favorites: database.favorites.filter((favorite) => favorite.property_id !== id),
  }));
}

export async function setPropertyFlags(
  id: string,
  flags: { published?: boolean; featured?: boolean },
): Promise<void> {
  await wait(120);
  commit((database) => ({
    ...database,
    properties: database.properties.map((property) =>
      property.id === id ? { ...property, ...flags, updated_at: new Date().toISOString() } : property,
    ),
  }));
}

export interface AgentInput {
  id?: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  profile_image: string;
  biography: string;
  specialties: string[];
  service_areas: string[];
  published: boolean;
}

export async function saveAgent(input: AgentInput, slugify: (value: string) => string): Promise<Agent> {
  await wait(240);
  const existing = input.id ? getSnapshot().agents.find((agent) => agent.id === input.id) : undefined;
  const record: Agent = {
    id: existing?.id ?? createId('agent'),
    slug: existing?.slug ?? slugify(input.name),
    created_at: existing?.created_at ?? new Date().toISOString(),
    ...input,
  };

  commit((database) => ({
    ...database,
    agents: existing
      ? database.agents.map((agent) => (agent.id === existing.id ? record : agent))
      : [...database.agents, record],
  }));

  return record;
}

export async function deleteAgent(id: string): Promise<void> {
  await wait(160);
  commit((database) => ({
    ...database,
    agents: database.agents.filter((agent) => agent.id !== id),
    properties: database.properties.map((property) =>
      property.agent_id === id ? { ...property, agent_id: null } : property,
    ),
  }));
}

export interface DashboardStats {
  totalProperties: number;
  publishedProperties: number;
  featuredProperties: number;
  totalAgents: number;
  totalInquiries: number;
  openInquiries: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await wait(140);
  const database = getSnapshot();
  return {
    totalProperties: database.properties.length,
    publishedProperties: database.properties.filter((property) => property.published).length,
    featuredProperties: database.properties.filter((property) => property.featured).length,
    totalAgents: database.agents.length,
    totalInquiries: database.inquiries.length,
    openInquiries: database.inquiries.filter((inquiry) => inquiry.status === 'new').length,
  };
}

export async function restoreDemoContent(): Promise<void> {
  await wait(200);
  resetDatabase();
}
