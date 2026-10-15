/**
 * @file analyticsStore.ts
 * Enterprise reactive data store for Daniel’s Maison Atelier Analytics Center.
 * Houses metrics for Revenue Trends, Product Performance, Customer Retention,
 * Order Conversion Funnel, Review & Craftsmanship Ratings, and Customer Lifetime Value (CLV).
 */

import { useState, useEffect } from 'react';
import {
  AnalyticsTimeRange,
  AnalyticsCategoryFilter,
  RevenueDataPoint,
  ProductPerformanceMetric,
  RetentionCohort,
  FunnelStage,
  TrafficChannelConversion,
  DeviceConversion,
  ReviewAspectScore,
  StarRatingDistribution,
  VipClientDossier,
  ClvTierSummary,
  AnalyticsSummaryKPIs,
} from '../types/analytics.types';

const INITIAL_REVENUE_SERIES: RevenueDataPoint[] = [
  { date: '2025-05', label: 'May 2025', grossRevenue: 48200, netProfit: 32776, bespokeRevenue: 34500, rtwRevenue: 13700, ordersCount: 19, aov: 2536.84 },
  { date: '2025-06', label: 'Jun 2025', grossRevenue: 53400, netProfit: 36312, bespokeRevenue: 38900, rtwRevenue: 14500, ordersCount: 22, aov: 2427.27 },
  { date: '2025-07', label: 'Jul 2025', grossRevenue: 49800, netProfit: 33864, bespokeRevenue: 36200, rtwRevenue: 13600, ordersCount: 20, aov: 2490.00 },
  { date: '2025-08', label: 'Aug 2025', grossRevenue: 61200, netProfit: 41616, bespokeRevenue: 45000, rtwRevenue: 16200, ordersCount: 25, aov: 2448.00 },
  { date: '2025-09', label: 'Sep 2025', grossRevenue: 68900, netProfit: 46852, bespokeRevenue: 51200, rtwRevenue: 17700, ordersCount: 28, aov: 2460.71 },
  { date: '2025-10', label: 'Oct 2025', grossRevenue: 74500, netProfit: 50660, bespokeRevenue: 55400, rtwRevenue: 19100, ordersCount: 30, aov: 2483.33 },
  { date: '2025-11', label: 'Nov 2025', grossRevenue: 82100, netProfit: 55828, bespokeRevenue: 61800, rtwRevenue: 20300, ordersCount: 33, aov: 2487.88 },
  { date: '2025-12', label: 'Dec 2025', grossRevenue: 96400, netProfit: 65552, bespokeRevenue: 73500, rtwRevenue: 22900, ordersCount: 38, aov: 2536.84 },
  { date: '2026-01', label: 'Jan 2026', grossRevenue: 84300, netProfit: 57324, bespokeRevenue: 62800, rtwRevenue: 21500, ordersCount: 34, aov: 2479.41 },
  { date: '2026-02', label: 'Feb 2026', grossRevenue: 91500, netProfit: 62220, bespokeRevenue: 69200, rtwRevenue: 22300, ordersCount: 36, aov: 2541.67 },
  { date: '2026-03', label: 'Mar 2026', grossRevenue: 104800, netProfit: 71264, bespokeRevenue: 79800, rtwRevenue: 25000, ordersCount: 41, aov: 2556.10 },
  { date: '2026-04', label: 'Apr 2026', grossRevenue: 118600, netProfit: 80648, bespokeRevenue: 91400, rtwRevenue: 27200, ordersCount: 46, aov: 2578.26 },
];

const INITIAL_PRODUCTS: ProductPerformanceMetric[] = [
  {
    id: 'prod_001',
    sku: 'ART-CT-001',
    name: 'Metamorphic Drape Overcoat',
    category: 'Outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=400&q=80',
    price: 3450,
    totalRevenue: 144900,
    unitsSold: 42,
    conversionRate: 4.8,
    grossMarginPct: 69.5,
    returnRate: 0.8,
    rating: 4.96,
    reviewsCount: 38,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod_002',
    sku: 'ART-TX-002',
    name: 'Anatomical Savile Row Tuxedo',
    category: 'Suiting',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    price: 4200,
    totalRevenue: 159600,
    unitsSold: 38,
    conversionRate: 5.2,
    grossMarginPct: 72.0,
    returnRate: 0.5,
    rating: 4.98,
    reviewsCount: 35,
    stockStatus: 'Bespoke Only',
  },
  {
    id: 'prod_003',
    sku: 'ART-DN-003',
    name: 'Raw-Hem Architectural Denim',
    category: 'Suiting',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80',
    price: 1850,
    totalRevenue: 96200,
    unitsSold: 52,
    conversionRate: 6.4,
    grossMarginPct: 65.0,
    returnRate: 1.2,
    rating: 4.88,
    reviewsCount: 46,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod_004',
    sku: 'ART-EV-004',
    name: 'Monolithic Muslin Veil Ensemble',
    category: 'Eveningwear',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80',
    price: 4950,
    totalRevenue: 118800,
    unitsSold: 24,
    conversionRate: 3.6,
    grossMarginPct: 74.5,
    returnRate: 0.3,
    rating: 4.99,
    reviewsCount: 22,
    stockStatus: 'Bespoke Only',
  },
  {
    id: 'prod_005',
    sku: 'ART-KT-005',
    name: 'Calcified Cashmere Ribbed Turtleneck',
    category: 'Knitwear',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=400&q=80',
    price: 1450,
    totalRevenue: 84100,
    unitsSold: 58,
    conversionRate: 7.1,
    grossMarginPct: 63.8,
    returnRate: 0.9,
    rating: 4.92,
    reviewsCount: 51,
    stockStatus: 'Low Fabric',
  },
  {
    id: 'prod_006',
    sku: 'ART-BL-006',
    name: 'Structured Trench with Horn Hardware',
    category: 'Outerwear',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80',
    price: 3800,
    totalRevenue: 110200,
    unitsSold: 29,
    conversionRate: 4.1,
    grossMarginPct: 68.2,
    returnRate: 0.7,
    rating: 4.94,
    reviewsCount: 27,
    stockStatus: 'In Stock',
  },
  {
    id: 'prod_007',
    sku: 'ART-AC-007',
    name: 'Hand-Milled Damascus Silk Scarf',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=400&q=80',
    price: 680,
    totalRevenue: 49640,
    unitsSold: 73,
    conversionRate: 9.3,
    grossMarginPct: 78.0,
    returnRate: 0.2,
    rating: 4.97,
    reviewsCount: 65,
    stockStatus: 'In Stock',
  },
];

const INITIAL_COHORTS: RetentionCohort[] = [
  { cohortMonth: 'Nov 2025', initialCustomers: 33, month1Pct: 100, month2Pct: 42.4, month3Pct: 48.5, month4Pct: 54.5, month5Pct: 57.6, month6Pct: 63.6 },
  { cohortMonth: 'Dec 2025', initialCustomers: 38, month1Pct: 100, month2Pct: 39.5, month3Pct: 44.7, month4Pct: 52.6, month5Pct: 60.5, month6Pct: 65.8 },
  { cohortMonth: 'Jan 2026', initialCustomers: 34, month1Pct: 100, month2Pct: 41.2, month3Pct: 50.0, month4Pct: 58.8, month5Pct: 64.7, month6Pct: 67.6 },
  { cohortMonth: 'Feb 2026', initialCustomers: 36, month1Pct: 100, month2Pct: 44.4, month3Pct: 52.8, month4Pct: 61.1, month5Pct: 66.7, month6Pct: 69.4 },
  { cohortMonth: 'Mar 2026', initialCustomers: 41, month1Pct: 100, month2Pct: 46.3, month3Pct: 56.1, month4Pct: 63.4, month5Pct: 68.3, month6Pct: 70.7 },
  { cohortMonth: 'Apr 2026', initialCustomers: 46, month1Pct: 100, month2Pct: 47.8, month3Pct: 58.7, month4Pct: 65.2, month5Pct: 71.7, month6Pct: 73.9 },
];

const INITIAL_FUNNEL: FunnelStage[] = [
  {
    id: 'stage_1',
    name: '1. Catalog Browse',
    description: 'Archive lookbook impressions & curation browsing sessions',
    visitors: 48200,
    conversionRateFromPrev: 100,
    overallConversionRate: 100,
    dropoffRate: 0,
  },
  {
    id: 'stage_2',
    name: '2. Specimen Inspection',
    description: 'Deep product detail, textile spec & craftsmanship viewing',
    visitors: 17850,
    conversionRateFromPrev: 37.0,
    overallConversionRate: 37.0,
    dropoffRate: 63.0,
  },
  {
    id: 'stage_3',
    name: '3. 3D Customizer',
    description: 'Interactive fabric, lining, monogram & lapel configuration',
    visitors: 6920,
    conversionRateFromPrev: 38.8,
    overallConversionRate: 14.4,
    dropoffRate: 61.2,
  },
  {
    id: 'stage_4',
    name: '4. Biometric Measurements',
    description: 'Client profile measurements setup or Savile Row sizing calibration',
    visitors: 2840,
    conversionRateFromPrev: 41.0,
    overallConversionRate: 5.9,
    dropoffRate: 59.0,
  },
  {
    id: 'stage_5',
    name: '5. Salon Deposit Gate',
    description: 'Reviewing bespoke quotation, lead time & deposit terms',
    visitors: 1890,
    conversionRateFromPrev: 66.5,
    overallConversionRate: 3.9,
    dropoffRate: 33.5,
  },
  {
    id: 'stage_6',
    name: '6. Confirmed Commission',
    description: 'Cryptographic payment authorization & workshop order creation',
    visitors: 1395,
    conversionRateFromPrev: 73.8,
    overallConversionRate: 2.89,
    dropoffRate: 26.2,
  },
];

const INITIAL_TRAFFIC_CHANNELS: TrafficChannelConversion[] = [
  { channel: 'Private Salon Concierge & Referrals', visitors: 8400, orders: 495, conversionRate: 5.89, revenue: 384200 },
  { channel: 'Runway Exhibitions & Press', visitors: 14200, orders: 382, conversionRate: 2.69, revenue: 268500 },
  { channel: 'Organic Direct Atelier Traffic', visitors: 16500, orders: 348, conversionRate: 2.11, revenue: 198200 },
  { channel: 'Bespoke Invitation Letters', visitors: 4600, orders: 122, conversionRate: 2.65, revenue: 84600 },
  { channel: 'Partner Mill Showcases', visitors: 4500, orders: 48, conversionRate: 1.07, revenue: 38200 },
];

const INITIAL_DEVICES: DeviceConversion[] = [
  { device: 'Desktop Studio', sharePct: 58.4, conversionRate: 3.82 },
  { device: 'Mobile Device', sharePct: 34.6, conversionRate: 1.84 },
  { device: 'Tablet Salon', sharePct: 7.0, conversionRate: 2.95 },
];

const INITIAL_REVIEW_ASPECTS: ReviewAspectScore[] = [
  { aspect: 'Craftsmanship & Stitching', score: 4.98, maxScore: 5.0, benchmark: 4.85, description: 'Sartorial roped shoulders, canvassing & pick-stitching precision' },
  { aspect: 'Textile & Fabric Quality', score: 4.96, maxScore: 5.0, benchmark: 4.80, description: 'Loro Piana, Scabal & Dormeuil genuine mill authentications' },
  { aspect: 'Bespoke Fit Precision', score: 4.91, maxScore: 5.0, benchmark: 4.70, description: 'First-fitting accuracy vs client biometric measurements' },
  { aspect: 'Packaging & Unboxing', score: 4.97, maxScore: 5.0, benchmark: 4.82, description: 'Embossed archival trunks, cedar garment carriers & brass hangers' },
  { aspect: 'Lead Time & Delivery Reliability', score: 4.88, maxScore: 5.0, benchmark: 4.65, description: 'Adherence to 4-to-6 week atelier turnaround promises' },
];

const INITIAL_STAR_DISTRIBUTION: StarRatingDistribution[] = [
  { stars: 5, count: 284, pct: 93.4 },
  { stars: 4, count: 18, pct: 5.9 },
  { stars: 3, count: 2, pct: 0.7 },
  { stars: 2, count: 0, pct: 0.0 },
  { stars: 1, count: 0, pct: 0.0 },
];

const INITIAL_VIP_CLIENTS: VipClientDossier[] = [
  {
    id: 'vip_001',
    clientName: 'Lord Sterling Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    tier: 'Imperial Sovereign',
    location: 'London, Mayfair',
    totalSpend: 38400,
    ordersCount: 9,
    firstOrderDate: '2024-08-12',
    lastOrderDate: '2026-04-02',
    aov: 4266.67,
    repeatFrequencyDays: 38,
    loyaltyStatus: 'VIP Concierge',
  },
  {
    id: 'vip_002',
    clientName: 'Countess Eleanor Beauchamp',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    tier: 'Imperial Sovereign',
    location: 'Zurich, Switzerland',
    totalSpend: 31200,
    ordersCount: 7,
    firstOrderDate: '2025-01-18',
    lastOrderDate: '2026-03-24',
    aov: 4457.14,
    repeatFrequencyDays: 45,
    loyaltyStatus: 'VIP Concierge',
  },
  {
    id: 'vip_003',
    clientName: 'Marcus Al-Rashid',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    tier: 'Haute Patron',
    location: 'Dubai, DIFC',
    totalSpend: 19800,
    ordersCount: 5,
    firstOrderDate: '2025-04-10',
    lastOrderDate: '2026-03-12',
    aov: 3960.00,
    repeatFrequencyDays: 52,
    loyaltyStatus: 'Active',
  },
  {
    id: 'vip_004',
    clientName: 'Soren Vinterberg',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    tier: 'Haute Patron',
    location: 'Copenhagen, Denmark',
    totalSpend: 14500,
    ordersCount: 4,
    firstOrderDate: '2025-07-22',
    lastOrderDate: '2026-02-28',
    aov: 3625.00,
    repeatFrequencyDays: 60,
    loyaltyStatus: 'Active',
  },
  {
    id: 'vip_005',
    clientName: 'Aria Thorne-Croft',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    tier: 'Atelier Regular',
    location: 'Edinburgh, New Town',
    totalSpend: 8900,
    ordersCount: 3,
    firstOrderDate: '2025-09-05',
    lastOrderDate: '2026-04-08',
    aov: 2966.67,
    repeatFrequencyDays: 70,
    loyaltyStatus: 'Highly Engaged',
  },
  {
    id: 'vip_006',
    clientName: 'Klaus Reinhardt',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    tier: 'Atelier Regular',
    location: 'Munich, Germany',
    totalSpend: 7800,
    ordersCount: 2,
    firstOrderDate: '2025-11-14',
    lastOrderDate: '2026-03-05',
    aov: 3900.00,
    repeatFrequencyDays: 110,
    loyaltyStatus: 'Active',
  },
];

const INITIAL_CLV_TIERS: ClvTierSummary[] = [
  { tier: 'Imperial Sovereign', clientCount: 18, sharePct: 5.6, avgLtv: 32400, totalRevenue: 583200, color: '#f59e0b' },
  { tier: 'Haute Patron', clientCount: 54, sharePct: 16.8, avgLtv: 16200, totalRevenue: 874800, color: '#eab308' },
  { tier: 'Atelier Regular', clientCount: 112, sharePct: 34.8, avgLtv: 7600, totalRevenue: 851200, color: '#10b981' },
  { tier: 'Bespoke Newcomer', clientCount: 138, sharePct: 42.8, avgLtv: 2850, totalRevenue: 393300, color: '#38bdf8' },
];

const INITIAL_KPIS: AnalyticsSummaryKPIs = {
  totalRevenue: 902400,
  revenueChangePct: 24.8,
  orderConversionRate: 2.89,
  conversionChangePct: 0.45,
  repeatCustomerRate: 64.2,
  repeatCustomerChangePct: 7.2,
  avgCustomerLtv: 8420,
  ltvChangePct: 15.6,
  avgReviewScore: 4.94,
  totalReviewsCount: 304,
  netPromoterScore: 88,
  avgOrderValue: 2542,
  aovChangePct: 8.4,
  totalOrders: 355,
  activeClientsCount: 322,
  bespokeSharePct: 74.8,
  clvToCacRatio: 7.4,
};

class AnalyticsStore {
  private timeRange: AnalyticsTimeRange = '1Y';
  private categoryFilter: AnalyticsCategoryFilter = 'ALL';
  private revenueSeries: RevenueDataPoint[] = INITIAL_REVENUE_SERIES;
  private products: ProductPerformanceMetric[] = INITIAL_PRODUCTS;
  private cohorts: RetentionCohort[] = INITIAL_COHORTS;
  private funnelStages: FunnelStage[] = INITIAL_FUNNEL;
  private trafficChannels: TrafficChannelConversion[] = INITIAL_TRAFFIC_CHANNELS;
  private devices: DeviceConversion[] = INITIAL_DEVICES;
  private reviewAspects: ReviewAspectScore[] = INITIAL_REVIEW_ASPECTS;
  private starDistribution: StarRatingDistribution[] = INITIAL_STAR_DISTRIBUTION;
  private vipClients: VipClientDossier[] = INITIAL_VIP_CLIENTS;
  private clvTiers: ClvTierSummary[] = INITIAL_CLV_TIERS;
  private summaryKpis: AnalyticsSummaryKPIs = INITIAL_KPIS;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('daniels_analytics_store');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.timeRange) this.timeRange = parsed.timeRange;
        if (parsed.categoryFilter) this.categoryFilter = parsed.categoryFilter;
      }
    } catch {
      // Keep defaults
    }
  }

  private persist() {
    try {
      localStorage.setItem(
        'daniels_analytics_store',
        JSON.stringify({
          timeRange: this.timeRange,
          categoryFilter: this.categoryFilter,
        })
      );
    } catch {
      // Ignore
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // Getters
  public getTimeRange(): AnalyticsTimeRange {
    return this.timeRange;
  }

  public getCategoryFilter(): AnalyticsCategoryFilter {
    return this.categoryFilter;
  }

  public setTimeRange(range: AnalyticsTimeRange) {
    this.timeRange = range;
    this.persist();
  }

  public setCategoryFilter(filter: AnalyticsCategoryFilter) {
    this.categoryFilter = filter;
    this.persist();
  }

  /**
   * Filtered revenue series according to the active time range.
   */
  public getFilteredRevenueSeries(): RevenueDataPoint[] {
    const all = this.revenueSeries;
    switch (this.timeRange) {
      case '7D':
        // Return 7 recent days simulated
        return [
          { date: '2026-04-07', label: 'Tue Apr 7', grossRevenue: 4200, netProfit: 2856, bespokeRevenue: 4200, rtwRevenue: 0, ordersCount: 1, aov: 4200 },
          { date: '2026-04-08', label: 'Wed Apr 8', grossRevenue: 6800, netProfit: 4624, bespokeRevenue: 4950, rtwRevenue: 1850, ordersCount: 2, aov: 3400 },
          { date: '2026-04-09', label: 'Thu Apr 9', grossRevenue: 3450, netProfit: 2346, bespokeRevenue: 3450, rtwRevenue: 0, ordersCount: 1, aov: 3450 },
          { date: '2026-04-10', label: 'Fri Apr 10', grossRevenue: 8900, netProfit: 6052, bespokeRevenue: 7450, rtwRevenue: 1450, ordersCount: 3, aov: 2966 },
          { date: '2026-04-11', label: 'Sat Apr 11', grossRevenue: 12400, netProfit: 8432, bespokeRevenue: 9600, rtwRevenue: 2800, ordersCount: 4, aov: 3100 },
          { date: '2026-04-12', label: 'Sun Apr 12', grossRevenue: 5600, netProfit: 3808, bespokeRevenue: 4200, rtwRevenue: 1400, ordersCount: 2, aov: 2800 },
          { date: '2026-04-13', label: 'Mon Apr 13', grossRevenue: 7800, netProfit: 5304, bespokeRevenue: 6400, rtwRevenue: 1400, ordersCount: 3, aov: 2600 },
        ];
      case '30D':
        // Return last 4 weeks
        return [
          { date: '2026-W12', label: 'Week 12 (Mar 16)', grossRevenue: 24500, netProfit: 16660, bespokeRevenue: 18900, rtwRevenue: 5600, ordersCount: 10, aov: 2450 },
          { date: '2026-W13', label: 'Week 13 (Mar 23)', grossRevenue: 28600, netProfit: 19448, bespokeRevenue: 22400, rtwRevenue: 6200, ordersCount: 11, aov: 2600 },
          { date: '2026-W14', label: 'Week 14 (Mar 30)', grossRevenue: 31200, netProfit: 21216, bespokeRevenue: 24800, rtwRevenue: 6400, ordersCount: 12, aov: 2600 },
          { date: '2026-W15', label: 'Week 15 (Apr 06)', grossRevenue: 34300, netProfit: 23324, bespokeRevenue: 27100, rtwRevenue: 7200, ordersCount: 13, aov: 2638 },
        ];
      case '90D':
        return all.slice(-3);
      case 'YTD':
        return all.filter((d) => d.date.startsWith('2026'));
      case '1Y':
      case 'ALL':
      default:
        return all;
    }
  }

  public getFilteredProducts(): ProductPerformanceMetric[] {
    if (this.categoryFilter === 'ALL') return this.products;
    if (this.categoryFilter === 'BESPOKE') {
      return this.products.filter((p) => p.stockStatus === 'Bespoke Only');
    }
    if (this.categoryFilter === 'RTW') {
      return this.products.filter((p) => p.stockStatus !== 'Bespoke Only');
    }
    if (this.categoryFilter === 'ACCESSORIES') {
      return this.products.filter((p) => p.category === 'Accessories');
    }
    return this.products;
  }

  public getCohorts(): RetentionCohort[] {
    return this.cohorts;
  }

  public getFunnelStages(): FunnelStage[] {
    return this.funnelStages;
  }

  public getTrafficChannels(): TrafficChannelConversion[] {
    return this.trafficChannels;
  }

  public getDevices(): DeviceConversion[] {
    return this.devices;
  }

  public getReviewAspects(): ReviewAspectScore[] {
    return this.reviewAspects;
  }

  public getStarDistribution(): StarRatingDistribution[] {
    return this.starDistribution;
  }

  public getVipClients(): VipClientDossier[] {
    return this.vipClients;
  }

  public getClvTiers(): ClvTierSummary[] {
    return this.clvTiers;
  }

  public getSummaryKpis(): AnalyticsSummaryKPIs {
    const series = this.getFilteredRevenueSeries();
    const totalRev = series.reduce((sum, item) => sum + item.grossRevenue, 0);
    const totalOrders = series.reduce((sum, item) => sum + item.ordersCount, 0);
    const aov = totalOrders > 0 ? Math.round(totalRev / totalOrders) : this.summaryKpis.avgOrderValue;

    return {
      ...this.summaryKpis,
      totalRevenue: totalRev,
      totalOrders: totalOrders,
      avgOrderValue: aov,
    };
  }

  public exportAnalyticsCsv(): void {
    const series = this.getFilteredRevenueSeries();
    const products = this.getFilteredProducts();

    let csv = '=== DANIEL’S MAISON — ATELIER ANALYTICS DOSSIER ===\r\n';
    csv += `Export Timestamp,${new Date().toISOString()}\r\n`;
    csv += `Active Time Range,${this.timeRange}\r\n`;
    csv += `Category Filter,${this.categoryFilter}\r\n\r\n`;

    csv += '--- REVENUE TRAJECTORY ---\r\n';
    csv += 'Period,Gross Revenue (GBP),Net Atelier Share (GBP),Bespoke Volume (GBP),Ready-To-Wear (GBP),Orders Count,AOV (GBP)\r\n';
    series.forEach((s) => {
      csv += `"${s.label}",${s.grossRevenue},${s.netProfit},${s.bespokeRevenue},${s.rtwRevenue},${s.ordersCount},${s.aov}\r\n`;
    });

    csv += '\r\n--- PRODUCT PERFORMANCE ---\r\n';
    csv += 'SKU,Garment Name,Category,Unit Price (GBP),Gross Revenue (GBP),Units Sold,Conversion Rate (%),Gross Margin (%),Return Rate (%),Rating,Stock Status\r\n';
    products.forEach((p) => {
      csv += `"${p.sku}","${p.name}","${p.category}",${p.price},${p.totalRevenue},${p.unitsSold},${p.conversionRate}%,${p.grossMarginPct}%,${p.returnRate}%,${p.rating},"${p.stockStatus}"\r\n`;
    });

    csv += '\r\n--- ORDER CONVERSION FUNNEL ---\r\n';
    csv += 'Funnel Stage,Visitors/Sessions,Stage Conversion Rate (%),Overall Funnel Conversion (%),Dropoff Rate (%)\r\n';
    this.funnelStages.forEach((f) => {
      csv += `"${f.name}",${f.visitors},${f.conversionRateFromPrev}%,${f.overallConversionRate}%,${f.dropoffRate}%\r\n`;
    });

    csv += '\r\n--- VIP CLIENT LIFETIME VALUE (CLV) ---\r\n';
    csv += 'Client Name,VIP Tier,Location,Total Lifetime Spend (GBP),Total Orders,AOV (GBP),Repeat Frequency (Days),Loyalty Status\r\n';
    this.vipClients.forEach((c) => {
      csv += `"${c.clientName}","${c.tier}","${c.location}",${c.totalSpend},${c.ordersCount},${c.aov},${c.repeatFrequencyDays},"${c.loyaltyStatus}"\r\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `daniels_analytics_report_${this.timeRange.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  public resetToDefaults(): void {
    this.timeRange = '1Y';
    this.categoryFilter = 'ALL';
    this.persist();
  }
}

export const analyticsStore = new AnalyticsStore();

export function useAnalyticsStore() {
  const [timeRange, setTimeRangeState] = useState<AnalyticsTimeRange>(analyticsStore.getTimeRange());
  const [categoryFilter, setCategoryFilterState] = useState<AnalyticsCategoryFilter>(analyticsStore.getCategoryFilter());
  const [revenueSeries, setRevenueSeries] = useState<RevenueDataPoint[]>(analyticsStore.getFilteredRevenueSeries());
  const [products, setProducts] = useState<ProductPerformanceMetric[]>(analyticsStore.getFilteredProducts());
  const [cohorts, setCohorts] = useState<RetentionCohort[]>(analyticsStore.getCohorts());
  const [funnelStages, setFunnelStages] = useState<FunnelStage[]>(analyticsStore.getFunnelStages());
  const [trafficChannels, setTrafficChannels] = useState<TrafficChannelConversion[]>(analyticsStore.getTrafficChannels());
  const [devices, setDevices] = useState<DeviceConversion[]>(analyticsStore.getDevices());
  const [reviewAspects, setReviewAspects] = useState<ReviewAspectScore[]>(analyticsStore.getReviewAspects());
  const [starDistribution, setStarDistribution] = useState<StarRatingDistribution[]>(analyticsStore.getStarDistribution());
  const [vipClients, setVipClients] = useState<VipClientDossier[]>(analyticsStore.getVipClients());
  const [clvTiers, setClvTiers] = useState<ClvTierSummary[]>(analyticsStore.getClvTiers());
  const [kpis, setKpis] = useState<AnalyticsSummaryKPIs>(analyticsStore.getSummaryKpis());

  useEffect(() => {
    const unsubscribe = analyticsStore.subscribe(() => {
      setTimeRangeState(analyticsStore.getTimeRange());
      setCategoryFilterState(analyticsStore.getCategoryFilter());
      setRevenueSeries(analyticsStore.getFilteredRevenueSeries());
      setProducts(analyticsStore.getFilteredProducts());
      setCohorts(analyticsStore.getCohorts());
      setFunnelStages(analyticsStore.getFunnelStages());
      setTrafficChannels(analyticsStore.getTrafficChannels());
      setDevices(analyticsStore.getDevices());
      setReviewAspects(analyticsStore.getReviewAspects());
      setStarDistribution(analyticsStore.getStarDistribution());
      setVipClients(analyticsStore.getVipClients());
      setClvTiers(analyticsStore.getClvTiers());
      setKpis(analyticsStore.getSummaryKpis());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    timeRange,
    categoryFilter,
    revenueSeries,
    products,
    cohorts,
    funnelStages,
    trafficChannels,
    devices,
    reviewAspects,
    starDistribution,
    vipClients,
    clvTiers,
    kpis,
    setTimeRange: (r: AnalyticsTimeRange) => analyticsStore.setTimeRange(r),
    setCategoryFilter: (c: AnalyticsCategoryFilter) => analyticsStore.setCategoryFilter(c),
    exportAnalyticsCsv: () => analyticsStore.exportAnalyticsCsv(),
    resetToDefaults: () => analyticsStore.resetToDefaults(),
  };
}
