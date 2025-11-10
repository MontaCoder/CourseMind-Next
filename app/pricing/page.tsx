import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { STRIPE_PLANS } from "@/lib/stripe";
import { PricingCard } from "@/components/pricing/pricing-card";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold gradient-text">
              CourseMind
            </Link>
            <div className="flex gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="gradient-text">Learning Path</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start for free, upgrade when you're ready. All plans include AI-powered course generation.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <PricingCard plan="FREE" />

          {/* Monthly Plan */}
          <PricingCard plan="MONTHLY" featured />

          {/* Yearly Plan */}
          <PricingCard plan="YEARLY" />
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Can I switch plans later?
              </h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time from your profile settings.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What happens if I cancel?
              </h3>
              <p className="text-muted-foreground">
                You'll retain access to your Pro features until the end of your billing period. After that, your account will revert to the Free plan.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-muted-foreground">
                We offer a 30-day money-back guarantee. If you're not satisfied, contact us for a full refund.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Can I use CourseMind for commercial purposes?
              </h3>
              <p className="text-muted-foreground">
                Yes! Pro plans include commercial use rights. You can create courses for your business or clients.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of learners creating AI-powered courses today.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent">
              Get Started Free
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-24 py-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CourseMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
