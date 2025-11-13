"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  navItems: NavItem[];
  isAuthenticated?: boolean;
  className?: string;
}

/**
 * Mobile navigation menu with hamburger toggle
 * Used in public header for responsive navigation
 */
export function MobileMenu({
  navItems,
  isAuthenticated = false,
  className,
}: MobileMenuProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={cn("md:hidden", className)}>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
        className="relative"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </Button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={closeMobileMenu}
          />

          {/* Menu Panel */}
          <div className="fixed top-[73px] right-0 left-0 bottom-0 bg-background border-t z-50 animate-in slide-in-from-top-5">
            <nav className="container py-6 flex flex-col gap-4">
              {/* Navigation Links */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="text-lg font-medium hover:text-primary transition-colors py-2"
                >
                  {item.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="border-t my-2" />

              {/* Auth CTAs */}
              <div className="flex flex-col gap-3">
                {isAuthenticated ? (
                  <Link href="/dashboard" onClick={closeMobileMenu}>
                    <Button className="w-full" size="lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={closeMobileMenu}>
                      <Button variant="outline" className="w-full" size="lg">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={closeMobileMenu}>
                      <Button className="w-full" size="lg">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
