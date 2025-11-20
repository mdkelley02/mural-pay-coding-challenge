"use server";

import { prisma } from "@/lib/prisma";

export async function getProduct(id: string) {
  return await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      images: true,
    },
  });
}
