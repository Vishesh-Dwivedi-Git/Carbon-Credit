"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon, AreaChart as AreaChartIcon, Activity, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ScatterChart, Scatter, ZAxis } from "recharts"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [emissionsData, setEmissionsData] = useState<{ date: string; ppm: number; baseline: number }[]>([])
  const [tradeData, setTradeData] = useState<{ month: string; volume: number; transactions: number; avgPrice: number }[]>([])
  const [tokenData, setTokenData] = useState<{ name: string; value: number }[]>([])
  const [predictedPrices, setPredictedPrices] = useState<{ month: string; actual: number | null; predicted: number; lower: number; upper: number }[]>([])
  const [industryAdoption, setIndustryAdoption] = useState<{ industry: string; conventional: number; sustainable: number; target: number }[]>([])
  const [sustainabilityScores, setSustainabilityScores] = useState<{ category: string; score: number; average: number }[]>([])
  const [contractActivity, setContractActivity] = useState<{ date: string; executed: number; value: number }[]>([])
  const [loading, setLoading] = useState(true)

  // Green color palette
  const GREEN_PALETTE = ['#2e7d32', '#4caf50', '#66bb6a', '#81c784', '#a5d6a7', '#c8e6c9'];
  const BLUE_GREEN_PALETTE = ['#00796b', '#009688', '#4db6ac', '#26a69a', '#80cbc4', '#b2dfdb'];
  const COMPLEMENTARY_PALETTE = ['#66bb6a', '#3949ab', '#26a69a', '#7e57c2', '#ffca28', '#ef5350'];

  useEffect(() => {
    // Simulate fetching data based on timeRange
    const fetchAllData = async () => {
      try {
        // CO2 emissions data based on NASA data
        const nasaData = [
          { date: 'Jan', ppm: 419.2, baseline: 415.0 },
          { date: 'Feb', ppm: 420.1, baseline: 415.5 },
          { date: 'Mar', ppm: 421.5, baseline: 416.0 },
          { date: 'Apr', ppm: 422.8, baseline: 416.5 },
          { date: 'May', ppm: 423.4, baseline: 417.0 },
          { date: 'Jun', ppm: 422.9, baseline: 417.5 },
          { date: 'Jul', ppm: 422.1, baseline: 418.0 },
          { date: 'Aug', ppm: 421.3, baseline: 418.5 },
          { date: 'Sep', ppm: 420.2, baseline: 419.0 },
          { date: 'Oct', ppm: 419.5, baseline: 419.5 },
        ];
        setEmissionsData(nasaData);
        
        // Carbon credit trading data - now with proper structure for scatter plot
        const trades = [
          { month: 'Jan', volume: 220000, transactions: 156, avgPrice: 32 },
          { month: 'Feb', volume: 310000, transactions: 198, avgPrice: 35 },
          { month: 'Mar', volume: 280000, transactions: 210, avgPrice: 37 },
          { month: 'Apr', volume: 350000, transactions: 245, avgPrice: 39 },
          { month: 'May', volume: 420000, transactions: 312, avgPrice: 42 },
          { month: 'Jun', volume: 390000, transactions: 278, avgPrice: 45 },
          { month: 'Jul', volume: 480000, transactions: 356, avgPrice: 48 },
          { month: 'Aug', volume: 520000, transactions: 425, avgPrice: 49 },
          { month: 'Sep', volume: 550000, transactions: 467, avgPrice: 52 },
          { month: 'Oct', volume: 600000, transactions: 520, avgPrice: 55 },
        ];
        setTradeData(trades);
        
        // Token distribution data
        const tokens = [
          { name: 'Renewable Energy', value: 35 },
          { name: 'Carbon Capture', value: 25 },
          { name: 'Reforestation', value: 20 },
          { name: 'Sustainable Farming', value: 12 },
          { name: 'Ocean Conservation', value: 8 },
        ];
        setTokenData(tokens);
        
        // AI Price Prediction data - showing historical vs AI predicted
        const predictions = [
          { month: 'Nov', actual: null, predicted: 58, lower: 56, upper: 61 },
          { month: 'Dec', actual: null, predicted: 62, lower: 59, upper: 65 },
          { month: 'Jan', actual: null, predicted: 65, lower: 62, upper: 68 },
          { month: 'Feb', actual: null, predicted: 67, lower: 64, upper: 71 },
        ];
        // Combine last 3 actual prices with predictions
        const priceHistory = trades.slice(-3).map(item => ({
          month: item.month,
          actual: item.avgPrice,
          predicted: item.avgPrice,
          lower: item.avgPrice,
          upper: item.avgPrice
        }));
        setPredictedPrices([...priceHistory, ...predictions]);
        
        // Industry adoption rates
        const adoption = [
          { industry: 'Energy', conventional: 65, sustainable: 35, target: 50 },
          { industry: 'Manufacturing', conventional: 72, sustainable: 28, target: 40 },
          { industry: 'Transport', conventional: 78, sustainable: 22, target: 35 },
          { industry: 'Agriculture', conventional: 55, sustainable: 45, target: 60 },
          { industry: 'Construction', conventional: 82, sustainable: 18, target: 30 },
        ];
        setIndustryAdoption(adoption);
        
        // Sustainability scores radar data
        const sustainability = [
          { category: 'Emissions Reduction', score: 78, average: 65 },
          { category: 'Renewable Usage', score: 82, average: 60 },
          { category: 'Waste Management', score: 65, average: 58 },
          { category: 'Water Conservation', score: 70, average: 62 },
          { category: 'Sustainable Materials', score: 75, average: 59 },
          { category: 'Biodiversity', score: 68, average: 54 },
        ];
        setSustainabilityScores(sustainability);
        
        // Smart contract activity
        const contracts = [
          { date: '1', executed: 42, value: 156000 },
          { date: '5', executed: 38, value: 132000 },
          { date: '10', executed: 56, value: 189000 },
          { date: '15', executed: 49, value: 172000 },
          { date: '20', executed: 63, value: 210000 },
          { date: '25', executed: 58, value: 198000 },
          { date: '30', executed: 72, value: 254000 },
        ];
        setContractActivity(contracts);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching climate data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, [timeRange]);

  // Calculate summary metrics
  const totalTokens = "18,450";
  const emissionsReduced = "1,275 tons";
  const tradeVolume = "$2.25M";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-green-700">Decentralized Carbon Exchange</h1>
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
        <MetricCard title="Total Carbon Credits" value={totalTokens} change="+24%" trend="up" />
        <MetricCard title="CO2 Emissions Reduced" value={emissionsReduced} change="+15%" trend="up" />
        <MetricCard title="Trading Volume" value={tradeVolume} change="+42%" trend="up" />
      </div>

      <Tabs defaultValue="ai-predictions">
        <TabsList className="mb-4">
          <TabsTrigger value="ai-predictions">AI Price Predictions</TabsTrigger>
          <TabsTrigger value="emissions">Emissions Tracking</TabsTrigger>
          <TabsTrigger value="smart-contracts">Smart Contracts</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>
        
        {/* AI Price Predictions Tab */}
        <TabsContent value="ai-predictions">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Price Predictions</CardTitle>
                <CardDescription>Carbon credit price forecast with confidence intervals</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <TrendingUp className="w-16 h-16 text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Loading prediction data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={predictedPrices}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                      <Tooltip formatter={(value) => [`$${value}`, 'Price']} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="upper" 
                        stackId="1" 
                        stroke="none" 
                        fill="#e8f5e9" 
                        name="Upper Bound" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="lower" 
                        stackId="2" 
                        stroke="none" 
                        fill="#ffffff" 
                        name="Lower Bound"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#2e7d32" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                        name="AI Prediction"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#1976d2" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                        name="Actual Price"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trade Activity vs. Price</CardTitle>
                <CardDescription>Correlation between trading volume and credit prices</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <BarChartIcon className="w-16 h-16 text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Loading trade data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={tradeData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" tickFormatter={(value) => `$${value}`} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `$${value/1000}k`} />
                      <Tooltip 
                        formatter={(value, name, props) => {
                          if (name === "Credit Price") return [`$${value}`, name];
                          return [`$${value.toLocaleString()}`, name];
                        }}
                      />
                      <Legend />
                      <Bar 
                        yAxisId="right" 
                        dataKey="volume" 
                        fill="#81c784" 
                        name="Trade Volume" 
                      />
                      <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="avgPrice" 
                        stroke="#2e7d32" 
                        strokeWidth={2} 
                        name="Credit Price" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Emissions Tracking Tab */}
        <TabsContent value="emissions">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>CO2 Atmospheric Concentration</CardTitle>
                <CardDescription>Based on NASA's Global Climate Change data</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <LineChartIcon className="w-16 h-16 text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Loading emissions data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={emissionsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[415, 425]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="ppm" stroke="#ff5722" strokeWidth={2} name="Current CO2 (ppm)" />
                      <Line type="monotone" dataKey="baseline" stroke="#9e9e9e" strokeDasharray="5 5" name="Baseline (ppm)" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Adoption of Sustainable Practices</CardTitle>
                <CardDescription>Current adoption vs 2025 targets</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <BarChartIcon className="w-16 h-16 text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Loading industry data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={industryAdoption}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="industry" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sustainable" stackId="a" fill="#4caf50" name="Sustainable Practices (%)" />
                      <Bar dataKey="conventional" stackId="a" fill="#f44336" name="Conventional Practices (%)" />
                      <Line dataKey="target" stroke="#ffc107" strokeWidth={2} dot={{ stroke: '#ffc107', strokeWidth: 2, r: 4 }} name="2025 Target (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Smart Contracts Tab */}
        <TabsContent value="smart-contracts">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Smart Contract Execution</CardTitle>
                <CardDescription>Daily contract activity this month</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Activity className="w-16 h-16 text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Loading contract data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={contractActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="executed" fill="#3f51b5" stroke="#3f51b5" name="Contracts Executed" />
                      <Line yAxisId="right" type="monotone" dataKey="value" stroke="#4caf50" name="Value ($)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carbon Credit Token Distribution</CardTitle>
                <CardDescription>Allocation by sustainability initiative</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <PieChartIcon className="w-16 h-16 text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Loading token data...</p>
                  </div>
                ) : (
                  <div className="h-full">
                    <ResponsiveContainer width="100%" height="80%">
                      <PieChart>
                        <Pie
                          data={tokenData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {tokenData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={GREEN_PALETTE[index % GREEN_PALETTE.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Allocation']} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-4">
                      {tokenData.map((entry, index) => (
                        <div key={`legend-${index}`} className="flex items-center">
                          <div 
                            className="w-3 h-3 mr-2" 
                            style={{ backgroundColor: GREEN_PALETTE[index % GREEN_PALETTE.length] }}
                          />
                          <span className="text-sm">{entry.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Sustainability Tab */}
        <TabsContent value="sustainability">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sustainability Performance</CardTitle>
                <CardDescription>Your performance vs. industry average</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Activity className="w-16 h-16 text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Loading sustainability data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={sustainabilityScores}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Your Score" dataKey="score" stroke="#4caf50" fill="#4caf50" fillOpacity={0.6} />
                      <Radar name="Industry Average" dataKey="average" stroke="#9e9e9e" fill="#9e9e9e" fillOpacity={0.3} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trading Activity</CardTitle>
                <CardDescription>Volume and transaction count</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <BarChartIcon className="w-16 h-16 text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Loading transaction data...</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tradeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="volume" fill="#00796b" name="Volume ($)" />
                      <Line yAxisId="right" type="monotone" dataKey="transactions" stroke="#3f51b5" name="Transactions" strokeWidth={2} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
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
    <Card className={trend === "up" ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
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