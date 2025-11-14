'use client'

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Shield, 
  MapPin, 
  Star,
  TrendingUp,
  Package,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../../components/marketplace/ProductCard";

type MinerProfileProduct = {
  id: string;
  title: string;
  description: string;
  category: string;
  price_per_unit: number;
  unit: string;
  quantity: number;
  purity_grade: string | null;
  country: string;
  image_urls: string[];
  seller: {
    full_name: string;
    country: string;
  };
  is_featured: boolean;
  status: string;
  views: number;
};

type MinerProfileReview = {
  id: string;
  buyer_name: string;
  rating: number;
  comment: string;
  product_quality: number | null;
  communication: number | null;
  shipping_speed: number | null;
  created_date: string;
};

type MinerProfile = {
  id: string;
  full_name: string;
  country: string;
  mine_location: string | null;
  bio: string | null;
  rating_average: number;
  total_reviews: number;
  total_sales: number;
  products: MinerProfileProduct[];
  reviews: MinerProfileReview[];
};

type MinerProfileResponse = {
  data: MinerProfile;
};

function MinerProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-24 mb-6" />
        
        <Card className="mb-12 border-2 border-gray-200">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <Skeleton className="w-32 h-32 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-64" />
                <Skeleton className="h-5 w-40" />
                <div className="grid grid-cols-3 gap-6 mt-6">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
                <Skeleton className="h-20 w-full mt-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full" />
          ))}
        </div>

        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function MinerProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const minerId = searchParams.get("id");

  const { data, isLoading } = useQuery<MinerProfileResponse>({
    queryKey: ["miner-profile", minerId],
    queryFn: async () => {
      const res = await fetch(`/api/miners/${minerId}`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch miner profile");
      }
      return res.json() as Promise<MinerProfileResponse>;
    },
    enabled: Boolean(minerId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading || !data) {
    return <MinerProfileSkeleton />;
  }

  const miner = data.data;
  const { products, reviews } = miner;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-[#D4AF37] hover:text-[#1A1A1A] hover:bg-[#D4AF37]/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Profile Header */}
        <Card className="mb-12 border-2 border-gray-200">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center text-5xl font-bold text-[#1A1A1A]">
                  {miner.full_name?.[0] || 'M'}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">
                      {miner.full_name}
                    </h1>
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-[#D4AF37]" />
                      <span className="text-sm font-semibold text-[#D4AF37]">VERIFIED CERTIFIED MINER</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{miner.country}</span>
                      {miner.mine_location && <span>• {miner.mine_location}</span>}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                      <span className="text-2xl font-bold text-[#1A1A1A]">
                        {miner.rating_average?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{miner.total_reviews || 0} reviews</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                      <span className="text-2xl font-bold text-[#1A1A1A]">
                        {miner.total_sales || 0}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">completed sales</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-[#D4AF37]" />
                      <span className="text-2xl font-bold text-[#1A1A1A]">
                        {products.length}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">active listings</p>
                  </div>
                </div>

                {/* Bio */}
                {miner.bio && (
                  <div>
                    <h3 className="font-bold text-[#1A1A1A] mb-2">About</h3>
                    <p className="text-gray-700 leading-relaxed">{miner.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Listings */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">
            Active Listings ({products.length})
          </h2>
          
          {products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No active listings</h3>
              <p className="text-gray-600">This seller doesn't have any products available at the moment</p>
            </Card>
          )}
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">
            Customer Reviews ({reviews.length})
          </h2>
          
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-[#1A1A1A]">{review.buyer_name}</h4>
                        <p className="text-sm text-gray-500">
                          {format(new Date(review.created_date), "MMMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array(5).fill(0).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < review.rating
                                ? 'fill-[#D4AF37] text-[#D4AF37]'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    
                    {(review.product_quality || review.communication || review.shipping_speed) && (
                      <div className="mt-4 pt-4 border-t grid grid-cols-3 gap-4 text-sm">
                        {review.product_quality && (
                          <div>
                            <p className="text-gray-600 mb-1">Product Quality</p>
                            <div className="flex items-center gap-1">
                              {Array(5).fill(0).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.product_quality
                                      ? 'fill-[#D4AF37] text-[#D4AF37]'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {review.communication && (
                          <div>
                            <p className="text-gray-600 mb-1">Communication</p>
                            <div className="flex items-center gap-1">
                              {Array(5).fill(0).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.communication
                                      ? 'fill-[#D4AF37] text-[#D4AF37]'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {review.shipping_speed && (
                          <div>
                            <p className="text-gray-600 mb-1">Shipping Speed</p>
                            <div className="flex items-center gap-1">
                              {Array(5).fill(0).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < review.shipping_speed
                                      ? 'fill-[#D4AF37] text-[#D4AF37]'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No reviews yet</h3>
              <p className="text-gray-600">Be the first to review this seller's products</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MinerProfilePage() {
  return (
    <Suspense fallback={<MinerProfileSkeleton />}>
      <MinerProfileContent />
    </Suspense>
  );
}
