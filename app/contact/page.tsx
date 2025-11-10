import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MessageSquare, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata = {
  title: "Contact Us - CourseMind",
  description:
    "Get in touch with the CourseMind team. We're here to help with any questions or feedback.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
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
      <main className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have a question or feedback? We'd love to hear from you. Send us a
            message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Contact Methods */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <Mail className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  For general inquiries
                </p>
                <a
                  href="mailto:support@coursemind.com"
                  className="text-primary hover:underline"
                >
                  support@coursemind.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Live Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Available for Pro users
                </p>
                <p className="text-sm">Monday - Friday, 9am - 5pm EST</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24 hours during business days.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">
                How do I reset my password?
              </h3>
              <p className="text-sm text-muted-foreground">
                Click "Forgot Password" on the login page and follow the
                instructions sent to your email.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Can I change my subscription plan?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes! Go to your profile settings and click "Manage Subscription"
                to upgrade or downgrade your plan.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                What languages are supported?
              </h3>
              <p className="text-sm text-muted-foreground">
                We support 39 languages including English, Spanish, French,
                German, Chinese, Japanese, and many more.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes, we offer a 30-day money-back guarantee. Contact us within 30
                days of your purchase for a full refund.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">
                How does the AI course generation work?
              </h3>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes your topic and generates a comprehensive course
                outline with chapters, learning objectives, and resources. You can
                then interact with an AI tutor for personalized help.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
          <p className="text-muted-foreground mb-6">
            Check out our other resources for more information
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/about">
              <Button variant="outline">About Us</Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline">Pricing</Button>
            </Link>
            <Link href="/terms">
              <Button variant="outline">Terms of Service</Button>
            </Link>
          </div>
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
