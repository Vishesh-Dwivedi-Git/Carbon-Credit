"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

import { useAccount } from "wagmi"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    org_name: "",
    org_type: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, org_type: value }))
  }
  const { address } = useAccount();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.org_name || !formData.org_type) {
        toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
        return;
    }

    if (formData.password !== formData.confirmPassword) {
        toast({ title: "Passwords don't match", description: "Make sure your passwords match.", variant: "destructive" });
        return;
    }

    if (formData.password.length < 8) {
        toast({ title: "Password too short", description: "Password must be at least 8 characters.", variant: "destructive" });
        return;
    }

    setIsLoading(true);

    try {
        // Get wallet address (Assuming you use wagmi for Ethereum wallets)
        if (!address) {
            toast({ title: "Wallet not connected", description: "Please connect your wallet first.", variant: "destructive" });
            return;
        }

        const apiUrl = "http://localhost:5000/api/auth/register";

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
                org_name: formData.org_name,
                org_type: formData.org_type,
                walletAddress: address, // Include wallet address
            }),
        });

        const data = await response.json();

        if (response.ok) {
            toast({ title: "Registration successful!", description: "Your organization has been registered." });
            router.push("/login");
        } else {
            throw new Error(data.message || "Registration failed");
        }
    } catch (error) {
        console.error("Registration error:", error);
        toast({ title: "Registration failed", description: error instanceof Error ? error.message : "Unable to connect to server", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
};


  return (
    <div className="min-h-screen flex flex-col">

      <div className="flex-1 flex items-center justify-center py-12 px-4 dashboard-gradient">
        <Card className="w-full max-w-md carbon-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Register your Organization</CardTitle>
            <CardDescription>Create an account to start trading carbon tokens</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="org_name">Organization Name</Label>
                <Input
                  id="org_name"
                  name="org_name"
                  placeholder="Enter your organization name"
                  value={formData.org_name}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="org_type">Organization Type</Label>
                <Select 
                  onValueChange={handleSelectChange} 
                  value={formData.org_type}
                  required
                >
                  <SelectTrigger id="org_type">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NGO">NGO</SelectItem>
                    <SelectItem value="Oil & Gas">Oil & Gas</SelectItem>
                    <SelectItem value="Steel & Cement">Steel & Cement</SelectItem>
                    <SelectItem value="Renewable Energy">Renewable Energy</SelectItem>
                    <SelectItem value="Recycling & Waste Management">Recycling & Waste Management</SelectItem>
                    <SelectItem value="Aviation & Shipping">Aviation & Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  minLength={8}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

    </div>
  )
}