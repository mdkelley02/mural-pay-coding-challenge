"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatUSDC } from "@/lib/utils";
import { OrderDetails } from "@/types/types";

export default function CartDetailsTable({
  order,
}: {
  order: OrderDetails | null;
}) {
  if (!order) {
    return null;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {order.items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.product.name}</TableCell>
            <TableCell>{formatUSDC(item.priceUsdc)}</TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell>
              {formatUSDC(Number(item.priceUsdc) * item.quantity)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">
            {formatUSDC(order.totalAmountUsdc.toString())}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
