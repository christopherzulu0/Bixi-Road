'use client'

import React, { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Package,
  AlertCircle,
  Eye,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

type BuyerStats = {
  total: number;
  pending: number;
  completed: number;
  totalSpent: number;
};

type Transaction = {
  id: string;
  transaction_id: string;
  product_title: string;
  seller_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  escrow_status: string;
  buyer_confirmed: boolean;
  created_date: string;
};

type BuyerDashboardResponse = {
  user: {
    id: string;
    full_name: string;
  };
  stats: BuyerStats;
  transactions: Transaction[];
};

function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      {/* Header Skeleton */}
      <div className="mb-12">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-6 w-96" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transactions Skeleton */}
      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function BuyerDashboardContent() {
  const router = useRouter();

  const { data, isLoading } = useQuery<BuyerDashboardResponse>({
    queryKey: ["buyer", "dashboard"],
    queryFn: async () => {
      const res = await fetch("/api/buyer/dashboard", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      return res.json() as Promise<BuyerDashboardResponse>;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });

  if (isLoading || !data) {
    return <DashboardSkeleton />;
  }

  const { user, stats, transactions } = data;

  const getStatusIcon = (status: string) => {
    const icons = {
      funds_held: <Clock className="w-4 h-4" />,
      shipped: <Package className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      disputed: <AlertCircle className="w-4 h-4" />,
      refunded: <AlertCircle className="w-4 h-4" />,
    };
    return icons[status as keyof typeof icons] || <Clock className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      funds_held: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      completed: "bg-green-100 text-green-800",
      disputed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">
            Welcome back, {user.full_name || "Buyer"}!
          </h1>
          <p className="text-lg text-gray-600">Track your purchases and manage your transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Orders</span>
                <ShoppingCart className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stats.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Pending</span>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stats.pending}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Completed</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-3xl font-bold text-[#1A1A1A]">{stats.completed}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Total Spent</span>
                <FileText className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <p className="text-3xl font-bold text-[#D4AF37]">
                ${stats.totalSpent.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => router.push("/MarketPlace")}
              className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Browse Marketplace
            </Button>
            <Button
              variant="outline"
              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1A1A1A]"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Saved Items
            </Button>
          </div>
        </div>

        {/* Transactions */}
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">My Transactions</h2>

          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <Card key={transaction.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-[#1A1A1A]">
                            {transaction.product_title}
                          </h3>
                          <Badge className={`${getStatusColor(transaction.escrow_status)} flex items-center gap-1`}>
                            {getStatusIcon(transaction.escrow_status)}
                            {transaction.escrow_status.replace(/_/g, " ").toUpperCase()}
                          </Badge>
                        </div>

                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            Transaction ID:{" "}
                            <span className="font-mono text-[#1A1A1A]">{transaction.transaction_id}</span>
                          </p>
                          <p>
                            Seller: <span className="font-medium text-[#1A1A1A]">{transaction.seller_name}</span>
                          </p>
                          <p>
                            Quantity:{" "}
                            <span className="font-medium text-[#1A1A1A]">
                              {transaction.quantity} units @ ${transaction.unit_price.toLocaleString()}
                            </span>
                          </p>
                          <p>Date: {format(new Date(transaction.created_date), "MMM d, yyyy")}</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                          <p className="text-2xl font-bold text-[#D4AF37]">
                            ${transaction.total_amount.toLocaleString()}
                          </p>
                        </div>

                        {transaction.escrow_status === "delivered" && !transaction.buyer_confirmed && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm Delivery
                          </Button>
                        )}

                        {transaction.escrow_status === "completed" && (
                          <Button size="sm" variant="outline">
                            Leave Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">No transactions yet</h3>
              <p className="text-gray-600 mb-6">Start browsing the marketplace to make your first purchase</p>
              <Button
                onClick={() => router.push("/MarketPlace")}
                className="bg-[#D4AF37] hover:bg-[#F4E4BC] text-[#1A1A1A]"
              >
                Browse Marketplace
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BuyerDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <BuyerDashboardContent />
    </Suspense>
  );
}
