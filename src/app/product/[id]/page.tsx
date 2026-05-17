import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { PageContainer } from "@/components/layout/PageContainer";
import { getProductByIdStatic, getProductIds } from "@/lib/products";

export function generateStaticParams() {
  return getProductIds().map((id) => ({ id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductByIdStatic(id);

  if (!product) {
    notFound();
  }

  return (
    <PageContainer>
      <ProductDetail product={product} />
    </PageContainer>
  );
}
