"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  X,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Data
// ─────────────────────────────────────────────────────────────────────────────

interface NavColumn {
  heading: string;
  links: { label: string; href: string; tag?: string }[];
}

interface NavItem {
  label: string;
  href: string;
  columns?: NavColumn[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Shop",
    href: "/designs",
    columns: [
      {
        heading: "New In",
        links: [
          { label: "Latest Drops", href: "/designs/new", tag: "New" },
          { label: "Trending", href: "/designs/trending" },
          { label: "Staff Picks", href: "/designs/picks" },
        ],
      },
      {
        heading: "By Style",
        links: [
          { label: "Dark Art", href: "/categories/dark-art" },
          { label: "Minimal", href: "/categories/minimal" },
          { label: "Abstract", href: "/categories/abstract" },
          { label: "Illustrative", href: "/categories/illustrative" },
          { label: "Streetwear", href: "/categories/streetwear" },
        ],
      },
      {
        heading: "Garments",
        links: [
          { label: "T-Shirts", href: "/products/tshirts" },
          { label: "Hoodies", href: "/products/hoodies" },
        ],
      },
    ],
  },
  {
    label: "Designers",
    href: "/designers",
    columns: [
      {
        heading: "Discover",
        links: [
          { label: "All Creators", href: "/designers" },
          { label: "Spotlight", href: "/designers/spotlight" },
          { label: "Rising Talent", href: "/designers/rising" },
        ],
      },
      {
        heading: "Create",
        links: [
          { label: "Become a Designer", href: "/signup?role=designer", tag: "Free" },
          { label: "How It Works", href: "/designers/how-it-works" },
          { label: "Royalty Info", href: "/designers/royalties" },
        ],
      },
    ],
  },
  { label: "Categories", href: "/categories" },
  { label: "Editorial", href: "/editorial" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Announcement Bar
// ─────────────────────────────────────────────────────────────────────────────

function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="relative flex items-center justify-center bg-foreground text-background h-9 px-10">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em]">
        Upload your design&nbsp;&mdash;&nbsp;earn 20% royalty on every sale
        <Link
          href="/signup?role=designer"
          className="ml-3 inline-flex items-center gap-0.5 underline underline-offset-2 hover:opacity-70 transition-opacity"
        >
          Apply Free
          <ArrowUpRight className="h-2.5 w-2.5" />
        </Link>
      </p>
      <button
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100 transition-opacity"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mega Menu
// ─────────────────────────────────────────────────────────────────────────────

function MegaMenu({ item, visible }: { item: NavItem; visible: boolean }) {
  if (!item.columns) return null;

  return (
    <div
      className={`absolute left-0 right-0 top-full z-50 border-b border-border bg-background/98 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-3 pointer-events-none"
      }`}
      style={{ boxShadow: "0 40px 80px -20px rgba(0,0,0,0.10)" }}
    >
      <div className="max-w-screen-xl mx-auto px-12 py-10">
        <div className="flex gap-16">
          {item.columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-5 min-w-[140px]">
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-muted-foreground/50">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2.5 text-[13px] font-medium text-foreground/75 hover:text-foreground transition-colors duration-150"
                    >
                      <span className="h-px w-0 bg-foreground transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-4" />
                      {link.label}
                      {link.tag && (
                        <span className="text-[9px] font-semibold uppercase tracking-widest text-brand-purple bg-brand-purple/10 px-1.5 py-0.5">
                          {link.tag}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Editorial image — far right */}
          <div className="ml-auto hidden xl:block w-48 shrink-0">
            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
              <img
                src="https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&q=80&fit=crop"
                alt="Featured"
                className="h-full w-full object-cover grayscale"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[9px] uppercase tracking-widest text-white/60 mb-0.5">Featured Drop</p>
                <p className="text-sm font-semibold text-white leading-snug">"Eclipse" by @darkmatter</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Search Overlay
// ─────────────────────────────────────────────────────────────────────────────

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const trending = ["Dark Art", "Eclipse", "Minimal Tees", "Abstract Hoodies"];

  return (
    <div
      className={`overflow-hidden transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        open ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="border-t border-border px-6 md:px-12">
        <div className="flex items-center gap-5 h-14">
          <Search className="h-4 w-4 text-muted-foreground/60 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            placeholder="Search designs, artists, aesthetics…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
          />
          <button
            onClick={onClose}
            className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            Esc
          </button>
        </div>
        <div className="flex items-center gap-2 pb-3.5">
          <span className="text-[9px] uppercase tracking-widest text-muted-foreground/40 mr-1">Trending:</span>
          {trending.map((t) => (
            <button
              key={t}
              className="text-[10px] font-medium text-muted-foreground hover:text-foreground border border-border px-2.5 py-1 transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hamburger
// ─────────────────────────────────────────────────────────────────────────────

function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] lg:hidden"
    >
      <span className={`block h-[1.5px] w-5 bg-foreground origin-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "translate-y-[6.5px] rotate-45" : ""}`} />
      <span className={`block h-[1.5px] w-5 bg-foreground transition-all duration-200 ${open ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"}`} />
      <span className={`block h-[1.5px] w-5 bg-foreground origin-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile Drawer
// ─────────────────────────────────────────────────────────────────────────────

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const mainLinks = NAV_ITEMS.map((i) => ({ label: i.label, href: i.href }));

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/45 backdrop-blur-sm transition-opacity duration-400 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer panel */}
      <nav
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed inset-y-0 right-0 z-50 flex w-[min(380px,100vw)] flex-col bg-background transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-7 h-[60px] border-b border-border shrink-0">
          <Link href="/" onClick={onClose} className="text-wordmark text-[1.2rem] tracking-[0.22em] select-none">
            DRIPIT
          </Link>
          <button onClick={onClose} aria-label="Close" className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Nav links — large editorial type */}
        <div className="flex-1 overflow-y-auto px-7">
          <ul className="pt-10 pb-6">
            {mainLinks.map((link, i) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="group flex items-center justify-between py-[18px] border-b border-border/40"
                  style={{ transitionDelay: open ? `${60 + i * 35}ms` : "0ms" }}
                >
                  <span className="text-[2.1rem] font-bold tracking-[-0.03em] text-foreground group-hover:text-muted-foreground transition-colors duration-200 leading-none">
                    {link.label}
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-200 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Utility links */}
          <div className="pt-2 pb-6">
            <p className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground/40 mb-4">Account</p>
            {[
              { label: "Sign In", href: "/sign-in" },
              { label: "Create Account", href: "/signup" },
              { label: "Wishlist", href: "/wishlist" },
              { label: "Cart", href: "/cart" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={onClose}
                className="flex items-center py-3 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Sticky CTA */}
        <div className="px-7 py-5 border-t border-border shrink-0">
          <Link
            href="/signup?role=designer"
            onClick={onClose}
            className="flex items-center justify-between w-full h-12 px-5 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.18em] hover:bg-foreground/85 transition-colors"
          >
            Become a Designer
            <ArrowUpRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </nav>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Root Export
// ─────────────────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuTimeout = useRef<ReturnType<typeof setTimeout> |undefined>(undefined);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setActiveMenu(null);
    setSearchOpen(false);
  }, [pathname]);

  const openMenu = useCallback((label: string) => {
    clearTimeout(menuTimeout.current);
    setSearchOpen(false);
    setActiveMenu(label);
  }, []);

  const scheduleClose = useCallback(() => {
    menuTimeout.current = setTimeout(() => setActiveMenu(null), 120);
  }, []);

  const cancelClose = useCallback(() => {
    clearTimeout(menuTimeout.current);
  }, []);

  useEffect(() => () => clearTimeout(menuTimeout.current), []);

  const isElevated = scrolled || !!activeMenu || searchOpen;

  return (
    <>
      <AnnouncementBar />

      <header
        className={`sticky top-0 z-30 w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isElevated
            ? "bg-background/96 backdrop-blur-xl border-b border-border"
            : "bg-transparent border-b border-border/0"
        }`}
      >
        {/* ── Main bar ── */}
        <div className="relative flex h-[60px] items-center justify-between px-6 md:px-12">

          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 z-10 text-wordmark text-[1.25rem] tracking-[0.22em] text-foreground hover:opacity-60 transition-opacity duration-200 select-none"
            aria-label="Dripit home"
          >
            DRIPIT
          </Link>

          {/* Center nav — desktop */}
          <nav
            aria-label="Primary"
            className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-9"
          >
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              const menuActive = activeMenu === item.label;

              return (
                <div
                  key={item.label}
                  onMouseEnter={() => item.columns ? openMenu(item.label) : setActiveMenu(null)}
                  onMouseLeave={item.columns ? scheduleClose : undefined}
                >
                  <Link
                    href={item.href}
                    className={`group relative flex items-center gap-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] py-1 transition-colors duration-200 ${
                      active || menuActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    {item.columns && (
                      <ChevronDown className={`h-2.5 w-2.5 mt-px transition-transform duration-300 ${menuActive ? "rotate-180" : ""}`} />
                    )}
                    {/* Hover underline */}
                    <span className={`absolute -bottom-px left-0 h-px bg-foreground transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${active || menuActive ? "w-full" : "w-0 group-hover:w-full"}`} />
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-0.5 z-10">

            {/* Search toggle */}
            <button
              onClick={() => { setSearchOpen((p) => !p); setActiveMenu(null); }}
              aria-label="Search"
              className={`h-9 w-9 flex items-center justify-center transition-colors duration-200 ${searchOpen ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {searchOpen ? <X className="h-[17px] w-[17px]" /> : <Search className="h-[17px] w-[17px]" />}
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" aria-label="Wishlist" className="relative h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200">
              <Heart className="h-[17px] w-[17px]" />
              <span className="absolute top-1.5 right-1.5 h-[13px] w-[13px] flex items-center justify-center bg-foreground text-background text-[8px] font-bold">2</span>
            </Link>

            {/* Cart */}
            <Link href="/cart" aria-label="Cart" className="relative h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200">
              <ShoppingBag className="h-[17px] w-[17px]" />
              <span className="absolute top-1.5 right-1.5 h-[13px] w-[13px] flex items-center justify-center bg-foreground text-background text-[8px] font-bold">3</span>
            </Link>

            {/* Desktop — account + sign in */}
            <div className="hidden lg:flex items-center gap-3 ml-3 pl-4 border-l border-border/60">
              <Link href="/account" aria-label="Account" className="h-9 w-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors duration-200">
                <User className="h-[17px] w-[17px]" />
              </Link>
              <Link
                href="/sign-in"
                className="flex items-center h-8 px-5 bg-foreground text-background text-[10px] font-bold uppercase tracking-[0.16em] hover:bg-foreground/80 transition-colors"
              >
                Sign In
              </Link>
            </div>

            {/* Mobile hamburger */}
            <div className="ml-1 lg:hidden">
              <Hamburger open={mobileOpen} onClick={() => setMobileOpen((p) => !p)} />
            </div>
          </div>
        </div>

        {/* Search overlay */}
        <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

        {/* Mega menus */}
        {NAV_ITEMS.filter((i) => i.columns).map((item) => (
          <div key={item.label} onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
            <MegaMenu item={item} visible={activeMenu === item.label} />
          </div>
        ))}
      </header>

      {/* Mobile drawer */}
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}