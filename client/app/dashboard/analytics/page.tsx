"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard title="Total Carbon Tokens" value="12,500" change="+15%" trend="up" />
        <MetricCard title="CO2 Emissions Reduced" value="850 tons" change="-8%" trend="down" />
        <MetricCard title="Trade Volume" value="$1.2M" change="+22%" trend="up" />
      </div>

      <Tabs defaultValue="emissions">
        <TabsList className="mb-4">
          <TabsTrigger value="emissions">Emissions</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
        </TabsList>
        <TabsContent value="emissions">
          <Card>
            <CardHeader>
              <CardTitle>CO2 Emissions Over Time</CardTitle>
              <CardDescription>Your organization&apos;s carbon footprint</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <LineChart className="h-16 w-16 text-muted-foreground" />
              <p className="ml-4 text-muted-foreground">Emissions chart will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trades">
          <Card>
            <CardHeader>
              <CardTitle>Trade Activity</CardTitle>
              <CardDescription>Buy and sell transactions</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <BarChart className="h-16 w-16 text-muted-foreground" />
              <p className="ml-4 text-muted-foreground">Trade activity chart will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tokens">
          <Card>
            <CardHeader>
              <CardTitle>Token Distribution</CardTitle>
              <CardDescription>Allocation of your carbon tokens</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <PieChart className="h-16 w-16 text-muted-foreground" />
              <p className="ml-4 text-muted-foreground">Token distribution chart will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  trend,
}: { title: string; value: string; change: string; trend: "up" | "down" }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className={`h-4 w-4 ${trend === "up" ? "text-green-500" : "text-red-500"}`}
        >
          {trend === "up" ? <path d="M7 17l5-5 5 5M7 7l5 5 5-5" /> : <path d="M7 7l5 5 5-5M7 17l5-5 5 5" />}
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${trend === "up" ? "text-green-500" : "text-red-500"}`}>{change} from last period</p>
      </CardContent>
    </Card>
  )
}

