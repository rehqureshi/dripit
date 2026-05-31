import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const NAV_COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "All Designs", href: "/designs" },
      { label: "New Arrivals", href: "/designs/new" },
      { label: "Dark Art", href: "/categories/dark-art" },
      { label: "Minimal", href: "/categories/minimal" },
      { label: "Abstract", href: "/categories/abstract" },
    ],
  },
  {
    heading: "Creators",
    links: [
      { label: "All Designers", href: "/designers" },
      { label: "Creator Spotlight", href: "/designers/spotlight" },
      { label: "Become a Designer", href: "/signup?role=designer" },
      { label: "How It Works", href: "/designers/how-it-works" },
      { label: "Royalty Info", href: "/designers/royalties" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Dripit", href: "/about" },
      { label: "Editorial", href: "/editorial" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Size Guide", href: "/sizing" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "TikTok", href: "https://tiktok.com" },
  { label: "Twitter / X", href: "https://x.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Settings", href: "/cookies" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 text-white" aria-label="Site footer">

      {/* ── Upper — wordmark + newsletter + designer CTA ── */}
      <div className="px-6 md:px-12 pt-20 pb-16 border-b border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">

          {/* Wordmark + tagline */}
          <div>
            <p className="text-wordmark text-[clamp(3rem,8vw,6rem)] tracking-[0.12em] leading-none text-white select-none">
              DRIPIT
            </p>
            <p className="text-tagline text-zinc-500 mt-3">
              CREATE • WEAR • EARN
            </p>
          </div>

          {/* Right — newsletter + designer nudge */}
          <div className="flex flex-col gap-6 max-w-sm w-full">
            {/* Newsletter */}
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-400 mb-3">
                New drops. No noise.
              </p>
              <div className="flex h-12">
                <input
                  type="email"
                  placeholder="your@email.com"
                  aria-label="Email for newsletter"
                  className="flex-1 min-w-0 bg-white/5 border border-white/10 px-4 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-brand-purple transition-colors"
                />
                <button
                  type="submit"
                  className="h-12 px-5 bg-white text-black text-[11px] font-semibold uppercase tracking-widest hover:bg-white/85 transition-colors shrink-0"
                  aria-label="Subscribe"
                >
                  Join
                </button>
              </div>
            </div>

            {/* Designer nudge */}
            <Link
              href="/signup?role=designer"
              className="group flex items-center justify-between border border-brand-purple/40 bg-brand-purple/10 px-5 py-4 hover:bg-brand-purple/20 transition-colors"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-purple-light">
                  Are you an artist?
                </p>
                <p className="text-sm font-medium text-white mt-0.5">
                  Upload your design. Start earning.
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-brand-purple-light shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mid — nav columns ── */}
      <div className="px-6 md:px-12 py-16 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
          {NAV_COLUMNS.map((col) => (
            <div key={col.heading}>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500 mb-5">
                {col.heading}
              </p>
              <ul className="space-y-3" role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-300 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom — legal + social ── */}
      <div className="px-6 md:px-12 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <p className="text-xs text-zinc-600">© {year} Dripit, Inc.</p>
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-5">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="group flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
              >
                {link.label}
                <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}