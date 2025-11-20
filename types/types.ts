import {
  Order,
  OrderItem,
  Product as PrismaProduct,
  ProductImage,
} from "@/lib/generated/prisma";

export type Product = PrismaProduct & { images: ProductImage[] };

export type CartItem = {
  quantity: number;
  product: Product;
};

export type CreateOrderPayload = {
  customerEmail: string;
  customerWalletAddress: string;
  items: {
    quantity: number;
    productId: string;
  }[];
};

export type CreateOrderResponse = {
  orderId: string;
};

export type OrderDetails =
  | (Order & { items: (OrderItem & { product: Product })[] })
  | null;
