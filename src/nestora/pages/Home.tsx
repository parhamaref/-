import { PRICE_MAX, PRICE_MIN } from '../data/types';
import { useJsonLd, usePageMeta } from '../data/hooks';
import { useRouter } from '../router';
import { Layout } from '../components/Layout';
import { Hero } from '../components/Hero';
import { FeaturedProperties } from '../components/FeaturedProperties';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { PortfolioCta } from '../components/PortfolioCta';
import type { SearchCriteria } from '../components/SearchPanel';

export function Home() {
  const { navigate } = useRouter();

  usePageMeta({
    title: 'Nestora Homes — Exclusive Luxury Homes & Sophisticated Properties',
    description:
      'Discover exclusive luxury homes and sophisticated properties with Nestora Homes — curated villas, penthouses, waterfront residences and estates.',
    image: `${window.location.origin}/og-nestora.jpg`,
  });

  useJsonLd('organisation', {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Nestora Homes',
    description: 'Premium and luxury residential real estate discovery and personalised consultation.',
    url: window.location.origin,
    areaServed: ['Malibu', 'New York', 'Seattle', 'Miami', 'Los Angeles', 'London', 'Dubai'],
  });

  const handleSearch = (criteria: SearchCriteria) => {
    const params = new URLSearchParams();
    if (criteria.location) params.set('location', criteria.location);
    if (criteria.type && criteria.type !== 'All Properties') params.set('type', criteria.type);
    if (criteria.minPrice > PRICE_MIN) params.set('min', String(criteria.minPrice));
    if (criteria.maxPrice < PRICE_MAX) params.set('max', String(criteria.maxPrice));
    const search = params.toString();
    navigate(`/listings${search ? `?${search}` : ''}`);
  };

  return (
    <Layout overlayHeader>
      <Hero onSearch={handleSearch} />
      <FeaturedProperties />
      <WhyChooseUs />
      <PortfolioCta />
    </Layout>
  );
}
