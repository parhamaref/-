/**
 * @file review.types.ts
 * Enterprise type definitions for the Atelier Review Management & Customer Sentiment Suite.
 * Covers Ratings, Multi-Vector Craft Scores, Text & Video Reviews, Atelier Replies, and Analytics.
 */

export type ReviewRatingValue = 1 | 2 | 3 | 4 | 5;

export type ReviewFormat = 'text' | 'video' | 'photo';

export type ReviewStatus = 'published' | 'pending_moderation' | 'flagged';

export interface MultiVectorRatings {
  fabricQuality: number; // 1-5
  fitAccuracy: number; // 1-5
  craftFinishing: number; // 1-5
  communicationService: number; // 1-5
}

export interface ReviewAuthor {
  id: string;
  name: string;
  avatarUrl: string;
  tier: 'VIP Patron' | 'Verified Buyer' | 'Private Client' | 'Bespoke Member';
  city: string;
  country: string;
  totalOrdersCount: number;
}

export interface AtelierReply {
  id: string;
  text: string;
  authorName: string;
  authorRole: string;
  authorAvatarUrl: string;
  createdAt: string;
  updatedAt?: string;
  isPublished: boolean;
}

export interface VideoReviewMetadata {
  videoUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  aspectRatio: '16:9' | '9:16';
  transcription: string;
  soundtrack?: string;
}

export interface ReviewItem {
  id: string;
  orderId: string;
  orderNumber: string;
  garmentName: string;
  garmentCategory: 'jackets' | 'suits' | 'shirts' | 'outerwear' | 'trousers';
  garmentThumbnail: string;
  author: ReviewAuthor;
  overallRating: ReviewRatingValue;
  vectorRatings: MultiVectorRatings;
  headline: string;
  content: string;
  format: ReviewFormat;
  videoMetadata?: VideoReviewMetadata;
  photos?: string[];
  helpfulCount: number;
  isVerifiedPurchase: boolean;
  isFeatured: boolean;
  status: ReviewStatus;
  sentiment: 'positive' | 'neutral' | 'constructive';
  reply?: AtelierReply;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewAnalyticsSummary {
  averageRating: number;
  totalReviewsCount: number;
  verifiedBuyersCount: number;
  responseRatePercent: number;
  averageResponseHours: number;
  csatPercent: number; // Customer satisfaction score
  npsScore: number; // Net promoter score
  ratingDistribution: {
    stars: ReviewRatingValue;
    count: number;
    percentage: number;
  }[];
  vectorAverages: {
    fabricQuality: number;
    fitAccuracy: number;
    craftFinishing: number;
    communicationService: number;
  };
  monthlyTrends: {
    month: string;
    averageRating: number;
    reviewsCount: number;
    sentimentScore: number; // 0-100
  }[];
}
