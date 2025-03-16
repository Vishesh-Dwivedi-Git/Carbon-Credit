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
import { ArrowDownUp, Filter, Search } from "lucide-react";
import {
  useTradeRequestStore,
  useCreateOrder,
  useExecuteTradeStore,
} from "../../../Store";
import SellTokenForm from "@/components/SellTokenForm";

export default function MarketplacePage() {
  const { toast } = useToast();
  const { tradeRequests, fetchTradeRequests } = useTradeRequestStore();
  const [activeTab, setActiveTab] = useState("buy");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTradeRequests();
  }, [fetchTradeRequests]);

  const { executeTrade } = useExecuteTradeStore();

  const handleMatchTrade = async (trade) => {
    try {
      await executeTrade({
        sellerId: trade.sellerId,
        sellerAddress: trade.sellerWalletAddress,
        pricePerToken: trade.pricePerToken,
        carbonTokenAmount: trade.tokenAmount,
      });

      toast({
        title: "Trade matched",
        description: `Successfully matched trade request #${trade.id}.`,
      });

      fetchTradeRequests(); // Refresh trade list after execution
    } catch (error) {
      console.error("Trade match failed:", error);
      toast({
        title: "Trade match failed",
        description: error.message || "An error occurred.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Carbon Marketplace</h1>
            <Button onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by organization name or type..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <ArrowDownUp className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>

          <Tabs defaultValue="buy" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="buy">Buy Tokens</TabsTrigger>
              <TabsTrigger value="sell">Sell Tokens</TabsTrigger>
            </TabsList>

            <TabsContent value="buy">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {tradeRequests
                  .filter((req) => req.requestType === "SELL")
                  .map((trade) => (
                    <TradeRequestCard
                      key={trade.id}
                      {...trade}
                      onMatch={() => handleMatchTrade(trade.id)}
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
}: {
  id: string;
  orgName: string;
  orgType: string;
  tokenAmount: number;
  pricePerToken: number;
  requestType: "BUY" | "SELL";
  onMatch: () => void;
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
            <span className="font-medium">${pricePerToken.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Value:</span>
            <span className="font-medium">
              $
              {(tokenAmount * pricePerToken).toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
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
