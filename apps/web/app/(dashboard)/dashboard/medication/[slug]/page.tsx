import MedicationDetails from '@/components/medication/MedicationDetails';

export default function Page({ params: { slug } }: { params: { slug: string } }) {
  const decodedSlug = decodeURI(slug);
  return <MedicationDetails uid={decodedSlug} />;
}
