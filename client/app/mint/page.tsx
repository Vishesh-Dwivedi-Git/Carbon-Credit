"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Mint Tokens</CardTitle>
          <CardDescription>Enter the number of tokens to mint and submit to mint them on the blockchain.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-sm font-medium">
                Number of Tokens to Mint
              </label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter number of tokens"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Minting..." : "Mint Tokens"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
