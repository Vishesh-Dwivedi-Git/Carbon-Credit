"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAccount, useWriteContract } from "wagmi";
import { Chain, Client, parseUnits, Transport } from "viem";
import axios from "axios";



const CCT_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_CCT;
const TRADING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TRADING;


const CCT_TOKEN_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function createOrder({ requestType, carbonTokenAmount, pricePerToken, writeContractAsync }) {
  try {

    
    if (requestType === "SELL") {
      // Step 1: Initiate the approval transaction
      await writeContractAsync({
        address: CCT_TOKEN_ADDRESS,
        abi: CCT_TOKEN_ABI,
        functionName: "approve",
        args: [TRADING_CONTRACT_ADDRESS, parseUnits(carbonTokenAmount.toString(), 18)],
      });
    
    }
    
    // Step 3: Only proceed with the API call if approval was successful
    console.log(requestType, carbonTokenAmount, pricePerToken);
    const resp=await axios.post("http://localhost:5000/api/carbon/trade-request", { 
      requestType, 
      carbonTokenAmount, 
      pricePerToken,
    });
    
    console.log("Trade request created:", resp.data);
    return resp.data;
  } catch (error) {
    console.error("Trade request failed:", error);
    throw error;
  }
}
// Helper function to wait for transaction with timeout and retry

function SellTokenForm() {
  const { toast } = useToast();
  const { address } = useAccount(); // Get the seller's wallet address
  const { writeContractAsync } = useWriteContract();

  const [tokenAmount, setTokenAmount] = useState("");
  const [pricePerToken, setPricePerToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const client=process.env.NEXT_PUBLIC_CLIENT;

  const handleSell = async () => {
    if (!tokenAmount || !pricePerToken) {
      toast({ title: "Error", description: "Please fill all fields." });
      return;
    }

    if (!address) {
      toast({ title: "Error", description: "Wallet not connected." });
      return;
    }

    try {
      setIsLoading(true);
      console.log("Calling createOrder...");

      await createOrder({
        requestType: "SELL",
        carbonTokenAmount: parseFloat(tokenAmount),
        pricePerToken: parseFloat(pricePerToken),
        writeContractAsync, // ✅ Passing the writeContractAsync function,
        
      });

      toast({ title: "Success", description: "Trade request created successfully." });
      setTokenAmount("");
      setPricePerToken("");
    } catch (error) {
      toast({ title: "Error", description: "Trade request failed." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg bg-black shadow-md">
      <h2 className="text-xl font-bold mb-4">Sell Carbon Tokens</h2>
      <div className="space-y-4">
        <Input
          type="number"
          placeholder="Token Amount"
          value={tokenAmount}
          onChange={(e) => setTokenAmount(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Price Per Token"
          value={pricePerToken}
          onChange={(e) => setPricePerToken(e.target.value)}
        />
        <Button onClick={handleSell} disabled={isLoading}>
          {isLoading ? "Processing..." : "Sell Tokens"}
        </Button>
      </div>
    </div>
  );
}

export default SellTokenForm;
