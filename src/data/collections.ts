export interface Collection {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  featured?: boolean;
}

export const collections: Collection[] = [
  {
    id: "col-1",
    name: "Abayas",
    nameAr: "عبايات",
    slug: "abayas",
    description: "Our signature collection of oversized, pleated, and classic abayas crafted from premium fabrics. Timeless modesty meets contemporary design.",
    image: "/images/products/hijab-cotton-charcoal.png",
    productCount: 10,
    featured: true,
  },
  {
    id: "col-2",
    name: "Dresses",
    nameAr: "فساتين",
    slug: "dresses",
    description: "Elegant modest dresses from chiffon to denim. Each piece designed for the modern woman who values both style and modesty.",
    image: "/images/products/hijab-silk-mocha.png",
    productCount: 5,
    featured: true,
  },
  {
    id: "col-3",
    name: "Sets",
    nameAr: "طقم",
    slug: "sets",
    description: "Coordinated matching sets in linen, satin, and cotton. Effortless style with perfectly paired pieces for a put-together look.",
    image: "/images/products/hijab-chiffon-sky.png",
    productCount: 4,
    featured: true,
  },
  {
    id: "col-4",
    name: "Capes",
    nameAr: "كاب",
    slug: "capes",
    description: "Flowing chiffon capes and layering pieces that add drama and elegance. Transform any outfit with these versatile statement pieces.",
    image: "/images/products/hijab-satin-emerald.png",
    productCount: 2,
    featured: true,
  },
  {
    id: "col-5",
    name: "Scarves",
    nameAr: "حجابات",
    slug: "scarves",
    description: "Premium modal cotton and silk chiffon scarves in a curated color palette. The essential finishing touch for every modest outfit.",
    image: "/images/products/hijab-modal-ivory.png",
    productCount: 2,
    featured: true,
  },
  {
    id: "col-6",
    name: "Eid Al-Fitr Edit",
    nameAr: "كولكشن العيد",
    slug: "eid-edit",
    description: "A special capsule collection curated for Eid celebrations. Premium fabrics and exclusive designs to make your celebration unforgettable.",
    image: "/images/products/hijab-silk-burgundy.png",
    productCount: 8,
    featured: true,
  },
  {
    id: "col-7",
    name: "New Arrivals",
    nameAr: "وصل حديثاً",
    slug: "new-arrivals",
    description: "The latest additions to the HAYA collection. Be the first to discover fresh designs and new colorways.",
    image: "/images/products/hijab-jersey-lavender.png",
    productCount: 12,
  },
  {
    id: "col-8",
    name: "Best Sellers",
    nameAr: "الأكثر مبيعاً",
    slug: "best-sellers",
    description: "Our community's most-loved pieces. Tried, tested, and adored — these are the staples that define HAYA.",
    image: "/images/products/hijab-jersey-beige.png",
    productCount: 6,
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find(c => c.slug === slug);
}
