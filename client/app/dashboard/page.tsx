"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, BarChart3, DollarSign, Leaf, RefreshCcw, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  const [predictionMonth, setPredictionMonth] = useState("")
  const [predictionYear, setPredictionYear] = useState("")
  const [predictedEmission, setPredictedEmission] = useState(null)
  const [isPredicting, setIsPredicting] = useState(false)

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No token found")
        return
      }
  
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
  
      const [tradeRes, co2Res, userProfileRes] = await Promise.all([
        fetch("http://localhost:5000/api/carbon/trade-requests", { method: "GET", headers, credentials: "include" }),
        fetch("http://localhost:5000/api/carbon/co2-reports", { method: "GET", headers, credentials: "include" }),
        fetch("http://localhost:5000/api/user/user-profile", { method: "GET", headers, credentials: "include" }),
      ])
  
      if (tradeRes.ok && co2Res.ok && userProfileRes.ok) {
        const tradeData = await tradeRes.json()
        const co2Data = await co2Res.json()
        const userProfile = await userProfileRes.json()
  
        setTradeRequests(tradeData.tradeRequests)
        setCo2Reports(co2Data.co2Reports)
  
        setDashboardData({
          carbonTokens: userProfile.user?.CCtTokens || 0,
          co2Emissions: co2Data.co2Reports.reduce((sum, report) => sum + report.emissions, 0),
          tokenValue: 1,
          tradeVolume: tradeData.tradeRequests.length * 50,
        })
      } else {
        console.error("Failed to fetch data", tradeRes.status, co2Res.status, userProfileRes.status)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const predictEmission = async () => {
    if (!predictionMonth || !predictionYear) {
      alert("Please enter both month and year")
      return
    }

    setIsPredicting(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://127.0.0.1:8080/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          month: predictionMonth,
          year: parseInt(predictionYear)
        })
      })

      if (response.ok) {
        const data = await response.json()
        setPredictedEmission(data.predicted_emission || data.emission || data) // Adjust based on your API response structure
      } else {
        console.error("Failed to fetch prediction", response.status)
        alert("Failed to get emission prediction")
      }
    } catch (error) {
      console.error("Error predicting emission:", error)
      alert("Error occurred while predicting emission")
    } finally {
      setIsPredicting(false)
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
        <MetricCard title="Token Value" value={`CCT ${dashboardData.tokenValue}`} description="One CO-2 tonne emmision" icon={<DollarSign className="w-5 h-5 text-yellow-500" />} trend={{ value: "+5.2%", positive: true }} />
        <MetricCard title="Trade Volume" value={dashboardData.tradeVolume} description="Tokens this month" icon={<ShoppingCart className="w-5 h-5 text-blue-500" />} trend={{ value: "-2.1%", positive: false }} />
      </div>

      {/* New Emission Prediction Section */}
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
                <Input
                  id="month"
                  value={predictionMonth}
                  onChange={(e) => setPredictionMonth(e.target.value)}
                  placeholder="Enter month"
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min="2000"
                  max="2100"
                  value={predictionYear}
                  onChange={(e) => setPredictionYear(e.target.value)}
                  placeholder="Enter year"
                />
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

// MetricCard and ActivityItem components remain unchanged
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