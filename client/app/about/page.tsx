import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ArrowRight, Award, Globe, Leaf, Shield } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About <span className="text-primary">Carbon</span>Chain
              </h1>
              <p className="text-xl mb-8 text-muted-foreground">
                Empowering industries to reduce emissions through blockchain-based carbon token trading
              </p>
              <Button asChild size="lg">
                <Link href="/register">Join the Revolution</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-8 text-muted-foreground">
                CarbonChain is on a mission to accelerate the transition to a low-carbon economy by providing a
                transparent, efficient, and secure platform for carbon credit trading. We believe that by leveraging
                blockchain technology and creating a marketplace for carbon tokens, we can incentivize businesses to
                reduce their environmental impact and drive global sustainability efforts.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose CarbonChain?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-primary" />}
                title="Secure Blockchain"
                description="Our platform is built on robust blockchain technology, ensuring the security and immutability of all transactions."
              />
              <FeatureCard
                icon={<Globe className="h-10 w-10 text-primary" />}
                title="Global Marketplace"
                description="Connect with a worldwide network of businesses and organizations committed to reducing carbon emissions."
              />
              <FeatureCard
                icon={<Leaf className="h-10 w-10 text-primary" />}
                title="Environmental Impact"
                description="Every trade on our platform contributes to global efforts in combating climate change and promoting sustainability."
              />
              <FeatureCard
                icon={<Award className="h-10 w-10 text-primary" />}
                title="Regulatory Compliance"
                description="Stay compliant with evolving environmental regulations through our transparent and auditable system."
              />
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <TeamMember name="Vishesh" role="CEO & Co-founder" image="/placeholder.svg?height=300&width=300" />
              <TeamMember name="JYashpreeth" role="CTO & Co-founder" image="/placeholder.svg?height=300&width=300" />
              <TeamMember
                name="Anas"
                role="Head of Sustainability"
                image="/placeholder.svg?height=300&width=300"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
              Join CarbonChain today and be part of the global movement towards a sustainable future.
            </p>
            <Button asChild size="lg">
              <Link href="/register">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="carbon-card">
      <CardHeader>
        <div className="mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function TeamMember({ name, role, image }: { name: string; role: string; image: string }) {
  return (
    <Card className="carbon-card text-center">
      <CardContent className="pt-6">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          width={200}
          height={200}
          className="rounded-full mx-auto mb-4"
        />
        <CardTitle>{name}</CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardContent>
    </Card>
  )
}

