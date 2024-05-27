export default function Page({ params: { slug } }: { params: { slug: string } }) {
  return <>{decodeURI(slug)}</>;
}
