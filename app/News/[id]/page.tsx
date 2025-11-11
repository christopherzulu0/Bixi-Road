"use client"

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Eye, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";


type Article = {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string | null
  content: string
  coverImageUrl: string | null
  imageGalleryUrls: string[]
  youtubeVideoUrl: string | null
  views: number
  publishedAt: string | null
  createdAt: string
  authorName?: string
}

export default function NewsArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = useMemo(() => {
    const idParam = params?.id
    if (!idParam) return undefined
    if (Array.isArray(idParam)) return idParam[0]
    return idParam
  }, [params])

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  function getBaseUrl() {
    if (typeof window !== "undefined") return window.location.origin
    const site = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
    return site ? (site.startsWith("http") ? site : `https://${site}`) : "http://localhost:3000"
  }

  const { data, isLoading } = useQuery<{ article: Article }>({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const url = new URL(`/api/articles/${articleId}`, getBaseUrl())
      const res = await fetch(url.toString())
      if (!res.ok) throw new Error("Failed to fetch article")
      return res.json()
    },
    enabled: !!articleId,
  })

  const article = data?.article;

  const displayCategory = article?.category
    ? article.category.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
    : "";

  const displayDate = article ? new Date(article.publishedAt ?? article.createdAt) : null;

    const getCategoryColor = (category: string): string => {
        const colors: { [key: string]: string } = {
            "Market Prices": "bg-green-100 text-green-800",
            "Mining Laws": "bg-blue-100 text-blue-800",
            "Export Procedures": "bg-purple-100 text-purple-800",
            "Trading Tips": "bg-orange-100 text-orange-800",
            "Success Stories": "bg-yellow-100 text-yellow-800",
            "Industry News": "bg-pink-100 text-pink-800"
        };
        return colors[category] || "bg-gray-100 text-gray-800";
    };

    const getYouTubeEmbedUrl = (url: string): string | null => {
        if (!url) return null;

        // Extract video ID from various YouTube URL formats
        let videoId = null;

        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('embed/')[1]?.split('?')[0];
        } else {
            // Assume it's already a video ID
            videoId = url;
        }

        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Skeleton className="h-96 w-full rounded-xl mb-8" />
                    <Skeleton className="h-12 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-1/2 mb-8" />
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Article not found</h2>
                    <Button onClick={() => router.push("/News")}>
                        Back to News
                    </Button>
                </div>
            </div>
        );
    }

    const galleryImages = article.imageGalleryUrls && article.imageGalleryUrls.length > 0
        ? article.imageGalleryUrls
        : [];

    const youtubeEmbedUrl = article.youtubeVideoUrl ? getYouTubeEmbedUrl(article.youtubeVideoUrl) : null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.push("/News")}
                    className="mb-6 text-[#D4AF37] hover:text-[#1A1A1A] hover:bg-[#D4AF37]/10"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to News
                </Button>

                {/* Cover Image */}
                <div className="relative h-96 rounded-xl overflow-hidden mb-8">
                    <img
                        src={article.coverImageUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=600&fit=crop"}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                        <Badge className={`${getCategoryColor(displayCategory)} border-0 font-semibold mb-3`}>
                            {displayCategory}
                        </Badge>
                    </div>
                </div>

                {/* Article Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-600">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            <span>{article.authorName || "BixiRoad Team"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>{displayDate ? format(displayDate, "MMMM d, yyyy") : ""}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-5 h-5" />
                            <span>{article.views || 0} views</span>
                        </div>
                    </div>
                </div>

                {/* YouTube Video Embed */}
                {youtubeEmbedUrl && (
                    <div className="mb-8">
                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
                            <iframe
                                src={youtubeEmbedUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        </div>
                    </div>
                )}

                {/* Article Content */}
                <div className="prose prose-lg max-w-none mb-8">
                    <ReactMarkdown
                        components={{
                            h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-[#1A1A1A] mt-8 mb-4" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-[#1A1A1A] mt-6 mb-3" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-xl font-bold text-[#1A1A1A] mt-4 mb-2" {...props} />,
                            p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-[#1A1A1A]" {...props} />,
                            a: ({node, ...props}) => <a className="text-[#D4AF37] hover:underline" {...props} />,
                            blockquote: ({node, ...props}) => (
                                <blockquote className="border-l-4 border-[#D4AF37] pl-4 py-2 my-4 italic text-gray-600" {...props} />
                            ),
                        }}
                    >
                        {article.content}
                    </ReactMarkdown>
                </div>

                {/* Image Gallery */}
                {galleryImages.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Photo Gallery</h2>

                        {/* Main Gallery Image */}
                        <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-xl">
                            <img
                                src={galleryImages[currentImageIndex]}
                                alt={`Gallery image ${currentImageIndex + 1}`}
                                className="w-full h-full object-cover"
                            />

                            {galleryImages.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-[#1A1A1A]" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1))}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                                    >
                                        <ChevronRight className="w-6 h-6 text-[#1A1A1A]" />
                                    </button>

                                    {/* Image Counter */}
                                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                                        {currentImageIndex + 1} / {galleryImages.length}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Navigation */}
                        {galleryImages.length > 1 && (
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                                {galleryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                            idx === currentImageIndex
                                                ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50'
                                                : 'border-transparent hover:border-[#D4AF37]/50'
                                        }`}
                                    >
                                        <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Call to Action */}
                <div className="mt-12 p-8 bg-gradient-to-r from-[#D4AF37]/10 to-[#F4E4BC]/10 rounded-xl border-2 border-[#D4AF37]/20">
                    <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">
                        Ready to Start Trading?
                    </h3>
                    <p className="text-gray-700 mb-6">
                        Join Africa's most trusted marketplace for raw materials and precious minerals.
                    </p>
                    <div className="flex gap-4">
                        <Button
                            onClick={() => router.push("/MarketPlace")}
                            className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
                        >
                            Browse Marketplace
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push("/BecomeSeller")}
                            className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A1A1A]"
                        >
                            Become a Seller
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}