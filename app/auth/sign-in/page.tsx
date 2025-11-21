"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGuestCheckout = async () => {
    if (email.trim() === "") {
      toast.error("Please enter an email");
      return;
    }

    setLoading(true);
    const result = await signIn("credentials", {
      email,
      callbackUrl: "/",
    });
    setLoading(false);
    if (result?.error) {
      toast.error(`Failed to sign in as guest: ${result.error}`);
    }
  };

  const handleAdminLogin = async () => {
    setLoading(true);
    const result = await signIn("credentials", {
      email: "admin@merchantinc.com",
      password: "admin123",
      callbackUrl: "/dashboard",
    });
    setLoading(false);
    if (result?.error) {
      toast.error(`Failed to sign in as admin: ${result.error}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Welcome to Merchant Inc.</h1>

      {/* GUEST FLOW */}
      <div className="border p-4 rounded bg-gray-50">
        <label className="block text-sm mb-2">
          Enter email to track your orders
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className="border p-2 w-full mb-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          onClick={handleGuestCheckout}
          className="w-full py-2"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Continue as Guest"
          )}
        </Button>
      </div>

      <div className="relative flex py-2 items-center">
        <div className="grow border-t border-gray-300"></div>
        <span className="shrink mx-4 text-gray-400">OR</span>
        <div className="grow border-t border-gray-300"></div>
      </div>

      <Button onClick={handleAdminLogin} variant="link" disabled={loading}>
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Continue as Admin (Demo)"
        )}
      </Button>
    </div>
  );
}
