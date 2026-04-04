export type PageRoute =
  | { type: "home" }
  | { type: "shop"; category?: string }
  | { type: "product"; id: number }
  | { type: "cart" }
  | { type: "checkout" }
  | { type: "wishlist" }
  | { type: "about" }
  | { type: "shipping" }
  | { type: "returns" }
  | { type: "size-guide" }
  | { type: "faq" }
  | { type: "contact" }
  | { type: "order-tracking" }
  | { type: "admin"; section?: string };

export function parseHash(hash: string): PageRoute {
  const path = (hash.replace("#", "") || "/").replace(/\/+$/, "");

  if (path === "" || path === "/" || path === "/home") return { type: "home" };
  if (path.startsWith("/shop/"))
    return { type: "shop", category: path.split("/")[2] || undefined };
  if (path === "/shop") return { type: "shop" };
  if (path.startsWith("/product/")) {
    const id = parseInt(path.split("/")[2]);
    return { type: "product", id: isNaN(id) ? 0 : id };
  }
  if (path === "/cart") return { type: "cart" };
  if (path.startsWith("/checkout")) return { type: "checkout" };
  if (path === "/wishlist") return { type: "wishlist" };
  if (path === "/about") return { type: "about" };
  if (path === "/shipping") return { type: "shipping" };
  if (path === "/returns") return { type: "returns" };
  if (path === "/size-guide") return { type: "size-guide" };
  if (path === "/faq") return { type: "faq" };
  if (path === "/contact") return { type: "contact" };
  if (path === "/order-tracking" || path === "/track-order") return { type: "order-tracking" };
  if (path.startsWith("/admin")) {
    const section = path.split("/")[2] || undefined;
    return { type: "admin", section };
  }

  return { type: "home" };
}

export function navigate(page: PageRoute) {
  let hash = "#/";
  switch (page.type) {
    case "home":
      hash = "#/";
      break;
    case "shop":
      hash = page.category ? `#/shop/${page.category}` : "#/shop";
      break;
    case "product":
      hash = `#/product/${page.id}`;
      break;
    case "cart":
      hash = "#/cart";
      break;
    case "checkout":
      hash = "#/checkout";
      break;
    case "wishlist":
      hash = "#/wishlist";
      break;
    case "about":
      hash = "#/about";
      break;
    case "shipping":
      hash = "#/shipping";
      break;
    case "returns":
      hash = "#/returns";
      break;
    case "size-guide":
      hash = "#/size-guide";
      break;
    case "faq":
      hash = "#/faq";
      break;
    case "contact":
      hash = "#/contact";
      break;
    case "order-tracking":
      hash = "#/order-tracking";
      break;
    case "admin":
      hash = page.section ? `#/admin/${page.section}` : "#/admin/dashboard";
      break;
  }
  if (typeof window !== "undefined") {
    window.location.hash = hash;
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
      return `product-${page.id}`;
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
