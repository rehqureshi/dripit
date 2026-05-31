import { HeroSection } from "src/components/marketing/hero/hero-section";
import { FeaturedProducts } from "src/components/marketing/featured-products/featured-products";
import { DesignerSpotlight } from "src/components/marketing/designer-spotlight/designer-spotlight";
import { CategoriesSection } from "src/components/marketing/categories/categories-section";
import { Footer } from "src/components/marketing/footer/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dripit — Independent Fashion Marketplace",
  description:
    "Discover and shop exclusive pieces from independent designers. Creator-driven fashion. Minimal. Editorial. Uncompromised.",
  openGraph: {
    title: "Dripit — Independent Fashion Marketplace",
    description: "Shop independent fashion designers. Minimal. Editorial. Uncompromised.",
    type: "website",
  },
};

/** Scrolling marquee ticker between sections */
function MarqueeTicker() {
  const text =
    "New Drop — Void Jacket  ·  Amara Osei × FRGMNT  ·  SS'25 Now Live  ·  Free Shipping $150+  ·  Creator Applications Open  ·  ";
  // Duplicate for seamless loop
  const repeated = text.repeat(4);

  return (
    <div
      className="overflow-hidden whitespace-nowrap border-y border-border py-3 bg-background select-none"
      aria-hidden="true"
    >
      <div className="inline-block animate-marquee">
        <span className="text-tagline text-muted-foreground text-[10px]">
          {repeated}
        </span>
        {/* Duplicate to create seamless loop */}
        <span className="text-tagline text-muted-foreground text-[10px]">
          {repeated}
        </span>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="relative" role="main">
      {/* 1. Hero */}
      <HeroSection />

      {/* Ticker */}
      <MarqueeTicker />

      {/* 2. Featured Products */}
      <FeaturedProducts />

      {/* Section divider */}
      <div className="h-px bg-border mx-6 md:mx-12" aria-hidden="true" />

      {/* 3. Designer Spotlight */}
      <DesignerSpotlight />

      {/* 4. Categories */}
      <CategoriesSection />

      {/* 5. Footer */}
      <Footer />
    </main>
  );
}