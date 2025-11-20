"use server";

import { prisma } from "@/lib/prisma";

export async function getProducts(params?: {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}) {
  const { page, limit, search, category } = params ?? {};
  return await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: limit ?? 20,
    skip: (page ?? 1) * (limit ?? 20),
    include: {
      images: true,
    },
  });
}
