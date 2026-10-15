/**
 * @file AnalyticsCenter.tsx
 * Master Atelier Analytics Center for Daniel’s Maison.
 * Advanced dashboard integrating Revenue Trends, Product Performance, Customer Retention,
 * Order Conversion Funnel, Review Satisfaction Scores, and Customer Lifetime Value (CLV).
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  LineChart,
  PieChart,
  Users,
  Star,
  DollarSign,
  Download,
  Printer,
  Calendar,
  Filter,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Crown,
  HeartHandshake,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Layers,
  Award,
} from 'lucide-react';
import { useAnalyticsStore } from '../../../stores/analyticsStore';
import {
  AnalyticsTab,
  AnalyticsTimeRange,
  AnalyticsCategoryFilter,
} from '../../../types/analytics.types';
import { RevenueTrendView } from './RevenueTrendView';
import { ProductPerformanceView } from './ProductPerformanceView';
import { OrderConversionView } from './OrderConversionView';
import { RetentionClvView } from './RetentionClvView';
import { ReviewScoreView } from './ReviewScoreView';
import { AnalyticsPdfReportModal } from './AnalyticsPdfReportModal';

export const AnalyticsCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);

  const {
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
    setTimeRange,
    setCategoryFilter,
    exportAnalyticsCsv,
    resetToDefaults,
  } = useAnalyticsStore();

  const timeRanges: AnalyticsTimeRange[] = ['7D', '30D', '90D', 'YTD', '1Y', 'ALL'];

  return (
    <div className="space-y-8 animate-fadeIn text-left max-w-7xl 2xl:max-w-[1600px] mx-auto pb-16">
      {/* Top Header & Master Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#222] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <LineChart className="w-4 h-4" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wide text-white">
              Atelier Analytics Center
            </h1>
          </div>
          <p className="text-xs text-neutral-400 font-sans mt-1.5 max-w-2xl">
            Real-time sartorial telemetry tracking revenue trajectories, bespoke order conversion funnels,
            garment performance, client retention cohorts, and Customer Lifetime Value (CLV).
          </p>
        </div>

        {/* Global Filter & Export Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center gap-1 p-1 bg-[#121212] border border-[#262626] rounded-xl font-mono text-xs">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  timeRange === range
                    ? 'bg-amber-400 text-black font-bold shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Export to CSV */}
          <button
            onClick={exportAnalyticsCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-[#2e2e2e] text-xs font-mono text-neutral-200 transition-colors cursor-pointer"
            title="Download CSV Dossier"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export CSV</span>
          </button>

          {/* Executive PDF Report */}
          <button
            onClick={() => setIsPdfModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs font-mono uppercase tracking-wider transition-colors shadow-lg shadow-amber-500/10 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Executive Dossier</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Executive Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            Gross Revenue
          </span>
          <div className="mt-1.5 font-serif text-xl sm:text-2xl font-bold text-white">
            £{(kpis.totalRevenue / 1000).toFixed(1)}k
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold block mt-0.5">
            +{kpis.revenueChangePct}% YoY
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            Order Conversion
          </span>
          <div className="mt-1.5 font-serif text-xl sm:text-2xl font-bold text-white">
            {kpis.orderConversionRate}%
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold block mt-0.5">
            +{kpis.conversionChangePct}% pts
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            Repeat Retention
          </span>
          <div className="mt-1.5 font-serif text-xl sm:text-2xl font-bold text-emerald-400">
            {kpis.repeatCustomerRate}%
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold block mt-0.5">
            +{kpis.repeatCustomerChangePct}% YoY
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            Mean Patron CLV
          </span>
          <div className="mt-1.5 font-serif text-xl sm:text-2xl font-bold text-amber-300">
            £{kpis.avgCustomerLtv.toLocaleString()}
          </div>
          <span className="text-[10px] font-mono text-sky-400 font-semibold block mt-0.5">
            {kpis.clvToCacRatio}x CAC
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
            <span>Review Score</span>
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-1.5 font-serif text-xl sm:text-2xl font-bold text-white">
            {kpis.avgReviewScore.toFixed(2)}
          </div>
          <span className="text-[10px] font-mono text-neutral-400 block mt-0.5">
            {kpis.totalReviewsCount} reviews
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
            Average Order (AOV)
          </span>
          <div className="mt-1.5 font-serif text-xl sm:text-2xl font-bold text-sky-300">
            £{kpis.avgOrderValue.toLocaleString()}
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold block mt-0.5">
            +{kpis.aovChangePct}% YoY
          </span>
        </div>
      </div>

      {/* Tab Navigation Segmented Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#222] pb-3 no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-amber-400 text-black font-bold shadow-xs'
              : 'bg-[#121212] text-neutral-400 hover:text-white border border-[#262626]'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Executive Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('revenue')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'revenue'
              ? 'bg-amber-400 text-black font-bold shadow-xs'
              : 'bg-[#121212] text-neutral-400 hover:text-white border border-[#262626]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Revenue Trend</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-amber-400 text-black font-bold shadow-xs'
              : 'bg-[#121212] text-neutral-400 hover:text-white border border-[#262626]'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Product Performance</span>
        </button>

        <button
          onClick={() => setActiveTab('conversion')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'conversion'
              ? 'bg-amber-400 text-black font-bold shadow-xs'
              : 'bg-[#121212] text-neutral-400 hover:text-white border border-[#262626]'
          }`}
        >
          <LineChart className="w-3.5 h-3.5" />
          <span>Order Conversion</span>
        </button>

        <button
          onClick={() => setActiveTab('retention_clv')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'retention_clv'
              ? 'bg-amber-400 text-black font-bold shadow-xs'
              : 'bg-[#121212] text-neutral-400 hover:text-white border border-[#262626]'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Retention & CLV</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors shrink-0 flex items-center gap-2 cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-amber-400 text-black font-bold shadow-xs'
              : 'bg-[#121212] text-neutral-400 hover:text-white border border-[#262626]'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span>Review Satisfaction</span>
        </button>
      </div>

      {/* Main Tab View Rendering */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Primary Revenue Curve Snapshot */}
            <RevenueTrendView series={revenueSeries} timeRange={timeRange} />

            {/* Grid with Funnel Snapshot & Retention Snapshot */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Funnel Preview */}
              <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
                  <div>
                    <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                      Bespoke Conversion Funnel
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans mt-0.5">
                      Overall conversion: {kpis.orderConversionRate}%
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('conversion')}
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Analysis</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {funnelStages.map((stage) => {
                    const widthPct = Math.max(Math.round((stage.visitors / funnelStages[0].visitors) * 100), 10);
                    return (
                      <div key={stage.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-neutral-300">{stage.name}</span>
                          <span className="text-white font-bold">{stage.visitors.toLocaleString()}</span>
                        </div>
                        <div className="h-2 w-full bg-[#181818] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review & Craftsmanship Aspect Preview */}
              <div className="p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-4">
                <div className="flex items-center justify-between border-b border-[#1c1c1c] pb-3">
                  <div>
                    <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                      Craftsmanship Quality Dimensions
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans mt-0.5">
                      Average score: {kpis.avgReviewScore.toFixed(2)} / 5.0 (NPS +{kpis.netPromoterScore})
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="text-xs font-mono text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Full Scorecard</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {reviewAspects.map((aspect) => (
                    <div key={aspect.aspect} className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-neutral-300">{aspect.aspect}</span>
                        <span className="text-amber-300 font-bold">{aspect.score.toFixed(2)} / 5.0</span>
                      </div>
                      <div className="h-2 w-full bg-[#181818] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full"
                          style={{ width: `${(aspect.score / 5.0) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Product Silhouettes Snapshot */}
            <ProductPerformanceView products={products} />
          </div>
        )}

        {activeTab === 'revenue' && (
          <RevenueTrendView series={revenueSeries} timeRange={timeRange} />
        )}

        {activeTab === 'products' && (
          <ProductPerformanceView products={products} />
        )}

        {activeTab === 'conversion' && (
          <OrderConversionView
            funnelStages={funnelStages}
            trafficChannels={trafficChannels}
            devices={devices}
          />
        )}

        {activeTab === 'retention_clv' && (
          <RetentionClvView
            cohorts={cohorts}
            vipClients={vipClients}
            clvTiers={clvTiers}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewScoreView
            aspects={reviewAspects}
            starDistribution={starDistribution}
            avgScore={kpis.avgReviewScore}
            totalReviews={kpis.totalReviewsCount}
            nps={kpis.netPromoterScore}
          />
        )}
      </div>

      {/* PDF Export Modal */}
      <AnalyticsPdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        kpis={kpis}
        series={revenueSeries}
        products={products}
        vipClients={vipClients}
        timeRange={timeRange}
      />
    </div>
  );
};
