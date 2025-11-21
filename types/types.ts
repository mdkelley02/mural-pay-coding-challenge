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

export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
};
