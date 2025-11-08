'use client'

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  Package,
  AlertCircle,
  Eye,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

// Static data
const user = {
  id: "user-1",
  full_name: "John Buyer"
};

const transactions = [
  {
    id: "txn-1",
    transaction_id: "TXN-12345-ABCDE",
    product_title: "Premium 24K Gold Nuggets",
    seller_name: "Ghana Gold Mining Co.",
    quantity: 2,
    unit_price: 1850,
    total_amount: 3700,
    escrow_status: "delivered",
    buyer_confirmed: false,
    created_date: new Date(2024, 0, 15).toISOString()
  },
  {
    id: "txn-2",
    transaction_id: "TXN-12346-FGHIJ",
    product_title: "Raw Diamond Crystals",
    seller_name: "African Diamond Traders",
    quantity: 5,
    unit_price: 2500,
    total_amount: 12500,
    escrow_status: "completed",
    created_date: new Date(2024, 0, 10).toISOString()
  },
  {
    id: "txn-3",
    transaction_id: "TXN-12347-KLMNO",
    product_title: "Copper Ore Concentrate",
    seller_name: "Zambia Copper Mines",
    quantity: 10,
    unit_price: 8500,
    total_amount: 85000,
    escrow_status: "funds_held",
    created_date: new Date(2024, 0, 20).toISOString()
  }
];

export default function BuyerDashboardPage() {
const router = useRouter()
  const isLoading = false;

  const getStatusIcon = (status) => {
    const icons = {
      funds_held: <Clock className="w-4 h-4" />,
      shipped: <Package className="w-4 h-4" />,
      delivered: <CheckCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      disputed: <AlertCircle className="w-4 h-4" />,
      refunded: <AlertCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      funds_held: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      completed: "bg-green-100 text-green-800",
      disputed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const stats = {
    total: transactions.length,
    pending: transactions.filter(t => ['funds_held', 'shipped'].includes(t.escrow_status)).length,
    completed: transactions.filter(t => t.escrow_status === 'completed').length,
    totalSpent: transactions
      .filter(t => t.escrow_status === 'completed')
      .reduce((sum, t) => sum + (t.total_amount || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-[#1A1A1A] mb-2">
            Welcome back, {user.full_name || 'Buyer'}!
          </h1>
          <p className="text-lg text-gray-600">
            Track your purchases and manage your transactions
          </p>
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
              onClick={() => router.push('/Marketplace')}
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
                            {transaction.escrow_status.replace(/_/g, ' ').toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>Transaction ID: <span className="font-mono text-[#1A1A1A]">{transaction.transaction_id}</span></p>
                          <p>Seller: <span className="font-medium text-[#1A1A1A]">{transaction.seller_name}</span></p>
                          <p>Quantity: <span className="font-medium text-[#1A1A1A]">{transaction.quantity} units @ ${transaction.unit_price.toLocaleString()}</span></p>
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
                        
                        {transaction.escrow_status === 'delivered' && !transaction.buyer_confirmed && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm Delivery
                          </Button>
                        )}
                        
                        {transaction.escrow_status === 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            // onClick={() => navigate(`${createPageUrl("LeaveReview")}?transaction_id=${transaction.id}`)}
                          >
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
                onClick={() => router.push('/Marketplace')}
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