'use client'

import React, { useState, useMemo, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, Filter, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/marketplace/ProductCard";

type Product = {
  id: string;
  title: string;
  description: string;
  category: string;
  price_per_unit: number;
  unit: string;
  quantity: number;
  purity_grade?: string;
  country: string;
  image_urls: string[];
  seller: { full_name: string; country: string };
  is_featured: boolean;
  status: string;
  views: number;
  created_date: string;
};

type MarketplaceResponse = {
  data: Product[];
};

interface ResultsCountProps {
  categoryFilter: string;
  countryFilter: string;
  searchQuery: string;
  sortBy: string;
}

function ResultsCount({
  categoryFilter,
  countryFilter,
  searchQuery,
  sortBy,
}: ResultsCountProps) {
  const { data } = useQuery<MarketplaceResponse>({
    queryKey: ["marketplace", { categoryFilter, countryFilter, searchQuery, sortBy }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (countryFilter !== "all") params.append("country", countryFilter);
      if (searchQuery) params.append("search", searchQuery);
      params.append("sortBy", sortBy);

      const res = await fetch(`/api/marketplace?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json() as Promise<MarketplaceResponse>;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const count = data?.data?.length ?? 0;

  return (
    <p className="text-gray-600">
      <span className="font-semibold text-[#1A1A1A]">{count}</span> verified listings found
    </p>
  );
}

function MarketplaceSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <div className="p-5 space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function MarketplaceContent({
  categoryFilter,
  countryFilter,
  searchQuery,
  sortBy,
}: {
  categoryFilter: string;
  countryFilter: string;
  searchQuery: string;
  sortBy: string;
}) {
  const { data, isLoading } = useQuery<MarketplaceResponse>({
    queryKey: ["marketplace", { categoryFilter, countryFilter, searchQuery, sortBy }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (countryFilter !== "all") params.append("country", countryFilter);
      if (searchQuery) params.append("search", searchQuery);
      params.append("sortBy", sortBy);

      const res = await fetch(`/api/marketplace?${params.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json() as Promise<MarketplaceResponse>;
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const products = data?.data ?? [];

  if (isLoading) {
    return <MarketplaceSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">No listings found</h3>
        <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("-created_date");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "GOLD",
    "DIAMOND",
    "EMERALD",
    "RUBY",
    "SAPPHIRE",
    "COPPER",
    "LITHIUM",
    "COBALT",
    "COLTAN",
    "URANIUM",
    "IRON_ORE",
    "BAUXITE",
    "OTHER_GEMSTONE",
    "OTHER_MINERAL",
  ];

  const countries = [
    "Ghana",
    "Kenya",
    "Tanzania",
    "Zambia",
    "South Africa",
    "DRC",
    "Nigeria",
    "Zimbabwe",
    "Botswana",
    "Mali",
  ];

  const clearFilters = () => {
    setCategoryFilter("all");
    setCountryFilter("all");
    setSearchQuery("");
    setSortBy("-created_date");
  };

  const hasActiveFilters =
    categoryFilter !== "all" || countryFilter !== "all" || searchQuery !== "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">
            Verified Marketplace
          </h1>
          <p className="text-lg text-gray-600">
            Browse authentic African minerals from certified miners
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search minerals, gemstones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-2 focus:border-[#D4AF37]"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden border-2 border-[#D4AF37] text-[#D4AF37] h-12"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 h-12 border-2 focus:border-[#D4AF37]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-created_date">Newest First</SelectItem>
                <SelectItem value="price_per_unit">Price: Low to High</SelectItem>
                <SelectItem value="-price_per_unit">Price: High to Low</SelectItem>
                <SelectItem value="-views">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filters Row */}
          <div className={`${showFilters ? "flex" : "hidden"} md:flex flex-col md:flex-row gap-4`}>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="flex-1 h-12 border-2 focus:border-[#D4AF37]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="flex-1 h-12 border-2 focus:border-[#D4AF37]">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-[#D4AF37] hover:text-[#1A1A1A] hover:bg-[#D4AF37]/10"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <Suspense fallback={
            <p className="text-gray-600">
              <span className="font-semibold text-[#1A1A1A]">Loading...</span> verified listings
            </p>
          }>
            <ResultsCount
              categoryFilter={categoryFilter}
              countryFilter={countryFilter}
              searchQuery={searchQuery}
              sortBy={sortBy}
            />
          </Suspense>
        </div>

        {/* Products Grid with Suspense */}
        <Suspense fallback={<MarketplaceSkeleton />}>
          <MarketplaceContent
            categoryFilter={categoryFilter}
            countryFilter={countryFilter}
            searchQuery={searchQuery}
            sortBy={sortBy}
          />
        </Suspense>
      </div>
    </div>
  );
}
