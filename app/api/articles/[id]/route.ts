import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!id) {
      return new NextResponse("Article ID is required", { status: 400 })
    }

    // Increment views and fetch the article
    const article = await prisma.article.update({
      where: { id },
      data: { views: { increment: 1 } },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        excerpt: true,
        content: true,
        coverImageUrl: true,
        imageGalleryUrls: true,
        youtubeVideoUrl: true,
        isPublished: true,
        featured: true,
        views: true,
        publishedAt: true,
        createdAt: true,
        author: { select: { firstName: true, lastName: true } },
      },
    })

    if (!article || !article.isPublished) {
      return new NextResponse("Not found", { status: 404 })
    }

    // Shape response for client convenience
    const authorName = [article.author?.firstName, article.author?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim()

    const { author, isPublished, ...rest } = article

    return NextResponse.json({
      article: {
        ...rest,
        authorName: authorName || "BixiRoad Team",
      },
    })
  } catch (error: any) {
    // If the update failed because the record doesn't exist
    if (error?.code === "P2025") {
      return new NextResponse("Not found", { status: 404 })
    }
    console.error("/api/articles/[id] error", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
