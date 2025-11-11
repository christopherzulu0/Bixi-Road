'use client'

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Image as ImageIcon, Package } from "lucide-react";

type ListingFormData = {
  title: string;
  category: string;
  description: string;
  imageUrls: string[];
  quantity: string;
  unit: string;
  purityGrade: string;
  pricePerUnit: string;
  country: string;
  region: string;
  shippingDetails: string;
};

type ListingResponse = {
  data: {
    id: string;
    title: string;
    category: string;
    description: string;
    imageUrls: string[];
    quantity: number;
    unit: string;
    purityGrade: string | null;
    pricePerUnit: number;
    country: string;
    region: string | null;
    shippingDetails: string | null;
  };
};

const categories = [
  "Gold",
  "Diamond",
  "Emerald",
  "Ruby",
  "Sapphire",
  "Copper",
  "Lithium",
  "Cobalt",
  "Coltan",
  "Uranium",
  "Iron Ore",
  "Bauxite",
  "Other Gemstone",
  "Other Mineral",
];

const units = ["grams", "kilograms", "tonnes", "carats", "pieces"];

function EditListingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-48 mb-6" />
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const listingId = params?.id;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ListingFormData | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  const { data, isLoading } = useQuery<ListingResponse>({
    queryKey: ["listing", listingId],
    queryFn: async () => {
      const res = await fetch(`/api/listings/${listingId}`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to load listing");
      }
      return res.json() as Promise<ListingResponse>;
    },
    enabled: Boolean(listingId),
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (data?.data) {
      const listing = data.data;
      setFormData({
        title: listing.title ?? "",
        category: listing.category ?? "",
        description: listing.description ?? "",
        imageUrls: listing.imageUrls ?? [],
        quantity: listing.quantity?.toString() ?? "",
        unit: listing.unit?.toLowerCase() ?? "",
        purityGrade: listing.purityGrade ?? "",
        pricePerUnit: listing.pricePerUnit?.toString() ?? "",
        country: listing.country ?? "",
        region: listing.region ?? "",
        shippingDetails: listing.shippingDetails ?? "",
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload: ListingFormData) => {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: payload.title,
          category: payload.category,
          description: payload.description,
          imageUrls: payload.imageUrls,
          quantity: payload.quantity,
          unit: payload.unit,
          purityGrade: payload.purityGrade,
          pricePerUnit: payload.pricePerUnit,
          country: payload.country,
          region: payload.region,
          shippingDetails: payload.shippingDetails,
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Failed to update listing");
      }

      return res.json() as Promise<ListingResponse>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      queryClient.invalidateQueries({ queryKey: ["miner", "dashboard"] });
      alert("Listing updated successfully!");
      router.push("/MinerDashboard");
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : "Failed to update listing";
      alert(message);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0 || !formData) return;

    setUploadingImages(true);
    setTimeout(() => {
      const newUrls = files.map((file) => URL.createObjectURL(file));
      setFormData((prev) =>
        prev
          ? {
              ...prev,
              imageUrls: [...prev.imageUrls, ...newUrls],
            }
          : prev
      );
      setUploadingImages(false);
    }, 1000);
  };

  const removeImage = (index: number) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            imageUrls: prev.imageUrls.filter((_, i) => i !== index),
          }
        : prev
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    if (
      !formData.title ||
      !formData.category ||
      !formData.quantity ||
      !formData.pricePerUnit ||
      !formData.country
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.imageUrls.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    mutation.mutate(formData);
  };

  const isSubmitting = mutation.isPending;

  if (isLoading || !formData) {
    return <EditListingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/MinerDashboard")}
            className="mb-4 text-[#D4AF37] hover:text-[#1A1A1A] hover:bg-[#D4AF37]/10"
          >
            ← Back to Dashboard
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-xl flex items-center justify-center">
              <Package className="w-8 h-8 text-[#1A1A1A]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#1A1A1A]">Edit Listing</h1>
              <p className="text-gray-600">Update your product details</p>
            </div>
          </div>
        </div>

        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">Basic Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Premium 24K Gold Nuggets"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purity_grade">Purity/Grade</Label>
                    <Input
                      id="purity_grade"
                      value={formData.purityGrade}
                      onChange={(e) => setFormData({ ...formData, purityGrade: e.target.value })}
                      placeholder="e.g., 24K, 99.9% pure, AAA Grade"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your product in detail"
                    rows={5}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">Product Images</h3>
                <div className="space-y-4">
                  {formData.imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.imageUrls.map((url, index) => (
                        <div
                          key={url + index}
                          className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
                        >
                          <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-colors">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div>
                      <label htmlFor="images" className="cursor-pointer">
                        <span className="text-[#D4AF37] font-medium hover:underline">
                          {uploadingImages ? "Uploading..." : "Click to upload more images"}
                        </span>
                      </label>
                      <input
                        id="images"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploadingImages}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">Quantity & Pricing</h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity Available *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) => setFormData({ ...formData, unit: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price_per_unit">Price per Unit (USD) *</Label>
                    <Input
                      id="price_per_unit"
                      type="number"
                      step="0.01"
                      value={formData.pricePerUnit}
                      onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">Location & Shipping</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Region/Mine Location</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping_details">Shipping & Export Details</Label>
                  <Textarea
                    id="shipping_details"
                    value={formData.shippingDetails}
                    onChange={(e) => setFormData({ ...formData, shippingDetails: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/MinerDashboard")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
                >
                  {isSubmitting ? "Updating..." : "Update Listing"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}