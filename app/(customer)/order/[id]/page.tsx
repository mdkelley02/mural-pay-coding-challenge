import CartDetailsTable from "@/components/CartDetailsTable";
import CryptoCheckout from "@/components/CryptoCheckout";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { OrderDetails } from "@/types/types";
import { notFound } from "next/navigation";
export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order: OrderDetails | null = await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      payment: true,
      payout: true,
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
  });
  if (!order) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xs text-muted-foreground">
        Orders / Order Details
      </div>

      <div className="flex items-center justify-between">
        <span className="font-bold text-xl">#{order.id}</span>
        <OrderStatusBadge status={order.status} />
      </div>

      <Separator />

      <div className="space-y-8">
        <CartDetailsTable order={order} />
        <div className="flex items-center justify-end">
          <CryptoCheckout
            amountAtomic={order.totalAmount.toString()}
            orderId={order.id}
          />
        </div>
      </div>
    </div>
  );
}
