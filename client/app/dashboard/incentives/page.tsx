"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Star, Trophy, Leaf, Award, Gift } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { cctAbi, cctAddress } from "@/constants/abiCCT";

// Main IncentivesPage Component
export default function IncentivesPage() {
  const [incentives, setIncentives] = useState([]);
  const [userIncentives, setUserIncentives] = useState([]);
  const [userStats, setUserStats] = useState({ totalPoints: 0, totalCarbonOffset: 0, totalRecords: 0, level: 1 });
  const [leaderboard, setLeaderboard] = useState([]);
  const [globalImpact, setGlobalImpact] = useState({ totalPoints: 0, totalCarbonOffset: 0, totalActions: 0 });
  const [isGovernmentUser, setIsGovernmentUser] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementMessage, setAchievementMessage] = useState("");

  // Fetch user's CCt balance using wagmi
  const { address, isConnected } = useAccount();
  const { data: cctBalance, isLoading: balanceLoading } = useReadContract({
    address: cctAddress,
    abi: cctAbi,
    functionName: "balanceOf",
    args: [address],
    enabled: !!address, // Only fetch if address is available
  });

  const formattedBalance = cctBalance ? formatUnits(BigInt(cctBalance.toString()), 18) : "0"; // Assuming 18 decimals

  const fetchData = async () => {
    try {
      const [incentivesRes, userIncentivesRes, leaderboardRes, impactRes] = await Promise.all([
        fetch("http://localhost:5000/api/incentives/list", { credentials: "include" }),
        fetch("http://localhost:5000/api/incentives/user", { credentials: "include" }),
        fetch("http://localhost:5000/api/incentives/leaderboard", { credentials: "include" }),
        fetch("http://localhost:5000/api/incentives/impact/global", { credentials: "include" }),
      ]);

      if (incentivesRes.ok) setIncentives(await incentivesRes.json().then(data => data.incentives));
      if (userIncentivesRes.ok) {
        const data = await userIncentivesRes.json();
        setUserIncentives(data.userIncentives);
        setUserStats({
          ...data.stats,
          level: Math.floor(data.stats.totalPoints / 1000) + 1,
        });
      }
      if (leaderboardRes.ok) setLeaderboard(await leaderboardRes.json().then(data => data.leaderboard));
      if (impactRes.ok) setGlobalImpact(await impactRes.json().then(data => data.impact));

      const userRole = localStorage.getItem("userRole");
      setIsGovernmentUser(userRole === "government");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => {
      setAchievementMessage("You have reached level 2!");
      setShowAchievement(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData().finally(() => setIsRefreshing(false));
  };

  const calculateStars = (points) => Math.min(5, Math.floor(points / 200));

  return (
    <div className="space-y-6">
      {/* Achievement Notification */}
      <AchievementNotification 
        show={showAchievement} 
        achievement={achievementMessage} 
        onClose={() => setShowAchievement(false)} 
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Green Incentives</h1>
        <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* User Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatCard 
          title="Level" 
          value={userStats.level} 
          description="Current Level" 
          icon={<Trophy className="w-5 h-5 text-primary" />} 
        />
        <StatCard 
          title="Total Points" 
          value={userStats.totalPoints} 
          description="Earned Points" 
          icon={<Star className="w-5 h-5 text-yellow-500" />} 
        />
        <StatCard 
          title="CO2 Offset" 
          value={`${userStats.totalCarbonOffset} kg`} 
          description="Carbon Saved" 
          icon={<Leaf className="w-5 h-5 text-green-500" />} 
        />
        <StatCard 
          title="Rating" 
          value={<StarRating rating={calculateStars(userStats.totalPoints)} size="lg" />} 
          description="Your Rating" 
          icon={<Star className="w-5 h-5 text-yellow-500" />} 
        />
        <StatCard 
          title="CCt Balance" 
          value={balanceLoading ? "Loading..." : `${parseFloat(formattedBalance).toFixed(2)} CCt`} 
          description="Your Token Balance" 
          icon={<Gift className="w-5 h-5 text-blue-500" />} 
        />
      </div>

      {/* Tabs Section */}
      <Card>
        <CardHeader>
          <CardTitle>Incentive Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="incentives">
            <TabsList className="mb-4">
              <TabsTrigger value="incentives">
                <Gift className="w-4 h-4 mr-2" />
                Incentives
              </TabsTrigger>
              <TabsTrigger value="my-rewards">
                <Award className="w-4 h-4 mr-2" />
                My Rewards
              </TabsTrigger>
              <TabsTrigger value="leaderboard">
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </TabsTrigger>
              <TabsTrigger value="global-impact">
                <Leaf className="w-4 h-4 mr-2" />
                Global Impact
              </TabsTrigger>
            </TabsList>

            <TabsContent value="incentives">
              <IncentiveList 
                incentives={incentives} 
                isGovernmentUser={isGovernmentUser} 
                refreshData={fetchData} 
                calculateStars={calculateStars}
              />
            </TabsContent>
            <TabsContent value="my-rewards">
              <UserIncentives 
                userIncentives={userIncentives} 
                stats={userStats} 
                calculateStars={calculateStars}
              />
              <RedeemForm refreshData={fetchData} />
            </TabsContent>
            <TabsContent value="leaderboard">
              <Leaderboard leaderboard={leaderboard} calculateStars={calculateStars} />
            </TabsContent>
            <TabsContent value="global-impact">
              <GlobalImpact impact={globalImpact} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// StatCard Component
function StatCard({ title, value, description, icon }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-1 text-2xl font-bold">{value}</div>
          </div>
          <div className="p-2 rounded-full bg-secondary">{icon}</div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// IncentiveList Component
function IncentiveList({ incentives, isGovernmentUser, refreshData, calculateStars }) {
  const [newIncentive, setNewIncentive] = useState({ 
    title: "", 
    description: "", 
    category: "", 
    points: 0, 
    actions: "",
    difficulty: "easy" 
  });

  const handleCreate = async () => {
    const res = await fetch("http://localhost:5000/api/incentives/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        ...newIncentive, 
        actions: newIncentive.actions.split(",").map(a => a.trim()) 
      }),
      credentials: "include",
    });
    if (res.ok) {
      setNewIncentive({ title: "", description: "", category: "", points: 0, actions: "", difficulty: "easy" });
      refreshData();
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this incentive?")) {
      const res = await fetch(`http://localhost:5000/api/incentives/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) refreshData();
    }
  };

  return (
    <div className="space-y-4">
      {isGovernmentUser && (
        <div className="p-4 border rounded-lg border-border">
          <h3 className="mb-3 text-lg font-semibold">Create New Incentive</h3>
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            <input 
              className="p-2 border rounded-md border-border focus:outline-none focus:ring-2 focus:ring-primary" 
              placeholder="Title" 
              value={newIncentive.title} 
              onChange={(e) => setNewIncentive({ ...newIncentive, title: e.target.value })} 
            />
            <input 
              className="p-2 border rounded-md border-border focus:outline-none focus:ring-2 focus:ring-primary" 
              placeholder="Description" 
              value={newIncentive.description} 
              onChange={(e) => setNewIncentive({ ...newIncentive, description: e.target.value })} 
            />
            <input 
              className="p-2 border rounded-md border-border focus:outline-none focus:ring-2 focus:ring-primary" 
              placeholder="Category" 
              value={newIncentive.category} 
              onChange={(e) => setNewIncentive({ ...newIncentive, category: e.target.value })} 
            />
            <input 
              className="p-2 border rounded-md border-border focus:outline-none focus:ring-2 focus:ring-primary" 
              type="number" 
              placeholder="Points" 
              value={newIncentive.points} 
              onChange={(e) => setNewIncentive({ ...newIncentive, points: Number(e.target.value) })} 
            />
            <input 
              className="p-2 border rounded-md border-border focus:outline-none focus:ring-2 focus:ring-primary" 
              placeholder="Actions (comma-separated)" 
              value={newIncentive.actions} 
              onChange={(e) => setNewIncentive({ ...newIncentive, actions: e.target.value })} 
            />
            <select
              className="p-2 border rounded-md border-border focus:outline-none focus:ring-2 focus:ring-primary"
              value={newIncentive.difficulty}
              onChange={(e) => setNewIncentive({ ...newIncentive, difficulty: e.target.value })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleCreate}
          >
            Create Incentive
          </Button>
        </div>
      )}
      
      {incentives.length > 0 ? (
        incentives.map((incentive) => (
          <div key={incentive._id} className="p-4 border rounded-lg border-border">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium">{incentive.title}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${incentive.difficulty === 'easy' ? 'bg-green-500/20 text-green-500' : incentive.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
                {incentive.difficulty || 'Easy'}
              </span>
            </div>
            <p className="mb-2 text-sm text-muted-foreground">{incentive.description}</p>
            <div className="flex items-center mb-2">
              <span className="px-2 py-1 mr-2 text-xs rounded-full bg-secondary text-secondary-foreground">{incentive.category}</span>
              <span className="flex items-center text-yellow-500">
                <Star className="w-4 h-4 mr-1 fill-yellow-500" />
                {incentive.points} points
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Actions: {incentive.actions.join(", ")}</p>
            {isGovernmentUser && (
              <div className="flex justify-end mt-3">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => handleDelete(incentive._id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-muted-foreground">No incentives available yet</p>
      )}
    </div>
  );
}

// UserIncentives Component
function UserIncentives({ userIncentives, stats, calculateStars }) {
  const nextLevelPoints = stats.level * 1000;
  const progressPercent = ((stats.totalPoints % 1000) / 1000) * 100;
  
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg border-border">
        <div className="flex flex-wrap items-center justify-around gap-4 mb-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.totalPoints}</div>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{stats.totalCarbonOffset}</div>
            <p className="text-sm text-muted-foreground">CO₂ Offset (kg)</p>
          </div>
          <div className="text-center">
            <StarRating rating={calculateStars(stats.totalPoints)} size="md" />
            <p className="text-sm text-muted-foreground">Rating</p>
          </div>
        </div>
        <div className="flex justify-between mb-2 text-xs text-muted-foreground">
          <span>Level {stats.level}</span>
          <span>Level {stats.level + 1}</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="mt-1 text-xs text-center text-muted-foreground">
          {stats.totalPoints % 1000} / 1000 points to next level
        </p>
      </div>
      
      <h3 className="mb-3 font-medium">Earned Rewards</h3>
      {userIncentives.length > 0 ? (
        userIncentives.map((record) => (
          <div key={record._id} className="p-4 border rounded-lg border-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{record.action}</h4>
                <div className="flex items-center mt-1">
                  <span className="flex items-center mr-4 text-yellow-500">
                    <Star className="w-4 h-4 mr-1 fill-yellow-500" />
                    {record.pointsEarned} points
                  </span>
                  <span className="flex items-center text-green-500">
                    <Leaf className="w-4 h-4 mr-1" />
                    {record.carbonOffset} kg offset
                  </span>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${record.redeemed ? 'bg-gray-500/20 text-gray-500' : 'bg-green-500/20 text-green-500'}`}>
                {record.redeemed ? 'Redeemed' : 'Available'}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted-foreground">No rewards earned yet</p>
      )}
    </div>
  );
}

// RedeemForm Component
function RedeemForm({ refreshData }) {
  const [rewardType, setRewardType] = useState("");
  const [points, setPoints] = useState(0);

  const handleRedeem = async () => {
    const res = await fetch("http://localhost:5000/api/incentives/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rewardType, pointsUsed: points }),
      credentials: "include",
    });
    if (res.ok) {
      alert("Points redeemed successfully!");
      setRewardType("");
      setPoints(0);
      refreshData();
    } else {
      const data = await res.json();
      alert(`Error: ${data.message}`);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="p-4 border rounded-lg border-border">
        <p className="mb-2 text-sm text-muted-foreground">Exchange your earned points for rewards</p>
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
          <select 
            className="p-2 border rounded-md border-border focus:outline-none focus:ring-2 focus:ring-primary"
            value={rewardType} 
            onChange={(e) => setRewardType(e.target.value)}
          >
            <option value="">Select Reward Type</option>
            <option value="token_bonus">Carbon Token Bonus</option>
            <option value="discount_coupon">Sustainability Discount</option>
            <option value="tree_planting">Plant Trees (100 pts = 1 tree)</option>
            <option value="certification">Green Certification</option>
          </select>
          <input 
            className="p-2 border rounded-md border-border focus:outline-none focus:ring-2 focus:ring-primary" 
            type="number" 
            value={points} 
            onChange={(e) => setPoints(Number(e.target.value))} 
            placeholder="Points to Redeem" 
          />
        </div>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground md:w-auto"
          onClick={handleRedeem} 
          disabled={!rewardType || points <= 0}
        >
          Redeem Reward
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="p-4 border rounded-lg border-border">
          <div className="mb-2 text-yellow-500"><Star className="w-6 h-6" /></div>
          <h4 className="mb-1 font-medium">Carbon Token Bonus</h4>
          <p className="text-sm text-muted-foreground">Get additional carbon tokens</p>
          <p className="mt-2 text-xs text-muted-foreground">500 points minimum</p>
        </div>
        <div className="p-4 border rounded-lg border-border">
          <div className="mb-2 text-green-500"><Leaf className="w-6 h-6" /></div>
          <h4 className="mb-1 font-medium">Plant Trees</h4>
          <p className="text-sm text-muted-foreground">We’ll plant real trees</p>
          <p className="mt-2 text-xs text-muted-foreground">100 points = 1 tree</p>
        </div>
        <div className="p-4 border rounded-lg border-border">
          <div className="mb-2 text-blue-500"><Award className="w-6 h-6" /></div>
          <h4 className="mb-1 font-medium">Green Certification</h4>
          <p className="text-sm text-muted-foreground">Earn sustainability recognition</p>
          <p className="mt-2 text-xs text-muted-foreground">2000 points minimum</p>
        </div>
      </div>
    </div>
  );
}

// Leaderboard Component
function Leaderboard({ leaderboard, calculateStars }) {
  return (
    <div className="space-y-4">
      {leaderboard.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary">
              <tr>
                <th className="p-2 font-medium text-left">Rank</th>
                <th className="p-2 font-medium text-left">Organization</th>
                <th className="p-2 font-medium text-left">Stars</th>
                <th className="p-2 font-medium text-left">Points</th>
                <th className="p-2 font-medium text-left">Carbon Offset</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry.user._id} className="border-b border-border hover:bg-secondary">
                  <td className="p-3">
                    {index < 3 ? (
                      <div className="flex items-center">
                        <Trophy className={`w-5 h-5 mr-1 ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 'text-amber-700'
                        }`} />
                        <span className="font-medium">{index + 1}</span>
                      </div>
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </td>
                  <td className="p-3 font-medium">{entry.user.org_name}</td>
                  <td className="p-3">
                    <StarRating rating={calculateStars(entry.totalPoints)} size="sm" />
                  </td>
                  <td className="p-3">{entry.totalPoints}</td>
                  <td className="p-3 text-green-500">{entry.totalCarbonOffset} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted-foreground">No leaderboard data available yet</p>
      )}
    </div>
  );
}

// GlobalImpact Component
function GlobalImpact({ impact }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
        <div className="p-6 border rounded-lg border-border">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-secondary text-primary">
            <Star className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold">{impact.totalPoints.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Total Points Earned</p>
        </div>
        <div className="p-6 border rounded-lg border-border">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-secondary text-primary">
            <Leaf className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold">{impact.totalCarbonOffset.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">kg CO₂ Offset</p>
        </div>
        <div className="p-6 border rounded-lg border-border">
          <div className="inline-flex items-center justify-center w-12 h-12 mb-3 rounded-full bg-secondary text-primary">
            <Award className="w-6 h-6" />
          </div>
          <div className="text-3xl font-bold">{impact.totalActions.toLocaleString()}</div>
          <p className="text-sm text-muted-foreground">Sustainable Actions</p>
        </div>
      </div>
      
      <h3 className="mb-4 font-medium">Environmental Impact Equivalents</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="p-4 border rounded-lg border-border">
          <div className="flex items-start">
            <div className="p-2 mr-3 rounded-full bg-secondary">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">{Math.round(impact.totalCarbonOffset / 100)} trees planted</h4>
              <p className="text-sm text-muted-foreground">CO₂ absorption equivalent</p>
            </div>
          </div>
        </div>
        <div className="p-4 border rounded-lg border-border">
          <div className="flex items-start">
            <div className="p-2 mr-3 rounded-full bg-secondary">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">{Math.round(impact.totalCarbonOffset / 50)} kWh saved</h4>
              <p className="text-sm text-muted-foreground">Household energy equivalent</p>
            </div>
          </div>
        </div>
        <div className="p-4 border rounded-lg border-border">
          <div className="flex items-start">
            <div className="p-2 mr-3 rounded-full bg-secondary">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">{Math.round(impact.totalCarbonOffset / 200)} gallons of fuel saved</h4>
              <p className="text-sm text-muted-foreground">Vehicle emissions reduction</p>
            </div>
          </div>
        </div>
        <div className="p-4 border rounded-lg border-border">
          <div className="flex items-start">
            <div className="p-2 mr-3 rounded-full bg-secondary">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium">{Math.round(impact.totalCarbonOffset / 1000)} homes powered</h4>
              <p className="text-sm text-muted-foreground">Annual home energy equivalent</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// StarRating Component
function StarRating({ rating, maxRating = 5, size = 'md', className = '' }) {
  const starSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8"
  };
  const starSize = starSizes[size] || starSizes.md;
  return (
    <div className={`flex ${className}`}>
      {[...Array(maxRating)].map((_, i) => (
        <Star 
          key={i} 
          className={`${starSize} ${i < rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`} 
        />
      ))}
    </div>
  );
}

// AchievementNotification Component (Using CSS Animation)
function AchievementNotification({ show, achievement, onClose }) {
  return (
    <div
      className={`fixed z-50 flex items-start max-w-xs p-4 rounded-lg shadow-lg top-4 right-4 bg-primary text-primary-foreground transition-all duration-300 ease-in-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="p-2 mr-3 rounded-full bg-secondary text-primary">
        <Award className="w-6 h-6" />
      </div>
      <div>
        <h4 className="mb-1 font-bold">Achievement Unlocked!</h4>
        <p className="text-sm">{achievement}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 text-xs"
          onClick={onClose}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}