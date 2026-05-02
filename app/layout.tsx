import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "@/components/ui/sonner";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CourseMind - AI-Powered Course Generation Platform",
  description: "Generate comprehensive courses on any topic with AI in minutes. Support for 39 languages, video tutorials, and interactive learning.",
  keywords: ["AI course generation", "online learning", "course creator", "education platform", "AI learning", "course builder"],
  authors: [{ name: "CourseMind" }],
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.json",
  applicationName: "CourseMind",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CourseMind",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "CourseMind",
    title: "CourseMind - AI-Powered Course Generation",
    description: "Generate comprehensive courses on any topic with AI in minutes. Support for 39 languages.",
    url: siteUrl,
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "CourseMind",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CourseMind - AI-Powered Course Generation",
    description: "Generate comprehensive courses on any topic with AI in minutes. Support for 39 languages.",
    images: ["/logo.svg"],
  },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#667eea",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${manrope.variable} font-sans`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
