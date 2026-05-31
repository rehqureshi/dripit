import Link from "next/link";
import type { TopDesign } from "@/types/database";

interface TopDesignsProps {
  designs: TopDesign[];
}

export function TopDesigns({ designs }: TopDesignsProps) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-7">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
          Best Sellers
        </p>
        <h3 className="mt-2 text-2xl font-bold text-white">Top Designs</h3>
      </div>

      {designs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-zinc-500 text-sm">No published designs yet.</p>
          <Link
            href="/designs/create"
            className="mt-3 text-xs text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2"
          >
            Create your first design
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {designs.map((design, i) => (
            <Link
              key={design.id}
              href={`/designs/${design.id}`}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 hover:border-white/20 transition-colors group"
            >
              <span className="text-xs font-bold text-zinc-600 w-5 shrink-0 text-center">
                {i + 1}
              </span>

              {design.front_mockup_url ? (
                <img
                  src={design.front_mockup_url}
                  alt={design.title}
                  className="h-16 w-16 rounded-xl object-cover shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              ) : (
                <div className="h-16 w-16 rounded-xl bg-zinc-800 shrink-0 flex items-center justify-center">
                  <span className="text-zinc-600 text-xs">No img</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white truncate group-hover:text-violet-300 transition-colors">
                  {design.title}
                </h4>
                <p className="mt-1 text-xs text-zinc-500">
                  {design.sales_count.toLocaleString()} sales
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-lg font-bold text-white">
                  ${design.royalty.toFixed(0)}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Royalty
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}