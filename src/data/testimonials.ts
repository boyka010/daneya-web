export interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Fatima A.",
    location: "Dubai, UAE",
    avatar: "/images/testimonials/avatar-1.png",
    rating: 5,
    text: "The quality is absolutely unmatched. I've tried dozens of hijab brands, and HAYA is in a league of its own. The silk collection feels like wearing pure luxury.",
  },
  {
    id: 2,
    name: "Sarah M.",
    location: "London, UK",
    avatar: "/images/testimonials/avatar-2.png",
    rating: 5,
    text: "Finally, a brand that understands modest fashion doesn't mean boring. The colors, the drape, the packaging — everything is perfection. My entire wardrobe is now HAYA.",
  },
  {
    id: 3,
    name: "Amina K.",
    location: "Toronto, Canada",
    avatar: "/images/testimonials/avatar-3.png",
    rating: 5,
    text: "I ordered 6 hijabs for my wedding trousseau and each one was more beautiful than the last. The burgundy silk was the showstopper. Worth every penny.",
  },
  {
    id: 4,
    name: "Noor H.",
    location: "Kuala Lumpur, Malaysia",
    avatar: "/images/testimonials/avatar-4.png",
    rating: 5,
    text: "The fabric quality is incredible — so soft and breathable even in our tropical climate. I wear my HAYA hijabs every single day and they still look brand new.",
  },
];
