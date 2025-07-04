"use client"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useExecuteTradeStore,
} from "../../../Store";
import SellTokenForm from "@/components/SellTokenForm";
import { usePublicClient, useSendTransaction } from "wagmi";
import toast from "react-hot-toast";

export default function MarketplacePage() {
  const { sendTransactionAsync } = useSendTransaction();
  const { executeTrade } = useExecuteTradeStore();
  const publicClient = usePublicClient();

  interface TradeRequest {
    _id: string;
    requester: {
      _id: string;
      org_name: string;
      org_type: string;
      walletAddress: string;
    };
    carbonTokenAmount: number;
    pricePerToken: number;
    requestType: string;
  }

  const [tradeRequests_b, setTradeRequests] = useState<TradeRequest[]>([]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const tradeRes = await fetch("https://carbon-credit-production.up.railway.app/api/carbon/trade-requests", {
        method: "GET",
        headers,
        credentials: "include",
      });

      if (tradeRes.ok) {
        const tradeData = await tradeRes.json();
        setTradeRequests(tradeData.tradeRequests);
      } else {
        toast.error("Failed to fetch trade requests from the server.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMatchTrade = async (
    tradeId: string,
    sellerAddress: string,
    pricePerToken: number | string,
    carbonTokenAmount: number | string
  ): Promise<void> => {
    if (isNaN(Number(pricePerToken)) || isNaN(Number(carbonTokenAmount))) {
      toast.error("Price per token or carbon token amount is invalid.");
      return;
    }

    try {
      await executeTrade({
        sellerId: tradeId,
        sellerAddress,
        pricePerToken: parseFloat(pricePerToken as string),
        carbonTokenAmount: parseFloat(carbonTokenAmount as string),
        sendTransactionAsync,
        publicClient,
      });

      toast.success(`Successfully matched trade request #${tradeId}`);
      fetchDashboardData();
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
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
                          trade.requester._id,
                          trade.requester.walletAddress,
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

interface TradeRequestCardProps {
  id: string;
  orgName: string;
  orgType: string;
  tokenAmount: number;
  pricePerToken: number;
  requestType: string;
  onMatch: () => void;
}

function TradeRequestCard({
  id,
  orgName,
  orgType,
  tokenAmount,
  pricePerToken,
  requestType,
  onMatch,
}: TradeRequestCardProps) {
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
