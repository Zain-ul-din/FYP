'use client';
import HealthProviderDetails from '@/components/HealthProviderDetails';

export default function Page({ params: { slug } }: { params: { slug: string } }) {
  return <HealthProviderDetails uid={slug} />;
}
