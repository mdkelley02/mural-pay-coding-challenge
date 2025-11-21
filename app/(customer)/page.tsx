import OrdersTable from "@/components/OrdersTable";
import ProductCard from "@/components/ProductCard";
import ProductHero from "@/components/ProductHero";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  const products = await prisma.product.findMany({
    include: {
      images: true,
    },
  });

  const orders = await prisma.order.findMany({
    where: {
      userId: session?.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <div className="space-y-4">
      <ProductHero />

      <div className="space-y-4">
        <div className="text-xl font-bold">Orders</div>
        <OrdersTable orders={orders} />
      </div>

      <div className="space-y-4">
        <div className="text-xl font-bold">Products</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
