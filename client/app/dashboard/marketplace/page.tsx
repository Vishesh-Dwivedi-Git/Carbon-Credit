"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ArrowDownUp, Filter, Search } from "lucide-react"

export default function MarketplacePage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("buy")
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const handleCreateTradeRequest = () => {
    toast({
      title: "Trade request created",
      description: "Your trade request has been submitted successfully.",
    })
  }

  const handleMatchTrade = (id: string) => {
    toast({
      title: "Trade matched",
      description: `You have successfully matched trade request #${id}.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Carbon Marketplace</h1>
        <Button onClick={() => setShowFilters(!showFilters)}>
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by organization name or type..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <ArrowDownUp className="w-4 h-4 mr-2" />
          Sort
        </Button>
      </div>

      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Price Range</Label>
                <div className="flex items-center space-x-2">
                  <Input type="number" placeholder="Min" />
                  <span>to</span>
                  <Input type="number" placeholder="Max" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Organization Type</Label>
                <RadioGroup defaultValue="all">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="renewable" id="renewable" />
                    <Label htmlFor="renewable">Renewable Energy</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="oil-gas" id="oil-gas" />
                    <Label htmlFor="oil-gas">Oil & Gas</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Token Amount</Label>
                <div className="flex items-center space-x-2">
                  <Input type="number" placeholder="Min" />
                  <span>to</span>
                  <Input type="number" placeholder="Max" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="buy" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="buy">Token Marketplace</TabsTrigger>
          <TabsTrigger value="create">Create Request</TabsTrigger>
        </TabsList>

        <TabsContent value="buy">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <TradeRequestCard
              id="TR-3456"
              orgName="PetroChem Industries"
              orgType="Oil & Gas"
              tokenAmount={800}
              pricePerToken={45.2}
              requestType="BUY"
              onMatch={() => handleMatchTrade("TR-3456")}
            />
            <TradeRequestCard
              id="TR-7890"
              orgName="SteelWorks Manufacturing"
              orgType="Steel & Cement"
              tokenAmount={650}
              pricePerToken={44.3}
              requestType="BUY"
              onMatch={() => handleMatchTrade("TR-7890")}
            />
            <TradeRequestCard
              id="TR-1357"
              orgName="AirFleet Logistics"
              orgType="Aviation & Shipping"
              tokenAmount={450}
              pricePerToken={46.75}
              requestType="BUY"
              onMatch={() => handleMatchTrade("TR-1357")}
            />
            <TradeRequestCard
              id="TR-1234"
              orgName="EcoEnergy Solutions"
              orgType="Renewable Energy"
              tokenAmount={500}
              pricePerToken={42.5}
              requestType="SELL"
              onMatch={() => handleMatchTrade("TR-1234")}
            />
            <TradeRequestCard
              id="TR-5678"
              orgName="GreenTech Industries"
              orgType="Recycling & Waste Management"
              tokenAmount={350}
              pricePerToken={40.75}
              requestType="SELL"
              onMatch={() => handleMatchTrade("TR-5678")}
            />
            <TradeRequestCard
              id="TR-9012"
              orgName="SustainableFuture Corp"
              orgType="NGO"
              tokenAmount={200}
              pricePerToken={38.9}
              requestType="SELL"
              onMatch={() => handleMatchTrade("TR-9012")}
            />
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Trade Request</CardTitle>
              <CardDescription>Create a new request to buy or sell carbon tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Request Type</Label>
                  <RadioGroup defaultValue="buy">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="buy" id="request-buy" />
                      <Label htmlFor="request-buy">Buy Tokens</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sell" id="request-sell" />
                      <Label htmlFor="request-sell">Sell Tokens</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token-amount">Token Amount</Label>
                  <Input id="token-amount" type="number" placeholder="Enter amount of tokens" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price-per-token">Price Per Token ($)</Label>
                  <Input id="price-per-token" type="number" step="0.01" placeholder="Enter price per token" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateTradeRequest}>Create Trade Request</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
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
  id: string
  orgName: string
  orgType: string
  tokenAmount: number
  pricePerToken: number
  requestType: "BUY" | "SELL"
  onMatch: () => void
}) {
  return (
    <Card className="overflow-hidden carbon-card">
      <div className={`h-2 ${requestType === "BUY" ? "bg-blue-500" : "bg-green-500"}`}></div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{orgName}</CardTitle>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              requestType === "BUY" ? "bg-blue-500/20 text-blue-500" : "bg-green-500/20 text-green-500"
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
              ${(tokenAmount * pricePerToken).toLocaleString(undefined, { maximumFractionDigits: 2 })}
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
  )
}

