'use client'

import React, { Suspense, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  DollarSign,
  Eye,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Users,
  Star
} from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type MinerDashboardStats = {
  totalListings: number;
  activeListings: number;
  totalViews: number;
  totalInquiries: number;
  totalSales: number;
  totalRevenue: number;
  pendingTransactions: number;
};

type MinerDashboardUser = {
  id: string;
  fullName: string;
  country: string | null;
  ratingAverage: number | null;
  totalReviews: number;
  totalSales: number;
};

type MinerDashboardProduct = {
  id: string;
  title: string;
  status: string;
  pricePerUnit: number;
  unit: string;
  quantity: number;
  views: number;
  imageUrls: string[];
  isActive: boolean;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type MinerDashboardResponse = {
  data: {
    user: MinerDashboardUser;
    stats: MinerDashboardStats;
    products: MinerDashboardProduct[];
    inquiries: unknown[];
    transactions: unknown[];
  };
};

function MinerDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, idx) => (
            <Card key={idx}>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 space-y-6">
            <Skeleton className="h-10 w-full" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, idx) => (
                <Card key={idx}>
                  <div className="h-48 bg-gray-200 animate-pulse rounded-t-lg" />
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MinerDashboardContent() {
  const router = useRouter();
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [response, setResponse] = useState("");

  const { data } = useQuery<MinerDashboardResponse>({
    queryKey: ["miner", "dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/miner/dashboard", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch miner dashboard");
      }
      return res.json() as Promise<MinerDashboardResponse>;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });

  if (!data?.data) {
    return <MinerDashboardSkeleton />;
  }

  const dashboard = data.data;
  const { user, stats, products } = dashboard;

  type InquiryRecord = {
    id: string;
    productTitle: string;
    buyerName: string;
    message: string;
    status: string;
    response?: string | null;
    createdAt: string;
  };

  type TransactionRecord = {
    id: string;
    productTitle: string;
    buyerName: string;
    quantity: number;
    unitPrice: number;
    sellerReceives: number;
    escrowStatus: string;
    createdAt: string;
  };

  const normalizedInquiries: InquiryRecord[] = Array.isArray(dashboard.inquiries)
    ? dashboard.inquiries.map((item: any) => ({
        id: String(item.id ?? ""),
        productTitle: String(item.productTitle ?? item.product_title ?? "Unknown product"),
        buyerName: String(item.buyerName ?? item.buyer_name ?? "Unknown buyer"),
        message: String(item.message ?? ""),
        status: String(item.status ?? "pending"),
        response: item.response ?? null,
        createdAt: String(item.createdAt ?? item.created_date ?? new Date().toISOString()),
      }))
    : [];

  const normalizedTransactions: TransactionRecord[] = Array.isArray(dashboard.transactions)
    ? dashboard.transactions.map((item: any) => ({
        id: String(item.id ?? ""),
        productTitle: String(item.productTitle ?? item.product_title ?? "Unknown product"),
        buyerName: String(item.buyerName ?? item.buyer_name ?? "Unknown buyer"),
        quantity: Number(item.quantity ?? 0),
        unitPrice: Number(item.unitPrice ?? item.unit_price ?? 0),
        sellerReceives: Number(item.sellerReceives ?? item.seller_receives ?? 0),
        escrowStatus: String(item.escrowStatus ?? item.escrow_status ?? "pending"),
        createdAt: String(item.createdAt ?? item.created_date ?? new Date().toISOString()),
      }))
    : [];

  const pendingInquiriesCount = normalizedInquiries.filter(
    (inquiry) => inquiry.status === "pending"
  ).length;

  const productStatusBadge = (status: string) => {
    switch (status) {
      case "live":
      case "approved":
        return "bg-green-500";
      case "pending_review":
      case "pending_approval":
        return "bg-yellow-500";
      case "sold":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    console.info("Request to delete product", productId);
  };

  const handleRespond = (inquiryId: string) => {
    console.info("Responded to inquiry", inquiryId, response);
    setRespondingTo(null);
    setResponse("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">Seller Dashboard</h1>
              <p className="text-lg text-gray-600">Manage your listings and track your sales</p>
            </div>
            <Button
              onClick={() => router.push("/CreateListing")}
              className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A] font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Listing
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Active Listings</span>
                <Package className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-3xl font-bold text-[#1A1A1A]">
                {stats.activeListings.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                of {stats.totalListings.toLocaleString()} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Views</span>
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-[#1A1A1A]">
                {stats.totalViews.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">across all listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Completed Sales</span>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-[#1A1A1A]">
                {stats.totalSales.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.pendingTransactions.toLocaleString()} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <DollarSign className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-3xl font-bold text-[#D4AF37]">
                ${stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">after commission</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Your Profile Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#F4E4BC] rounded-full flex items-center justify-center text-2xl font-bold text-[#1A1A1A]">
                  {user.fullName?.[0] || "M"}
                </div>
                <div>
                  <p className="font-bold text-[#1A1A1A]">{user.fullName}</p>
                  <p className="text-sm text-gray-600">{user.country ?? "Unknown"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 fill-[#D4AF37] text-[#D4AF37]" />
                <div>
                  <p className="text-2xl font-bold text-[#1A1A1A]">
                    {(user.ratingAverage ?? 0).toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {user.totalReviews.toLocaleString()} reviews
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-[#D4AF37]" />
                <div>
                  <p className="text-2xl font-bold text-[#1A1A1A]">
                    {user.totalSales.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">successful sales</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="listings">My Listings ({products.length})</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries ({pendingInquiriesCount})</TabsTrigger>
            <TabsTrigger value="transactions">Transactions ({normalizedTransactions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">My Listings</h2>

            {products.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          product.imageUrls?.[0] ||
                          "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=300&fit=crop"
                        }
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={productStatusBadge(product.status)}>
                          {product.status.replace(/_/g, " ").toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg text-[#1A1A1A] mb-2 line-clamp-1">
                        {product.title}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-semibold text-[#D4AF37]">
                            ${product.pricePerUnit}/{product.unit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span className="font-semibold">
                            {product.quantity} {product.unit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Views:</span>
                          <span className="font-semibold">{product.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/MinerProfile/${product.id}`)}
                          className="flex-1"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No listings yet</h3>
                <p className="text-gray-600 mb-6">Create your first listing to start selling</p>
                <Button
                  onClick={() => router.push("/CreateListing")}
                  className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Listing
                </Button>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="inquiries">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Product Inquiries</h2>

            {normalizedInquiries.length > 0 ? (
              <div className="space-y-4">
                {normalizedInquiries.map((inquiry) => (
                  <Card
                    key={inquiry.id}
                    className={
                      inquiry.status === "pending" ? "border-2 border-yellow-300" : ""
                    }
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-[#1A1A1A] mb-1">
                            {inquiry.productTitle}
                          </h3>
                          <p className="text-sm text-gray-600">
                            From: <span className="font-medium">{inquiry.buyerName}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(inquiry.createdAt), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                        <Badge
                          className={
                            inquiry.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : inquiry.status === "responded"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {inquiry.status.replace("_", " ")}
                        </Badge>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Question:</p>
                        <p className="text-gray-800">{inquiry.message}</p>
                      </div>

                      {inquiry.response ? (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-sm font-semibold text-green-900 mb-1">
                            Your Response:
                          </p>
                          <p className="text-green-800">{inquiry.response}</p>
                        </div>
                      ) : respondingTo === inquiry.id ? (
                        <div className="space-y-3">
                          <Textarea
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Type your response..."
                            rows={4}
                            className="resize-none"
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleRespond(inquiry.id)}
                              disabled={!response.trim()}
                              className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
                            >
                              Send Response
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setRespondingTo(null);
                                setResponse("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setRespondingTo(inquiry.id)}
                          className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Respond to Inquiry
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No inquiries yet</h3>
                <p className="text-gray-600">Buyer questions will appear here</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="transactions">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Recent Transactions</h2>

            {normalizedTransactions.length > 0 ? (
              <div className="space-y-4">
                {normalizedTransactions.slice(0, 5).map((transaction) => (
                  <Card key={transaction.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-[#1A1A1A] mb-2">
                            {transaction.productTitle}
                          </h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p>
                              Buyer: <span className="font-medium">{transaction.buyerName}</span>
                            </p>
                            <p>
                              Quantity: {transaction.quantity} @ ${transaction.unitPrice}
                            </p>
                            <p>
                              Date: {format(new Date(transaction.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              transaction.escrowStatus === "completed"
                                ? "bg-green-100 text-green-800"
                                : transaction.escrowStatus === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {transaction.escrowStatus.replace(/_/g, " ")}
                          </Badge>
                          <p className="text-2xl font-bold text-[#D4AF37] mt-2">
                            ${transaction.sellerReceives.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">you receive</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No transactions yet</h3>
                <p className="text-gray-600">Your sales will appear here</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function MinerDashboardPage() {
  return (
    <Suspense fallback={<MinerDashboardSkeleton />}>
      <MinerDashboardContent />
    </Suspense>
  );
}
