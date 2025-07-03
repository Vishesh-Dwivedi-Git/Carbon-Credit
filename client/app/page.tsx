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
import { useRef } from "react";
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

function WalletWarningMarquee() {
  return (
    <div className="relative z-50 w-full py-2 bg-green-900 border-b border-green-800 overflow-hidden">
      <div className="flex items-center whitespace-nowrap animate-marquee px-4 text-sm text-green-200 gap-8">
        <span className="font-medium">⚠️ Please make sure to connect your wallet first</span>
        <span className="font-medium">🧪 Have Sepolia Testnet ETHs before Authorization and Register</span>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.9, 1]);
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const adminButtonY = useTransform(scrollYProgress, [0, 0.05, 0.1], [6, 3, 0]);
  const adminButtonOpacity = useTransform(scrollYProgress, [0, 0.05, 0.1], [1, 1, 0.9]);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden text-green-100 bg-gradient-to-b from-black to-green-950">
      <WalletWarningMarquee/>
      <section className="relative flex-1 overflow-hidden md:pt-20 md:pb-40 ">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-green-900 to-black opacity-70"></div>
          <div className="absolute inset-0 opacity-20 bg-[url('/hexagon-pattern.svg')]" />
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

        <motion.div
          className="absolute top-24 right-6 "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ y: adminButtonY, opacity: adminButtonOpacity }}
          transition={{ duration: 0.5, delay: 0.8 }}
        ></motion.div>

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
                  <div className="w-10 h-10 bg-green-500 rounded-lg " />
                  <h2 className="text-2xl font-bold tracking-tight text-white">CarbonChain</h2>
                </div>
              </motion.div>

              <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white md:text-7xl">
                The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">Carbon Trading</span>
              </h1>
              <p className="mb-8 text-xl leading-relaxed text-white md:text-2xl">
                A blockchain-powered ecosystem connecting industries, regulators, and sustainability goals through transparent carbon credit trading.
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
                  className="font-semibold text-white transition-all duration-300 border-2 border-green-600 hover:bg-green-900/50"
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
                  <CardTitle className="flex items-center gap-2 text-white">
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
      </section>
    </div>
  );
}
