import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "@/components/ui/sonner";

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
    url: process.env.NEXT_PUBLIC_APP_URL || "https://coursemind.com",
    images: [
      {
        url: "/og-image.png",
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
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  themeColor: "#667eea",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
