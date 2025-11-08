'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useUploadThing } from "@/lib/uploadthing-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  X,
  Image as ImageIcon,
  AlertCircle,
  Package,
  Info,
  Loader2,
  CheckCircle
} from "lucide-react";


export default function CreateListingPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    imageUrls: [],
    quantity: "",
    unit: "grams",
    purityGrade: "",
    pricePerUnit: "",
    country: "Ghana",
    region: "",
    shippingDetails: ""
  });

  const { startUpload, isUploading } = useUploadThing("productImageUploader", {
    onClientUploadComplete: (res) => {
      console.log("✅ Images uploaded successfully:", res);
      
      if (res && res.length > 0) {
        const imageUrls = res.map(file => file.url);
        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...imageUrls]
        }));
        
        setTimeout(() => {
          setUploadingImages(false);
        }, 500);
      }
    },
    onUploadError: (error) => {
      console.error("❌ Upload error:", error);
      alert(`Upload failed: ${error.message}`);
      setUploadingImages(false);
    },
    onUploadProgress: (progress) => {
      console.log("📊 Upload progress:", progress);
      setUploadProgress({ current: progress });
    },
    onUploadBegin: (fileName) => {
      console.log("📤 Upload began for:", fileName);
    },
  });

  // Check if user is signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
      return;
    }
  }, [isLoaded, isSignedIn, router]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    console.log(`📁 Product images selected: ${files.length} files`);
    setUploadingImages(true);
    setUploadProgress({ current: 0 });

    try {
      // Start upload - completion handled in onClientUploadComplete callback
      await startUpload(files);
    } catch (error) {
      console.error("❌ Image upload error:", error);
      
      if (error?.message?.includes('timeout') || error?.message?.includes('metadata')) {
        console.warn("⚠️ Metadata error but files may have uploaded");
        alert("Upload completed but verification failed. If images don't appear, please try again.");
      } else {
        alert("Failed to upload images. Please try again.");
      }
      
      setUploadingImages(false);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.quantity || !formData.pricePerUnit || !formData.country) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.imageUrls.length === 0) {
      alert("Please upload at least one product image");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create listing");
      }

      const listing = await response.json();
      console.log("✅ Listing created:", listing);
      
      alert("Listing submitted successfully! It will be reviewed within 24 hours. Once approved, you'll receive shipping instructions to send your product to our Verification Hub.");
      router.push("/MinerDashboard");
    } catch (error) {
      console.error("❌ Listing creation error:", error);
      alert(error.message || "Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              <h1 className="text-4xl font-bold text-[#1A1A1A]">Create New Listing</h1>
              <p className="text-gray-600">Add a new product to the marketplace</p>
            </div>
          </div>
        </div>

        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              All listings are reviewed by our team. Once approved, you'll receive instructions to ship your product to our Verification Hub for authentication.
            </p>
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
                      value={formData.purityGrade}
                      onChange={(e) => setFormData({...formData, purityGrade: e.target.value})}
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
                    placeholder="Describe your product in detail - quality, origin, certification, etc."
                    rows={5}
                    required
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">Product Images</h3>
                
                <div className="space-y-4">
                  {formData.imageUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.imageUrls.map((url, index) => (
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
                          {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                        </span>
                        <span className="text-gray-500"> or drag and drop</span>
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
                    <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 10MB (max 4 images)</p>
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
                      placeholder="0"
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
                        <SelectValue placeholder="Select unit" />
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
                      value={formData.pricePerUnit}
                      onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {formData.quantity && formData.pricePerUnit && (
                  <Alert className="bg-[#D4AF37]/10 border-[#D4AF37]">
                    <AlertCircle className="w-4 h-4 text-[#D4AF37]" />
                    <AlertDescription>
                      <strong>Total Value:</strong> ${(parseFloat(formData.quantity || 0) * parseFloat(formData.pricePerUnit || 0)).toLocaleString()} USD
                      <br />
                      <span className="text-xs">Platform commission: 7.5% (${((parseFloat(formData.quantity || 0) * parseFloat(formData.pricePerUnit || 0)) * 0.075).toLocaleString()})</span>
                    </AlertDescription>
                  </Alert>
                )}
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
                      placeholder="e.g., Ghana, Kenya"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region">Region/Mine Location</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      placeholder="e.g., Ashanti Region"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shipping_details">Shipping & Export Details</Label>
                  <Textarea
                    id="shipping_details"
                    value={formData.shippingDetails}
                    onChange={(e) => setFormData({...formData, shippingDetails: e.target.value})}
                    placeholder="Describe shipping options, export procedures, delivery timeframes, etc."
                    rows={3}
                  />
                </div>
              </div>

              {/* Shipping Notice */}
              <Alert className="bg-blue-50 border-blue-200">
                <Info className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-900">
                  <strong>Next Steps After Approval:</strong> Once your listing is approved, you'll receive our Verification Hub shipping address. 
                  Ship your product to us for physical verification before it goes live on the marketplace.
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  Your listing will be reviewed by our team within 24 hours. You'll be notified via email once it's approved.
                </AlertDescription>
              </Alert>

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
                  {isSubmitting ? "Creating..." : "Submit for Review"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
