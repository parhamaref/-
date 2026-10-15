/**
 * @file reviewStore.ts
 * Reactive state store for Atelier Review Management & Customer Sentiment.
 * Manages client ratings, multi-vector craft scores, video reviews, official replies,
 * and real-time performance analytics.
 */

import { useState, useEffect } from 'react';
import {
  ReviewItem,
  ReviewAnalyticsSummary,
  AtelierReply,
  ReviewRatingValue,
} from '../types/review.types';

const STORAGE_KEY = 'daniels_atelier_reviews_v1';

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev_001_alistair',
    orderId: 'ord_dm_9481',
    orderNumber: 'DM-2026-9481',
    garmentName: 'Anatomical Savile Row Tuxedo Jacket',
    garmentCategory: 'jackets',
    garmentThumbnail:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80',
    author: {
      id: 'cust_alistair_sterling',
      name: 'Lord Alistair Sterling',
      avatarUrl:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      tier: 'VIP Patron',
      city: 'London',
      country: 'United Kingdom',
      totalOrdersCount: 5,
    },
    overallRating: 5,
    vectorRatings: {
      fabricQuality: 5.0,
      fitAccuracy: 5.0,
      craftFinishing: 5.0,
      communicationService: 4.9,
    },
    headline: 'Supreme drape and unmatched shoulder posture for Royal Ascot',
    content:
      'The roped shoulder and floating horsehair chest canvas mold precisely to the clavicle without any chest buckling. The Scabal Super 150s diamond powder finish catches the ballroom chandeliers with extraordinary subtlety. Truly heirloom bespoke tailoring.',
    format: 'video',
    videoMetadata: {
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 58,
      aspectRatio: '16:9',
      transcription:
        "Good afternoon from Mayfair. I just received the bespoke tuxedo from Daniel's atelier for the Royal Ascot banquet. Take a look at the roping on the shoulder seam — zero collapse, and the satin grosgrain lapel roll is razor-crisp. You can feel the floating horsehair canvas breathing as you move.",
    },
    photos: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    ],
    helpfulCount: 24,
    isVerifiedPurchase: true,
    isFeatured: true,
    status: 'published',
    sentiment: 'positive',
    reply: {
      id: 'rep_001',
      text: 'My Lord, it was a supreme privilege cutting this cloth for you. The high-twist worsted wool will continue to temper gracefully across the season. We look forward to fitting the winter overcoat.',
      authorName: 'Daniel M. Sterling',
      authorRole: 'Creative Director & Master Cutter',
      authorAvatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: '2026-10-09T14:20:00Z',
      isPublished: true,
    },
    createdAt: '2026-10-08T18:30:00Z',
    updatedAt: '2026-10-09T14:20:00Z',
  },
  {
    id: 'rev_002_julian',
    orderId: 'ord_dm_9480',
    orderNumber: 'DM-2026-9480',
    garmentName: 'Anatomical Overcoat (Loro Piana Storm System)',
    garmentCategory: 'outerwear',
    garmentThumbnail:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    author: {
      id: 'cust_julian_thorne',
      name: 'Sir Julian Thorne',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      tier: 'VIP Patron',
      city: 'Zurich / Geneva',
      country: 'Switzerland',
      totalOrdersCount: 4,
    },
    overallRating: 5,
    vectorRatings: {
      fabricQuality: 5.0,
      fitAccuracy: 4.9,
      craftFinishing: 5.0,
      communicationService: 5.0,
    },
    headline: 'Incredible weather-barrier warmth without compromising Savile Row elegance',
    content:
      'Testing the coat during early Swiss alpine sleet. The water bead run-off on the Loro Piana Storm System Tasmania wool is remarkable. The horn button stance sits right at the natural waist line. The custom hand-embroidered monogram inside the facing is an exquisite detail.',
    format: 'photo',
    photos: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    ],
    helpfulCount: 19,
    isVerifiedPurchase: true,
    isFeatured: true,
    status: 'published',
    sentiment: 'positive',
    reply: {
      id: 'rep_002',
      text: 'Thank you Sir Julian. We reinforced the storm collar tab specifically for the high altitude winds in the Engadin. Delighted to hear the weather barrier is performing seamlessly.',
      authorName: 'Daniel M. Sterling',
      authorRole: 'Creative Director',
      authorAvatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: '2026-10-06T10:15:00Z',
      isPublished: true,
    },
    createdAt: '2026-10-05T16:00:00Z',
    updatedAt: '2026-10-06T10:15:00Z',
  },
  {
    id: 'rev_003_evelyn',
    orderId: 'ord_dm_9487',
    orderNumber: 'DM-2026-9487',
    garmentName: 'Couture Silk Velvet Smoking Jacket',
    garmentCategory: 'jackets',
    garmentThumbnail:
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80',
    author: {
      id: 'cust_evelyn_sinclair',
      name: 'Lady Evelyn Sinclair',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      tier: 'Private Client',
      city: 'Edinburgh',
      country: 'United Kingdom',
      totalOrdersCount: 3,
    },
    overallRating: 5,
    vectorRatings: {
      fabricQuality: 5.0,
      fitAccuracy: 4.8,
      craftFinishing: 5.0,
      communicationService: 4.9,
    },
    headline: 'Jakob Schlaepfer silk velvet with flawless quilted lapels',
    content:
      'The deep black luster of this velvet has zero crush lines. The hand-quilted silk satin shawl collar feels like a dream around the neck. The direct messaging updates from the workshop floor kept me connected through every cut.',
    format: 'video',
    videoMetadata: {
      videoUrl:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
      durationSeconds: 44,
      aspectRatio: '16:9',
      transcription:
        'Here is the smoking jacket on the hanger and on body. The hand quilting along the shawl lapel is unbelievable — millimeter-accurate stitches. I love the weight and drape of the silk velvet pile.',
    },
    photos: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    ],
    helpfulCount: 16,
    isVerifiedPurchase: true,
    isFeatured: true,
    status: 'published',
    sentiment: 'positive',
    reply: {
      id: 'rep_003',
      text: 'Lady Sinclair, the vertical suspension velvet box ensured the pile arrived unblemished. Thank you for trusting us with this historical piece.',
      authorName: 'Daniel M. Sterling',
      authorRole: 'Creative Director',
      authorAvatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: '2026-10-04T12:00:00Z',
      isPublished: true,
    },
    createdAt: '2026-10-03T20:10:00Z',
    updatedAt: '2026-10-04T12:00:00Z',
  },
  {
    id: 'rev_004_harrison',
    orderId: 'ord_dm_9485',
    orderNumber: 'DM-2026-9485',
    garmentName: 'Albini Giza 87 Double-Cuff Dress Shirt',
    garmentCategory: 'shirts',
    garmentThumbnail:
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=400&q=80',
    author: {
      id: 'cust_harrison_brooks',
      name: 'Harrison Brooks',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      tier: 'Verified Buyer',
      city: 'New York',
      country: 'United States',
      totalOrdersCount: 2,
    },
    overallRating: 4,
    vectorRatings: {
      fabricQuality: 4.8,
      fitAccuracy: 4.2,
      craftFinishing: 4.7,
      communicationService: 4.5,
    },
    headline: 'Glorious Egyptian cotton shirting — slight tightness at wrist cuff',
    content:
      'The Albini Giza 87 cloth feels like liquid silk against the skin, and the mother-of-pearl buttons are thick and luxurious. My only minor note is the right cuff ease with my thick mechanical chronograph watch. Otherwise, collar roll is world-class.',
    format: 'text',
    photos: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
    ],
    helpfulCount: 8,
    isVerifiedPurchase: true,
    isFeatured: false,
    status: 'published',
    sentiment: 'constructive',
    // Awaiting reply to test reply feature!
    createdAt: '2026-10-11T15:45:00Z',
    updatedAt: '2026-10-11T15:45:00Z',
  },
  {
    id: 'rev_005_alexander',
    orderId: 'ord_dm_9486',
    orderNumber: 'DM-2026-9486',
    garmentName: 'Kurashiki Selvedge Artisan Overshirt',
    garmentCategory: 'shirts',
    garmentThumbnail:
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=400&q=80',
    author: {
      id: 'cust_alexander_dubois',
      name: 'Alexander Dubois',
      avatarUrl:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      tier: 'Bespoke Member',
      city: 'Paris',
      country: 'France',
      totalOrdersCount: 2,
    },
    overallRating: 5,
    vectorRatings: {
      fabricQuality: 5.0,
      fitAccuracy: 4.9,
      craftFinishing: 4.9,
      communicationService: 4.8,
    },
    headline: 'Authentic pink ticker shuttle loom selvedge ID on the interior placket',
    content:
      'A work of art. You can see the pure rope-dyed indigo uneven slub yarn texture. The horn buttons contrast beautifully with the dark raw denim. It will fade into personal gold over the next ten years.',
    format: 'text',
    helpfulCount: 11,
    isVerifiedPurchase: true,
    isFeatured: false,
    status: 'published',
    sentiment: 'positive',
    // Awaiting reply to test reply feature!
    createdAt: '2026-10-10T11:20:00Z',
    updatedAt: '2026-10-10T11:20:00Z',
  },
  {
    id: 'rev_006_marcus',
    orderId: 'ord_dm_9482',
    orderNumber: 'DM-2026-9482',
    garmentName: 'Holland & Sherry High-Twist Fresco Suit',
    garmentCategory: 'suits',
    garmentThumbnail:
      'https://images.unsplash.com/photo-1520006403909-838d6b89c79e?auto=format&fit=crop&w=400&q=80',
    author: {
      id: 'cust_marcus_vance',
      name: 'Marcus Vance',
      avatarUrl:
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
      tier: 'Verified Buyer',
      city: 'Milan',
      country: 'Italy',
      totalOrdersCount: 3,
    },
    overallRating: 5,
    vectorRatings: {
      fabricQuality: 4.9,
      fitAccuracy: 5.0,
      craftFinishing: 4.8,
      communicationService: 4.7,
    },
    headline: 'Crease resistance through 14 hours of transatlantic flight',
    content:
      'I stepped off the Heathrow to JFK red-eye and walked straight into our boardroom meeting without needing steam pressing. The open fresco weave breathes effortlessly while keeping a rigid architectural silhouette.',
    format: 'text',
    helpfulCount: 7,
    isVerifiedPurchase: true,
    isFeatured: true,
    status: 'published',
    sentiment: 'positive',
    reply: {
      id: 'rep_006',
      text: 'Marcus, high-twist Crispaire wool was engineered precisely for global traveling patrons. Delighted the springback recovery served you well in New York.',
      authorName: 'Daniel M. Sterling',
      authorRole: 'Master Cutter',
      authorAvatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      createdAt: '2026-10-02T16:00:00Z',
      isPublished: true,
    },
    createdAt: '2026-10-01T14:10:00Z',
    updatedAt: '2026-10-02T16:00:00Z',
  },
];

class ReviewStore {
  private reviews: ReviewItem[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      this.reviews = data ? JSON.parse(data) : INITIAL_REVIEWS;
    } catch {
      this.reviews = INITIAL_REVIEWS;
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.reviews));
    } catch (err) {
      console.error('Failed to persist reviews', err);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getReviews(): ReviewItem[] {
    return [...this.reviews];
  }

  public getAnalyticsSummary(): ReviewAnalyticsSummary {
    const total = this.reviews.length;
    if (total === 0) {
      return {
        averageRating: 5.0,
        totalReviewsCount: 0,
        verifiedBuyersCount: 0,
        responseRatePercent: 100,
        averageResponseHours: 4.2,
        csatPercent: 98,
        npsScore: 88,
        ratingDistribution: [
          { stars: 5, count: 0, percentage: 0 },
          { stars: 4, count: 0, percentage: 0 },
          { stars: 3, count: 0, percentage: 0 },
          { stars: 2, count: 0, percentage: 0 },
          { stars: 1, count: 0, percentage: 0 },
        ],
        vectorAverages: {
          fabricQuality: 5.0,
          fitAccuracy: 5.0,
          craftFinishing: 5.0,
          communicationService: 5.0,
        },
        monthlyTrends: [],
      };
    }

    const sumRating = this.reviews.reduce((sum, r) => sum + r.overallRating, 0);
    const averageRating = Math.round((sumRating / total) * 100) / 100;
    const verifiedBuyersCount = this.reviews.filter((r) => r.isVerifiedPurchase).length;
    const repliedCount = this.reviews.filter((r) => r.reply && r.reply.isPublished).length;
    const responseRatePercent = Math.round((repliedCount / total) * 100);

    // Distribution
    const starCounts: Record<ReviewRatingValue, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    this.reviews.forEach((r) => {
      starCounts[r.overallRating] = (starCounts[r.overallRating] || 0) + 1;
    });

    const ratingDistribution = ([5, 4, 3, 2, 1] as ReviewRatingValue[]).map((stars) => ({
      stars,
      count: starCounts[stars] || 0,
      percentage: Math.round(((starCounts[stars] || 0) / total) * 100),
    }));

    // Vector Averages
    const fabricSum = this.reviews.reduce((s, r) => s + r.vectorRatings.fabricQuality, 0);
    const fitSum = this.reviews.reduce((s, r) => s + r.vectorRatings.fitAccuracy, 0);
    const craftSum = this.reviews.reduce((s, r) => s + r.vectorRatings.craftFinishing, 0);
    const commSum = this.reviews.reduce((s, r) => s + r.vectorRatings.communicationService, 0);

    const vectorAverages = {
      fabricQuality: Math.round((fabricSum / total) * 10) / 10,
      fitAccuracy: Math.round((fitSum / total) * 10) / 10,
      craftFinishing: Math.round((craftSum / total) * 10) / 10,
      communicationService: Math.round((commSum / total) * 10) / 10,
    };

    return {
      averageRating,
      totalReviewsCount: total,
      verifiedBuyersCount,
      responseRatePercent,
      averageResponseHours: 3.8,
      csatPercent: 96,
      npsScore: 89,
      ratingDistribution,
      vectorAverages,
      monthlyTrends: [
        { month: 'May', averageRating: 4.88, reviewsCount: 14, sentimentScore: 92 },
        { month: 'Jun', averageRating: 4.92, reviewsCount: 18, sentimentScore: 95 },
        { month: 'Jul', averageRating: 4.90, reviewsCount: 22, sentimentScore: 94 },
        { month: 'Aug', averageRating: 4.95, reviewsCount: 20, sentimentScore: 97 },
        { month: 'Sep', averageRating: 4.91, reviewsCount: 26, sentimentScore: 95 },
        { month: 'Oct', averageRating: 4.94, reviewsCount: 28, sentimentScore: 98 },
      ],
    };
  }

  // --- ACTIONS ---

  public replyToReview(reviewId: string, replyText: string, authorRole: string = 'Master Cutter') {
    this.reviews = this.reviews.map((r) => {
      if (r.id === reviewId) {
        const reply: AtelierReply = {
          id: `rep_${Date.now()}`,
          text: replyText,
          authorName: 'Daniel M. Sterling',
          authorRole,
          authorAvatarUrl:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          createdAt: new Date().toISOString(),
          isPublished: true,
        };
        return {
          ...r,
          reply,
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    this.persist();
  }

  public updateReply(reviewId: string, replyText: string) {
    this.reviews = this.reviews.map((r) => {
      if (r.id === reviewId && r.reply) {
        return {
          ...r,
          reply: {
            ...r.reply,
            text: replyText,
            updatedAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    this.persist();
  }

  public deleteReply(reviewId: string) {
    this.reviews = this.reviews.map((r) => {
      if (r.id === reviewId) {
        const { reply, ...rest } = r;
        return {
          ...rest,
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    this.persist();
  }

  public toggleFeatured(reviewId: string) {
    this.reviews = this.reviews.map((r) => {
      if (r.id === reviewId) {
        return {
          ...r,
          isFeatured: !r.isFeatured,
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    this.persist();
  }

  public updateReviewStatus(reviewId: string, status: ReviewItem['status']) {
    this.reviews = this.reviews.map((r) => {
      if (r.id === reviewId) {
        return {
          ...r,
          status,
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });
    this.persist();
  }

  public addReview(reviewData: Omit<ReviewItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const newRev: ReviewItem = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.reviews = [newRev, ...this.reviews];
    this.persist();
    return newRev;
  }

  public resetToDefaults() {
    this.reviews = INITIAL_REVIEWS;
    this.persist();
  }
}

export const reviewStore = new ReviewStore();

export function useReviewStore() {
  const [reviews, setReviews] = useState<ReviewItem[]>(reviewStore.getReviews());
  const [analytics, setAnalytics] = useState<ReviewAnalyticsSummary>(
    reviewStore.getAnalyticsSummary()
  );

  useEffect(() => {
    const unsubscribe = reviewStore.subscribe(() => {
      setReviews(reviewStore.getReviews());
      setAnalytics(reviewStore.getAnalyticsSummary());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    reviews,
    analytics,
    replyToReview: (id: string, text: string, role?: string) =>
      reviewStore.replyToReview(id, text, role),
    updateReply: (id: string, text: string) => reviewStore.updateReply(id, text),
    deleteReply: (id: string) => reviewStore.deleteReply(id),
    toggleFeatured: (id: string) => reviewStore.toggleFeatured(id),
    updateReviewStatus: (id: string, status: ReviewItem['status']) =>
      reviewStore.updateReviewStatus(id, status),
    addReview: (rev: Omit<ReviewItem, 'id' | 'createdAt' | 'updatedAt'>) =>
      reviewStore.addReview(rev),
    resetToDefaults: () => reviewStore.resetToDefaults(),
  };
}
