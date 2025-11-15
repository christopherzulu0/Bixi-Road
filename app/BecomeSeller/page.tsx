'use client'

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useUploadThing } from "@/lib/uploadthing-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Shield, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Building2,
  MapPin,
  Loader2
} from "lucide-react";

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

function CountrySelectSkeleton() {
  return <Skeleton className="h-10 w-full" />;
}

function CountrySelectContent({ 
  value, 
  onValueChange 
}: { 
  value: string; 
  onValueChange: (value: string) => void;
}) {
  const { data, isLoading } = useQuery<CountriesResponse>({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await fetch("/api/home/countries", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch countries");
      return res.json() as Promise<CountriesResponse>;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  if (isLoading || !data) {
    return <CountrySelectSkeleton />;
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select your country" />
      </SelectTrigger>
      <SelectContent>
        {data.data.map((country) => (
          <SelectItem key={country.id} value={country.name}>
            <div className="flex items-center gap-2">
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function BecomeASellerPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingApplication, setExistingApplication] = useState<any>(null);
  const [loadingApplication, setLoadingApplication] = useState(true);
  const [formData, setFormData] = useState({
    country: "",
    phone: "",
    bio: "",
    mineLocation: "",
    miningLicenseUrl: "",
    idDocumentUrl: "",
    companyCertUrl: ""
  });
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const uploadingFileRef = React.useRef<string | null>(null);
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm?: () => void;
  }>({
    open: false,
    title: "",
    description: "",
  });

  const { startUpload } = useUploadThing("sellerDocumentUploader", {
    onClientUploadComplete: (res) => {
      console.log("✅ Upload completed successfully:", res);
      const currentField = uploadingFileRef.current;
      if (currentField && res && res[0]) {
        const fileUrl = res[0].url;
        console.log(`✅ File uploaded successfully: ${fileUrl}`);
        
        // Update form data with the uploaded file URL
        setFormData(prev => ({ ...prev, [currentField]: fileUrl }));
        
        // Reset progress for this field
        setUploadProgress(prev => {
          const { [currentField]: _omit, ...rest } = prev as any;
          return rest;
        });
        
        // Clear uploading state after a brief delay
        setTimeout(() => {
          setUploadingFile(null);
          uploadingFileRef.current = null;
        }, 800);
      }
    },
    onUploadError: (error: Error) => {
      console.error("❌ Upload error:", error);
      setAlertDialog({
        open: true,
        title: "Upload Failed",
        description: error.message || "Failed to upload file. Please try again.",
      });
      setUploadingFile(null);
      uploadingFileRef.current = null;
    },
    onUploadProgress: (progress) => {
      console.log("📊 Upload progress:", progress);
      const currentField = uploadingFileRef.current;
      if (currentField) {
        const pct = Math.max(0, Math.min(99, Math.floor(progress)));
        setUploadProgress(prev => ({ ...prev, [currentField]: pct }));
      }
    },
    onBeforeUploadBegin: (files) => {
      console.log("🚀 Starting upload for files:", files.map(f => f.name));
      // Sanitize filenames to avoid spaces, parentheses, and double-encoding issues that can cause 409 on UploadThing
      const sanitizeFileName = (name: string) => {
        let out = name.trim();
        try {
          // If the name came in already encoded, decode once
          out = decodeURIComponent(out);
        } catch {}
        // Replace spaces with hyphens, drop parentheses and stray percent signs
        out = out.replace(/\s+/g, "-").replace(/[()]/g, "").replace(/%/g, "");
        // Remove any remaining unsafe characters (keep letters, numbers, dot and dash and underscore)
        out = out.normalize("NFKD").replace(/[^\w.\-]+/g, "");
        // Ensure we don't end up with an empty filename
        if (!out) out = "file";
        return out;
      };

      const normalized = files.map((f) => {
        const safeName = sanitizeFileName(f.name);
        if (safeName === f.name) return f;
        return new File([f], safeName, { type: f.type });
      });

      console.log("🧹 Normalized filenames:", normalized.map(f => f.name));
      return normalized;
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

  // Fetch existing application
  useEffect(() => {
    const fetchApplication = async () => {
      if (!isSignedIn) return;
      
      try {
        const response = await fetch("/api/seller-applications");
        if (response.ok) {
          const applications = await response.json();
          if (applications.length > 0) {
            setExistingApplication(applications[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching application:", error);
      } finally {
        setLoadingApplication(false);
      }
    };

    if (isLoaded && isSignedIn) {
      fetchApplication();
    }
  }, [isLoaded, isSignedIn]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log(`📁 File selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    // Set uploading state
    setUploadingFile(fieldName);
    uploadingFileRef.current = fieldName;
    setUploadProgress(prev => ({ ...prev, [fieldName]: 0 }));

    try {
      console.log(`⬆️ Starting upload for field: ${fieldName}`);
      
      // Start upload - completion is handled in onClientUploadComplete callback
      await startUpload([file]);
      
    } catch (error) {
      console.error("❌ Upload error in handler:", error);
      setAlertDialog({
        open: true,
        title: "Upload Failed",
        description: "Failed to upload file. Please try again.",
      });
      setUploadingFile(null);
      uploadingFileRef.current = null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.country || !formData.phone || !formData.bio || !formData.mineLocation) {
      setAlertDialog({
        open: true,
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    if (!formData.miningLicenseUrl || !formData.idDocumentUrl) {
      setAlertDialog({
        open: true,
        title: "Missing Documents",
        description: "Please upload all required documents.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/seller-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit application");
      }

      setAlertDialog({
        open: true,
        title: "Application Submitted",
        description: "Application submitted successfully! Our team will review your documents within 3-5 business days.",
        onConfirm: () => {
          router.push("/");
        },
      });
    } catch (error: any) {
      console.error("Submission error:", error);
      setAlertDialog({
        open: true,
        title: "Submission Failed",
        description: error.message || "Failed to submit application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (!isLoaded || loadingApplication) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Check for existing pending or approved application
  if (existingApplication) {
    const statusConfig = {
      PENDING: {
        icon: AlertCircle,
        title: "Application Under Review",
        color: "text-[#D4AF37]",
        bgColor: "bg-[#D4AF37]/20",
        borderColor: "border-[#D4AF37]",
        message: "Thank you for submitting your verification application!",
        description: "Our team is currently reviewing your documents. This typically takes 3-5 business days. We'll notify you via email once your application has been processed.",
      },
      APPROVED: {
        icon: CheckCircle,
        title: "Application Approved!",
        color: "text-green-600",
        bgColor: "bg-green-100",
        borderColor: "border-green-600",
        message: "Congratulations! Your seller application has been approved.",
        description: "You can now start creating listings and selling your minerals on the platform.",
      },
      REJECTED: {
        icon: AlertCircle,
        title: "Application Rejected",
        color: "text-red-600",
        bgColor: "bg-red-100",
        borderColor: "border-red-600",
        message: "Unfortunately, your application was not approved.",
        description: "Please contact our support team for more information or to submit a new application with updated documents.",
      },
    };

    const config = statusConfig[existingApplication.status as keyof typeof statusConfig];
    const IconComponent = config.icon;

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className={`border-2 ${config.borderColor}`}>
            <CardHeader className="text-center pb-8">
              <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <IconComponent className={`w-10 h-10 ${config.color}`} />
              </div>
              <CardTitle className="text-3xl">{config.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-lg text-gray-600">{config.message}</p>
              <p className="text-gray-600">{config.description}</p>
              {existingApplication.status === "APPROVED" && (
                <div className="pt-6">
                  <Button
                    onClick={() => router.push("/create-listing")}
                    className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A] mr-2"
                  >
                    Create Listing
                  </Button>
                  <Button
                    onClick={() => router.push("/MinerDashboard")}
                    variant="outline"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              )}
              {existingApplication.status !== "APPROVED" && (
              <div className="pt-6">
                <Button
                    onClick={() => router.push("/")}
                  className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
                >
                  Return to Homepage
                </Button>
              </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-[#1A1A1A]" />
          </div>
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">
            Become a Verified Seller
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join Africa's trusted network of certified miners. Complete verification to start selling your minerals globally.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-bold mb-2">Global Reach</h3>
              <p className="text-sm text-gray-600">Access international buyers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-bold mb-2">Secure Payments</h3>
              <p className="text-sm text-gray-600">Escrow protection on all sales</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
              <h3 className="font-bold mb-2">Fair Pricing</h3>
              <p className="text-sm text-gray-600">No middlemen, better margins</p>
            </CardContent>
          </Card>
        </div>

        {/* Application Form */}
        <Card className="border-2 border-gray-200">
          <CardHeader>
            <CardTitle>Verification Application</CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              All information will be kept confidential and used only for verification purposes.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#D4AF37]" />
                  Basic Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Suspense fallback={<CountrySelectSkeleton />}>
                      <CountrySelectContent
                        value={formData.country}
                        onValueChange={(value) => setFormData({...formData, country: value})}
                      />
                    </Suspense>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+XXX XXX XXX XXXX"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mine_location">Mine Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="mine_location"
                      value={formData.mineLocation}
                      onChange={(e) => setFormData({...formData, mineLocation: e.target.value})}
                      placeholder="e.g., Ashanti Region, Ghana"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Business Description *</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Describe your mining operation, experience, and specialization..."
                    rows={4}
                    required
                  />
                </div>
              </div>

              {/* Required Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#D4AF37]" />
                  Required Documents
                </h3>

                <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    Upload clear, readable copies of all documents. Supported formats: PDF, PNG, JPG
                  </p>
                </div>

                {/* Mining License */}
                <div className="space-y-2">
                  <Label>Mining License or Permit *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D4AF37] transition-colors">
                    {formData.miningLicenseUrl ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                        <p className="text-sm text-green-600 font-medium">Document uploaded successfully</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData({...formData, miningLicenseUrl: ""})}
                        >
                          Change File
                        </Button>
                      </div>
                    ) : uploadingFile === 'miningLicenseUrl' ? (
                      <div className="space-y-2">
                        <Loader2 className="w-8 h-8 text-[#D4AF37] mx-auto animate-spin" />
                        <p className="text-sm text-[#D4AF37] font-medium">
                          {(uploadProgress.miningLicenseUrl ?? 0) >= 99 ? "Processing file..." : `Uploading... ${uploadProgress.miningLicenseUrl ?? 0}%`}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <div>
                          <label htmlFor="mining_license" className="cursor-pointer">
                            <span className="text-[#D4AF37] font-medium hover:underline">
                              Click to upload
                            </span>
                            <span className="text-gray-500"> or drag and drop</span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG (max 8MB)</p>
                          <input
                            id="mining_license"
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => handleFileUpload(e, 'miningLicenseUrl')}
                            disabled={!!uploadingFile}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ID Document */}
                <div className="space-y-2">
                  <Label>ID or Passport *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D4AF37] transition-colors">
                    {formData.idDocumentUrl ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                        <p className="text-sm text-green-600 font-medium">Document uploaded successfully</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData({...formData, idDocumentUrl: ""})}
                        >
                          Change File
                        </Button>
                      </div>
                    ) : uploadingFile === 'idDocumentUrl' ? (
                      <div className="space-y-2">
                        <Loader2 className="w-8 h-8 text-[#D4AF37] mx-auto animate-spin" />
                        <p className="text-sm text-[#D4AF37] font-medium">
                          {(uploadProgress.idDocumentUrl ?? 0) >= 99 ? "Processing file..." : `Uploading... ${uploadProgress.idDocumentUrl ?? 0}%`}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <div>
                          <label htmlFor="id_document" className="cursor-pointer">
                            <span className="text-[#D4AF37] font-medium hover:underline">
                              Click to upload
                            </span>
                            <span className="text-gray-500"> or drag and drop</span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG (max 8MB)</p>
                          <input
                            id="id_document"
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => handleFileUpload(e, 'idDocumentUrl')}
                            disabled={!!uploadingFile}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Certificate (Optional) */}
                <div className="space-y-2">
                  <Label>Company Registration Certificate (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#D4AF37] transition-colors">
                    {formData.companyCertUrl ? (
                      <div className="space-y-2">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                        <p className="text-sm text-green-600 font-medium">Document uploaded successfully</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData({...formData, companyCertUrl: ""})}
                        >
                          Change File
                        </Button>
                      </div>
                    ) : uploadingFile === 'companyCertUrl' ? (
                      <div className="space-y-2">
                        <Loader2 className="w-8 h-8 text-[#D4AF37] mx-auto animate-spin" />
                        <p className="text-sm text-[#D4AF37] font-medium">
                          {(uploadProgress.companyCertUrl ?? 0) >= 99 ? "Processing file..." : `Uploading... ${uploadProgress.companyCertUrl ?? 0}%`}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                        <div>
                          <label htmlFor="company_cert" className="cursor-pointer">
                            <span className="text-[#D4AF37] font-medium hover:underline">
                              Click to upload
                            </span>
                            <span className="text-gray-500"> or drag and drop</span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG (max 8MB)</p>
                          <input
                            id="company_cert"
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => handleFileUpload(e, 'companyCertUrl')}
                            disabled={!!uploadingFile}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Verification Fee Notice */}
              <div className="flex items-start gap-2 p-4 bg-[#D4AF37]/10 border border-[#D4AF37] rounded-lg">
                <Shield className="w-5 h-5 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-[#1A1A1A]">
                  <strong>Verification Fee:</strong> $100 USD (one-time payment)
                  <br />
                  This fee covers document verification and identity checks to maintain platform trust.
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/")}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Alert Dialog */}
      <AlertDialog open={alertDialog.open} onOpenChange={(open) => setAlertDialog({ ...alertDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{alertDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alertDialog.onConfirm ? (
              <>
                <AlertDialogCancel onClick={() => setAlertDialog({ ...alertDialog, open: false })}>
                  Close
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    alertDialog.onConfirm?.();
                    setAlertDialog({ ...alertDialog, open: false });
                  }}
                  className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
                >
                  Continue
                </AlertDialogAction>
              </>
            ) : (
              <AlertDialogAction
                onClick={() => setAlertDialog({ ...alertDialog, open: false })}
                className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
              >
                OK
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
