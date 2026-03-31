export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Abayas",
    slug: "abayas",
    description: "Premium oversized and classic abayas",
    image: "/images/categories/cat-everyday.png",
  },
  {
    id: "cat-2",
    name: "Dresses",
    slug: "dresses",
    description: "Modest dresses for every occasion",
    image: "/images/categories/cat-chiffon.png",
  },
  {
    id: "cat-3",
    name: "Sets",
    slug: "sets",
    description: "Coordinated matching sets",
    image: "/images/categories/cat-silk.png",
  },
  {
    id: "cat-4",
    name: "Capes",
    slug: "capes",
    description: "Flowing layering capes",
    image: "/images/categories/cat-limited.png",
  },
  {
    id: "cat-5",
    name: "Scarves",
    slug: "scarves",
    description: "Premium modal & silk scarves",
    image: "/images/categories/cat-accessories.png",
  },
];
