import { SellerProfileView } from "@/components/seller/SellerProfileView";
import { sellers } from "@/data/sellers";

export function generateStaticParams() {
  return sellers.map((s) => ({ slug: s.slug }));
}

export default async function SellerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <SellerProfileView slug={slug} />
    </div>
  );
}
