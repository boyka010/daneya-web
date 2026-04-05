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
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find(c => c.slug === slug);
}
