"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, BarChart3, DollarSign, Leaf, RefreshCcw, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [tradeRequests, setTradeRequests] = useState([])
  const [co2Reports, setCo2Reports] = useState([])
  const [dashboardData, setDashboardData] = useState({
    carbonTokens: 0,
    co2Emissions: 0,
    tokenValue: 0,
    tradeVolume: 0
  })

  const fetchDashboardData = async () => {
    try {
      const tradeRes = await fetch("http://localhost:5000/api/carbon/trade-requests", { credentials: "include" })
      const co2Res = await fetch("http://localhost:5000/api/carbon/co2-reports", { credentials: "include" })

      if (tradeRes.ok && co2Res.ok) {
        const tradeData = await tradeRes.json()
        const co2Data = await co2Res.json()

        setTradeRequests(tradeData.tradeRequests)
        setCo2Reports(co2Data.co2Reports)

        // Example calculations (adjust based on actual API response)
        setDashboardData({
          carbonTokens: tradeData.tradeRequests.length * 100, // Replace with actual logic
          co2Emissions: co2Data.co2Reports.reduce((sum, report) => sum + report.emissions, 0),
          tokenValue: 45.20, // Fetch if available
          tradeVolume: tradeData.tradeRequests.length * 50 // Example
        })
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchDashboardData().finally(() => setIsRefreshing(false))
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
        <MetricCard title="Carbon Tokens" value={dashboardData.carbonTokens} description="Available tokens" icon={<Leaf className="w-5 h-5 text-primary" />} trend={{ value: "+12%", positive: true }} />
        <MetricCard title="CO2 Emissions" value={dashboardData.co2Emissions} description="Tons this month" icon={<BarChart3 className="w-5 h-5 text-destructive" />} trend={{ value: "-8%", positive: true }} />
        <MetricCard title="Token Value" value={`$${dashboardData.tokenValue}`} description="Per token" icon={<DollarSign className="w-5 h-5 text-yellow-500" />} trend={{ value: "+5.2%", positive: true }} />
        <MetricCard title="Trade Volume" value={dashboardData.tradeVolume} description="Tokens this month" icon={<ShoppingCart className="w-5 h-5 text-blue-500" />} trend={{ value: "-2.1%", positive: false }} />
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
                {tradeRequests.length > 0 ? (
                  tradeRequests.map((trade, index) => (
                    <ActivityItem key={index} title={trade.requestType} description={`Requested by ${trade.requester.org_name}`} timestamp={new Date(trade.createdAt).toLocaleString()} status={trade.status} />
                  ))
                ) : (
                  <p>No trade requests found</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div className="space-y-4">
                {co2Reports.length > 0 ? (
                  co2Reports.map((report, index) => (
                    <ActivityItem key={index} title="CO2 Report" description={`Emissions: ${report.emissions} tons`} timestamp={new Date(report.createdAt).toLocaleString()} status={report.verificationStatus} />
                  ))
                ) : (
                  <p>No CO2 reports found</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({ title, value, description, icon, trend }) {
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

function ActivityItem({ title, description, timestamp, status }) {
  return (
    <div className="flex items-start p-4 border rounded-lg border-border">
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        <p className="mt-2 text-xs text-muted-foreground">{timestamp}</p>
      </div>
      <div>
        <span className={`text-xs px-2 py-1 rounded-full ${status === "pending" ? "bg-yellow-500/20 text-yellow-500" : status === "completed" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
    </div>
  )
}
