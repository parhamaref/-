/**
 * @file analytics.types.ts
 * Type definitions for the Daniel’s Maison Atelier Analytics Center.
 * Models revenue trajectories, product performance, customer retention,
 * order conversion funnels, review satisfaction metrics, and customer lifetime value (CLV).
 */

export type AnalyticsTimeRange = '7D' | '30D' | '90D' | 'YTD' | '1Y' | 'ALL';

export type AnalyticsCategoryFilter = 'ALL' | 'BESPOKE' | 'RTW' | 'VIP_SALON' | 'ACCESSORIES';

export interface RevenueDataPoint {
  date: string;
  label: string;
  grossRevenue: number;
  netProfit: number;
  bespokeRevenue: number;
  rtwRevenue: number;
  ordersCount: number;
  aov: number;
}

export interface ProductPerformanceMetric {
  id: string;
  sku: string;
  name: string;
  category: 'Suiting' | 'Outerwear' | 'Eveningwear' | 'Knitwear' | 'Accessories';
  imageUrl: string;
  price: number;
  totalRevenue: number;
  unitsSold: number;
  conversionRate: number; // e.g. 4.8 (%)
  grossMarginPct: number; // e.g. 68 (%)
  returnRate: number; // e.g. 1.2 (%)
  rating: number; // e.g. 4.95
  reviewsCount: number;
  stockStatus: 'In Stock' | 'Bespoke Only' | 'Low Fabric' | 'Pre-Order';
}

export interface RetentionCohort {
  cohortMonth: string;
  initialCustomers: number;
  month1Pct: number;
  month2Pct: number;
  month3Pct: number;
  month4Pct: number;
  month5Pct: number;
  month6Pct: number;
}

export interface FunnelStage {
  id: string;
  name: string;
  description: string;
  visitors: number;
  conversionRateFromPrev: number; // percentage
  overallConversionRate: number; // percentage from top
  dropoffRate: number; // percentage
}

export interface TrafficChannelConversion {
  channel: string;
  visitors: number;
  orders: number;
  conversionRate: number;
  revenue: number;
}

export interface DeviceConversion {
  device: 'Desktop Studio' | 'Mobile Device' | 'Tablet Salon';
  sharePct: number;
  conversionRate: number;
}

export interface ReviewAspectScore {
  aspect: string;
  score: number; // 0 - 5.0
  maxScore: number;
  benchmark: number;
  description: string;
}

export interface StarRatingDistribution {
  stars: 5 | 4 | 3 | 2 | 1;
  count: number;
  pct: number;
}

export type VipTier = 'Imperial Sovereign' | 'Haute Patron' | 'Atelier Regular' | 'Bespoke Newcomer';

export interface VipClientDossier {
  id: string;
  clientName: string;
  avatar?: string;
  tier: VipTier;
  location: string;
  totalSpend: number;
  ordersCount: number;
  firstOrderDate: string;
  lastOrderDate: string;
  aov: number;
  repeatFrequencyDays: number;
  loyaltyStatus: 'Active' | 'Highly Engaged' | 'Dormant' | 'VIP Concierge';
}

export interface ClvTierSummary {
  tier: VipTier;
  clientCount: number;
  sharePct: number;
  avgLtv: number;
  totalRevenue: number;
  color: string;
}

export interface AnalyticsSummaryKPIs {
  totalRevenue: number;
  revenueChangePct: number;
  orderConversionRate: number;
  conversionChangePct: number;
  repeatCustomerRate: number;
  repeatCustomerChangePct: number;
  avgCustomerLtv: number;
  ltvChangePct: number;
  avgReviewScore: number;
  totalReviewsCount: number;
  netPromoterScore: number;
  avgOrderValue: number;
  aovChangePct: number;
  totalOrders: number;
  activeClientsCount: number;
  bespokeSharePct: number;
  clvToCacRatio: number;
}

export type AnalyticsTab =
  | 'overview'
  | 'revenue'
  | 'products'
  | 'conversion'
  | 'retention_clv'
  | 'reviews';
