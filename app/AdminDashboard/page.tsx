'use client'

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users, 
  Package, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  Shield,
  TrendingUp,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
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

type PendingVerification = {
  id: string;
  full_name: string;
  email: string;
  country?: string;
  phone?: string;
  mine_location?: string;
  bio?: string;
  mining_license_url?: string;
  id_document_url?: string;
  company_cert_url?: string;
};

type PendingProduct = {
  id: string;
  title: string;
  category?: string;
  seller_name?: string;
  price_per_unit?: number;
  unit?: string;
  quantity?: number;
  country?: string;
  image_urls?: string[];
};

type ApiResponse<T> = {
  data: T[];
};

type DialogState =
  | { type: "approve_user"; entity: PendingVerification }
  | { type: "reject_user"; entity: PendingVerification }
  | { type: "approve_product"; entity: PendingProduct }
  | { type: "reject_product"; entity: PendingProduct };

type DashboardStats = {
  totalUsers: number;
  verifiedMiners: number;
  pendingVerifications: number;
  totalListings: number;
  activeListings: number;
  pendingListings: number;
};

type DashboardStatsResponse = {
  data: DashboardStats;
};

function VerificationsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="border-2">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-56 mt-2" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-64 md:col-span-2" />
                  <Skeleton className="h-16 w-full md:col-span-2" />
                </div>
              </div>
              <div className="flex lg:flex-col gap-3 lg:w-40">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="border-2">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-5 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-36" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-10" />
            </div>
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

const allTransactions = [
  {
    id: "txn-1",
    transaction_id: "TXN-12345-ABCDE",
    product_title: "Premium 24K Gold Nuggets",
    buyer_name: "Buyer One",
    seller_name: "John Miner",
    total_amount: 3700,
    commission_amount: 277.5,
    seller_receives: 3422.5,
    escrow_status: "completed",
    created_date: new Date(2024, 0, 15).toISOString()
  },
  {
    id: "txn-2",
    transaction_id: "TXN-12346-FGHIJ",
    product_title: "Raw Diamond Crystals",
    buyer_name: "Buyer Two",
    seller_name: "Jane Trader",
    total_amount: 12500,
    commission_amount: 937.5,
    seller_receives: 11562.5,
    escrow_status: "completed",
    created_date: new Date(2024, 0, 10).toISOString()
  }
];

export default function AdminDashboardPage() {
  const navigate = useRouter();
  const queryClient = useQueryClient();
  const [countryFilter, setCountryFilter] = useState("all");
  const [dialogState, setDialogState] = useState<DialogState | null>(null);
  const [dialogLoading, setDialogLoading] = useState(false);

  const {
    data: verificationsData,
    isLoading: verificationsLoading,
  } = useQuery<ApiResponse<PendingVerification>>({
    queryKey: ["admin", "pending-verifications"],
    queryFn: async () => {
      const res = await fetch("/api/admin/pending-verifications");
      if (!res.ok) throw new Error("Failed to fetch pending verifications");
      const data = (await res.json()) as ApiResponse<PendingVerification>;
      return data;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });

  const {
    data: productsData,
    isLoading: productsLoading,
  } = useQuery<ApiResponse<PendingProduct>>({
    queryKey: ["admin", "pending-products"],
    queryFn: async () => {
      const res = await fetch("/api/admin/pending-products");
      if (!res.ok) throw new Error("Failed to fetch pending products");
      const data = (await res.json()) as ApiResponse<PendingProduct>;
      return data;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });

  const {
    data: statsData,
    isLoading: statsLoading,
  } = useQuery<DashboardStatsResponse>({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard-stats");
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return res.json() as Promise<DashboardStatsResponse>;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });

  const allUsersApi = verificationsData?.data ?? [];
  const allProductsApi = productsData?.data ?? [];

  const filteredUsers = countryFilter === "all"
    ? allUsersApi
    : allUsersApi.filter((u) => u.country === countryFilter);

  const filteredProducts = countryFilter === "all"
    ? allProductsApi
    : allProductsApi.filter((p) => p.country === countryFilter);

  const pendingVerifications = filteredUsers; // API already returns only pending
  const pendingProducts = filteredProducts; // API already returns only pending

  const approveUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/seller-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      if (!res.ok) throw new Error("Failed to approve user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-verifications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
    },
  });

  const rejectUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/seller-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      });
      if (!res.ok) throw new Error("Failed to reject user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-verifications"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
    },
  });

  const approveProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/product-listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      if (!res.ok) throw new Error("Failed to approve product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
    },
  });

  const rejectProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/product-listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      });
      if (!res.ok) throw new Error("Failed to reject product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "pending-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard-stats"] });
    },
  });

  const handleApproveUser = async (userId: string) => {
    await approveUserMutation.mutateAsync(userId);
  };

  const handleRejectUser = async (userId: string) => {
    await rejectUserMutation.mutateAsync(userId);
  };

  const handleApproveProduct = async (productId: string) => {
    await approveProductMutation.mutateAsync(productId);
  };

  const handleRejectProduct = async (productId: string) => {
    await rejectProductMutation.mutateAsync(productId);
  };

  const handleDialogConfirm = async () => {
    if (!dialogState) return;
    setDialogLoading(true);
    try {
      if (dialogState.type === "approve_user") {
        await handleApproveUser(dialogState.entity.id);
      } else if (dialogState.type === "reject_user") {
        await handleRejectUser(dialogState.entity.id);
      } else if (dialogState.type === "approve_product") {
        await handleApproveProduct(dialogState.entity.id);
      } else if (dialogState.type === "reject_product") {
        await handleRejectProduct(dialogState.entity.id);
      }
      setDialogState(null);
    } catch (error) {
      console.error("Failed to perform action", error);
    } finally {
      setDialogLoading(false);
    }
  };

  const closeDialog = () => {
    if (dialogLoading) return;
    setDialogState(null);
  };

  const dialogDetails = useMemo(() => {
    if (!dialogState) return null;
    switch (dialogState.type) {
      case "approve_user":
        return {
          title: "Approve Seller Application",
          description: `Are you sure you want to approve seller ${dialogState.entity.full_name}?`,
          confirmLabel: "Approve",
          confirmClass: "bg-green-600 hover:bg-green-700",
        };
      case "reject_user":
        return {
          title: "Reject Seller Application",
          description: `Are you sure you want to reject seller ${dialogState.entity.full_name}?`,
          confirmLabel: "Reject",
          confirmClass: "bg-red-600 hover:bg-red-700",
        };
      case "approve_product":
        return {
          title: "Approve Product Listing",
          description: `Are you sure you want to approve product "${dialogState.entity.title}"?`,
          confirmLabel: "Approve",
          confirmClass: "bg-green-600 hover:bg-green-700",
        };
      case "reject_product":
        return {
          title: "Reject Product Listing",
          description: `Are you sure you want to reject product "${dialogState.entity.title}"?`,
          confirmLabel: "Reject",
          confirmClass: "bg-red-600 hover:bg-red-700",
        };
      default:
        return null;
    }
  }, [dialogState]);

  // Calculate stats (based on available API data)
  const statsFromApi = statsData?.data;

  const stats = {
    totalUsers: statsFromApi?.totalUsers ?? 0,
    verifiedMiners: statsFromApi?.verifiedMiners ?? 0,
    pendingVerifications: statsFromApi?.pendingVerifications ?? pendingVerifications.length,
    totalListings: statsFromApi?.totalListings ?? 0,
    activeListings: statsFromApi?.activeListings ?? 0,
    pendingListings: statsFromApi?.pendingListings ?? pendingProducts.length,
    totalTransactions: allTransactions.length,
    completedTransactions: allTransactions.filter(t => t.escrow_status === 'completed').length,
    totalRevenue: allTransactions
      .filter(t => t.escrow_status === 'completed')
      .reduce((sum, t) => sum + (t.total_amount || 0), 0),
    totalCommission: allTransactions
      .filter(t => t.escrow_status === 'completed')
      .reduce((sum, t) => sum + (t.commission_amount || 0), 0)
  };

  // Get unique countries from API data
  const countries = useMemo(() => {
    const uniqueCountries = Array.from(
      new Set(
        allUsersApi
          .map((u) => u.country)
          .filter((country): country is string => Boolean(country))
      )
    );
    return ["all", ...uniqueCountries];
  }, [allUsersApi]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">
                Admin Dashboard
              </h1>
              <p className="text-lg text-gray-600">
                Manage platform operations and oversee transactions
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate.push("/CreateArticle")}
                className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
              >
                <FileText className="w-4 h-4 mr-2" />
                Create Article
              </Button>
              <Select value={countryFilter} onValueChange={setCountryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by Country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country === "all" ? "All Countries" : country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Alert for pending items */}
          {(pendingVerifications.length > 0 || pendingProducts.length > 0) && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-900">Action Required</p>
                <p className="text-sm text-yellow-800">
                  {pendingVerifications.length > 0 && `${pendingVerifications.length} pending seller verification${pendingVerifications.length > 1 ? 's' : ''}`}
                  {pendingVerifications.length > 0 && pendingProducts.length > 0 && ' • '}
                  {pendingProducts.length > 0 && `${pendingProducts.length} pending product approval${pendingProducts.length > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Users</span>
                <Users className="w-5 h-5 text-[#D4AF37]" />
              </div>
              {statsLoading ? (
                <div className="text-3xl font-bold text-[#1A1A1A]">
                  <Skeleton className="h-8 w-24" />
                </div>
              ) : (
                <p className="text-3xl font-bold text-[#1A1A1A]">
                  {stats.totalUsers.toLocaleString()}
                </p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {statsLoading ? (
                  <Skeleton className="h-3 w-24" />
                ) : (
                  <span>{`${stats.verifiedMiners.toLocaleString()} verified miners`}</span>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Active Listings</span>
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              {statsLoading ? (
                <div className="text-3xl font-bold text-[#1A1A1A]">
                  <Skeleton className="h-8 w-24" />
                </div>
              ) : (
                <p className="text-3xl font-bold text-[#1A1A1A]">
                  {stats.activeListings.toLocaleString()}
                </p>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {statsLoading ? (
                  <Skeleton className="h-3 w-28" />
                ) : (
                  <span>{`of ${stats.totalListings.toLocaleString()} total`}</span>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Transactions</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stats.completedTransactions}</p>
              <p className="text-xs text-gray-500 mt-1">of {stats.totalTransactions} completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Commission Revenue</span>
                <DollarSign className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-3xl font-bold text-[#D4AF37]">
                ${stats.totalCommission.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">from ${stats.totalRevenue.toLocaleString()} sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="verifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="verifications" className="relative">
              Pending Verifications
              {pendingVerifications.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">{pendingVerifications.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="products" className="relative">
              Product Approvals
              {pendingProducts.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">{pendingProducts.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="transactions">
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Pending Verifications Tab */}
          <TabsContent value="verifications">
            <Card>
              <CardHeader>
                <CardTitle>Pending Seller Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                {verificationsLoading ? (
                  <VerificationsSkeleton />
                ) : pendingVerifications.length > 0 ? (
                  <div className="space-y-4">
                    {pendingVerifications.map((user) => (
                      <Card key={user.id} className="border-2">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row gap-6">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-bold text-[#1A1A1A]">{user.full_name}</h3>
                                  <p className="text-sm text-gray-600">{user.email}</p>
                                </div>
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  Pending Review
                                </Badge>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-gray-600">Country:</span>
                                  <span className="ml-2 font-semibold">{user.country}</span>
                                </div>
                                <div>
                                  <span className="text-gray-600">Phone:</span>
                                  <span className="ml-2 font-semibold">{user.phone}</span>
                                </div>
                                <div className="md:col-span-2">
                                  <span className="text-gray-600">Mine Location:</span>
                                  <span className="ml-2 font-semibold">{user.mine_location}</span>
                                </div>
                                <div className="md:col-span-2">
                                  <span className="text-gray-600">Bio:</span>
                                  <p className="mt-1 text-gray-700">{user.bio}</p>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <p className="text-sm font-semibold text-gray-700">Documents:</p>
                                <div className="flex flex-wrap gap-2">
                                  {user.mining_license_url && (
                                    <a href={user.mining_license_url} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="outline">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Mining License
                                      </Button>
                                    </a>
                                  )}
                                  {user.id_document_url && (
                                    <a href={user.id_document_url} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="outline">
                                        <FileText className="w-4 h-4 mr-2" />
                                        ID Document
                                      </Button>
                                    </a>
                                  )}
                                  {user.company_cert_url && (
                                    <a href={user.company_cert_url} target="_blank" rel="noopener noreferrer">
                                      <Button size="sm" variant="outline">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Company Cert
                                      </Button>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex lg:flex-col gap-3 lg:w-40">
                              <Button
                                  onClick={() => setDialogState({ type: "approve_user", entity: user })}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                  onClick={() => setDialogState({ type: "reject_user", entity: user })}
                                variant="outline"
                                className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No pending verifications</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Product Approvals Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Pending Product Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <ProductsSkeleton />
                ) : pendingProducts.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingProducts.map((product) => (
                      <Card key={product.id} className="border-2">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={product.image_urls?.[0] || "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=300&fit=crop"}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-yellow-500">Pending</Badge>
                          </div>
                        </div>
                        <CardContent className="p-5">
                          <h3 className="font-bold text-[#1A1A1A] mb-2 line-clamp-1">
                            {product.title}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600 mb-4">
                            <p>Category: <span className="font-semibold">{product.category}</span></p>
                            <p>Seller: <span className="font-semibold">{product.seller_name}</span></p>
                            <p>Price: <span className="font-semibold text-[#D4AF37]">${product.price_per_unit}/{product.unit}</span></p>
                            <p>Quantity: <span className="font-semibold">{product.quantity} {product.unit}</span></p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => setDialogState({ type: "approve_product", entity: product })}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDialogState({ type: "reject_product", entity: product })}
                              className="text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                              onClick={() => navigate.push(`/PorductDetail?id=${product.id}`)}
                            className="w-full mt-2"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No pending product approvals</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {allTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {allTransactions.slice(0, 10).map((transaction) => (
                      <Card key={transaction.id} className="border">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-[#1A1A1A] mb-2">
                                {transaction.product_title}
                              </h3>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p>Transaction ID: <span className="font-mono">{transaction.transaction_id}</span></p>
                                <p>Buyer: <span className="font-semibold">{transaction.buyer_name}</span></p>
                                <p>Seller: <span className="font-semibold">{transaction.seller_name}</span></p>
                                <p>Date: {format(new Date(transaction.created_date), "MMM d, yyyy")}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={
                                transaction.escrow_status === 'completed' ? 'bg-green-100 text-green-800' :
                                transaction.escrow_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>
                                {transaction.escrow_status.replace(/_/g, ' ')}
                              </Badge>
                              <div className="mt-3 space-y-1 text-sm">
                                <p className="text-gray-600">Total: <span className="font-bold text-[#1A1A1A]">${transaction.total_amount.toLocaleString()}</span></p>
                                <p className="text-gray-600">Commission: <span className="font-bold text-[#D4AF37]">${transaction.commission_amount.toLocaleString()}</span></p>
                                <p className="text-gray-600">Seller Gets: <span className="font-bold">${transaction.seller_receives.toLocaleString()}</span></p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No transactions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <AlertDialog open={Boolean(dialogState)} onOpenChange={(open) => (open ? null : closeDialog())}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogDetails?.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialogDetails?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDialog} disabled={dialogLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDialogConfirm}
              className={dialogDetails?.confirmClass}
              disabled={dialogLoading}
            >
              {dialogLoading ? "Processing..." : dialogDetails?.confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
