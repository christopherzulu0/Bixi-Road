'use client'

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, TrendingUp, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_LABELS = [
  "Market Prices",
  "Mining Laws",
  "Export Procedures",
  "Trading Tips",
  "Success Stories",
  "Industry News",
] as const

type CategoryLabel = typeof CATEGORY_LABELS[number]

type Article = {
  id: string
  title: string
  slug: string
  category: string
  excerpt: string | null
  coverImageUrl: string | null
  featured: boolean
  views: number
  publishedAt: string | null
  createdAt: string
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    "Market Prices": "bg-green-100 text-green-800",
    "Mining Laws": "bg-blue-100 text-blue-800",
    "Export Procedures": "bg-purple-100 text-purple-800",
    "Trading Tips": "bg-orange-100 text-orange-800",
    "Success Stories": "bg-yellow-100 text-yellow-800",
    "Industry News": "bg-pink-100 text-pink-800",
  }
  return colors[category] || "bg-gray-100 text-gray-800"
}

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin
  const site = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
  return site ? (site.startsWith("http") ? site : `https://${site}`) : "http://localhost:3000"
}

async function fetchArticles(category: string) {
  const url = new URL("/api/articles", getBaseUrl())
  if (category && category !== "all") url.searchParams.set("category", category)
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error("Failed to fetch articles")
  const data = await res.json()
  return data.articles as Article[]
}

function NewsSkeleton() {
  return (
    <div className="space-y-12">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="w-5 h-5 rounded-full bg-[#E8D8A6]" />
          <div className="h-6 w-40 bg-gray-200 rounded" />
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {[0, 1].map((i) => (
            <div key={i} className="overflow-hidden border rounded-xl">
              <Skeleton className="h-64 w-full" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden border rounded-xl">
              <Skeleton className="h-48 w-full" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ArticlesContent({ category }: { category: string }) {
  const { data: articles } = useQuery({
    queryKey: ["articles", category],
    queryFn: () => fetchArticles(category),
    suspense: true,
  })

  const featuredArticles = useMemo(() => (articles ?? []).filter((a) => a.featured), [articles])
  const regularArticles = useMemo(() => (articles ?? []).filter((a) => !a.featured), [articles])

  return (
    <div className="space-y-12">
      {featuredArticles.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-2xl font-bold text-[#1A1A1A]">Featured Stories</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredArticles.slice(0, 2).map((article) => (
              <Link key={article.id} href={`/News/${article.id}`}>
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#D4AF37] h-full">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={article.coverImageUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop"}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getCategoryColor(article.category)} border-0 font-semibold`}>
                        {article.category.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3 group-hover:text-[#D4AF37] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(article.publishedAt ?? article.createdAt), "MMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.views || 0}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {regularArticles.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
              <Link key={article.id} href={`/News/${article.id}`}>
                <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#D4AF37] h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.coverImageUrl || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop"}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${getCategoryColor(article.category)} border-0 font-semibold text-xs`}>
                        {article.category.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(article.publishedAt ?? article.createdAt), "MMM d")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views || 0}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {(articles?.length ?? 0) === 0 && (
        <div className="text-center py-20">
          <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">No articles found</h3>
          <p className="text-gray-600">Check back soon for the latest news and insights</p>
        </div>
      )}
    </div>
  )
}

export default function NewsPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
            Market News & Insights
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated on African mining markets, regulations, and trading opportunities
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Button
            variant={categoryFilter === "all" ? "default" : "outline"}
            onClick={() => setCategoryFilter("all")}
            className={categoryFilter === "all" ? "bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]" : ""}
          >
            All Articles
          </Button>
          {CATEGORY_LABELS.map((category) => (
            <Button
              key={category}
              variant={categoryFilter === category ? "default" : "outline"}
              onClick={() => setCategoryFilter(category)}
              className={categoryFilter === category ? "bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        <Suspense fallback={<NewsSkeleton />}>
          <ArticlesContent category={categoryFilter} />
        </Suspense>
      </div>
    </div>
  );
}
