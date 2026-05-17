import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { PopularProducts } from "@/components/home/PopularProducts";
import { WhySection } from "@/components/home/WhySection";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:px-6 sm:py-14">
      <Hero />
      <Categories />
      <PopularProducts />
      <WhySection />
    </div>
  );
}
