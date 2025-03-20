"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Building2 } from "lucide-react"; // Adding icons for government theme

export default function MintPage() {
  const [amount, setAmount] = useState(""); // Amount of tokens to be minted
  const [loading, setLoading] = useState(false); // Loading state for form submission
  const [error, setError] = useState<string | null>(null); // To store error messages
  const { toast } = useToast(); // Toast for showing success/error messages

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate the input
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid positive number.");
      return;
    }

    try {
      setLoading(true);
      setError(null); // Clear previous error

      // Make the API call to mint the tokens
      const response = await fetch("http://localhost:5000/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify({ amount }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success case
        toast({
          title: "Tokens Minted",
          description: `${amount} tokens have been successfully minted.`,
          variant: "success",
        });
      } else {
        // Error case
        toast({
          title: "Minting Failed",
          description: data.message || "An error occurred while minting tokens.",
          variant: "destructive",
        });
      }
    } catch (err) {
      // Catching network or other errors
      setError("An error occurred. Please try again.");
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Government Header Section */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-green-500" />
          <h1 className="text-3xl font-bold text-white">
            Government Regulatory Portal
          </h1>
        </div>
        <p className="text-green-400/70 text-lg max-w-2xl mx-auto">
          Authorized portal for government officials to manage and mint carbon credit tokens on the CarbonChain blockchain, ensuring compliance with global sustainability standards.
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
            As a government regulator, mint new carbon credit tokens to allocate to industries or initiatives under the CarbonChain ecosystem.
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

      {/* Additional Information Section */}
      <div className="text-center text-green-400/70 text-sm">
        <p>
          All minting actions are logged and audited on the blockchain for transparency and compliance with international carbon regulations.
        </p>
        <p className="mt-2">
          For assistance, contact the CarbonChain Regulatory Support Team at{" "}
          <a href="mailto:regulatory@carbonchain.org" className="underline hover:text-green-300">
            regulatory@carbonchain.org
          </a>.
        </p>
      </div>
    </div>
  );
}