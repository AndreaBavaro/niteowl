import { Metadata } from 'next';
import { ForYouNetflixClient } from '@/components/SimpleNetflixClient';

export const metadata: Metadata = {
  title: 'For You - Netflix Style | Nite Owl',
  description: 'Discover your perfect nightlife spots with our Netflix-style interface',
};

export default function ForYouNetflixPage() {
  return <ForYouNetflixClient />;
}
