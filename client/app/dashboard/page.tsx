"use client"

import { useState, useEffect, ReactNode } from "react"
import { ArrowDown, ArrowUp, BarChart3, DollarSign, Leaf, RefreshCcw, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "react-hot-toast"

// MetricCard component definition
type MetricCardProps = {
  title: string
  value: string | number
  description: string
  icon: ReactNode
  trend: { value: string, positive: boolean }
}

function MetricCard({ title, value, description, icon, trend }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className={`flex items-center mt-2 text-xs ${trend.positive ? "text-green-600" : "text-red-600"}`}>
          {trend.positive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
          {trend.value}
        </div>
      </CardContent>
    </Card>
  )
}

// ActivityItem component definition
type ActivityItemProps = {
  title: string
  description: string
  timestamp: string
  status: string
}

function ActivityItem({ title, description, timestamp, status }: ActivityItemProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
        <div className="text-xs text-gray-400">{timestamp}</div>
      </div>
      <div className="text-xs font-medium px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">{status}</div>
    </div>
  )
}

type Co2Report = {
  emissions: number
  createdAt: string
  verificationStatus?: string
}

export default function DashboardPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  type TradeRequest = {
    requestType: string
    requester: { org_name: string }
    createdAt: string
    status: string
  }
  const [tradeRequests, setTradeRequests] = useState<TradeRequest[]>([])
  const [co2Reports, setCo2Reports] = useState<Co2Report[]>([])
  const [dashboardData, setDashboardData] = useState({
    carbonTokens: 0,
    co2Emissions: 0,
    tokenValue: 0,
    tradeVolume: 0
  })
  const [predictionMonth, setPredictionMonth] = useState("")
  const [predictionYear, setPredictionYear] = useState("")
  const [predictedEmission, setPredictedEmission] = useState<number | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)

  const fetchDashboardData = async () => {
    const loading = toast.loading("Fetching dashboard data...")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.dismiss(loading)
        return toast.error("No token found. Please log in again.")
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }

      const [tradeRes, co2Res, userProfileRes] = await Promise.all([
        fetch("https://carbon-credit-production.up.railway.app/api/carbon/trade-requests", { method: "GET", headers, credentials: "include" }),
        fetch("https://carbon-credit-production.up.railway.app/api/carbon/co2-reports", { method: "GET", headers, credentials: "include" }),
        fetch("https://carbon-credit-production.up.railway.app/api/user/user-profile", { method: "GET", headers, credentials: "include" }),
      ])

      if (tradeRes.ok && co2Res.ok && userProfileRes.ok) {
        const tradeData = await tradeRes.json()
        const co2Data = await co2Res.json()
        const userProfile = await userProfileRes.json()

        setTradeRequests(tradeData.tradeRequests)
        setCo2Reports(co2Data.co2Reports)

        setDashboardData({
          carbonTokens: userProfile.user?.CCtTokens || 0,
          co2Emissions: co2Data.co2Reports.reduce((sum: number, report: Co2Report) => sum + report.emissions, 0),
          tokenValue: 1,
          tradeVolume: tradeData.tradeRequests.length * 50,
        })

        toast.success("Dashboard data loaded successfully", { id: loading })
      } else {
        toast.error("Failed to fetch some dashboard data", { id: loading })
      }
    } catch (error) {
      toast.error("Error loading dashboard", { id: loading })
      console.error("Error:", error)
    }
  }

  const predictEmission = async () => {
    if (!predictionMonth || !predictionYear) {
      toast.error("Please enter both month and year")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      return toast.error("You must be logged in to use prediction")
    }

    const promise = fetch("http://127.0.0.1:8080/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        month: predictionMonth,
        year: parseInt(predictionYear)
      })
    }).then(res => {
      if (!res.ok) throw new Error("Prediction failed")
      return res.json()
    })

    toast.promise(promise, {
      loading: "Predicting emissions...",
      success: (data) => {
        const predicted = data.predicted_emission || data.emission || data
        setPredictedEmission(predicted)
        return `Predicted emission: ${predicted} tons CO2`
      },
      error: "Failed to get emission prediction"
    })
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
        <MetricCard title="Token Value" value={`CCT ${dashboardData.tokenValue}`} description="One CO-2 tonne emission" icon={<DollarSign className="w-5 h-5 text-yellow-500" />} trend={{ value: "+5.2%", positive: true }} />
        <MetricCard title="Trade Volume" value={dashboardData.tradeVolume} description="Tokens this month" icon={<ShoppingCart className="w-5 h-5 text-blue-500" />} trend={{ value: "-2.1%", positive: false }} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Get Your Emission Prediction</CardTitle>
          <CardDescription>Predict your CO2 emissions for a specific month and year</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="month">Month</Label>
                <Input id="month" value={predictionMonth} onChange={(e) => setPredictionMonth(e.target.value)} placeholder="Enter month" />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" min="2000" max="2100" value={predictionYear} onChange={(e) => setPredictionYear(e.target.value)} placeholder="Enter year" />
              </div>
            </div>
            <Button onClick={predictEmission} disabled={isPredicting}>
              {isPredicting ? "Predicting..." : "Get Prediction"}
            </Button>
            {predictedEmission !== null && (
              <div className="p-4 bg-secondary rounded-lg">
                <p className="text-sm font-medium">Predicted Emission:</p>
                <p className="text-lg font-bold">{predictedEmission} tons CO2</p>
                <p className="text-xs text-muted-foreground">For {predictionMonth}/{predictionYear}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
                    <ActivityItem key={index} title="CO2 Report" description={`Emissions: ${report.emissions} tons`} timestamp={new Date(report.createdAt).toLocaleString()} status={report.verificationStatus ?? "unknown"} />
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
