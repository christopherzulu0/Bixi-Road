import React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, MapPin, Eye } from "lucide-react";
import Link from "next/link";

export default function ProductCard({ product }) {
  const getCategoryColor = (category) => {
    const colors = {
      Gold: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Diamond: "bg-blue-100 text-blue-800 border-blue-200",
      Emerald: "bg-green-100 text-green-800 border-green-200",
      Ruby: "bg-red-100 text-red-800 border-red-200",
      Copper: "bg-orange-100 text-orange-800 border-orange-200",
      Lithium: "bg-purple-100 text-purple-800 border-purple-200"
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const imageUrl = product.image_urls?.[0] || 
    `https://images.unsplash.com/photo-1610375461246-83df859d849d?w=400&h=300&fit=crop`;

  return (
    <Link href={`/product-detail?id=${product.id}`}>
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#D4AF37] h-full">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.is_featured && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-[#D4AF37] text-[#1A1A1A] border-0 font-semibold">
                FEATURED
              </Badge>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className={`${getCategoryColor(product.category)} border font-semibold`}>
              {product.category}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6">
          <h3 className="font-bold text-xl text-[#1A1A1A] mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {product.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {product.description}
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Quantity</span>
              <span className="font-semibold text-[#1A1A1A]">
                {product.quantity} {product.unit}
              </span>
            </div>

            {product.purity_grade && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Purity/Grade</span>
                <span className="font-semibold text-[#1A1A1A]">{product.purity_grade}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{product.country}</span>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t">
              <Shield className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-semibold text-[#D4AF37]">VERIFIED SELLER</span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-1 text-gray-500">
                <Eye className="w-4 h-4" />
                <span className="text-xs">{product.views || 0} views</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#D4AF37]">
                  ${product.price_per_unit.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">per {product.unit}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}