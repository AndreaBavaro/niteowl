import { Metadata } from 'next';
import WaitlistClient from '../../components/WaitlistClient';

export const metadata: Metadata = {
  title: 'Join the Waitlist | NiteFinder',
  description: 'Get early access to Toronto\'s smartest nightlife discovery platform. Personalized bar recommendations, real-time wait times, and loyalty rewards.',
  keywords: 'Toronto nightlife, bars, clubs, waitlist, early access, bar recommendations',
};

export default function WaitlistPage() {
  return <WaitlistClient />;
}
