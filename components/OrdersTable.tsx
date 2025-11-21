"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/lib/generated/prisma";
import { formatUSDC } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow
            key={order.id}
            onClick={() => router.push(`/order/${order.id}`)}
            className="cursor-pointer"
          >
            <TableCell>{order.id}</TableCell>
            <TableCell>
              {order.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </TableCell>
            <TableCell>
              {formatUSDC(order.totalAmountUsdc.toString())} USDC
            </TableCell>
            <TableCell>
              <Badge variant="outline">{order.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
