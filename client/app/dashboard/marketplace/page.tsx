"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Filter } from "lucide-react";
import {
  useTradeRequestStore,
  useExecuteTradeStore,
} from "../../../Store";
import SellTokenForm from "@/components/SellTokenForm";
import { usePublicClient, useSendTransaction } from "wagmi";

export default function MarketplacePage() {
  const { sendTransactionAsync } = useSendTransaction();
  const { executeTrade } = useExecuteTradeStore();
  const publicClient = usePublicClient(); 
  const { toast } = useToast();
  const [tradeRequests_b, setTradeRequests] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "No token found. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const tradeRes = await fetch("http://localhost:5000/api/carbon/trade-requests", {
        method: "GET",
        headers,
        credentials: "include",
      });

      if (tradeRes.ok) {
        const tradeData = await tradeRes.json();
        setTradeRequests(tradeData.tradeRequests);
      } else {
        toast({
          title: "Data Fetch Failed",
          description: "Failed to fetch trade requests from the server.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "An error occurred while fetching data.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMatchTrade = async (tradeId, sellerAddress, pricePerToken, carbonTokenAmount) => {
    if (isNaN(pricePerToken) || isNaN(carbonTokenAmount)) {
      toast({
        title: "Invalid Input",
        description: "Price per token or carbon token amount is invalid.",
        variant: "destructive",
      });
      return;
    }

    try {
      await executeTrade({
        sellerId: tradeId,
        sellerAddress,
        pricePerToken: parseFloat(pricePerToken),
        carbonTokenAmount: parseFloat(carbonTokenAmount),
        sendTransactionAsync,
        publicClient
      });

      toast({
        title: "Trade Matched",
        description: `Successfully matched trade request #${tradeId}.`,
      });
 fetchDashboardData();
    } catch (error) {
      toast({
        title: "Trade Match Failed",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Tabs defaultValue="buy">
            <TabsList className="mb-4">
              <TabsTrigger value="buy">Buy Tokens</TabsTrigger>
              <TabsTrigger value="sell">Sell Tokens</TabsTrigger>
            </TabsList>

            <TabsContent value="buy">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tradeRequests_b
                  .filter((req) => req.requestType === "SELL")
                  .map((trade) => (
                    <TradeRequestCard
                      key={trade._id}
                      id={trade._id}
                      orgName={trade.requester.org_name}
                      orgType={trade.requester.org_type}
                      tokenAmount={trade.carbonTokenAmount}
                      pricePerToken={trade.pricePerToken}
                      requestType={trade.requestType}
                      onMatch={() =>
                        handleMatchTrade(
                          trade.requester._id, // ✅ Correctly referencing _id
                          trade.requester.walletAddress, // ✅ Correctly referencing walletAddress
                          trade.pricePerToken,
                          trade.carbonTokenAmount
                        )
                      }
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="sell">
              <SellTokenForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function TradeRequestCard({
  id,
  orgName,
  orgType,
  tokenAmount,
  pricePerToken,
  requestType,
  onMatch,
}) {
  return (
    <Card className="carbon-card overflow-hidden">
      <div
        className={`h-2 ${
          requestType === "BUY" ? "bg-blue-500" : "bg-green-500"
        }`}
      ></div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{orgName}</CardTitle>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              requestType === "BUY"
                ? "bg-blue-500/20 text-blue-500"
                : "bg-green-500/20 text-green-500"
            }`}
          >
            {requestType}
          </span>
        </div>
        <CardDescription>{orgType}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Token Amount:</span>
            <span className="font-medium">{tokenAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Price Per Token:</span>
            <span className="font-medium">
              {pricePerToken.toFixed(8)} SepoliaETH
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Value:</span>
            <span className="font-medium">
              {(tokenAmount * pricePerToken).toLocaleString(undefined, {
                maximumFractionDigits: 8,
              })}{" "}
              SepoliaETH
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onMatch}>
          Match This Trade
        </Button>
      </CardFooter>
    </Card>
  );
}
