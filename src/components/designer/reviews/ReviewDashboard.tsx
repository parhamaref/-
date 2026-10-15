/**
 * @file ReviewDashboard.tsx
 * Enterprise Review Management & Client Sentiment Suite.
 * Features Multi-Vector Ratings, Text Reviews, Video Proof Playback,
 * Official Atelier Replies, Rating Distribution Charts, and Performance Metrics.
 */

import React, { useState } from 'react';
import {
  Star,
  Video,
  FileText,
  MessageSquare,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ThumbsUp,
  Sparkles,
  Play,
  RotateCcw,
  Pin,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronDown,
  BarChart2,
  Sliders,
  Send,
  Camera,
} from 'lucide-react';
import { useReviewStore } from '../../../stores/reviewStore';
import { ReviewItem, ReviewRatingValue, ReviewFormat } from '../../../types/review.types';
import { ReplyModal } from './ReplyModal';
import { VideoReviewModal } from './VideoReviewModal';

export const ReviewDashboard: React.FC = () => {
  const {
    reviews,
    analytics,
    replyToReview,
    updateReply,
    deleteReply,
    toggleFeatured,
    updateReviewStatus,
    resetToDefaults,
  } = useReviewStore();

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [starFilter, setStarFilter] = useState<string>('ALL');
  const [formatFilter, setFormatFilter] = useState<string>('ALL');
  const [replyFilter, setReplyFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest' | 'helpful'>('recent');

  // Modals
  const [activeReplyReview, setActiveReplyReview] = useState<ReviewItem | null>(null);
  const [activeVideoReview, setActiveVideoReview] = useState<ReviewItem | null>(null);

  // Quick inline reply state for convenience
  const [inlineReplyId, setInlineReplyId] = useState<string | null>(null);
  const [inlineReplyText, setInlineReplyText] = useState('');

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter logic
  const filteredReviews = reviews
    .filter((rev) => {
      const matchesSearch =
        rev.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.garmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rev.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStar =
        starFilter === 'ALL' || rev.overallRating === parseInt(starFilter, 10);

      const matchesFormat =
        formatFilter === 'ALL' ||
        (formatFilter === 'video' && rev.format === 'video') ||
        (formatFilter === 'photo' && rev.photos && rev.photos.length > 0) ||
        (formatFilter === 'text' && rev.format === 'text');

      let matchesReply = true;
      if (replyFilter === 'awaiting') matchesReply = !rev.reply || !rev.reply.isPublished;
      if (replyFilter === 'replied') matchesReply = !!rev.reply && rev.reply.isPublished;
      if (replyFilter === 'featured') matchesReply = rev.isFeatured;

      return matchesSearch && matchesStar && matchesFormat && matchesReply;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'highest') {
        return b.overallRating - a.overallRating;
      }
      if (sortBy === 'lowest') {
        return a.overallRating - b.overallRating;
      }
      if (sortBy === 'helpful') {
        return b.helpfulCount - a.helpfulCount;
      }
      return 0;
    });

  const handleSendInlineReply = (reviewId: string) => {
    if (!inlineReplyText.trim()) return;
    replyToReview(reviewId, inlineReplyText.trim(), 'Creative Director');
    setInlineReplyId(null);
    setInlineReplyText('');
    showToast('Atelier reply published successfully.');
  };

  const awaitingReplyCount = reviews.filter((r) => !r.reply || !r.reply.isPublished).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-[#181818] border border-amber-500/50 rounded-xl shadow-2xl flex items-center gap-3 text-xs text-white max-w-md animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="flex-1 font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-white tracking-wide">
              Client Reviews & Sentiment
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Multi-vector craft ratings, verified video proof reviews, official atelier replies, and CSAT metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {awaitingReplyCount > 0 && (
            <button
              onClick={() => setReplyFilter('awaiting')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{awaitingReplyCount} Awaiting Reply</span>
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm('Reset reviews to default atelier data?')) {
                resetToDefaults();
                showToast('Review records reset to factory presets.');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-[#181818] hover:bg-[#222] rounded-lg border border-[#333] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Performance Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Average Rating */}
        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Overall Rating</span>
            <div className="flex text-amber-400 text-xs">
              {'★★★★★'}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif font-bold text-white">
              {analytics.averageRating.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 font-mono">/ 5.0</span>
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" />
            100% Verified Savile Row Buyers
          </span>
        </div>

        {/* Total Reviews */}
        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Total Reviews</span>
            <FileText className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white">
            {analytics.totalReviewsCount}
          </div>
          <span className="text-[11px] text-gray-500">
            {reviews.filter((r) => r.format === 'video').length} Video Proofs Included
          </span>
        </div>

        {/* Response Rate */}
        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>Atelier Response Rate</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-emerald-400">
            {analytics.responseRatePercent}%
          </div>
          <span className="text-[11px] text-gray-500">
            Avg {analytics.averageResponseHours}h turnaround time
          </span>
        </div>

        {/* Customer Satisfaction & NPS */}
        <div className="p-4 bg-[#141414] border border-[#222] rounded-xl">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>CSAT / NPS Score</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-mono font-bold text-white">
            {analytics.csatPercent}%{' '}
            <span className="text-xs text-amber-400 font-normal">NPS {analytics.npsScore}</span>
          </div>
          <span className="text-[11px] text-gray-500">World-class luxury index</span>
        </div>
      </div>

      {/* Rating Charts & Vector Analytics Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Star Rating Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-[#141414] border border-[#222] rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-amber-400" />
            Rating Breakdown Distribution
          </h3>

          <div className="space-y-2 pt-1 text-xs">
            {analytics.ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="w-12 text-gray-400 font-mono text-[11px] flex items-center gap-1">
                  <span>{item.stars}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>

                <div className="flex-1 h-2 bg-[#222] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <div className="w-14 text-right font-mono text-gray-400 text-[11px]">
                  <span>{item.count}</span>
                  <span className="text-gray-600 text-[10px] ml-1">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Multi-Vector Craft Scores (4 cols) */}
        <div className="lg:col-span-4 bg-[#141414] border border-[#222] rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            Multi-Vector Craft Vectors
          </h3>

          <div className="space-y-2.5 pt-1 text-xs">
            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Fabric Quality & Drape</span>
                <span className="font-mono text-amber-400 font-semibold">
                  {analytics.vectorAverages.fabricQuality.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${(analytics.vectorAverages.fabricQuality / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Anatomical Fit & Posture</span>
                <span className="font-mono text-amber-400 font-semibold">
                  {analytics.vectorAverages.fitAccuracy.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${(analytics.vectorAverages.fitAccuracy / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Craftsmanship & Hand Finishing</span>
                <span className="font-mono text-amber-400 font-semibold">
                  {analytics.vectorAverages.craftFinishing.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${(analytics.vectorAverages.craftFinishing / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Fitting Studio Communication</span>
                <span className="font-mono text-amber-400 font-semibold">
                  {analytics.vectorAverages.communicationService.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#222] rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${(analytics.vectorAverages.communicationService / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Sentiment Trend (3 cols) */}
        <div className="lg:col-span-3 bg-[#141414] border border-[#222] rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Monthly Sentiment
          </h3>

          <div className="grid grid-cols-6 gap-1.5 pt-2 items-end h-28">
            {analytics.monthlyTrends.map((trend) => {
              const heightPercent = Math.min(100, Math.max(20, (trend.sentimentScore - 80) * 5));

              return (
                <div key={trend.month} className="flex flex-col items-center gap-1 h-full justify-end">
                  <span className="text-[9px] font-mono text-gray-400">
                    {trend.averageRating.toFixed(1)}
                  </span>
                  <div
                    className="w-full bg-emerald-500/80 hover:bg-emerald-400 rounded-t transition-all"
                    style={{ height: `${heightPercent}%` }}
                    title={`${trend.month}: ${trend.averageRating}★ (${trend.reviewsCount} reviews)`}
                  />
                  <span className="text-[9px] text-gray-500 truncate w-full text-center">
                    {trend.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="p-4 bg-[#141414] border border-[#222] rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client, garment, keyword..."
              className="w-full bg-[#181818] border border-[#2a2a2a] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Star Filter */}
          <select
            value={starFilter}
            onChange={(e) => setStarFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#181818] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Star Ratings</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars Only</option>
            <option value="3">3 Stars Only</option>
          </select>

          {/* Format Filter */}
          <select
            value={formatFilter}
            onChange={(e) => setFormatFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#181818] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Formats</option>
            <option value="video">Video Proofs</option>
            <option value="photo">Photo Attached</option>
            <option value="text">Text Only</option>
          </select>

          {/* Reply Status */}
          <select
            value={replyFilter}
            onChange={(e) => setReplyFilter(e.target.value)}
            className="w-full sm:w-auto bg-[#181818] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-400"
          >
            <option value="ALL">All Reply Statuses</option>
            <option value="awaiting">Awaiting Reply</option>
            <option value="replied">Replied by Atelier</option>
            <option value="featured">Featured Reviews</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <span className="text-gray-500 text-[11px] whitespace-nowrap">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#181818] border border-[#2a2a2a] rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-amber-400"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      </div>

      {/* Review Feed List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => {
          const hasReply = !!rev.reply && rev.reply.isPublished;
          const isVideo = rev.format === 'video' && rev.videoMetadata;

          return (
            <div
              key={rev.id}
              className={`p-6 bg-[#141414] border rounded-xl space-y-4 transition-all hover:border-[#333] ${
                rev.isFeatured ? 'border-amber-500/40 shadow-lg shadow-amber-500/5' : 'border-[#222]'
              }`}
            >
              {/* Top Row: Author, Verified Badge, Stars, Pin Action */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <img
                    src={rev.author.avatarUrl}
                    alt={rev.author.name}
                    className="w-11 h-11 rounded-full object-cover border border-white/20 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-white">{rev.author.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium">
                        {rev.author.tier}
                      </span>
                      {rev.isVerifiedPurchase && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified Bespoke Buyer
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2">
                      <span>{rev.author.city}, {rev.author.country}</span>
                      <span>•</span>
                      <span>Order #{rev.orderNumber}</span>
                      <span>•</span>
                      <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Star rating */}
                  <div className="flex items-center gap-1">
                    <span className="text-amber-400 text-sm font-mono">
                      {'★'.repeat(rev.overallRating)}
                    </span>
                    <span className="text-xs font-bold text-white font-mono">
                      {rev.overallRating}.0
                    </span>
                  </div>

                  {/* Pin/Feature toggle */}
                  <button
                    onClick={() => {
                      toggleFeatured(rev.id);
                      showToast(rev.isFeatured ? 'Review unpinned' : 'Review pinned to portfolio');
                    }}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      rev.isFeatured
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-[#1a1a1a] text-gray-400 hover:text-white border-[#2e2e2e]'
                    }`}
                    title={rev.isFeatured ? 'Unpin from Portfolio' : 'Pin to Portfolio'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Garment tag & Multi-vector scores strip */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] p-2.5 bg-[#181818] border border-[#222] rounded-lg">
                <span className="text-gray-400 font-medium">Bespoke Garment:</span>
                <span className="text-white font-semibold">{rev.garmentName}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">Fabric:</span>
                <span className="text-amber-300 font-mono font-medium">
                  {rev.vectorRatings.fabricQuality}★
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">Fit:</span>
                <span className="text-amber-300 font-mono font-medium">
                  {rev.vectorRatings.fitAccuracy}★
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">Craft:</span>
                <span className="text-amber-300 font-mono font-medium">
                  {rev.vectorRatings.craftFinishing}★
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">Service:</span>
                <span className="text-amber-300 font-mono font-medium">
                  {rev.vectorRatings.communicationService}★
                </span>
              </div>

              {/* Headline & Body Text */}
              <div className="space-y-1.5 text-xs">
                <h4 className="text-sm font-semibold text-white tracking-wide">
                  "{rev.headline}"
                </h4>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {rev.content}
                </p>
              </div>

              {/* Video Review Embedded Card if video format */}
              {isVideo && rev.videoMetadata && (
                <div className="p-3.5 bg-black/60 border border-[#262626] rounded-xl flex flex-col sm:flex-row items-center gap-4">
                  <div
                    onClick={() => setActiveVideoReview(rev)}
                    className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden cursor-pointer group shrink-0 border border-[#333]"
                  >
                    <img
                      src={rev.videoMetadata.thumbnailUrl}
                      alt="Video thumbnail"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-black ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/80 text-white">
                      {rev.videoMetadata.durationSeconds}s
                    </span>
                  </div>

                  <div className="flex-1 space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-amber-400 font-medium text-[11px]">
                      <Video className="w-3.5 h-3.5" />
                      <span>Verified Video Review Proof</span>
                    </div>
                    <p className="text-gray-300 line-clamp-2 italic text-[11px]">
                      "{rev.videoMetadata.transcription}"
                    </p>
                    <button
                      onClick={() => setActiveVideoReview(rev)}
                      className="text-amber-400 hover:text-amber-300 text-xs font-semibold flex items-center gap-1"
                    >
                      <span>Play Video & Read Full Transcript</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Photos Gallery if attached */}
              {rev.photos && rev.photos.length > 0 && !isVideo && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {rev.photos.map((photo, pIdx) => (
                    <img
                      key={pIdx}
                      src={photo}
                      alt="Review photo"
                      className="w-20 h-20 rounded-lg object-cover border border-[#2a2a2a] hover:opacity-90 transition-opacity cursor-pointer"
                    />
                  ))}
                </div>
              )}

              {/* Official Atelier Response Display if exists */}
              {hasReply && rev.reply && (
                <div className="p-4 rounded-xl bg-[#181818] border border-amber-500/30 text-xs space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.reply.authorAvatarUrl}
                        alt={rev.reply.authorName}
                        className="w-6 h-6 rounded-full border border-amber-500/40"
                      />
                      <span className="font-semibold text-amber-300">
                        {rev.reply.authorName}
                      </span>
                      <span className="text-[10px] text-gray-400">• {rev.reply.authorRole}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="text-[10px]">
                        {new Date(rev.reply.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setActiveReplyReview(rev)}
                        className="p-1 text-gray-400 hover:text-white rounded hover:bg-[#222]"
                        title="Edit Reply"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete official atelier reply?')) {
                            deleteReply(rev.id);
                            showToast('Reply removed.');
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-rose-400 rounded hover:bg-[#222]"
                        title="Delete Reply"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-200 leading-relaxed italic pl-8 border-l border-amber-500/30">
                    "{rev.reply.text}"
                  </p>
                </div>
              )}

              {/* Quick Inline Reply Box if triggered */}
              {inlineReplyId === rev.id && (
                <div className="p-3 bg-[#181818] border border-amber-500/40 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-amber-300">
                      Reply as Daniel M. Sterling (Creative Director)
                    </span>
                    <button
                      onClick={() => setInlineReplyId(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={inlineReplyText}
                    onChange={(e) => setInlineReplyText(e.target.value)}
                    placeholder="Write your atelier response..."
                    className="w-full bg-[#121212] border border-[#333] rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleSendInlineReply(rev.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-lg transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Publish Reply</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Footer Actions: Helpful count & Reply button */}
              <div className="flex items-center justify-between pt-2 border-t border-[#222] text-xs">
                <div className="flex items-center gap-2 text-gray-500 text-[11px]">
                  <ThumbsUp className="w-3.5 h-3.5 text-gray-400" />
                  <span>{rev.helpfulCount} clients found this helpful</span>
                </div>

                {!hasReply && inlineReplyId !== rev.id && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setInlineReplyId(rev.id);
                        setInlineReplyText('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 hover:text-white border border-[#333] transition-colors"
                    >
                      Quick Reply
                    </button>

                    <button
                      onClick={() => setActiveReplyReview(rev)}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg transition-colors shadow-sm shadow-amber-500/20"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Reply with Templates</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredReviews.length === 0 && (
          <div className="p-12 text-center bg-[#141414] border border-[#222] rounded-xl text-gray-400 space-y-2">
            <Star className="w-8 h-8 text-amber-400 mx-auto opacity-40" />
            <h4 className="text-sm font-semibold text-white">No Reviews Match Current Filters</h4>
            <p className="text-xs text-gray-500">
              Try adjusting your star ratings, review formats, or search keywords.
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ReplyModal
        isOpen={!!activeReplyReview}
        onClose={() => setActiveReplyReview(null)}
        review={activeReplyReview}
        onSaveReply={(reviewId, text, role) => {
          replyToReview(reviewId, text, role);
          showToast('Atelier official response published.');
        }}
      />

      <VideoReviewModal
        isOpen={!!activeVideoReview}
        onClose={() => setActiveVideoReview(null)}
        review={activeVideoReview}
        onOpenReply={(rev) => setActiveReplyReview(rev)}
      />
    </div>
  );
};
