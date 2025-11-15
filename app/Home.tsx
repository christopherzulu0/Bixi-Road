'use client'

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  Quote,
  AlertCircle
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
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
  userpic: string | null;
  rating_average: number;
  total_reviews: number;
  total_sales: number;
};

type VerifiedMinersResponse = {
  data: VerifiedMiner[];
};

type Country = {
  id: string;
  name: string;
  flag: string;
  code: string;
  miner_count: number;
  is_active: boolean;
};

type CountriesResponse = {
  data: Country[];
};

type Testimonial = {
  id: string;
  name: string;
  role: string;
  country: string;
  flag: string;
  content: string;
  rating: number;
  created_date: string;
};

type TestimonialsResponse = {
  data: Testimonial[];
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
              {miner.userpic ? (
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#D4AF37] mb-4 group-hover:scale-110 transition-transform shadow-md relative">
                  <Image
                    src={miner.userpic}
                    alt={miner.full_name}
                    fill
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center text-2xl font-bold text-[#1A1A1A]">${miner.full_name?.[0] || 'M'}</div>`;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center mb-4 text-2xl font-bold text-[#1A1A1A] group-hover:scale-110 transition-transform border-2 border-[#D4AF37] shadow-md">
                  {miner.full_name?.[0] || 'M'}
                </div>
              )}
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

function CountriesSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="p-6 text-center">
          <div className="space-y-3">
            <Skeleton className="h-12 w-12 mx-auto rounded-full" />
            <Skeleton className="h-5 w-20 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function CountriesContent() {
  const { data, isLoading } = useQuery<CountriesResponse>({
    queryKey: ["home", "countries"],
    queryFn: async () => {
      const res = await fetch("/api/home/countries", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch countries");
      return res.json() as Promise<CountriesResponse>;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  if (isLoading || !data) {
    return <CountriesSkeleton />;
  }

  if (data.data.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {data.data.map((country) => (
        <Card key={country.id} className="p-6 text-center hover:shadow-xl transition-all duration-200 bg-[#3E2723] border-[#D4AF37]/20 hover:border-[#D4AF37] group">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{country.flag}</div>
          <h3 className="font-bold text-[#FFFFF0] mb-1">{country.name}</h3>
          <p className="text-sm text-[#D4AF37]">{country.miner_count} miners</p>
        </Card>
      ))}
    </div>
  );
}

function TestimonialsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="p-8 bg-white/95">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </Card>
      ))}
    </div>
  );
}

function TestimonialsContent() {
  const { isSignedIn, user } = useUser();
  const queryClient = useQueryClient();
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    role: "",
    country: "",
    flag: "",
    content: "",
    rating: 0,
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    type: "success" | "error";
  }>({
    open: false,
    title: "",
    description: "",
    type: "success",
  });

  // Fetch user data to get role
  const { data: userData } = useQuery<{
    id: string;
    role: string;
    country: string | null;
  }>({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const res = await fetch("/api/users/me", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch user data");
      return res.json();
    },
    enabled: isSignedIn,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch countries for flag lookup
  const { data: countriesData } = useQuery<CountriesResponse>({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await fetch("/api/home/countries", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch countries");
      return res.json() as Promise<CountriesResponse>;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10,
  });

  const { data, isLoading, error } = useQuery<TestimonialsResponse>({
    queryKey: ["home", "testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/home/testimonials", { cache: "no-store" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("[TestimonialsContent] Failed to fetch testimonials:", res.status, errorData);
        throw new Error(errorData.error || "Failed to fetch testimonials");
      }
      const json = await res.json();
      console.log("[TestimonialsContent] Fetched testimonials:", json);
      return json as TestimonialsResponse;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Log errors for debugging
  React.useEffect(() => {
    if (error) {
      console.error("[TestimonialsContent] Query error:", error);
    }
  }, [error]);

  // Debug logging - must be before any conditional returns
  React.useEffect(() => {
    console.log("[TestimonialsContent] Data:", data);
    console.log("[TestimonialsContent] Testimonials array:", (data?.data && data.data.length > 0) ? data.data : []);
    console.log("[TestimonialsContent] Testimonials length:", (data?.data && data.data.length > 0) ? data.data.length : 0);
  }, [data]);

  const testimonialMutation = useMutation({
    mutationFn: async (formData: typeof testimonialForm) => {
      const res = await fetch("/api/home/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to submit testimonial");
      }

      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["home", "testimonials"] });
      setTestimonialDialogOpen(false);
      setTestimonialForm({
        name: "",
        role: "",
        country: "",
        flag: "",
        content: "",
        rating: 0,
      });
      setAlertDialog({
        open: true,
        title: "Testimonial Submitted",
        description: data.message || "Thank you for your testimonial! It will be reviewed before being published.",
        type: "success",
      });
    },
    onError: (error: unknown) => {
      setAlertDialog({
        open: true,
        title: "Submission Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit testimonial. Please try again.",
        type: "error",
      });
    },
  });

  // Helper function to map role to readable format
  const getRoleDisplayName = (role: string | undefined): string => {
    if (!role) return "Buyer";
    const normalized = role.toLowerCase();
    if (normalized === "seller" || normalized === "miner") return "Miner";
    if (normalized === "admin") return "Admin";
    return "Buyer";
  };

  // Auto-fill form data when dialog opens
  React.useEffect(() => {
    if (testimonialDialogOpen && isSignedIn && user && userData) {
      // Get name from Clerk user
      const name = user.fullName || user.firstName || "";
      
      // Get role from user data and map to display name
      const role = getRoleDisplayName(userData.role);
      
      // Get country from Clerk publicMetadata or user data
      const country = 
        (typeof user.publicMetadata?.country === "string" 
          ? user.publicMetadata.country 
          : null) || 
        userData.country || 
        "";
      
      // Find flag for the country
      let flag = "";
      if (country && countriesData) {
        const selectedCountry = countriesData.data.find(
          (c) => c.name.toLowerCase() === country.toLowerCase()
        );
        if (selectedCountry) {
          flag = selectedCountry.flag;
        }
      }

      setTestimonialForm((prev) => ({
        ...prev,
        name,
        role,
        country,
        flag,
      }));
    }
  }, [testimonialDialogOpen, isSignedIn, user, userData, countriesData]);

  if (isLoading) {
    return <TestimonialsSkeleton />;
  }

  if (error) {
    console.error("[TestimonialsContent] Error loading testimonials:", error);
    return (
      <div className="text-center py-12">
        <Quote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#FFFFF0] mb-2">
          Unable to load testimonials
        </h3>
        <p className="text-gray-300">
          Please try refreshing the page
        </p>
      </div>
    );
  }

  const testimonials = (data?.data && data.data.length > 0) ? data.data : [];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div className="flex-1" />
        {isSignedIn && user && (
          <Button
            onClick={() => setTestimonialDialogOpen(true)}
            className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
          >
            <Quote className="w-4 h-4 mr-2" />
            Share Your Story
          </Button>
        )}
      </div>

      {testimonials.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="p-8 bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#D4AF37]"
            >
              <div className="flex items-start gap-4 mb-4">
                <Quote className="w-10 h-10 text-[#D4AF37] flex-shrink-0 opacity-50" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 mb-3">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating
                              ? "fill-[#D4AF37] text-[#D4AF37]"
                              : "text-gray-300"
                          }`}
                        />
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
      ) : (
        <div className="text-center py-12">
          <Quote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#FFFFF0] mb-2">
            No testimonials yet
          </h3>
          <p className="text-gray-300">
            Be the first to share your experience with BixiRoad
          </p>
        </div>
      )}

      {/* Testimonial Submission Dialog */}
      <AlertDialog
        open={testimonialDialogOpen}
        onOpenChange={setTestimonialDialogOpen}
      >
        <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Share Your Story</AlertDialogTitle>
            <AlertDialogDescription>
              Help others discover BixiRoad by sharing your experience
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-6 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="testimonial-name">Your Name *</Label>
              <Input
                id="testimonial-name"
                value={testimonialForm.name}
                onChange={(e) =>
                  setTestimonialForm({ ...testimonialForm, name: e.target.value })
                }
                placeholder="Your full name"
                required
              />
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() =>
                      setTestimonialForm({ ...testimonialForm, rating })
                    }
                    onMouseEnter={() => setHoveredRating(rating)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        rating <= (hoveredRating || testimonialForm.rating)
                          ? "fill-[#D4AF37] text-[#D4AF37]"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="testimonial-content">Your Testimonial *</Label>
              <Textarea
                id="testimonial-content"
                value={testimonialForm.content}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    content: e.target.value,
                  })
                }
                placeholder="Share your experience with BixiRoad..."
                rows={5}
                required
              />
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setTestimonialDialogOpen(false);
                setTestimonialForm({
                  name: "",
                  role: "",
                  country: "",
                  flag: "",
                  content: "",
                  rating: 0,
                });
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (
                  !testimonialForm.name ||
                  !testimonialForm.content ||
                  !testimonialForm.rating
                ) {
                  setAlertDialog({
                    open: true,
                    title: "Missing Information",
                    description: "Please fill in all required fields.",
                    type: "error",
                  });
                  return;
                }
                
                // Ensure role and country are set before submitting
                if (!testimonialForm.role || !testimonialForm.country) {
                  setAlertDialog({
                    open: true,
                    title: "Unable to Submit",
                    description: "Please ensure you are logged in and have a role and country set in your profile.",
                    type: "error",
                  });
                  return;
                }
                
                testimonialMutation.mutate(testimonialForm);
              }}
              disabled={
                !testimonialForm.name ||
                !testimonialForm.content ||
                !testimonialForm.rating ||
                !testimonialForm.role ||
                !testimonialForm.country ||
                testimonialMutation.isPending
              }
              className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
            >
              {testimonialMutation.isPending
                ? "Submitting..."
                : "Submit Testimonial"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success/Error Alert Dialog */}
      <AlertDialog
        open={alertDialog.open}
        onOpenChange={(open) => setAlertDialog({ ...alertDialog, open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {alertDialog.type === "success" ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-600" />
              )}
              <AlertDialogTitle
                className={
                  alertDialog.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {alertDialog.title}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription>
              {alertDialog.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setAlertDialog({ ...alertDialog, open: false })}
              className={
                alertDialog.type === "success"
                  ? "bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
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

      {/* Testimonials Section */}
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

          <Suspense fallback={<TestimonialsSkeleton />}>
            <TestimonialsContent />
          </Suspense>
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
          
          <Suspense fallback={<CountriesSkeleton />}>
            <CountriesContent />
          </Suspense>
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

