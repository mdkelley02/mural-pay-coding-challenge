"use server";

import { prisma } from "@/lib/prisma";

export async function getOrders() {
  return await prisma.order.findMany({
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
}
