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
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Upload, 
  X,
  Image as ImageIcon,
  FileText,
  Video,
  AlertCircle,
  Loader2,
  CheckCircle
} from "lucide-react";

type ArticleFormData = {
  title: string;
  category: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  imageGalleryUrls: string[];
  youtubeVideoUrl: string;
  isPublished: boolean;
  featured: boolean;
};

export default function CreateArticlePage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const uploadingTypeRef = React.useRef<'cover' | 'gallery' | null>(null);

  // Alert Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState<string>("");
  const [dialogMessage, setDialogMessage] = useState<string>("");
  const confirmActionRef = React.useRef<(() => void) | null>(null);
  const showDialog = (title: string, message: string, onConfirm?: () => void) => {
    setDialogTitle(title);
    setDialogMessage(message);
    confirmActionRef.current = onConfirm || null;
    setDialogOpen(true);
  };
  
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    category: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    imageGalleryUrls: [],
    youtubeVideoUrl: "",
    isPublished: false,
    featured: false
  });

  const { startUpload, isUploading } = useUploadThing("articleImageUploader", {
    onClientUploadComplete: (res) => {
      console.log("✅ Images uploaded successfully:", res);
      const uploadType = uploadingTypeRef.current;
      
      if (uploadType === 'cover' && res && res[0]) {
        const imageUrl = res[0].url;
        setFormData(prev => ({ ...prev, coverImageUrl: imageUrl }));
        setTimeout(() => {
          setUploadingCover(false);
          uploadingTypeRef.current = null;
        }, 500);
      } else if (uploadType === 'gallery' && res) {
        const imageUrls = res.map(file => file.url);
        setFormData(prev => ({
          ...prev,
          imageGalleryUrls: [...prev.imageGalleryUrls, ...imageUrls]
        }));
        setTimeout(() => {
          setUploadingGallery(false);
          uploadingTypeRef.current = null;
        }, 500);
      }
    },
    onUploadError: (error: Error) => {
      console.error("❌ Upload error:", error);
      showDialog("Upload failed", `Upload failed: ${error.message}`);
      setUploadingCover(false);
      setUploadingGallery(false);
      uploadingTypeRef.current = null;
    },
    onUploadProgress: (progress) => {
      console.log("📊 Upload progress:", progress);
      setUploadProgress(prev => ({ ...prev, current: progress }));
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

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log(`📁 Cover image selected: ${file.name}`);
    setUploadingCover(true);
    uploadingTypeRef.current = 'cover';
    setUploadProgress({ current: 0 });

    try {
      // Start upload and get the result
      const result = await startUpload([file]);
      
      // If we get here, upload completed successfully
      if (result && result[0]) {
        console.log("✅ Cover upload successful:", result[0].url);
      }
    } catch (error: any) {
      console.error("❌ Cover upload error:", error);
      
      // Even on error, the file might have been uploaded to S3
      // Check if we can still use it
      if (error?.message?.includes('timeout') || error?.message?.includes('metadata')) {
        console.warn("⚠️ Metadata error but file may have uploaded");
        showDialog(
          "Upload verification issue",
          "Upload completed but verification failed. If image doesn't appear, please try again."
        );
      } else {
        showDialog("Upload failed", "Failed to upload cover image. Please try again.");
      }
      
      setUploadingCover(false);
      uploadingTypeRef.current = null;
    }
  };

  const handleGalleryImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    console.log(`📁 Gallery images selected: ${files.length} files`);
    setUploadingGallery(true);
    uploadingTypeRef.current = 'gallery';
    setUploadProgress({ current: 0 });

    try {
      // Start upload and get the result
      const result = await startUpload(files);
      
      // If we get here, upload completed successfully
      if (result && result.length > 0) {
        console.log(`✅ Gallery upload successful: ${result.length} images`);
      }
    } catch (error: any) {
      console.error("❌ Gallery upload error:", error);
      
      // Even on error, files might have been uploaded to S3
      if (error?.message?.includes('timeout') || error?.message?.includes('metadata')) {
        console.warn("⚠️ Metadata error but files may have uploaded");
        showDialog(
          "Upload verification issue",
          "Upload completed but verification failed. If images don't appear, please try again."
        );
      } else {
        showDialog("Upload failed", "Failed to upload gallery images. Please try again.");
      }
      
      setUploadingGallery(false);
      uploadingTypeRef.current = null;
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageGalleryUrls: prev.imageGalleryUrls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.content) {
      showDialog("Missing information", "Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create article");
      }

      const article = await response.json();
      console.log("✅ Article created:", article);
      
      showDialog(
        "Success",
        formData.isPublished 
          ? "Article published successfully!" 
          : "Article saved as draft successfully!",
        () => router.push("/News")
      );
    } catch (error: any) {
      console.error("❌ Article creation error:", error);
      showDialog("Error", error.message || "Failed to create article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    "Market Prices",
    "Mining Laws",
    "Export Procedures",
    "Trading Tips",
    "Success Stories",
    "Industry News"
  ];

  return (
    <>
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/AdminDashboard")}
            className="mb-4 text-[#D4AF37] hover:text-[#1A1A1A] hover:bg-[#D4AF37]/10"
          >
            ← Back to Dashboard
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-[#1A1A1A]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#1A1A1A]">Create News Article</h1>
              <p className="text-gray-600">Share market insights and stories</p>
            </div>
          </div>
        </div>

        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle>Article Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Article Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g., Gold Prices Surge in Q4 2024"
                    required
                  />
                </div>

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
                  <Label htmlFor="excerpt">Excerpt/Summary</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    placeholder="Brief summary that appears in article listings..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Article Content (Markdown) *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Write your article content here. You can use markdown formatting..."
                    rows={15}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Supports Markdown: **bold**, *italic*, # Heading, - Lists, etc.
                  </p>
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#D4AF37]" />
                  Cover Image
                </h3>
                
                {formData.coverImageUrl ? (
                  <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                    <img src={formData.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, coverImageUrl: ""})}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#D4AF37] transition-colors">
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div>
                      <label htmlFor="cover_image" className="cursor-pointer">
                        <span className="text-[#D4AF37] font-medium hover:underline">
                          {uploadingCover ? 'Uploading...' : 'Click to upload cover image'}
                        </span>
                      </label>
                      <input
                        id="cover_image"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleCoverImageUpload}
                        disabled={uploadingCover}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* YouTube Video */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#D4AF37]" />
                  YouTube Video (Optional)
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="youtube_url">YouTube Video URL</Label>
                  <Input
                    id="youtube_url"
                    value={formData.youtubeVideoUrl}
                    onChange={(e) => setFormData({...formData, youtubeVideoUrl: e.target.value})}
                    placeholder="https://www.youtube.com/watch?v=... or video ID"
                  />
                  <p className="text-xs text-gray-500">
                    Paste the full YouTube URL or just the video ID. The video will be embedded in the article.
                  </p>
                </div>

                {formData.youtubeVideoUrl && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <Video className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Video will be embedded in the article
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Image Gallery */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">Photo Gallery (Optional)</h3>
                
                {formData.imageGalleryUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {formData.imageGalleryUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                        <img src={url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
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
                    <label htmlFor="gallery_images" className="cursor-pointer">
                      <span className="text-[#D4AF37] font-medium hover:underline">
                        {uploadingGallery ? 'Uploading...' : 'Click to add gallery images'}
                      </span>
                    </label>
                    <input
                      id="gallery_images"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImagesUpload}
                      disabled={uploadingGallery}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Upload multiple images for the article gallery</p>
                </div>
              </div>

              {/* Publishing Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#1A1A1A]">Publishing Options</h3>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_published"
                    checked={formData.isPublished}
                    onCheckedChange={(checked) => setFormData({...formData, isPublished: checked === true})}
                  />
                  <Label htmlFor="is_published" className="cursor-pointer">
                    Publish immediately
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({...formData, featured: checked === true})}
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Mark as featured article
                  </Label>
                </div>

                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    {formData.isPublished 
                      ? "This article will be visible to all users immediately."
                      : "This article will be saved as a draft and won't be visible to users."}
                  </AlertDescription>
                </Alert>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/AdminDashboard")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
                >
                  {isSubmitting ? "Creating..." : formData.isPublished ? "Publish Article" : "Save as Draft"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Alert Dialog */}
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle || "Notice"}</AlertDialogTitle>
          <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => {
              const cb = confirmActionRef.current;
              confirmActionRef.current = null;
              setDialogOpen(false);
              if (cb) cb();
            }}
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
