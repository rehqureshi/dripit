import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/hero/hero-section";
import { HowItWorks } from "@/components/marketing/how-it-works/how-it-works";
import { FeaturedProducts } from "@/components/marketing/featured-products/featured-products";
import { DesignerSpotlight } from "@/components/marketing/designer-spotlight/designer-spotlight";
import { CategoriesSection } from "@/components/marketing/categories/categories-section";
import { Footer } from "@/components/marketing/footer/footer";

export const metadata: Metadata = {
  title: "Dripit — Wear Original Art",
  description:
    "Shop exclusive t-shirts and hoodies printed with original artwork from independent designers. Upload your design and earn royalties on every sale.",
  openGraph: {
    title: "Dripit — Wear Original Art",
    description:
      "Original print-on-demand fashion. Shop designs from independent creators or upload your own art and earn royalties.",
    type: "website",
  },
};

function MarqueeTicker() {
  const text =
    "New Design: Eclipse by @darkmatter  ·  600+ tees sold this week  ·  Become a designer — it's free  ·  20% royalty on every sale  ·  T-Shirts + Hoodies  ·  48hr design approval  ·  ";
  const repeated = text.repeat(3);

  return (
    <div
      className="overflow-hidden whitespace-nowrap border-y border-border py-3 bg-background select-none"
      aria-hidden="true"
    >
      <div className="inline-block animate-marquee">
        <span className="text-tagline text-muted-foreground text-[10px]">
          {repeated}
        </span>
        <span className="text-tagline text-muted-foreground text-[10px]">
          {repeated}
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main role="main">
      <HeroSection />
      <MarqueeTicker />
      <HowItWorks />
      <FeaturedProducts />
      <DesignerSpotlight />
      <CategoriesSection />
      <Footer />
    </main>
  );
}