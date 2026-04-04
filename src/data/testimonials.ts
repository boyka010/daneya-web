export interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  product: string;
  verified: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Nour E.",
    location: "Cairo, Egypt",
    avatar: "",
    rating: 5,
    text: "The quality is amazing — the fabric feels so premium and the fit is perfect for everyday wear. I've gotten so many compliments on my Aura Set. Will definitely be ordering more!",
    product: "Aura Oversized Abaya Set",
    verified: true,
  },
  {
    id: 2,
    name: "Menna A.",
    location: "Alexandria, Egypt",
    avatar: "",
    rating: 5,
    text: "Finally found a brand that gets modest fashion right. The Ripple Set is my go-to now — comfortable, elegant, and the color is exactly as shown. Shipping was fast too!",
    product: "Ripple Oversized Set",
    verified: true,
  },
  {
    id: 3,
    name: "Sara M.",
    location: "Giza, Egypt",
    avatar: "",
    rating: 5,
    text: "I was hesitant to order online but the quality exceeded my expectations. The fabric is breathable and the abaya drapes beautifully. My mom loved hers too so we ordered matching sets!",
    product: "Daneya Oversized Abaya",
    verified: true,
  },
  {
    id: 4,
    name: "Hana K.",
    location: "Mansoura, Egypt",
    avatar: "",
    rating: 4,
    text: "Beautiful pieces and great customer service. The packaging was lovely and the abaya fits perfectly. Only wish they had more color options. Already recommended to my friends!",
    product: "Essentials Abaya",
    verified: true,
  },
];