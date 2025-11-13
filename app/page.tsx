"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Book,
  Layers,
  BarChart,
  PenLine,
  RotateCw,
  Check,
  Star,
  Menu,
  X,
} from "lucide-react";
import { appName } from "@/lib/constants";
import { STRIPE_PLANS } from "@/lib/stripe-plans";
import { useState, useEffect } from "react";

const stats = [
  { value: "14K+", label: "Creators onboarded" },
  { value: "39", label: "Languages supported" },
  { value: "2.1M", label: "Learners engaged" },
];

const features = [
  {
    icon: Zap,
    eyebrow: "Pipeline intelligence",
    title: "AI-orchestrated course generation",
    description:
      "Blend transcripts, briefs, and raw notes into structured modules with visuals, labs, and comprehension checkpoints in seconds.",
  },
  {
    icon: Book,
    eyebrow: "Delivery choice",
    title: "Adaptive modality mixer",
    description:
      "Ship theory + video or cinematic image-led lessons, auto-tuned to your brand voice, tone, and learner proficiency.",
  },
  {
    icon: PenLine,
    eyebrow: "Assessment fabric",
    title: "Evaluations with semantic depth",
    description:
      "Instantly craft scenario-based quizzes, reflections, and rubrics that measure mastery—not memorisation.",
  },
  {
    icon: Layers,
    eyebrow: "Global scale",
    title: "39-language localisation layer",
    description:
      "Launch inclusive learning journeys with native-quality localisation, cultural nuance, and accessibility baked in.",
  },
  {
    icon: RotateCw,
    eyebrow: "Inline support",
    title: "Realtime AI coach",
    description:
      "Learners unlock a context-aware mentor who explains, summarises, and challenges in the moment of need.",
  },
  {
    icon: BarChart,
    eyebrow: "Outcomes",
    title: "Live engagement analytics",
    description:
      "Visibility into completion, dwell time, and knowledge gaps with alerts piped to Slack or your LMS.",
  },
];

const steps = [
  {
    step: "01",
    title: "Describe your course",
    description: "Share your topic, target audience, and learning objectives in plain language.",
  },
  {
    step: "02",
    title: "AI builds your curriculum",
    description: "Our AI crafts structured modules, sources multimedia, and generates assessments.",
  },
  {
    step: "03",
    title: "Review and refine",
    description: "Edit content, adjust flow, and add your personal touch with our intuitive editor.",
  },
  {
    step: "04",
    title: "Publish and engage",
    description: "Launch your course, track learner progress, and iterate based on real-time analytics.",
  },
];

const testimonials = [
  {
    quote: "CourseMind cut our course creation time from 6 weeks to 2 days. The AI-generated content is remarkably accurate and engaging.",
    author: "Sarah Chen",
    role: "Learning & Development Manager",
    company: "TechCorp",
    rating: 5,
  },
  {
    quote: "The multi-language support is incredible. We're now able to serve our global team with localized content that actually makes sense.",
    author: "Marcus Rodriguez",
    role: "Chief Learning Officer",
    company: "GlobalEdge",
    rating: 5,
  },
  {
    quote: "Best investment we've made in our training program. The AI coach feature keeps our learners engaged and answers questions 24/7.",
    author: "Emily Watson",
    role: "Head of Training",
    company: "InnovateLabs",
    rating: 5,
  },
];

const plans = [
  {
    name: STRIPE_PLANS.FREE.name,
    price: `$${STRIPE_PLANS.FREE.price}`,
    features: [
      "Generate 5 Sub-Topics",
      "Lifetime access",
      "Theory & Image Course",
      "AI Teacher Chat",
    ],
    featured: false,
    billing: "forever",
  },
  {
    name: STRIPE_PLANS.MONTHLY.name,
    price: `$${STRIPE_PLANS.MONTHLY.price}`,
    features: [
      "Generate 10 Sub-Topics",
      "1 Month Access",
      "Theory & Image Course",
      "AI Teacher Chat",
      "Course In 39+ Languages",
      "Create Unlimited Course",
      "Video & Theory Course",
    ],
    featured: true,
    billing: "month",
  },
  {
    name: STRIPE_PLANS.YEARLY.name,
    price: `$${STRIPE_PLANS.YEARLY.price}`,
    features: [
      "Generate 10 Sub-Topics",
      "1 Year Access",
      "Theory & Image Course",
      "AI Teacher Chat",
      "Course In 39+ Languages",
      "Create Unlimited Course",
      "Video & Theory Course",
    ],
    featured: false,
    billing: "year",
  },
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out px-6 lg:px-10 ${
          isScrolled
            ? "py-3 bg-white/80 dark:bg-background/80 backdrop-blur-2xl border-b border-border/60 shadow-[0_18px_46px_-32px_rgba(15,23,42,0.65)]"
            : "py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <Link href="/" className="group flex items-center space-x-3">
            <div className="relative flex items-center gap-2">
              <Image src="/logo.svg" alt="CourseMind Logo" width={32} height={32} className="drop-shadow-sm transition-transform group-hover:scale-105" />
              <span className="font-display text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
                {appName}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2 xl:space-x-4">
            {[
              { href: "#features", label: "Features" },
              { href: "#how-it-works", label: "How it works" },
              { href: "#pricing", label: "Pricing" },
              { href: "#testimonials", label: "Stories" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-primary/5"
              >
                <span className="mr-2 h-1 w-1 rounded-full bg-transparent transition-colors group-hover:bg-primary" />
                {item.label}
              </a>
            ))}
          </nav>

          {/* Call to Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20">
                Start building
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-background/95 backdrop-blur-2xl border-b border-border/60 shadow-2xl">
            <nav className="flex flex-col p-6 space-y-4">
              {[
                { href: "#features", label: "Features" },
                { href: "#how-it-works", label: "How it works" },
                { href: "#pricing", label: "Pricing" },
                { href: "#testimonials", label: "Stories" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent">
                    Start building
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-36 pb-20 md:pt-40 md:pb-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.18),_transparent_55%)]" />
          <div className="pointer-events-none absolute inset-y-0 right-[10%] w-[42rem] rounded-full bg-primary/10 blur-[140px] opacity-60" />

          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-4 py-2 text-xs font-medium text-primary shadow-soft-xl backdrop-blur dark:border-primary/30 dark:bg-primary/15 dark:text-primary/90 animate-fade-in">
                  <Sparkles className="h-4 w-4" />
                  <span>AI-first course creation workspace</span>
                </div>

                <div className="space-y-6 animate-fade-up">
                  <h1 className="text-balance font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
                    Craft premium learning experiences in minutes—not months
                  </h1>
                  <p className="max-w-xl text-lg text-muted-foreground">
                    CourseMind turns raw ideas into studio-grade courses with narrative structure,
                    multimedia assets, and instant assessments. Collaborate with AI experts, switch
                    languages seamlessly, and deliver beautiful learning journeys at scale.
                  </p>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center animate-fade-up">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-indigo-500 px-8 shadow-lg shadow-primary/30 transition hover:shadow-primary/45"
                    >
                      <span className="relative flex items-center gap-2">
                        Build a course
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-border/70 bg-white/70 backdrop-blur transition hover:border-primary/60"
                    >
                      Browse templates
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col gap-6 rounded-2xl border border-border/60 bg-white/70 p-6 text-foreground shadow-soft-xl backdrop-blur md:flex-row md:items-center animate-fade-up dark:border-border/70 dark:bg-card/85">
                  <div className="flex flex-wrap items-center gap-8 text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                    {stats.map((stat) => (
                      <div key={stat.label} className="min-w-[120px]">
                        <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                        <p>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent md:h-12 md:w-px" />
                  <p className="max-w-[240px] text-sm text-muted-foreground">
                    Trusted by learning teams at high-growth startups and global enterprises.
                  </p>
                </div>
              </div>

              <div className="relative animate-fade-in">
                <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-primary/15 blur-2xl" />
                <div className="absolute -bottom-16 -right-20 h-40 w-40 rounded-full bg-accent/25 blur-[120px]" />

                <div className="relative overflow-hidden rounded-[2.25rem] border border-white/40 bg-gradient-to-br from-white via-white to-primary/5 shadow-[0_32px_80px_-32px_rgba(15,23,42,0.6)] dark:border-border/70 dark:from-card dark:via-card/90 dark:to-primary/15">
                  <div className="absolute inset-x-10 top-6 grid grid-cols-3 gap-3 rounded-2xl border border-white/60 bg-white/70 p-3 text-xs font-medium uppercase tracking-[0.25em] text-primary/80 dark:border-border/60 dark:bg-card/80 dark:text-primary/90">
                    <span className="rounded-xl bg-primary/10 px-3 py-2 text-center">Plan</span>
                    <span className="rounded-xl bg-primary/10 px-3 py-2 text-center">Create</span>
                    <span className="rounded-xl bg-primary/10 px-3 py-2 text-center">Ship</span>
                  </div>
                  <div className="relative mt-24 aspect-[5/3] overflow-hidden rounded-t-[2rem] bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
                    <div className="text-center space-y-4 p-8">
                      <Sparkles className="h-16 w-16 text-primary mx-auto animate-pulse" />
                      <p className="text-sm text-muted-foreground">Dashboard preview coming soon</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-8 py-6 text-foreground">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">In flight</p>
                      <p className="text-lg font-semibold text-foreground">Product Analytics 101</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
                      Deploying...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center space-y-4 mb-16 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-4 py-2 text-xs font-medium text-primary shadow-soft-xl backdrop-blur dark:border-primary/30 dark:bg-primary/15">
                <Zap className="h-3 w-3" />
                <span>Powered by AI</span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-balance">
                Everything you need to build world-class courses
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From ideation to deployment, CourseMind handles the heavy lifting so you can focus on what matters—great content.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl border border-border/60 bg-white/70 p-8 shadow-soft-xl backdrop-blur transition-all duration-300 hover:shadow-xl hover:border-primary/40 dark:bg-card/85 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative space-y-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-primary uppercase tracking-wider">
                        {feature.eyebrow}
                      </p>
                      <h3 className="text-xl font-semibold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center space-y-4 mb-16 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-4 py-2 text-xs font-medium text-primary shadow-soft-xl backdrop-blur dark:border-primary/30 dark:bg-primary/15">
                <RotateCw className="h-3 w-3" />
                <span>Simple Process</span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-balance">
                From idea to course in 4 easy steps
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Our streamlined workflow makes course creation effortless, whether you're building your first course or your hundredth.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative flex gap-6 animate-fade-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-white font-bold text-lg shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-28 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center space-y-4 mb-16 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-4 py-2 text-xs font-medium text-primary shadow-soft-xl backdrop-blur dark:border-primary/30 dark:bg-primary/15">
                <Star className="h-3 w-3 fill-primary" />
                <span>Loved by educators</span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-balance">
                Trusted by thousands of creators
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See what learning professionals are saying about CourseMind.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border/60 bg-white/70 p-8 shadow-soft-xl backdrop-blur dark:bg-card/85 space-y-6 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="pt-4 border-t border-border/60">
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{testimonial.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="text-center space-y-4 mb-16 animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-4 py-2 text-xs font-medium text-primary shadow-soft-xl backdrop-blur dark:border-primary/30 dark:bg-primary/15">
                <Sparkles className="h-3 w-3" />
                <span>Simple Pricing</span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl text-balance">
                Choose the perfect plan for your needs
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start free and scale as you grow. No hidden fees, cancel anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-2xl border p-8 transition-all duration-300 animate-fade-up ${
                    plan.featured
                      ? "border-primary bg-white dark:bg-card shadow-2xl shadow-primary/20 scale-105"
                      : "border-border/60 bg-white/70 dark:bg-card/85 shadow-soft-xl hover:border-primary/40"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {plan.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-accent text-white text-xs font-medium rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground">{plan.name}</h3>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-muted-foreground">/{plan.billing}</span>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/signup" className="block">
                      <Button
                        className={`w-full ${
                          plan.featured
                            ? "bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20"
                            : ""
                        }`}
                        variant={plan.featured ? "default" : "outline"}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="mx-auto max-w-4xl px-6 lg:px-10 text-center space-y-8 animate-fade-up">
            <div className="space-y-4">
              <h2 className="font-display text-3xl md:text-5xl text-balance text-foreground">
                Ready to transform your course creation?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of educators and trainers who are already building amazing courses with CourseMind.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent px-8 shadow-lg shadow-primary/30 hover:shadow-primary/45"
                >
                  <span className="flex items-center gap-2">
                    Start building for free
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Button>
              </Link>
              <Link href="#pricing">
                <Button variant="outline" size="lg" className="px-8">
                  View pricing
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              No credit card required • Free plan available forever
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <Image 
                    src="/logo.svg" 
                    alt="CourseMind Logo" 
                    width={40} 
                    height={40} 
                    className="drop-shadow-sm"
                  />
                </div>
                <span className="font-display text-xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {appName}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered course creation platform for modern educators.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="/refund" className="hover:text-foreground transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/60 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 {appName}. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.070 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.220-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.640.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.580.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
