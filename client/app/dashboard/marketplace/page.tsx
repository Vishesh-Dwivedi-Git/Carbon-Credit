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

  const [tradeRequests_b, setTradeRequests] = useState([]);
  const [co2Reports, setCo2Reports] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    carbonTokens: 0,
    co2Emissions: 0,
    tokenValue: 0,
    tradeVolume: 0,
  });

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve JWT token from localStorage
      if (!token) {
        console.error("No token found");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Attach token
      };

      const [tradeRes, co2Res, userProfileRes] = await Promise.all([
        fetch("http://localhost:5000/api/carbon/trade-requests", {
          method: "GET",
          headers,
          credentials: "include",
        }),
        fetch("http://localhost:5000/api/carbon/co2-reports", {
          method: "GET",
          headers,
          credentials: "include",
        }),
        fetch("http://localhost:5000/api/user/user-profile", {
          method: "GET",
          headers,
          credentials: "include",
        }), // Fetch user profile
      ]);

      if (tradeRes.ok && co2Res.ok && userProfileRes.ok) {
        const tradeData = await tradeRes.json();
        const co2Data = await co2Res.json();
        const userProfile = await userProfileRes.json();

        setTradeRequests(tradeData.tradeRequests);
        setCo2Reports(co2Data.co2Reports);

        setDashboardData({
          carbonTokens: userProfile.user?.CCtTokens || 0, // Use CCtTokens from user profile
          co2Emissions: co2Data.co2Reports.reduce(
            (sum, report) => sum + report.emissions,
            0
          ),
          tokenValue: 1, // Fetch dynamically if available
          tradeVolume: tradeData.tradeRequests.length * 50, // Example
        });
      } else {
        console.error(
          "Failed to fetch data",
          tradeRes.status,
          co2Res.status,
          userProfileRes.status
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchTradeRequests();
  }, [fetchTradeRequests]);

  const { executeTrade } = useExecuteTradeStore();

  const handleMatchTrade = async (tradeId) => {
    try {
      await executeTrade({
        sellerId: tradeId, // Pass the trade ID
        sellerAddress: "", // Update with actual seller address if needed
        pricePerToken: 0, // Update with actual price if needed
        carbonTokenAmount: 0, // Update with actual amount if needed
      });

      toast({
        title: "Trade matched",
        description: `Successfully matched trade request #${tradeId}.`,
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
                      onMatch={() => handleMatchTrade(trade._id)}
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
