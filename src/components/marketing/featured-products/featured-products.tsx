"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Design {
  id: string;
  title: string;
  designer: string;
  designerHandle: string;
  price: number;
  /** Garment the design is shown on */
  garment: "T-Shirt" | "Hoodie";
  /** Tee mockup with print applied */
  mockupImage: string;
  /** Raw artwork thumbnail */
  artworkImage: string;
  badge?: string;
  slug: string;
}

const FEATURED_DESIGNS: Design[] = [
  {
    id: "1",
    title: "Eclipse",
    designer: "Dark Matter",
    designerHandle: "@darkmatter",
    price: 42,
    garment: "T-Shirt",
    mockupImage:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80&fit=crop",
    artworkImage:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80&fit=crop",
    badge: "Trending",
    slug: "eclipse",
  },
  {
    id: "2",
    title: "Void Circuit",
    designer: "Neon Haus",
    designerHandle: "@neonhaus",
    price: 44,
    garment: "Hoodie",
    mockupImage:
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80&fit=crop",
    artworkImage:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=200&q=80&fit=crop",
    slug: "void-circuit",
  },
  {
    id: "3",
    title: "Ghost Bloom",
    designer: "Amara Osei",
    designerHandle: "@amaraosei",
    price: 40,
    garment: "T-Shirt",
    mockupImage:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&fit=crop",
    artworkImage:
      "https://images.unsplash.com/photo-1563089145-599997674d42?w=200&q=80&fit=crop",
    badge: "New",
    slug: "ghost-bloom",
  },
  {
    id: "4",
    title: "Glitch Tokyo",
    designer: "FRGMNT",
    designerHandle: "@frgmnt",
    price: 46,
    garment: "Hoodie",
    mockupImage:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80&fit=crop",
    artworkImage:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&q=80&fit=crop",
    slug: "glitch-tokyo",
  },
];

function DesignCard({ design }: { design: Design }) {
  const [liked, setLiked] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="group relative flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Mockup image container */}
      <Link
        href={`/designs/${design.slug}`}
        className="relative block overflow-hidden bg-zinc-100 aspect-[3/4]"
      >
        <img
          src={design.mockupImage}
          alt={`${design.title} printed tee`}
          className="absolute inset-0 h-full w-full object-cover object-center grayscale transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0"
          loading="lazy"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

        {/* Badge */}
        {design.badge && (
          <span className="absolute top-3 left-3 bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground">
            {design.badge}
          </span>
        )}

        {/* Garment type pill */}
        <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest">
          {design.garment}
        </span>

        {/* Artwork thumbnail — slides in on hover */}
        <div
          className={`absolute bottom-3 left-3 w-14 h-14 border-2 border-white overflow-hidden transition-all duration-300 ${
            hovered
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          <img
            src={design.artworkImage}
            alt={`${design.title} artwork`}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Quick buy — slides up on hover */}
        <div className="absolute bottom-0 inset-x-0 translate-y-full opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 p-3">
          <Button
            className="w-full h-10 rounded-none bg-background text-foreground text-[11px] font-semibold uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            <ShoppingBag className="mr-1.5 h-3 w-3" />
            Quick Buy
          </Button>
        </div>
      </Link>

      {/* Card footer */}
      <div className="flex items-start justify-between pt-3 gap-2">
        <div className="min-w-0">
          {/* Design title */}
          <h3 className="text-sm font-semibold text-foreground tracking-tight truncate">
            &ldquo;{design.title}&rdquo;
          </h3>
          {/* Designer link */}
          <Link
            href={`/designers/${design.designerHandle}`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 block truncate"
          >
            {design.designerHandle}
          </Link>
          <p className="text-sm font-bold text-foreground mt-1.5">
            ${design.price}
          </p>
        </div>

        <button
          aria-label={liked ? "Remove from wishlist" : "Save design"}
          onClick={() => setLiked((p) => !p)}
          className="shrink-0 mt-0.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Heart
            className={`h-4 w-4 transition-all ${
              liked ? "fill-foreground stroke-foreground" : ""
            }`}
          />
        </button>
      </div>
    </article>
  );
}

export function FeaturedProducts() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-background">
      {/* Header */}
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <div>
          <p className="text-tagline text-muted-foreground mb-3">
            Original Prints
          </p>
          <h2 className="text-editorial text-[clamp(2rem,5vw,4rem)] leading-none tracking-[-0.03em] font-bold uppercase">
            Featured
            <br />
            Designs
          </h2>
        </div>
        <Button
          asChild
          variant="ghost"
          className="hidden sm:flex items-center gap-2 rounded-none text-xs font-semibold uppercase tracking-widest hover:bg-transparent hover:opacity-60 px-0"
        >
          <Link href="/designs">
            All Designs
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
        {FEATURED_DESIGNS.map((design) => (
          <DesignCard key={design.id} design={design} />
        ))}
      </div>

      {/* Mobile CTA */}
      <div className="mt-12 flex justify-center sm:hidden">
        <Button
          asChild
          variant="outline"
          className="h-12 px-8 rounded-none text-xs font-semibold uppercase tracking-widest border-foreground"
        >
          <Link href="/designs">Browse All Designs</Link>
        </Button>
      </div>
    </section>
  );
}