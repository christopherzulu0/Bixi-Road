'use client'
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  X,
  Image as ImageIcon,
  Package
} from "lucide-react";
import { useRouter } from "next/navigation";

// Static product data
const staticProduct = {
  id: "prod-1",
  title: "Premium 24K Gold Nuggets",
  category: "Gold",
  description: "High-quality gold nuggets from Ghana mines",
  image_urls: ["https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&h=600&fit=crop"],
  quantity: 100,
  unit: "grams",
  purity_grade: "24K",
  price_per_unit: 1850,
  country: "Ghana",
  region: "Ashanti Region",
  shipping_details: "Standard shipping available"
};

type ListingFormData = {
  title: string;
  category: string;
  description: string;
  image_urls: string[];
  quantity: string;
  unit: string;
  purity_grade: string;
  price_per_unit: string;
  country: string;
  region: string;
  shipping_details: string;
};

export default function EditListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState<ListingFormData>({
    title: staticProduct.title,
    category: staticProduct.category,
    description: staticProduct.description,
    image_urls: staticProduct.image_urls || [],
    quantity: staticProduct.quantity.toString(),
    unit: staticProduct.unit,
    purity_grade: staticProduct.purity_grade || "",
    price_per_unit: staticProduct.price_per_unit.toString(),
    country: staticProduct.country,
    region: staticProduct.region || "",
    shipping_details: staticProduct.shipping_details || ""
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploadingImages(true);
    setTimeout(() => {
      const newUrls = files.map(file => URL.createObjectURL(file));
      setFormData(prev => ({
        ...prev,
        image_urls: [...prev.image_urls, ...newUrls]
      }));
      setUploadingImages(false);
    }, 1000);
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.quantity || !formData.price_per_unit || !formData.country) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.image_urls.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      alert("Listing updated successfully!");
      router.push("/miner-dashboard");
      setIsSubmitting(false);
    }, 1500);
  };

  const categories = ["Gold", "Diamond", "Emerald", "Ruby", "Sapphire", "Copper", "Lithium", "Cobalt", "Coltan", "Uranium", "Iron Ore", "Bauxite", "Other Gemstone", "Other Mineral"];
  const units = ["grams", "kilograms", "tonnes", "carats", "pieces"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/miner-dashboard")}
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
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Premium 24K Gold Nuggets"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({...formData, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="purity_grade">Purity/Grade</Label>
                    <Input
                      id="purity_grade"
                      value={formData.purity_grade}
                      onChange={(e) => setFormData({...formData, purity_grade: e.target.value})}
                      placeholder="e.g., 24K, 99.9% pure, AAA Grade"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your product in detail"
                    rows={5}
                    required
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">Product Images</h3>
                
                <div className="space-y-4">
                  {formData.image_urls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.image_urls.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
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
                          {uploadingImages ? 'Uploading...' : 'Click to upload more images'}
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

              {/* Quantity & Pricing */}
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
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <Select
                      value={formData.unit}
                      onValueChange={(value) => setFormData({...formData, unit: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
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
                      value={formData.price_per_unit}
                      onChange={(e) => setFormData({...formData, price_per_unit: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location & Shipping */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">Location & Shipping</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Region/Mine Location</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping_details">Shipping & Export Details</Label>
                  <Textarea
                    id="shipping_details"
                    value={formData.shipping_details}
                    onChange={(e) => setFormData({...formData, shipping_details: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>

              {/* Submit */}
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
