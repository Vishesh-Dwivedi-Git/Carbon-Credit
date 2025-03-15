"use client"

import type React from "react"
import dynamic from "next/dynamic";
import { useState } from "react"
import { ArrowDown, ArrowUp, BarChart3, DollarSign, Leaf, LineChart, RefreshCcw, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
const Wallet = dynamic(() => import('@/components/Wallet'), { ssr: false });

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Carbon Tokens"
          value="1,250"
          description="Available tokens"
          icon={<Leaf className="w-5 h-5 text-primary" />}
          trend={{ value: "+12%", positive: true }}
        />
        <MetricCard
          title="CO2 Emissions"
          value="850"
          description="Tons this month"
          icon={<BarChart3 className="w-5 h-5 text-destructive" />}
          trend={{ value: "-8%", positive: true }}
        />
        <MetricCard
          title="Token Value"
          value="$45.20"
          description="Per token"
          icon={<DollarSign className="w-5 h-5 text-yellow-500" />}
          trend={{ value: "+5.2%", positive: true }}
        />
        <MetricCard
          title="Trade Volume"
          value="3,450"
          description="Tokens this month"
          icon={<ShoppingCart className="w-5 h-5 text-blue-500" />}
          trend={{ value: "-2.1%", positive: false }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Emissions Overview</CardTitle>
            <CardDescription>Your CO2 emissions over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <LineChart className="w-16 h-16 text-muted-foreground" />
              <p className="ml-4 text-muted-foreground">Emissions chart will appear here</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Allocation</CardTitle>
            <CardDescription>How your tokens are being used</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Available</span>
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Used for Emissions</span>
                  <span className="text-sm text-muted-foreground">25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending Trades</span>
                  <span className="text-sm text-muted-foreground">10%</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest transactions and reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trades">
            <TabsList className="mb-4">
              <TabsTrigger value="trades">Trade Requests</TabsTrigger>
              <TabsTrigger value="reports">CO2 Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="trades">
              <div className="space-y-4">
                <ActivityItem
                  title="Sell Request Created"
                  description="You created a sell request for 200 tokens at $45.20 each"
                  timestamp="2 hours ago"
                  status="pending"
                />
                <ActivityItem
                  title="Buy Request Matched"
                  description="Your buy request for 150 tokens was matched with Renewable Co."
                  timestamp="Yesterday"
                  status="completed"
                />
                <ActivityItem
                  title="Tokens Received"
                  description="You received 500 new carbon tokens from the government"
                  timestamp="3 days ago"
                  status="completed"
                />
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div className="space-y-4">
                <ActivityItem
                  title="March CO2 Report Submitted"
                  description="You submitted a report of 850 tons of CO2 emissions"
                  timestamp="1 day ago"
                  status="pending"
                />
                <ActivityItem
                  title="February CO2 Report Verified"
                  description="Your report of 920 tons was verified and 920 tokens were burned"
                  timestamp="2 weeks ago"
                  status="completed"
                />
                <ActivityItem
                  title="January CO2 Report Verified"
                  description="Your report of 1050 tons was verified and 1050 tokens were burned"
                  timestamp="1 month ago"
                  status="completed"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>ETH Wallet</CardTitle>
          <CardDescription>Manage your Ethereum wallet and transfers</CardDescription>
        </CardHeader>
        <CardContent>
          <Wallet />
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend: { value: string; positive: boolean }
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="mt-1 text-2xl font-bold">{value}</h3>
          </div>
          <div className="p-2 rounded-full bg-secondary">{icon}</div>
        </div>
        <div className="flex items-center mt-4">
          <div className={`flex items-center text-sm ${trend.positive ? "text-green-500" : "text-red-500"}`}>
            {trend.positive ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            {trend.value}
          </div>
          <span className="ml-2 text-sm text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function ActivityItem({
  title,
  description,
  timestamp,
  status,
}: {
  title: string
  description: string
  timestamp: string
  status: "pending" | "completed" | "failed"
}) {
  return (
    <div className="flex items-start p-4 border rounded-lg border-border">
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <p className="mt-2 text-xs text-muted-foreground">{timestamp}</p>
      </div>
      <div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            status === "pending"
              ? "bg-yellow-500/20 text-yellow-500"
              : status === "completed"
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  )
}

