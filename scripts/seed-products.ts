import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";

const USDC_DECIMALS = 1_000_000n;

async function main() {
  console.log("Starting seed...");

  const products = Array.from({ length: 50 }).map(() => {
    const priceInDollars = faker.number.int({ min: 1, max: 2 });
    const priceAtomic = BigInt(priceInDollars) * USDC_DECIMALS;
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      priceUsdc: priceAtomic.toString(), // Now using BigInt
      createdAt: new Date(),
      updatedAt: new Date(),
      soldUnits: faker.number.int({ min: 5, max: 1000 }),
      rating: faker.number.float({ min: 0, max: 5 }),
    };
  });

  await prisma.product.createMany({
    data: products.map((product) => ({
      ...product,
      priceUsdc: BigInt(product.priceUsdc),
    })),
  });

  const images = products.flatMap((product) => {
    const imageCount = faker.number.int({ min: 1, max: 3 });
    return Array.from({ length: imageCount }).map(() => ({
      id: faker.string.uuid(),
      productId: product.id,
      url: faker.image.urlPicsumPhotos({
        width: 256,
        height: 25,
      }),
      altText: product.name,
    }));
  });

  await prisma.productImage.createMany({
    data: images,
  });

  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
