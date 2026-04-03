import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, getCollectionByHandle, transformShopifyProduct } from "@/lib/shopify";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, accessToken, collectionHandle } = body;

    if (!domain || !accessToken) {
      return NextResponse.json(
        { success: false, message: "Missing Shopify credentials" },
        { status: 400 }
      );
    }

    const config = { storeDomain: domain, accessToken };

    let products;

    if (collectionHandle) {
      const collection = await getCollectionByHandle(config, collectionHandle, 50);
      products = collection?.products.edges.map((edge) => 
        transformShopifyProduct(edge.node)
      ) || [];
    } else {
      const shopifyProducts = await getAllProducts(config, 50);
      products = shopifyProducts.map(transformShopifyProduct);
    }

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Shopify sync error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to sync products" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST to sync products from Shopify",
    required: ["domain", "accessToken"],
    optional: ["collectionHandle"],
  });
}
