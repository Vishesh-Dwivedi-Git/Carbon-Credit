import type React from "react";
import Link from "next/link";
import { Facebook, Github, Instagram, Linkedin, Twitter, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Column 1: Branding and Social */}
          <div>
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-primary">Carbon</span>
              <span className="text-2xl font-bold">Chain</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Empowering industries to reduce emissions through blockchain-based carbon token trading.
            </p>
            <div className="flex space-x-4">
              <SocialIcon href="#" icon={<Twitter className="h-5 w-5" />} />
              <SocialIcon href="#" icon={<Facebook className="h-5 w-5" />} />
              <SocialIcon href="#" icon={<Instagram className="h-5 w-5" />} />
              <SocialIcon href="#" icon={<Linkedin className="h-5 w-5" />} />
              <SocialIcon href="#" icon={<Github className="h-5 w-5" />} />
            </div>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <FooterLink href="/marketplace">Marketplace</FooterLink>
              <FooterLink href="/dashboard">Dashboard</FooterLink>
              <FooterLink href="/reports">CO2 Reports</FooterLink>
              <FooterLink href="/tokens">Token Management</FooterLink>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/team">Our Team</FooterLink>
              <FooterLink href="/careers">Careers</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/cookies">Cookie Policy</FooterLink>
              <FooterLink href="/compliance">Compliance</FooterLink>
            </ul>
          </div>

          {/* Column 5: Regulators (Government Portal Button) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Regulators</h3>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="font-semibold text-white transition-all duration-300 border-2 border-green-600 hover:bg-green-900/50 backdrop-blur-sm bg-black/40"
            >
              <Link href="/mint" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Government Portal
              </Link>
            </Button>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} CarbonChain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      className="p-2 bg-secondary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-muted-foreground hover:text-primary transition-colors">
        {children}
      </Link>
    </li>
  );
}