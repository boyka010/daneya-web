export type PageRoute =
  | { type: "home" }
  | { type: "shop"; category?: string }
  | { type: "product"; handle: string }
  | { type: "cart" }
  | { type: "checkout" }
  | { type: "wishlist" }
  | { type: "about" }
  | { type: "shipping" }
  | { type: "returns" }
  | { type: "size-guide" }
  | { type: "faq" }
  | { type: "contact" }
  | { type: "admin"; section?: string };

export function parsePath(path: string): PageRoute {
  const clean = path.replace(/\/+$/, "");

  if (clean === "" || clean === "/" || clean === "/home") return { type: "home" };
  if (clean.startsWith("/shop/"))
    return { type: "shop", category: clean.split("/")[2] || undefined };
  if (clean === "/shop") return { type: "shop" };
  if (clean.startsWith("/product/")) {
    const handle = clean.split("/").slice(2).join("/");
    return { type: "product", handle: handle || "" };
  }
  if (clean === "/cart") return { type: "cart" };
  if (clean.startsWith("/checkout")) return { type: "checkout" };
  if (clean === "/wishlist") return { type: "wishlist" };
  if (clean === "/about") return { type: "about" };
  if (clean === "/shipping") return { type: "shipping" };
  if (clean === "/returns") return { type: "returns" };
  if (clean === "/size-guide") return { type: "size-guide" };
  if (clean === "/faq") return { type: "faq" };
  if (clean === "/contact") return { type: "contact" };
  if (clean.startsWith("/admin")) {
    const section = clean.split("/")[2] || undefined;
    return { type: "admin", section };
  }

  return { type: "home" };
}

export function routeToPath(page: PageRoute): string {
  switch (page.type) {
    case "home": return "/";
    case "shop": return page.category ? `/shop/${page.category}` : "/shop";
    case "product": return `/product/${page.handle}`;
    case "cart": return "/cart";
    case "checkout": return "/checkout";
    case "wishlist": return "/wishlist";
    case "about": return "/about";
    case "shipping": return "/shipping";
    case "returns": return "/returns";
    case "size-guide": return "/size-guide";
    case "faq": return "/faq";
    case "contact": return "/contact";
    case "admin": return page.section ? `/admin/${page.section}` : "/admin";
  }
}

export function navigate(page: PageRoute) {
  const path = routeToPath(page);
  if (typeof window !== "undefined") {
    // Use window.location for proper Next.js routing
    // The cache in shopify-queries.ts ensures data doesn't re-fetch
    window.location.href = path;
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}

export function getPageKey(page: PageRoute): string {
  switch (page.type) {
    case "home":
      return "home";
    case "shop":
      return `shop-${page.category || "all"}`;
    case "product":
      return `product-${page.handle}`;
    case "cart":
      return "cart";
    case "checkout":
      return "checkout";
    case "wishlist":
      return "wishlist";
    case "about":
      return "about";
    case "admin":
      return `admin-${page.section || "dashboard"}`;
  }
}
