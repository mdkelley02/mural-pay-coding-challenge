"use client";

import { setTxHash } from "@/app/actions/set-tx-hash";
import { Button } from "@/components/ui/button";
import { MURAL_PAY_CONFIG } from "@/config/mural-pay";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { parseAbi } from "viem"; // We still need this to create the "Menu"
import {
  useAccount,
  useConnect,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { polygonAmoy } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const USDC_ABI = parseAbi([
  "function transfer(address to, uint256 amount) returns (bool)",
]);

export default function CryptoCheckout({
  amountAtomic,
  orderId,
}: {
  amountAtomic: string;
  orderId: string;
}) {
  const router = useRouter();
  const { isConnected, chainId } = useAccount();
  const { connect } = useConnect();
  const { switchChain } = useSwitchChain();
  const { data: hash, writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (!isSuccess || !hash) {
      return;
    }

    setTxHash(orderId, hash);
    router.refresh();
  }, [isSuccess, hash, orderId, router]);

  useEffect(() => {
    if (!error) {
      return;
    }
    toast.error(error.message.split(".")[0] ?? "Something went wrong");
  }, [error, router]);

  const handlePay = () => {
    if (chainId !== polygonAmoy.id) {
      switchChain({ chainId: polygonAmoy.id });
      return;
    }

    writeContract({
      address: MURAL_PAY_CONFIG.usdcContractAddress,
      abi: USDC_ABI,
      functionName: "transfer",
      args: [MURAL_PAY_CONFIG.accountWalletAddress, BigInt(amountAtomic)],
    });
  };

  if (!isConnected) {
    return (
      <Button
        className="bg-black text-white px-4 py-2 rounded"
        onClick={() => connect({ connector: injected() })}
      >
        Connect Wallet
      </Button>
    );
  }

  if (isSuccess) {
    return (
      <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded">
        <p className="font-bold">Payment Sent!</p>
        <p className="text-sm">Waiting for confirmation...</p>
      </div>
    );
  }

  return (
    <Button disabled={isPending || isConfirming} onClick={handlePay}>
      {isPending
        ? "Check Wallet..."
        : isConfirming
        ? "Processing..."
        : "Pay Now"}
    </Button>
  );
}
