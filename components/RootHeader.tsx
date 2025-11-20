"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useCartStore from "@/store/cart-store";
import useUserStore from "@/store/user-store";
import { LayoutDashboard, ShoppingCartIcon, Shrimp } from "lucide-react";
import Link from "next/link";

export default function RootHeader() {
  const userStore = useUserStore();
  const cartStore = useCartStore();

  return (
    <div className="px-4 py-2 max-w-7xl mx-auto flex justify-between items-center">
      <Link href="/" className="font-semibold flex items-center gap-2">
        <Shrimp className="size-6 text-blue-500" />
        Merchant Inc.
      </Link>

      <div className="sm:block hidden w-full max-w-sm">
        <Input placeholder="Search products" />
      </div>

      <div className="flex items-center gap-2">
        {userStore.user == null && (
          <>
            <Button variant="link" size="sm" onClick={userStore.login}>
              Sign Up
            </Button>

            <Button variant="link" size="sm" onClick={userStore.login}>
              Login
            </Button>
          </>
        )}

        <Link href="/checkout">
          <Button variant="outline" size="sm" className="relative">
            <ShoppingCartIcon />
            {cartStore.items.length > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500 p-0 text-center text-xs font-bold leading-5 text-white ring-2 ring-background flex items-center justify-center">
                {cartStore.items.length}
              </span>
            )}
          </Button>
        </Link>

        {userStore.user != null && (
          <>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <LayoutDashboard />
              </Button>
            </Link>

            <Button variant="link" size="sm" onClick={userStore.logout}>
              <span>Logout</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
