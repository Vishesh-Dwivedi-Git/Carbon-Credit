"use client"
import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Globe, Leaf, Shield, Zap } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function Home() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // Scroll-linked animations
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.9, 1]);

  return (
    <div className="bg-black text-green-100 min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />

      {/* Hero Section with Animated Background */}
      <motion.section 
        className="relative hero-gradient bg-black py-20 md:py-32 flex-1 overflow-hidden"
        style={{ 
          opacity: backgroundOpacity,
          scale: scale
        }}
      >
        {/* Animated Green Particles Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-green-900 to-black opacity-70 animate-pulse"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              <span className="text-green-400">Carbon</span>Chain: Web3 Carbon Trading Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-200">
              Empowering industries to reduce emissions through blockchain-based carbon token trading
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                <Link href="/register">Get Started</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-green-600 text-green-400 hover:bg-green-900 font-semibold"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="bg-black py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-300">How CarbonChain Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-green-500" />}
              title="Government Regulation"
              description="Government mints carbon tokens and sets emission standards for industries to follow."
            />
            <FeatureCard
              icon={<BarChart3 className="h-10 w-10 text-green-500" />}
              title="Emissions Tracking"
              description="Industries report and verify CO2 emissions, with tokens burned based on consumption."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-green-500" />}
              title="Token Trading"
              description="Trade excess carbon tokens with other industries through our secure marketplace."
            />
          </div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        className="py-16 bg-black"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-300">Benefits of CarbonChain</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <BenefitCard
              icon={<Globe className="h-8 w-8 text-green-500" />}
              title="Environmental Impact"
              description="Reduce global carbon emissions and contribute to a sustainable future for our planet."
            />
            <BenefitCard
              icon={<Leaf className="h-8 w-8 text-green-500" />}
              title="Regulatory Compliance"
              description="Easily meet government regulations and avoid penalties with transparent reporting."
            />
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="bg-black py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-green-300">Ready to Join the Carbon Revolution?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-green-100">
            Start trading carbon tokens and make a positive impact on the environment today.
          </p>
          <Button 
            asChild 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            <Link href="/register">
              Register Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </motion.section>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div 
      className="bg-green-900/20 border border-green-800 p-6 rounded-lg transition-all duration-300 hover:bg-green-900/40 hover:scale-105"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3 text-green-300">{title}</h3>
      <p className="text-green-200">{description}</p>
    </motion.div>
  )
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div 
      className="flex gap-4 items-start"
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="p-3 bg-green-800/30 rounded-full">{icon}</div>
      <div>
        <h3 className="text-xl font-semibold mb-2 text-green-300">{title}</h3>
        <p className="text-green-200">{description}</p>
      </div>
    </motion.div>
  )
}