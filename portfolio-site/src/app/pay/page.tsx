import type { Metadata } from 'next';
import PayClient from './PayClient';

export const metadata: Metadata = {
  title: 'Pay Manpreet Singh | Secure Payment',
  description:
    'Send a secure payment to Manpreet Singh via Razorpay or Paytm. Supports UPI, cards, netbanking, and direct mobile app redirects.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Pay Manpreet Singh',
    description: 'Secure payment via Razorpay or Paytm UPI.',
    type: 'website',
  },
};

export default function PayPage() {
  return <PayClient />;
}
