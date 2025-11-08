'use client'

import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  MapPin, 
  Star,
  TrendingUp,
  Package,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import ProductCard from "../../components/marketplace/ProductCard";

// Static data
const miner = {
  id: "miner-1",
  full_name: "John Miner",
  country: "Ghana",
  mine_location: "Ashanti Region",
  bio: "Experienced gold miner with over 15 years in the industry. Specializing in high-quality gold nuggets from the Ashanti Region.",
  rating_average: 4.5,
  total_reviews: 23,
  total_sales: 15
};

const products = [
  {
    id: "prod-1",
    title: "Premium 24K Gold Nuggets",
    category: "Gold",
    price_per_unit: 1850,
    unit: "grams",
    quantity: 100,
    image_urls: ["https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=300&fit=crop"]
  },
  {
    id: "prod-2",
    title: "Raw Gold Ore",
    category: "Gold",
    price_per_unit: 1200,
    unit: "kilograms",
    quantity: 50,
    image_urls: ["https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=300&fit=crop"]
  }
];

const reviews = [
  {
    id: "rev-1",
    buyer_name: "Buyer One",
    rating: 5,
    comment: "Excellent quality gold nuggets, exactly as described!",
    product_quality: 5,
    communication: 5,
    shipping_speed: 4,
    created_date: new Date(2024, 0, 10).toISOString()
  },
  {
    id: "rev-2",
    buyer_name: "Buyer Two",
    rating: 4,
    comment: "Good seller, reliable and professional.",
    product_quality: 4,
    communication: 4,
    shipping_speed: 5,
    created_date: new Date(2024, 0, 5).toISOString()
  }
];

export default function MinerProfilePage() {
  const router = useRouter();

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
