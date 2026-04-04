import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const domain = searchParams.get("domain");
  const token = searchParams.get("token");

  if (!domain || !token) {
    return NextResponse.json(
      { success: false, message: "Missing domain or token" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://${domain}/api/2026-04/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": token,
        },
        body: JSON.stringify({
          query: `
            {
              shop {
                name
                domain
              }
            }
          `,
        }),
      }
    );

    const data = await response.json();

    if (data.errors) {
      return NextResponse.json(
        { success: false, message: data.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      shop: data.data.shop,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to connect to Shopify" },
      { status: 500 }
    );
  }
}
