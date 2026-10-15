/**
 * @file recommendationEngine.ts
 * Intelligent Recommendation Architecture Engine for Daniel’s Maison.
 *
 * Implements deterministic multi-factor scoring algorithms to generate:
 * 1. Personalized Product Suggestions (Match scores 0-100% with explainable rationale)
 * 2. Collection Suggestions (Thematic alignment with seasonal preferences)
 * 3. Marketing Personalization & VIP Persona Blueprint
 *
 * Multi-Factor Scoring Weights:
 * - Fabric & Mill Affinity: 25%
 * - Colorway Preference: 20%
 * - Fit & Silhouette Match: 20%
 * - Price Budget Alignment: 20%
 * - Designer & Artisan Affinity: 15%
 */

import {
  CustomerPreferenceProfile,
  ProductRecommendationItem,
  CollectionRecommendationItem,
  MarketingPersonaBlueprint,
} from '../types/customerPreferences.types';
import { SeasonalCollection } from '../types/collection.types';
import { INITIAL_SEASONAL_COLLECTIONS } from '../mock/collectionMockData';
import { MOCK_PRODUCTS } from '../mock/danielsMockData';

// Catalog of master bespoke garments to evaluate
const BESPOKE_PRODUCT_CATALOG = [
  {
    id: 'rec_suit_01',
    name: 'Savile Row Sovereign Double-Breasted Chalkstripe Suit',
    category: 'Suits',
    price: 4850,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    fabric: 'Fox Brothers 370g British Worsted Flannel',
    mill: 'Fox Brothers & Co.',
    colors: ['#1C1C1E', '#0B0D12'],
    silhouette: 'Double-Breasted Heritage with Roped Pagoda Shoulders',
    designer: 'Daniel’s Maison',
    fitStyle: 'Sleek Savile Row Cut',
    aesthetic: 'Double-Breasted Heritage',
  },
  {
    id: 'rec_coat_02',
    name: 'The Haussmann Cashmere Greatcoat with Velvet Collar',
    category: 'Coats',
    price: 5200,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80',
    fabric: 'Scabal 520g Ripple Zibeline Mongolian Cashmere',
    mill: 'Scabal',
    colors: ['#0B0D12', '#4A0E17'],
    silhouette: 'High-Collar Architectural Greatcoat with Silk Velvet Inlay',
    designer: 'Eleanor Vance',
    fitStyle: 'Architectural Structured',
    aesthetic: 'High-Collar Architectural Greatcoat',
  },
  {
    id: 'rec_blazer_03',
    name: 'Neapolitan Unstructured Washed Irish Linen Blazer',
    category: 'Suits',
    price: 3600,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    fabric: 'Solbiati 260g Washed Irish Linen & Tussah Silk',
    mill: 'Solbiati (Loro Piana)',
    colors: ['#4A5B4C', '#D2B48C', '#0F1E36'],
    silhouette: 'Spalla Camicia Shirt-Shoulder 3-Roll-2 Button Stance',
    designer: 'Master Tailor Henri Laurent',
    fitStyle: 'Neapolitan Soft Tailoring',
    aesthetic: 'Unstructured Summer Linen',
  },
  {
    id: 'rec_tux_04',
    name: 'The Royal Ambassador Evening Grosgrain Tuxedo',
    category: 'Suits',
    price: 5400,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=800&q=80',
    fabric: 'Dormeuil 280g Pure Wool & Mulberry Silk Barathea 180s',
    mill: 'Dormeuil',
    colors: ['#080808', '#0D172A'],
    silhouette: '11cm Hand-Rolled Ribbed Grosgrain Silk Peak Lapel',
    designer: 'Daniel’s Maison',
    fitStyle: 'Sleek Savile Row Cut',
    aesthetic: 'Black-Tie Ceremonial Evening',
  },
  {
    id: 'rec_gold_05',
    name: 'The Sovereign 24k Gold Pinstripe Royal Tasmanian Suit',
    category: 'Suits',
    price: 9800,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    fabric: 'Loro Piana Royal Tasmanian Super 160s (14.5 Micron)',
    mill: 'Loro Piana',
    colors: ['#0D172A', '#D4AF37'],
    silhouette: 'Single-Breasted 2-Button Peak Lapel with Milanese Buttonholes',
    designer: 'Daniel’s Maison',
    fitStyle: 'Sleek Savile Row Cut',
    aesthetic: 'Double-Breasted Heritage',
  },
  {
    id: 'rec_safari_06',
    name: 'The Botanist Water-Resistant Storm Linen Field Jacket',
    category: 'Outerwear',
    price: 2950,
    currency: 'GBP',
    imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    fabric: 'Smith Woollens Tropical Fresco & Water-Repellent Flax',
    mill: 'Smith Woollens',
    colors: ['#4A5B4C', '#9CA3AF'],
    silhouette: 'Field & Safari Utility Tailoring with Belt Fastener',
    designer: 'Henry Alcott',
    fitStyle: 'Relaxed Casual Bespoke',
    aesthetic: 'Field & Safari Utility Tailoring',
  },
];

export const recommendationEngine = {
  /**
   * Calculate personalized product recommendations scored against client profile
   */
  generateProductRecommendations(profile: CustomerPreferenceProfile): ProductRecommendationItem[] {
    const scored = BESPOKE_PRODUCT_CATALOG.map((item) => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Fabric Affinity (25 points max)
      const matchesFabric = profile.favoriteFabrics.some(
        (ff) =>
          item.fabric.toLowerCase().includes(ff.name.toLowerCase()) ||
          item.mill.toLowerCase().includes(ff.millName.toLowerCase())
      );
      if (matchesFabric) {
        score += 25;
        reasons.push(`Allocated from preferred mill (${item.mill})`);
      } else {
        score += 8; // base credit
      }

      // 2. Color Affinity (20 points max)
      const matchesColor = profile.favoriteColors.some((fc) =>
        item.colors.some((ic) => ic.toLowerCase() === fc.hex.toLowerCase())
      );
      if (matchesColor) {
        score += 20;
        reasons.push(`Tailored in favorite palette colorway`);
      } else {
        score += 10;
      }

      // 3. Fit & Silhouette Affinity (20 points max)
      if (item.fitStyle === profile.preferredFit) {
        score += 20;
        reasons.push(`Cut to your preferred ${profile.preferredFit}`);
      } else {
        score += 5;
      }

      // 4. Style Aesthetic Affinity (15 points max)
      const matchesStyle = profile.preferredStyles.some(
        (st) => st.toLowerCase() === item.aesthetic.toLowerCase()
      );
      if (matchesStyle) {
        score += 15;
        reasons.push(`Harmonizes with preferred ${item.aesthetic} styling`);
      } else {
        score += 5;
      }

      // 5. Price Range Alignment (20 points max)
      if (item.price >= profile.priceRange.minPrice && item.price <= profile.priceRange.maxPrice) {
        score += 20;
        reasons.push(`Perfect fit within your £${profile.priceRange.minPrice.toLocaleString()} - £${profile.priceRange.maxPrice.toLocaleString()} range`);
      } else if (item.price > profile.priceRange.maxPrice && profile.priceRange.allowHighValueExceptions) {
        score += 10;
        reasons.push(`Investment bespoke heirloom tier`);
      } else {
        score += 6;
      }

      // Clamp between 45 and 99
      const finalScore = Math.min(Math.max(score, 45), 99);

      return {
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        currency: item.currency,
        imageUrl: item.imageUrl,
        fabric: item.fabric,
        silhouette: item.silhouette,
        designer: item.designer,
        matchScore: finalScore,
        matchingReasons: reasons,
        isTopRecommendation: false,
      };
    });

    // Sort by match score descending
    scored.sort((a, b) => b.matchScore - a.matchScore);

    if (scored.length > 0) {
      scored[0].isTopRecommendation = true;
    }

    return scored;
  },

  /**
   * Recommend seasonal collections based on preferred seasons, fabrics, and color affinities
   */
  generateCollectionRecommendations(
    profile: CustomerPreferenceProfile,
    allCollections: SeasonalCollection[] = INITIAL_SEASONAL_COLLECTIONS
  ): CollectionRecommendationItem[] {
    const scored = allCollections.map((col) => {
      let score = 50;
      const notes: string[] = [];

      // 1. Seasonal affinity
      if (profile.preferredCollections.includes(col.season)) {
        score += 30;
        notes.push(`Directly matches your interest in ${col.season} seasonal releases.`);
      }

      // 2. Palette overlap
      const hasColorOverlap = col.colorPalette?.some((cp) =>
        profile.favoriteColors.some((fc) => fc.hex.toLowerCase() === cp.hex.toLowerCase())
      );
      if (hasColorOverlap) {
        score += 12;
        notes.push(`Includes your favored color swatches.`);
      }

      // 3. Mill overlap
      const hasMillOverlap = col.textileHighlights?.some((th) =>
        profile.favoriteFabrics.some((ff) => th.toLowerCase().includes(ff.millName.toLowerCase()))
      );
      if (hasMillOverlap) {
        score += 10;
        notes.push(`Features textiles from your preferred mills.`);
      }

      const finalScore = Math.min(score, 98);

      return {
        id: col.id,
        slug: col.slug,
        title: col.title,
        season: col.season,
        seasonCode: col.seasonCode,
        coverImageUrl: col.coverImageUrl,
        matchScore: finalScore,
        thematicRationale: notes.join(' ') || `Curated bespoke catalog for ${col.season}.`,
        curatedPiecesCount: col.productCount,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored;
  },

  /**
   * Formulate VIP Persona and Marketing Personalization Blueprint
   */
  generatePersonaBlueprint(profile: CustomerPreferenceProfile): MarketingPersonaBlueprint {
    const isHighLuxury = profile.priceRange.maxPrice >= 9000;
    const isNeapolitan = profile.preferredFit === 'Neapolitan Soft Tailoring';
    const isBritish = profile.preferredFit.includes('Savile') || profile.preferredFit.includes('English');

    let clientSegment: MarketingPersonaBlueprint['clientSegment'] = 'Sovereign Patron';
    if (isHighLuxury) clientSegment = 'Haute Avant-Garde';
    else if (isNeapolitan) clientSegment = 'Modern Diplomat';
    else if (isBritish) clientSegment = 'Sovereign Patron';

    const topFabric = profile.favoriteFabrics[0]?.name || 'Super 160s Royal Worsted';
    const topColor = profile.favoriteColors[0]?.name || 'Midnight Obsidian';

    return {
      personaTitle: profile.vipPersonaTitle || 'Savile Row Sovereign Traditionalist',
      clientSegment,
      nextRecommendedCommission: {
        garmentType: isNeapolitan
          ? 'Deconstructed Double-Breasted Summer Blazer'
          : 'Bespoke 3-Piece Peak Lapel Lounge Suit',
        suggestedCloth: topFabric,
        suggestedColor: topColor,
        whyRecommended: `Calibrated to complement existing wardrobe assets with client’s favored ${profile.preferredFit} balance.`,
        estimatedCostGbp: Math.round((profile.priceRange.minPrice + profile.priceRange.maxPrice) / 2),
      },
      tailorConsultationDirectives: [
        `Anchor garment silhouette in ${profile.preferredFit}.`,
        `Apply ${profile.fitEaseTolerance} during basted fitting stage.`,
        `Present swatch cards strictly within ${profile.favoriteColors.map((c) => c.name).join(', ')}.`,
      ],
      swatchTrunkRecommended: [
        'Loro Piana Royal Tasmanian Super 160s Box',
        'Fox Brothers Somerset Heritage Flannel Swatch Pack',
        'Dormeuil Ceremonial Evening Silk Barathea Selection',
      ],
    };
  },
};
