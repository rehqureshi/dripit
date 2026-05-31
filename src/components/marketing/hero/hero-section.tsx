"use client";

import Link from "next/link";
import { ArrowRight, Pencil, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "3,200+", label: "Designs Live" },
  { value: "840+", label: "Active Creators" },
  { value: "12K+", label: "Tees Sold" },
  { value: "100%", label: "Creator Royalties" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden flex flex-col">

      {/* ── Subtle grid texture ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#000 1px,transparent 1px),linear-gradient(to bottom,#000 1px,transparent 1px)",
          backgroundSize: "80px 80px",
        }}
        aria-hidden="true"
      />

      {/* ── Nav bar ── */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 pt-8">
        <span className="text-wordmark text-2xl tracking-[0.2em] text-foreground select-none">
          DRIPIT
        </span>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/designs"
            className="text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Browse Designs
          </Link>
          <Link
            href="/designers"
            className="text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Creators
          </Link>
        </nav>

        <Button
          asChild
          size="sm"
          className="h-9 px-5 rounded-none bg-brand-purple text-white text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-brand-purple-dark transition-colors"
        >
          <Link href="/signup?role=designer">
            <Pencil className="mr-1.5 h-3 w-3" />
            Sell Your Art
          </Link>
        </Button>
      </header>

      {/* ── Hero body ── */}
      <div className="relative z-10 flex flex-col lg:flex-row flex-1 items-stretch">

        {/* ── LEFT — Buyer side ── */}
        <div className="flex flex-col justify-center px-6 md:px-12 py-20 lg:py-0 lg:w-1/2 lg:border-r border-border">

          {/* Eyebrow */}
          <p className="text-tagline text-muted-foreground mb-6 animate-fade-up [animation-delay:100ms]">
            Art on Every Thread
          </p>

          {/* Headline */}
          <h1 className="text-editorial text-[clamp(3rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.04em] text-foreground uppercase mb-6 animate-fade-up [animation-delay:200ms]">
            Wear
            <br />
            <span className="text-brand-gradient">Original</span>
            <br />
            Art.
          </h1>

          <p className="text-base text-muted-foreground font-light leading-relaxed max-w-sm mb-10 animate-fade-up [animation-delay:300ms]">
            Every t-shirt and hoodie on Dripit carries an original design from
            an independent artist. No fast fashion. No mass prints. Just art
            you actually want to wear.
          </p>

          <div className="flex items-center gap-4 animate-fade-up [animation-delay:400ms]">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 rounded-none bg-foreground text-background text-xs font-semibold uppercase tracking-[0.12em] hover:bg-foreground/85 transition-colors"
            >
              <Link href="/designs">
                <ShoppingBag className="mr-2 h-3.5 w-3.5" />
                Shop Designs
              </Link>
            </Button>
            <Link
              href="/designs"
              className="group flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              New Arrivals
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Floating tee mockup preview */}
          <div className="mt-14 relative w-fit hidden md:block animate-fade-up [animation-delay:500ms]">
            <div className="relative w-48 aspect-square overflow-hidden bg-zinc-100 border border-border">
              <img
                src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80&fit=crop"
                alt="Sample printed tee"
                className="absolute inset-0 h-full w-full object-cover grayscale"
                draggable={false}
              />
            </div>
            <div className="absolute -bottom-3 -right-3 bg-background border border-border px-4 py-3 shadow-lg">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Just dropped
              </p>
              <p className="text-sm font-bold text-foreground mt-0.5">
                "Eclipse" Tee
              </p>
              <p className="text-xs text-muted-foreground">by @darkmatter</p>
            </div>
          </div>
        </div>

        {/* ── RIGHT — Designer side ── */}
        <div className="relative flex flex-col justify-center px-6 md:px-12 py-20 lg:py-0 lg:w-1/2 bg-zinc-950 overflow-hidden">

          {/* Background art texture */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=60&fit=crop"
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Purple accent line */}
          <div className="absolute left-0 top-16 bottom-16 w-px bg-brand-purple opacity-50" />

          <div className="relative z-10">
            <p className="text-tagline text-zinc-500 mb-6 animate-fade-up [animation-delay:200ms]">
              For Creators
            </p>

            <h2 className="text-editorial text-[clamp(3rem,7vw,6.5rem)] leading-[0.92] tracking-[-0.04em] text-white uppercase mb-6 animate-fade-up [animation-delay:300ms]">
              Upload.
              <br />
              <span style={{ color: "#9B7EC8" }}>Earn.</span>
              <br />
              Repeat.
            </h2>

            <p className="text-base text-zinc-400 font-light leading-relaxed max-w-sm mb-10 animate-fade-up [animation-delay:400ms]">
              Submit your artwork. We handle the printing, shipping, and
              payments. You earn a royalty on every sale — no inventory, no
              upfront cost.
            </p>

            {/* Royalty callout */}
            <div className="flex items-center gap-4 mb-10 animate-fade-up [animation-delay:450ms]">
              <div className="border border-brand-purple/40 bg-brand-purple/10 px-5 py-3">
                <p className="text-2xl font-bold text-white tracking-tight">
                  20%
                </p>
                <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 mt-0.5">
                  Royalty per sale
                </p>
              </div>
              <div className="border border-white/10 bg-white/5 px-5 py-3">
                <p className="text-2xl font-bold text-white tracking-tight">
                  Free
                </p>
                <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 mt-0.5">
                  To join & upload
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 animate-fade-up [animation-delay:500ms]">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 rounded-none bg-brand-purple text-white text-xs font-semibold uppercase tracking-[0.12em] hover:bg-brand-purple-dark transition-colors"
              >
                <Link href="/signup?role=designer">
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  Become a Designer
                </Link>
              </Button>
              <Link
                href="/designers/how-it-works"
                className="group flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
              >
                How it works
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="relative z-10 border-t border-border animate-fade-up [animation-delay:600ms]">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col items-start px-6 md:px-10 py-6 md:py-8 ${
                i < stats.length - 1 ? "border-r border-border" : ""
              }`}
            >
              <span className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                {stat.value}
              </span>
              <span className="text-label text-muted-foreground mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}