"use client";

import { Badge, badgeVariants } from "@/components/ui/badge";
import { Order } from "@/lib/generated/prisma";
import { VariantProps } from "class-variance-authority";

export default function OrderStatusBadge({ status }: { status: string }) {
  return <Badge variant={getVariant(status)}>{status}</Badge>;
}

function getVariant(
  status: Order["status"]
): VariantProps<typeof badgeVariants>["variant"] {
  switch (status) {
    case "PENDING":
      return "outline";
    case "PARTIALLY_PAID":
      return "destructive";
    case "PAID":
      return "default";
    case "FULFILLED":
      return "default";
    default:
      return "outline";
  }
}
