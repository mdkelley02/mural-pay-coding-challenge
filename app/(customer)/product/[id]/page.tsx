import ProductActions from "@/components/ProductActions";
import { prisma } from "@/lib/prisma";
import { cn, formatRating, formatUSDC } from "@/lib/utils";
import { Star } from "lucide-react";
import { notFound } from "next/navigation";
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      images: true,
    },
  });
  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xs text-muted-foreground">
        Products / {product.name}
      </div>

      <div className="flex gap-8">
        <div className="flex gap-4 h-96 w-1/2">
          <div className="flex flex-col gap-2">
            {product.images.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt={product.name}
                className={cn(
                  "size-24 object-cover rounded-md cursor-pointer",
                  image === product.images[0] ? "border-2 border-primary" : ""
                )}
              />
            ))}
          </div>

          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full object-cover rounded-md h-full object-fit max-w-96"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2 w-1/4">
          <div className="text-2xl">{product.name}</div>

          <div className="flex items-center gap-1 text-xs">
            <div>{product.soldUnits} Sold</div>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-1">
              <Star className="size-3 text-yellow-500" />
              <span>{formatRating(product.rating)}</span>
            </div>
          </div>

          <div className="text-xl font-bold">
            {formatUSDC(product.priceUsdc)}
          </div>

          <ProductActions product={product} />
        </div>
      </div>
    </div>
  );
}
