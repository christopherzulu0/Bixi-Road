import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Map human-readable category to enum name
const categoryMap: Record<string, string> = {
  "Market Prices": "MARKET_PRICES",
  "Mining Laws": "MINING_LAWS",
  "Export Procedures": "EXPORT_PROCEDURES",
  "Trading Tips": "TRADING_TIPS",
  "Success Stories": "SUCCESS_STORIES",
  "Industry News": "INDUSTRY_NEWS",
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")

    const where: any = { isPublished: true }

    if (category && category !== "all") {
      const enumVal = categoryMap[category] ?? category
      where.category = enumVal
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        excerpt: true,
        coverImageUrl: true,
        featured: true,
        views: true,
        publishedAt: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("/api/articles error", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
