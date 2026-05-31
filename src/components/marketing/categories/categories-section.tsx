import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface Category {
  name: string;
  slug: string;
  count: string;
  image: string;
  span?: string;
}

const CATEGORIES: Category[] = [
  {
    name: "Dark Art",
    slug: "dark-art",
    count: "920+ Designs",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80&fit=crop",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    name: "Minimal",
    slug: "minimal",
    count: "540+ Designs",
    image:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=700&q=80&fit=crop",
  },
  {
    name: "Abstract",
    slug: "abstract",
    count: "710+ Designs",
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=700&q=80&fit=crop",
  },
  {
    name: "Illustrative",
    slug: "illustrative",
    count: "380+ Designs",
    image:
      "https://images.unsplash.com/photo-1563089145-599997674d42?w=700&q=80&fit=crop",
  },
  {
    name: "Streetwear",
    slug: "streetwear",
    count: "460+ Designs",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=700&q=80&fit=crop",
  },
];

function CategoryCard({
  category,
  priority = false,
}: {
  category: Category;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group relative block overflow-hidden bg-zinc-900 ${
        category.span ?? ""
      }`}
      aria-label={`Browse ${category.name} designs`}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <img
          src={category.image}
          alt={category.name}
          className="h-full w-full object-cover object-center grayscale brightness-75 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-90"
          loading={priority ? "eager" : "lazy"}
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full min-h-[240px] flex-col justify-end p-6 md:p-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50 mb-1.5">
              {category.count}
            </p>
            <h3 className="text-editorial text-2xl md:text-3xl font-bold uppercase tracking-tight text-white leading-none">
              {category.name}
            </h3>
          </div>
          <div className="flex h-9 w-9 items-center justify-center border border-white/20 bg-white/10 backdrop-blur-sm opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <ArrowUpRight className="h-4 w-4 text-white" />
          </div>
        </div>
        {/* Underline sweep */}
        <div className="mt-4 h-px w-0 bg-white transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
      </div>
    </Link>
  );
}

export function CategoriesSection() {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-background">
      <div className="mb-12 md:mb-16">
        <p className="text-tagline text-muted-foreground mb-3">
          Shop by Style
        </p>
        <h2 className="text-editorial text-[clamp(2rem,5vw,4rem)] leading-none tracking-[-0.03em] font-bold uppercase">
          Find Your
          <br />
          Aesthetic
        </h2>
      </div>

      {/* Asymmetric grid: Dark Art anchors 2×2, others fill right */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[240px]">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.slug} category={cat} priority={i === 0} />
        ))}
      </div>
    </section>
  );
}