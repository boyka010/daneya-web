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
    image: "/images/categories/cat-everyday.png",
    productCount: 10,
    featured: true,
  },
  {
    id: "col-2",
    name: "Sets",
    nameAr: "طقم",
    slug: "sets",
    description: "Coordinated matching sets in linen, satin, and cotton. Effortless style with perfectly paired pieces for a put-together look.",
    image: "/images/categories/cat-silk.png",
    productCount: 4,
    featured: true,
  },
  {
    id: "col-3",
    name: "Capes",
    nameAr: "كاب",
    slug: "capes",
    description: "Flowing chiffon capes and layering pieces that add drama and elegance. Transform any outfit with these versatile statement pieces.",
    image: "/images/categories/cat-limited.png",
    productCount: 2,
    featured: true,
  },
  {
    id: "col-4",
    name: "Cardigans",
    nameAr: "كارديكان",
    slug: "cardigans",
    description: "Elegant cardigans and kimonos crafted from premium fabrics. Perfect layering pieces for every season.",
    image: "/images/categories/cat-chiffon.png",
    productCount: 2,
    featured: true,
  },
  {
    id: "col-5",
    name: "Skirts",
    nameAr: "تنانير",
    slug: "skirts",
    description: "Modest skirts for every occasion. From flowing maxi to tailored midi, designed for the modern woman.",
    image: "/images/categories/cat-accessories.png",
    productCount: 2,
    featured: true,
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find(c => c.slug === slug);
}
