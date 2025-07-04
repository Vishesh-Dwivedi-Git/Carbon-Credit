"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Building2 } from "lucide-react";

export default function MintPage() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid positive number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://carbon-credit-production.up.railway.app/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Tokens Minted",
          description: `${amount} tokens successfully minted.`,
        });
        setAmount(""); // Clear input
      } else {
        toast({
          title: "Minting Failed",
          description: data.message || "An error occurred during minting.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Minting error:", err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Government Header Section */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-green-500" />
          <h1 className="text-3xl font-bold text-white">Government Regulatory Portal</h1>
        </div>
        <p className="text-green-400/70 text-lg max-w-2xl mx-auto">
          Authorized portal for government officials to mint and manage carbon credit tokens on the CarbonChain blockchain in compliance with global sustainability standards.
        </p>
      </div>

      {/* Minting Card */}
      <Card className="mb-8 border-green-700/50 bg-black/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-green-500" />
            Mint Carbon Credit Tokens
          </CardTitle>
          <CardDescription className="text-green-400/70">
            Mint new carbon credit tokens for authorized distribution within the CarbonChain ecosystem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium text-white">
                Number of Carbon Credit Tokens to Mint
              </label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter number of tokens"
                required
                disabled={loading}
                className="border-green-600/50 bg-black/40 text-white placeholder-green-400/50"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white"
            >
              {loading ? "Minting..." : "Mint Tokens"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="text-center text-green-400/70 text-sm">
        <p>
          All minting actions are logged and audited on-chain for transparency and regulatory compliance.
        </p>
        <p className="mt-2">
          For assistance, contact{" "}
          <a href="mailto:regulatory@carbonchain.org" className="underline hover:text-green-300">
            regulatory@carbonchain.org
          </a>.
        </p>
      </div>
    </div>
  );
}
