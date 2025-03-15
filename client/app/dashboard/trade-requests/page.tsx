"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Check, Clock, X } from "lucide-react"

export default function TradeRequestsPage() {
  const { toast } = useToast()

  const handleCancelRequest = (id: string) => {
    toast({
      title: "Trade request cancelled",
      description: `Trade request #${id} has been cancelled.`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Trade Requests</h1>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Requests</TabsTrigger>
          <TabsTrigger value="matched">Matched</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="space-y-6">
            <MyTradeRequestCard
              id="TR-2468"
              requestType="SELL"
              tokenAmount={200}
              pricePerToken={45.2}
              status="PENDING"
              createdAt="Apr 10, 2024"
              onCancel={() => handleCancelRequest("TR-2468")}
            />
            <MyTradeRequestCard
              id="TR-1357"
              requestType="BUY"
              tokenAmount={350}
              pricePerToken={42.75}
              status="PENDING"
              createdAt="Apr 8, 2024"
              onCancel={() => handleCancelRequest("TR-1357")}
            />
          </div>
        </TabsContent>

        <TabsContent value="matched">
          <div className="space-y-6">
            <MyTradeRequestCard
              id="TR-9753"
              requestType="SELL"
              tokenAmount={150}
              pricePerToken={43.5}
              status="MATCHED"
              createdAt="Apr 5, 2024"
              matchedWith="PetroChem Industries"
              matchedAt="Apr 7, 2024"
            />
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-6">
            <MyTradeRequestCard
              id="TR-8642"
              requestType="BUY"
              tokenAmount={300}
              pricePerToken={41.25}
              status="COMPLETED"
              createdAt="Mar 28, 2024"
              matchedWith="EcoEnergy Solutions"
              matchedAt="Mar 30, 2024"
              completedAt="Apr 2, 2024"
            />
            <MyTradeRequestCard
              id="TR-7531"
              requestType="SELL"
              tokenAmount={250}
              pricePerToken={40.8}
              status="COMPLETED"
              createdAt="Mar 20, 2024"
              matchedWith="SteelWorks Manufacturing"
              matchedAt="Mar 22, 2024"
              completedAt="Mar 25, 2024"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MyTradeRequestCard({
  id,
  requestType,
  tokenAmount,
  pricePerToken,
  status,
  createdAt,
  matchedWith,
  matchedAt,
  completedAt,
  onCancel,
}: {
  id: string
  requestType: "BUY" | "SELL"
  tokenAmount: number
  pricePerToken: number
  status: "PENDING" | "MATCHED" | "COMPLETED" | "CANCELLED"
  createdAt: string
  matchedWith?: string
  matchedAt?: string
  completedAt?: string
  onCancel?: () => void
}) {
  return (
    <Card className="carbon-card overflow-hidden">
      <div className={`h-2 ${requestType === "BUY" ? "bg-blue-500" : "bg-green-500"}`}></div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Trade Request {id}</CardTitle>
          <Badge
            variant={
              status === "PENDING"
                ? "outline"
                : status === "MATCHED"
                  ? "secondary"
                  : status === "COMPLETED"
                    ? "default"
                    : "destructive"
            }
          >
            {status}
          </Badge>
        </div>
        <CardDescription>Created on {createdAt}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Request Type:</span>
            <Badge variant={requestType === "BUY" ? "secondary" : "default"}>{requestType}</Badge>
          </div>

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

          {matchedWith && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Matched With:</span>
              <span className="font-medium">{matchedWith}</span>
            </div>
          )}

          {matchedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Matched On:</span>
              <span className="font-medium">{matchedAt}</span>
            </div>
          )}

          {completedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Completed On:</span>
              <span className="font-medium">{completedAt}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {status === "PENDING" && onCancel && (
          <Button variant="destructive" className="w-full" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel Request
          </Button>
        )}

        {status === "MATCHED" && (
          <Button className="w-full">
            <Check className="h-4 w-4 mr-2" />
            Complete Transaction
          </Button>
        )}

        {status === "COMPLETED" && (
          <Button variant="outline" className="w-full" disabled>
            <Clock className="h-4 w-4 mr-2" />
            Transaction Completed
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

