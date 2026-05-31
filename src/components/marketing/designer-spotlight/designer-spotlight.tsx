import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const SPOTLIGHT = {
  name: "Amara Osei",
  handle: "@amaraosei",
  location: "London, UK",
  tagline: "I design at 2am. I earn while I sleep.",
  bio: "Amara started uploading prints to Dripit six months ago with one design. Today she has 34 live prints, has sold over 600 tees, and earns a passive income entirely from her artwork. She still has a day job — for now.",
  avatar:
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80&fit=crop",
  earningsStat: "$4,200",
  earningsPeriod: "earned in 6 months",
  designCount: "34",
  salesCount: "600+",
  designs: [
    {
      id: "d1",
      title: "Ghost Bloom",
      mockup:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80&fit=crop",
      price: 40,
    },
    {
      id: "d2",
      title: "Contour",
      mockup:
        "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80&fit=crop",
      price: 42,
    },
    {
      id: "d3",
      title: "Haze",
      mockup:
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80&fit=crop",
      price: 44,
    },
  ],
};

export function DesignerSpotlight() {
  const s = SPOTLIGHT;

  return (
    <section className="bg-zinc-950 text-white py-24 md:py-32 overflow-hidden">
      <div className="px-6 md:px-12">

        {/* Section label */}
        <p className="text-tagline text-zinc-500 mb-16">Creator Spotlight</p>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── LEFT — Designer portrait + earnings card ── */}
          <div className="relative">
            {/* Portrait */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=85&fit=crop"
                alt={`${s.name} at work`}
                className="absolute inset-0 h-full w-full object-cover object-top brightness-[0.65]"
                loading="lazy"
                draggable={false}
              />

              {/* Earnings overlay — bottom left */}
              <div className="absolute bottom-6 left-6 right-6 bg-black/70 backdrop-blur-sm border border-white/10 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-3.5 w-3.5 text-brand-purple-light" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                    Creator Earnings
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white tracking-tight">
                      {s.earningsStat}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {s.earningsPeriod}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      {s.designCount}
                    </p>
                    <p className="text-xs text-zinc-400">designs live</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Purple accent rule */}
            <div className="absolute -left-3 top-12 bottom-12 w-px bg-brand-purple opacity-50" />
          </div>

          {/* ── RIGHT — Story + designs ── */}
          <div className="flex flex-col">

            {/* Identity */}
            <div className="flex items-center gap-4 mb-10">
              <div className="relative h-14 w-14 rounded-full overflow-hidden ring-1 ring-white/10 shrink-0">
                <img
                  src={s.avatar}
                  alt={s.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{s.name}</p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {s.handle} · {s.location}
                </p>
              </div>
            </div>

            {/* Pull quote */}
            <h2 className="text-editorial text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-[-0.04em] font-bold text-white mb-8">
              &ldquo;{s.tagline}&rdquo;
            </h2>

            {/* Bio */}
            <p className="text-base text-zinc-400 font-light leading-relaxed max-w-md mb-10">
              {s.bio}
            </p>

            {/* Their prints mini-grid */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {s.designs.map((design) => (
                <Link
                  key={design.id}
                  href={`/designs/${design.id}`}
                  className="group relative block aspect-[3/4] overflow-hidden bg-zinc-900"
                >
                  <img
                    src={design.mockup}
                    alt={design.title}
                    className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    loading="lazy"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute bottom-0 inset-x-0 p-2.5 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-[10px] font-semibold text-white uppercase tracking-wide truncate">
                      {design.title}
                    </p>
                    <p className="text-[10px] text-white/70">${design.price}</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 mb-10 border-t border-white/10 pt-6">
              <div>
                <p className="text-xl font-bold text-white">{s.salesCount}</p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">
                  Tees sold
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-xl font-bold text-white">20%</p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">
                  Royalty rate
                </p>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <p className="text-xl font-bold text-white">48hr</p>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-0.5">
                  Design approval
                </p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-4">
              <Button
                asChild
                className="h-12 px-8 rounded-none bg-white text-black text-xs font-semibold uppercase tracking-widest hover:bg-white/85 transition-colors"
              >
                <Link href={`/designers/${s.handle}`}>
                  View Her Shop
                  <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                className="h-12 px-8 rounded-none bg-brand-purple text-white text-xs font-semibold uppercase tracking-widest hover:bg-brand-purple-dark transition-colors"
              >
                <Link href="/signup?role=designer">
                  Start Earning
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}