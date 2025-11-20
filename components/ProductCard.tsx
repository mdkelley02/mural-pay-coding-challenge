"use client";

import { Product, ProductImage } from "@/lib/generated/prisma";
import { formatRating, formatUSDC } from "@/lib/utils";
import { Star } from "lucide-react";
import Link from "next/link";

export default function ProductCard({
  product,
}: {
  product: Product & { images: ProductImage[] };
}) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="rounded-lg overflow-hidden border">
        <img
          src={product.images[0].url}
          alt="Product Image"
          className="w-full h-64 object-cover"
        />
        <div className="p-4">
          <div>{product.name}</div>
          <div className="flex items-center gap-1 text-xs">
            <Star className="size-3 text-yellow-500" />
            <span>{formatRating(product.rating)}</span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              {product.soldUnits}+ sold
            </span>
          </div>
          <div className="text-lg font-bold">
            {formatUSDC(product.priceUsdc)}
          </div>
        </div>
      </div>
    </Link>
  );
}
