import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Sparkles } from "lucide-react";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Welcome to CourseMind Pro
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">What's Next?</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Start creating AI-powered courses</li>
                  <li>• Access advanced AI tutor features</li>
                  <li>• Generate interactive quizzes</li>
                  <li>• Earn course certificates</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              A confirmation email has been sent to your inbox with your receipt and subscription details.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Link href="/dashboard" className="w-full">
              <Button className="w-full bg-gradient-to-r from-primary to-accent">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/create" className="w-full">
              <Button variant="outline" className="w-full">
                Create Your First Course
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t text-center">
            <p className="text-xs text-muted-foreground">
              Need help? <Link href="/contact" className="underline">Contact Support</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
