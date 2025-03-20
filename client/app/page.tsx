"use client";

import dynamic from "next/dynamic";
import type React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Globe,
  Leaf,
  Shield,
  Zap,
  Activity,
  TrendingUp,
  Award,
  Settings,
  Clock,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
const Wallet = dynamic(() => import("@/components/Wallet"), { ssr: false });

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.9, 1]);
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  
  // Mock data for real-time carbon emissions
  const [emissionData, setEmissionData] = useState({
    current: 412.5,
    change: -0.8,
    lastUpdated: new Date(),
    dailyReduction: 24.6,
    totalReduction: 1254.7,
    regions: [
      { name: "North America", value: 415.2, change: -0.5 },
      { name: "Europe", value: 408.3, change: -1.2 },
      { name: "Asia", value: 418.7, change: -0.7 },
      { name: "Oceania", value: 407.9, change: -0.9 },
    ]
  });
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEmissionData(prev => {
        const changeValue = Math.random() * 0.4 - 0.2;
        return {
          ...prev,
          current: +(prev.current + changeValue).toFixed(1),
          change: changeValue < 0 ? changeValue : 0,
          lastUpdated: new Date(),
          regions: prev.regions.map(region => ({
            ...region,
            value: +(region.value + (Math.random() * 0.3 - 0.15)).toFixed(1),
            change: Math.random() < 0.7 ? -Math.random() * 0.3 - 0.5 : Math.random() * 0.2
          }))
        };
      });
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden text-green-100 bg-gradient-to-b from-black to-green-950">
      <section className="relative flex-1 overflow-hidden md:pt-20 md:pb-40 ">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-green-900 to-black opacity-70"></div>
          <div className="absolute inset-0 opacity-20 bg-[url('/hexagon-pattern.svg')]"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-green-400 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * 100 - 50],
                  opacity: [0.7, 0.2, 0.7],
                }}
                transition={{
                  duration: 3 + Math.random() * 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Admin Button - Positioned at the top right */}
        <motion.div 
          className="absolute top-4 right-4 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button
            asChild
            size="sm"
            className="font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-800 to-green-700 hover:from-green-700 hover:to-green-600 shadow-green-800/20"
          >
            <Link href="/admin" className="flex items-center gap-2">
              <Settings className="w-4 h-4" /> Admin
            </Link>
          </Button>
        </motion.div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col max-w-xl"
              style={{ opacity: heroTextOpacity }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="mb-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-500 rounded-lg "></div>
                  <h2 className="text-2xl font-bold tracking-tight text-green-400">
                    CarbonChain
                  </h2>
                </div>
              </motion.div>

              <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl">
                The Future of{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
                  Carbon Trading
                </span>
              </h1>
              <p className="mb-8 text-xl leading-relaxed text-green-200 md:text-2xl">
                A blockchain-powered ecosystem connecting industries, regulators,
                and sustainability goals through transparent carbon credit
                trading.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-green-800/20"
                >
                  <Link href="/register" className="flex items-center gap-2">
                    Join The Movement <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="font-semibold text-green-400 transition-all duration-300 border-2 border-green-600 hover:bg-green-900/50"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <Card className="w-full overflow-hidden border shadow-lg border-green-700/50 bg-gradient-to-br from-black/80 to-green-950/50 shadow-green-900/20 backdrop-blur-sm">
                <CardHeader className="border-b border-green-800/30 bg-black/60">
                  <CardTitle className="flex items-center gap-2 text-green-300">
                    <div className="p-1.5 rounded-md bg-green-600/20">
                      <Zap className="w-5 h-5 text-green-400" />
                    </div>
                    Wagmi Wallet
                  </CardTitle>
                  <CardDescription className="text-green-400/70">
                    Securely manage your wallet and carbon token transfers
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg bg-green-900/10 border-green-800/20">
                      <Wallet />
                    </div>
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-400/80">Network: Ethereum</span>
                      </div>
                      <span className="text-xs text-green-400/80">Carbon Tokens: 0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 hidden py-6 border-t border-b bg-black/60 backdrop-blur-lg border-green-900/50 lg:block"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="container grid grid-cols-3 mx-auto">
            <div className="flex flex-col items-center justify-center p-4 border-r border-green-900/50">
              <span className="text-3xl font-bold text-green-400">250K+</span>
              <span className="text-sm text-green-300">
                Carbon Credits Traded
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 border-r border-green-900/50">
              <span className="text-3xl font-bold text-green-400">120+</span>
              <span className="text-sm text-green-300">
                Industries Connected
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-3xl font-bold text-green-400">30%</span>
              <span className="text-sm text-green-300">Emission Reduction</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Real-time Carbon Emissions Data Section */}
      <motion.section 
        className="py-12 bg-black/80 backdrop-blur-md border-y border-green-900/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-green-300 uppercase rounded-full bg-green-900/30">
                Real-time Monitor
              </span>
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-green-300">
                Global Carbon Emissions
              </h2>
              <div className="flex items-center justify-center gap-2 text-green-400/70">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Last updated: {emissionData.lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="border bg-black/60 border-green-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-300">Current PPM</CardTitle>
                  <CardDescription className="text-green-400/70">
                    Global CO₂ concentration in parts per million
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold text-green-400">
                      {emissionData.current}
                    </span>
                    <div className={`flex items-center mb-1 ${emissionData.change < 0 ? 'text-green-500' : 'text-red-400'}`}>
                      <span>{emissionData.change < 0 ? '↓' : '↑'}</span>
                      <span className="text-sm">{Math.abs(emissionData.change).toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-green-300">Safe Level</span>
                      <span className="text-green-400">350 PPM</span>
                    </div>
                    <Progress value={emissionData.current / 5} max={100} className="h-2 bg-green-900/30" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border bg-black/60 border-green-700/50 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-green-300">Reduction Metrics</CardTitle>
                  <CardDescription className="text-green-400/70">
                    Impact of carbon credit trading system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-green-400/70">Daily Reduction</div>
                      <div className="text-xl font-bold text-green-400">{emissionData.dailyReduction} tons</div>
                    </div>
                    <div>
                      <div className="text-sm text-green-400/70">Total Reduction</div>
                      <div className="text-xl font-bold text-green-400">{emissionData.totalReduction.toLocaleString()} tons</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4 md:grid-cols-4">
              {emissionData.regions.map((region, index) => (
                <Card key={index} className="border bg-black/60 border-green-700/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <h4 className="mb-1 text-sm font-medium text-green-300">{region.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-green-400">{region.value}</span>
                      <span className={`text-xs ${region.change < 0 ? 'text-green-500' : 'text-red-400'}`}>
                        {region.change < 0 ? '↓' : '↑'}{Math.abs(region.change).toFixed(1)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <section className="py-24 bg-gradient-to-b from-green-950/50 to-black">
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-green-300 uppercase rounded-full bg-green-900/30">
              Our Ecosystem
            </span>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-green-300">
              How CarbonChain Works
            </h2>
            <p className="text-lg text-green-200/70">
              A transparent, secure system connecting regulators, industries,
              and the environment.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Shield className="w-10 h-10 text-green-500" />}
              title="Government Regulation"
              description="Smart contracts mint verifiable carbon tokens, with emission standards for industries to follow."
              number="01"
            />
            <FeatureCard
              icon={<BarChart3 className="w-10 h-10 text-green-500" />}
              title="Emissions Tracking"
              description="AI-powered verification of CO2 emissions with automatic token burning based on consumption."
              number="02"
            />
            <FeatureCard
              icon={<Zap className="w-10 h-10 text-green-500" />}
              title="Token Trading"
              description="Decentralized marketplace for trading excess carbon tokens with price prediction and liquidity pools."
              number="03"
            />
          </div>

          <motion.div
            className="max-w-4xl py-16 mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative h-1 mb-12 bg-green-900/30">
              <div className="absolute top-0 left-0 w-3/4 h-1 bg-green-500"></div>
              <div className="absolute top-0 left-0 w-2 h-2 translate-x-0 -translate-y-1/2 bg-green-500 rounded-full"></div>
              <div className="absolute top-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-green-500 rounded-full left-1/3"></div>
              <div className="absolute top-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-green-500 rounded-full left-2/3"></div>
              <div className="absolute top-0 w-4 h-4 -translate-x-1/2 -translate-y-1/2 border-2 border-green-500 rounded-full left-3/4 animate-pulse"></div>
              <div className="absolute top-0 right-0 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-900/50"></div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <span className="block text-sm text-green-400">Step 1</span>
                <span className="block font-medium text-green-200">
                  Registration
                </span>
              </div>
              <div className="text-center">
                <span className="block text-sm text-green-400">Step 2</span>
                <span className="block font-medium text-green-200">
                  Token Allocation
                </span>
              </div>
              <div className="text-center">
                <span className="block text-sm text-green-400">Step 3</span>
                <span className="block font-medium text-green-200">
                  Emissions Tracking
                </span>
              </div>
              <div className="text-center">
                <span className="block text-sm text-green-400">Step 4</span>
                <span className="block font-medium text-green-200">
                  Token Trading
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section
        className="py-24 bg-green-950/20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container px-4 mx-auto">
          <div className="max-w-2xl mx-auto mb-16 text-center">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-green-300 uppercase rounded-full bg-green-900/30">
              Value Proposition
            </span>
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-green-300">
              Benefits of CarbonChain
            </h2>
            <p className="text-lg text-green-200/70">
              Creating value for industries, regulators, and our planet.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <BenefitCard
              icon={<Globe className="w-8 h-8 text-green-500" />}
              title="Environmental Impact"
              description="Reduce global carbon emissions with precise tracking and incentives for sustainable practices."
            />
            <BenefitCard
              icon={<Leaf className="w-8 h-8 text-green-500" />}
              title="Regulatory Compliance"
              description="Meet government standards with automated reporting and transparent blockchain verification."
            />
            <BenefitCard
              icon={<Activity className="w-8 h-8 text-green-500" />}
              title="Market Efficiency"
              description="AI-powered price prediction and liquidity pools create a more efficient carbon market."
            />
            <BenefitCard
              icon={<TrendingUp className="w-8 h-8 text-green-500" />}
              title="Economic Incentives"
              description="Convert sustainability into financial advantages with tokenized carbon credits."
            />
            <BenefitCard
              icon={<Award className="w-8 h-8 text-green-500" />}
              title="Brand Enhancement"
              description="Showcase environmental commitment with verifiable sustainability credentials."
            />
            <BenefitCard
              icon={<Shield className="w-8 h-8 text-green-500" />}
              title="Data Security"
              description="Immutable blockchain records ensure data integrity and regulatory trust."
            />
          </div>
        </div>
      </motion.section>

      <motion.section
        className="relative py-24 overflow-hidden bg-black"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
              backgroundSize: ["100% 100%", "120% 120%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage:
                "radial-gradient(circle at center, rgba(34, 197, 94, 0.2) 0%, rgba(0, 0, 0, 0) 50%)",
            }}
          />
        </div>

        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-3xl p-8 mx-auto text-center border rounded-xl bg-green-950/20 border-green-800/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="mb-6 text-4xl font-bold text-green-300">
                Join the Carbon Revolution
              </h2>
              <p className="max-w-2xl mx-auto mb-8 text-lg text-green-100">
                Start trading carbon tokens and contribute to a sustainable
                future for our planet.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  className="font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 shadow-green-800/20"
                >
                  <Link href="/register" className="flex items-center gap-2">
                    Register Now <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="font-semibold text-green-400 transition-all duration-300 border-2 border-green-600 hover:bg-green-900/50"
                >
                  <Link href="/about">Watch Demo</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  number,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  number: string;
}) {
  return (
    <motion.div
      className="relative p-6 transition-all duration-300 border border-green-800 rounded-lg bg-gradient-to-br from-green-900/20 to-black hover:from-green-900/40 hover:to-black"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ translateY: -5 }}
    >
      <div className="absolute top-0 right-0 p-2 text-xl font-bold text-green-500 opacity-30">
        {number}
      </div>
      <div className="p-3 mb-4 rounded-lg w-fit bg-green-900/30">{icon}</div>
      <h3 className="mb-3 text-xl font-semibold text-green-300">{title}</h3>
      <p className="text-green-200/80">{description}</p>
    </motion.div>
  );
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="flex items-start gap-4 p-6 transition-all duration-300 border rounded-lg border-green-900/50 bg-black/30 backdrop-blur-sm hover:bg-green-950/30"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="p-3 rounded-lg shrink-0 bg-green-800/30">{icon}</div>
      <div>
        <h3 className="mb-2 text-lg font-semibold text-green-300">{title}</h3>
        <p className="text-sm text-green-200/80">{description}</p>
      </div>
    </motion.div>
  );
}