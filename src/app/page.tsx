import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { PopularProducts } from "@/components/home/PopularProducts";
import { WhySection } from "@/components/home/WhySection";
import { PageContainer } from "@/components/layout/PageContainer";

export default function HomePage() {
  return (
    <PageContainer className="space-y-16 sm:space-y-20">
      <Hero />
      <Categories />
      <PopularProducts />
      <WhySection />
    </PageContainer>
  );
}
