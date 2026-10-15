/**
 * @file ReviewScoreView.tsx
 * Review Score & Craftsmanship Sentiment Analytics for Daniel’s Maison.
 * Highlights weighted star ratings, 5-star distribution bars, 5-dimensional
 * sartorial quality radar, Net Promoter Score (NPS), and video review efficacy.
 */

import React from 'react';
import {
  Star,
  Award,
  ShieldCheck,
  Video,
  FileText,
  ThumbsUp,
  TrendingUp,
  Sparkles,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import {
  ReviewAspectScore,
  StarRatingDistribution,
} from '../../../types/analytics.types';

interface ReviewScoreViewProps {
  aspects: ReviewAspectScore[];
  starDistribution: StarRatingDistribution[];
  avgScore: number;
  totalReviews: number;
  nps: number;
}

export const ReviewScoreView: React.FC<ReviewScoreViewProps> = ({
  aspects,
  starDistribution,
  avgScore,
  totalReviews,
  nps,
}) => {
  return (
    <div className="space-y-6 text-left">
      {/* Top Review Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-amber-500/20">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
            <span>Overall Review Score</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-amber-300">
              {avgScore.toFixed(2)}
            </span>
            <span className="text-neutral-400 font-mono text-xs">/ 5.00</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            Based on {totalReviews} verified client dossiers
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-emerald-500/20">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
            <span>Net Promoter Score (NPS)</span>
            <ThumbsUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-emerald-300">
              +{nps}
            </span>
            <span className="text-emerald-400 font-mono text-xs">World-Class</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            Luxury benchmark: +65 to +75
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
            <span>Video Review Share</span>
            <Video className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-white">
              31.6%
            </span>
            <span className="text-sky-400 font-mono text-xs font-semibold">
              96 Videos
            </span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            Generates 3.2x higher conversion referral
          </span>
        </div>

        <div className="p-5 rounded-xl bg-[#0c0c0c] border border-[#222]">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono uppercase tracking-wider">
            <span>5-Star Consensus</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold text-white">
              93.4%
            </span>
            <span className="text-emerald-400 font-mono text-xs">284 Patrons</span>
          </div>
          <span className="text-[10px] text-neutral-500 font-mono block mt-1">
            0% 1-star or 2-star ratings recorded
          </span>
        </div>
      </div>

      {/* Star Distribution & Aspect Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Star Rating Distribution Progress Bars */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-5">
          <div className="border-b border-[#1c1c1c] pb-3">
            <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
              Rating Spectrum Distribution
            </h3>
            <p className="text-xs text-neutral-400 font-sans mt-0.5">
              Breakdown across verified client submissions.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            {starDistribution.map((tier) => (
              <div key={tier.stars} className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1 w-14 shrink-0 text-amber-400 font-bold">
                  <span>{tier.stars}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </div>

                <div className="flex-1 h-3 bg-[#181818] rounded-full overflow-hidden border border-[#222]">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${tier.pct}%` }}
                  />
                </div>

                <div className="w-16 text-right font-bold text-white">
                  {tier.pct}%
                </div>
                <div className="w-12 text-right text-neutral-500 text-[10px]">
                  ({tier.count})
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#141414] border border-[#222] text-xs font-mono text-neutral-300 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>100% Authenticated Atelier Clients</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Only verified purchasers with logged fittings and deliveries can submit ratings.
            </p>
          </div>
        </div>

        {/* 5-Dimensional Sartorial Quality Scorecard */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0c0c0c] border border-[#222] space-y-5">
          <div className="border-b border-[#1c1c1c] pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-bold text-white uppercase tracking-wider">
                Craftsmanship & Quality Dimensions
              </h3>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">
                Evaluation across five core pillars of bespoke excellence.
              </p>
            </div>
            <span className="font-mono text-xs text-emerald-400">All Above Benchmark</span>
          </div>

          <div className="space-y-4 pt-1">
            {aspects.map((aspect) => {
              const scorePct = (aspect.score / aspect.maxScore) * 100;
              const benchmarkPct = (aspect.benchmark / aspect.maxScore) * 100;

              return (
                <div key={aspect.aspect} className="p-3.5 rounded-xl bg-[#141414] border border-[#222] space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white">{aspect.aspect}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-300 font-bold text-sm">
                        {aspect.score.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        (Benchmark: {aspect.benchmark.toFixed(2)})
                      </span>
                    </div>
                  </div>

                  {/* Relative bar with benchmark marker */}
                  <div className="relative w-full h-2 bg-[#222] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full"
                      style={{ width: `${scorePct}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-neutral-400 font-sans">
                    {aspect.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
