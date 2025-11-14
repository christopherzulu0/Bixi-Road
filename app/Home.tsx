'use client'

import React, { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Shield, 
  Lock, 
  TrendingUp, 
  Globe,
  ChevronRight,
  Star,
  MapPin,
  ArrowRight,
  CheckCircle,
  Truck,
  Quote
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "../components/marketplace/ProductCard";

type FeaturedProduct = {
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

type FeaturedProductsResponse = {
  data: FeaturedProduct[];
};

type VerifiedMiner = {
  id: string;
  full_name: string;
  country: string;
  rating_average: number;
  total_reviews: number;
  total_sales: number;
};

type VerifiedMinersResponse = {
  data: VerifiedMiner[];
};

function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="space-y-4 p-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function FeaturedProductsContent() {
  const { data, isLoading } = useQuery<FeaturedProductsResponse>({
    queryKey: ["home", "featured-products"],
    queryFn: async () => {
      const res = await fetch("/api/home/featured-products", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch featured products");
      return res.json() as Promise<FeaturedProductsResponse>;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading || !data) {
    return <FeaturedProductsSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.data.slice(0, 6).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function VerifiedMinersSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function VerifiedMinersContent() {
  const { data, isLoading } = useQuery<VerifiedMinersResponse>({
    queryKey: ["home", "verified-miners"],
    queryFn: async () => {
      const res = await fetch("/api/home/verified-miners", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch verified miners");
      return res.json() as Promise<VerifiedMinersResponse>;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading || !data) {
    return <VerifiedMinersSkeleton />;
  }

  if (data.data.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.data.map((miner) => (
        <Link key={miner.id} href={`/MinerProfile?id=${miner.id}`}>
          <Card className="p-6 hover:shadow-xl transition-all duration-200 hover:border-[#D4AF37] border-2 group">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-[#1A1A1A] group-hover:scale-110 transition-transform">
                {miner.full_name?.[0] || 'M'}
              </div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-1">{miner.full_name}</h3>
              <div className="flex items-center gap-1 text-[#D4AF37] mb-2">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-semibold">CERTIFIED</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{miner.country}</span>
              </div>
              {miner.rating_average > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  <span className="font-semibold">{miner.rating_average.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({miner.total_reviews})</span>
                </div>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function HomePage() {

  const features = [
    {
      icon: Shield,
      title: "Verified Miners Only",
      description: "Every seller is thoroughly vetted with mining licenses and documentation"
    },
    {
      icon: Lock,
      title: "Escrow Protection",
      description: "Your payment is secured until you confirm delivery and quality"
    },
    {
      icon: Globe,
      title: "Pan-African Network",
      description: "Connect with certified miners across the entire African continent"
    },
    {
      icon: TrendingUp,
      title: "Fair Commission",
      description: "Transparent 7.5% commission on successful transactions"
    }
  ];

  const countries = [
    { name: "Ghana", flag: "🇬🇭", miners: 24 },
    { name: "Kenya", flag: "🇰🇪", miners: 18 },
    { name: "Tanzania", flag: "🇹🇿", miners: 31 },
    { name: "Zambia", flag: "🇿🇲", miners: 15 },
    { name: "South Africa", flag: "🇿🇦", miners: 42 },
    { name: "DRC", flag: "🇨🇩", miners: 27 }
  ];

  const testimonials = [
    {
      name: "Kwame Mensah",
      role: "Gold Miner",
      country: "Ghana",
      flag: "🇬🇭",
      content: "BixiRoad changed my business. Before, I struggled to find international buyers and worried about payment. Now, I ship to their hub, they verify my gold, and I get paid securely. I've tripled my income in 6 months!",
      rating: 5
    },
    {
      name: "Sarah Mitchell",
      role: "Jewelry Manufacturer",
      country: "United States",
      flag: "🇺🇸",
      content: "As a buyer, I was always skeptical of African mineral marketplaces. BixiRoad's verification process is a game-changer. Every product is authenticated before I pay. The quality matches the description perfectly. Highly recommend!",
      rating: 5
    },
    {
      name: "Joseph Mwangi",
      role: "Emerald Miner",
      country: "Kenya",
      flag: "🇰🇪",
      content: "The verification process seemed intimidating at first, but BixiRoad's team guided me through everything. Now my emeralds sell at fair prices to buyers worldwide. The escrow system protects both of us. Fantastic platform!",
      rating: 5
    },
    {
      name: "Li Wei",
      role: "Mineral Trader",
      country: "China",
      flag: "🇨🇳",
      content: "I've sourced minerals from Africa for 10 years. BixiRoad eliminates the middlemen and uncertainty. The assay reports are professional, shipping is reliable, and I know exactly what I'm getting. This is the future of mineral trade.",
      rating: 5
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1A1A1A] via-[#3E2723] to-[#1A1A1A] py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] rounded-full text-sm font-semibold">
                Africa's First Verified Minerals Marketplace
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#FFFFF0] mb-6 leading-tight">
              Where Africa Trades<br />
              <span className="text-[#D4AF37]">Its Treasures</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with verified African miners. Trade gold, gemstones, and minerals 
              through secure escrow protection. Build trust, grow wealth, transform Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
              href="/MarketPlace"
              >
                <Button size="lg" className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A] font-semibold text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                  Browse Marketplace
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/BecomeSeller">
                <Button size="lg" variant="outline" className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A1A1A] font-semibold text-lg px-8 py-6 rounded-xl">
                  <Shield className="w-5 h-5 mr-2" />
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition - NEW */}
      <section className="py-12 bg-white border-b-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Verified Authenticity</h3>
                <p className="text-gray-600">
                  Every product physically examined and certified by our assayers before sale
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-xl flex items-center justify-center">
                <Lock className="w-7 h-7 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Secure Escrow</h3>
                <p className="text-gray-600">
                  Payments protected until buyers confirm delivery—guaranteed safety for both parties
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-xl flex items-center justify-center">
                <Truck className="w-7 h-7 text-[#1A1A1A]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Global Logistics</h3>
                <p className="text-gray-600">
                  We handle international shipping, customs, and documentation—from Africa to your door
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Why Trade on BixiRoad?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for security, transparency, and the growth of African trade
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-[#D4AF37]/20 group">
                <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <feature.icon className="w-7 h-7 text-[#1A1A1A]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-2">
                Featured Listings
              </h2>
              <p className="text-lg text-gray-600">
                Premium minerals from verified sellers
              </p>
            </div>
            <Link href="/MarketPlace">
              <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A1A1A]">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <Suspense fallback={<FeaturedProductsSkeleton />}>
            <FeaturedProductsContent />
          </Suspense>
        </div>
      </section>

      {/* Testimonials Section - NEW */}
      <section className="py-20 bg-gradient-to-br from-[#1A1A1A] to-[#3E2723]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFF0] mb-4">
              Trusted by Miners & Buyers Worldwide
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Real stories from our verified community
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#D4AF37]">
                <div className="flex items-start gap-4 mb-4">
                  <Quote className="w-10 h-10 text-[#D4AF37] flex-shrink-0 opacity-50" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-3">
                      {Array(testimonial.rating).fill(0).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4 italic">
                      "{testimonial.content}"
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="font-bold text-[#1A1A1A]">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl">{testimonial.flag}</p>
                    <p className="text-xs text-gray-500">{testimonial.country}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Miners */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Top Verified Miners
            </h2>
            <p className="text-lg text-gray-600">
              Trusted sellers with proven track records
            </p>
          </div>
          
          <Suspense fallback={<VerifiedMinersSkeleton />}>
            <VerifiedMinersContent />
          </Suspense>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-20 bg-gradient-to-br from-[#1A1A1A] to-[#3E2723]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#FFFFF0] mb-4">
              Trade Across Africa
            </h2>
            <p className="text-lg text-gray-300">
              Verified miners operating in major mining regions
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {countries.map((country) => (
              <Card key={country.name} className="p-6 text-center hover:shadow-xl transition-all duration-200 bg-[#3E2723] border-[#D4AF37]/20 hover:border-[#D4AF37] group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{country.flag}</div>
                <h3 className="font-bold text-[#FFFFF0] mb-1">{country.name}</h3>
                <p className="text-sm text-[#D4AF37]">{country.miners} miners</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#D4AF37] to-[#F4E4BC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-lg text-[#3E2723] mb-8 max-w-2xl mx-auto">
            Join Africa's most trusted marketplace for raw materials and precious minerals. 
            Secure transactions, verified sellers, transparent pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/MarketPlace">
              <Button size="lg" className="bg-[#1A1A1A] hover:bg-[#3E2723] text-[#FFFFF0] font-semibold px-8 py-6 rounded-xl">
                Start Buying
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/BecomeSeller">
              <Button size="lg" variant="outline" className="border-2 border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FFFFF0] font-semibold px-8 py-6 rounded-xl">
                <Shield className="w-5 h-5 mr-2" />
                Start Selling
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

