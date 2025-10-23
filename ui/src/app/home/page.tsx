import content from "./content.json"
import { Button } from "@/components/ui-library/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-library/ui/card"
import {
  Fortuna,
  Link as LinkIcon,
  Lightbulb,
  Wand2,
  Eye,
  BookOpen,
  Target,
  Users,
  Star,
  Compass,
  Heart,
  Zap,
  Shield,
  Rocket,
  ChevronRight,
  CheckCircle,
  ArrowRight,
  Quote,
  MessageCircle,
  Award,
  Infinity,
  Crown,
  Feather
} from "lucide-react";

import { Badge } from "@/components/ui-library/ui/badge";
import Image from "next/image";
import NextLink from "next/link";

const iconMap = {
  fortuna: Fortuna,
  link: LinkIcon,
  lightbulb: Lightbulb,
  wand2: Wand2,
  eye: Eye,
  bookOpen: BookOpen,
  target: Target,
  users: Users,
  star: Star,
  compass: Compass,
  heart: Heart,
  zap: Zap,
  shield: Shield,
  rocket: Rocket,
  messageCircle: MessageCircle,
  award: Award,
  crown: Crown,
  feather: Feather,
  infinity: Infinity
}

export default function LandingPage() {
  // Cohesive but varied gradient set for icon backgrounds
  const gradientVariants = [
    'bg-gradient-to-br from-primary to-secondary',
    'bg-gradient-to-tr from-secondary to-primary',
    'bg-gradient-to-r from-primary/90 to-secondary/70',
    'bg-gradient-to-bl from-secondary/90 to-primary/70',
  ] as const;

  // Solid background variants (no gradients) for icon tiles
  const solidBgVariants = [
    'bg-primary',
    'bg-secondary',
    'bg-primary/80',
    'bg-secondary/80',
  ] as const;

  // Unified solid background for all icon tiles (no alternation)
  const iconSolid = 'bg-primary';

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Cosmic Editorial Hero */}
      <section className="relative min-h-[100dvh] overflow-hidden">
        {/* Parallax hero image */}
        <div className="absolute inset-0 bg-[url('/static/hero.jpg')] bg-cover bg-center parallax-fixed brightness-110 dark:brightness-90 saturate-110" />
        {/* Starfield only in dark mode for extra depth */}
        <div className="absolute inset-0 starfield opacity-0 dark:opacity-100" />
        {/* Spotlights tuned per theme for balance */}
        <div className="absolute inset-0 spotlight opacity-20 dark:opacity-25" />
        {/* Subtle color wash overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-secondary/15 opacity-80" />
        <div className="absolute inset-0 grain" />
        {/* Theme-aware vignette for text contrast over photo */}
        <div className="absolute inset-0 bg-black/20 dark:bg-black/50" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 dark:from-black/50 dark:to-black/70" />

        {/* Chromatic orbs (subtle over photo) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary/10 dark:bg-primary/10 blur-3xl animate-float" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-secondary/10 dark:bg-secondary/10 blur-[90px] animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 min-h-[100dvh] flex items-center">
          <div className="max-w-6xl mx-auto text-center">
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/80 text-xs sm:text-sm mb-6 backdrop-blur">
              <Fortuna className="w-4 h-4" />
              Mystical AI for Story Divination
            </div>

            {/* Headline */}
            <h1 className="gradient-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight mb-5">
              {content.hero.headline}
            </h1>

            {/* Subheadline */}
            <p className="text-white/80 text-lg sm:text-2xl md:text-3xl max-w-4xl mx-auto leading-relaxed mb-6">
              {content.hero.subheadline}
            </p>

            {/* Description */}
            <p className="text-white/70 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-10">
              {content.hero.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-scale-in">
              <NextLink href={content.hero.primaryCTA.href} passHref>
                <Button className="group bg-white text-black hover:bg-white/90 shadow-xl py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg">
                  {content.hero.primaryCTA.label}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </NextLink>
              <NextLink href={content.hero.secondaryCTA.href} passHref>
                <Button
                  variant="outline"
                  className="bg-transparent text-white ring-1 ring-white/50 hover:ring-white/70 hover:bg-white/10 backdrop-blur-sm shadow-xl py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg"
                >
                  {content.hero.secondaryCTA.label}
                </Button>
              </NextLink>
              </div>
            </div>
          </div>
        
      </section>

      {/* Stats Section */}
      {/* <section className="py-20 px-6 bg-card/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {content.stats.map((stat, index) => {
              const IconComponent = iconMap[stat.icon as keyof typeof iconMap]
              return (
                <div key={index} className="text-center group animate-scale-in">
                  <div className="mb-4 flex justify-center">
                    <IconComponent className="w-8 h-8 text-primary group-hover:animate-bounce-gentle" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section> */}

      {/* Editorial Split: What Makes Us Unique (Shuttle + Parallax) */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36 px-4 sm:px-6 bg-shuttle parallax-fixed">
        {/* Mesh glow overlay */}
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        <div className="absolute inset-0 grain" />

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start max-w-7xl mx-auto">
            {/* Editorial lead */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-6">
                <Fortuna className="w-4 h-4" />
                What Makes Us Unique
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight gradient-text mb-6">
                {content.howDifferent.title}
              </h2>
              <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed mb-4">
                {content.howDifferent.subtitle}
              </p>
              <p className="text-base sm:text-lg leading-relaxed max-w-2xl">
                {content.howDifferent.description}
              </p>
            </div>

            {/* Pull-quote + Points */}
            <div className="lg:col-span-5">
              <div className="relative bg-card/65 backdrop-blur-xl border border-border/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl opacity-40" />
                <div className="relative">
                  <blockquote className="text-xl sm:text-2xl font-semibold mb-6">
                    “{content.howDifferent.subtitle}”
                  </blockquote>
                  <div className="flex flex-wrap gap-3">
                    {content.howDifferent.points.map((point, i) => (
                      <span key={i} className="px-3 py-1.5 rounded-full text-sm bg-white/10 border border-white/15 hover:bg-white/15 transition-colors">
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Concepts — Dark Minimal Editorial */}
      <section className="relative py-24 lg:py-36 px-4 sm:px-6 bg-black">
        <div className="absolute inset-0 gradient-mesh opacity-30" />
        <div className="absolute inset-0 grain" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-5 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              <Crown className="w-4 h-4" />
              Sacred Foundations
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white">
              The Sacred Foundations
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed mt-6">
              Three mystical pillars that transform ordinary writing into extraordinary storytelling
            </p>
          </div>

          <div className="grid gap-8 lg:gap-10 lg:grid-cols-3 max-w-7xl mx-auto">
            {content.coreConcepts.map((concept, index) => {
              const IconComponent = iconMap[concept.icon as keyof typeof iconMap]
              const num = (index + 1).toString().padStart(2, '0')
              return (
                <div key={index} className="group relative">
                  <div className="relative rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 sm:p-10 overflow-hidden tilt">
                    {/* Oversized numeral */}
                    <div className="absolute -top-6 -left-2 text-[120px] leading-none font-black text-white/5 select-none">
                      {num}
                    </div>
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-3">{concept.title}</h3>
                    <p className="text-white/70 leading-relaxed mb-5">{concept.description}</p>
                    <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                      <p className="text-sm text-white/80 italic">{concept.details}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features: Inverted Solid Background with dots */}
      <section id="features" className="relative py-20 sm:py-28 lg:py-32 px-4 sm:px-6 bg-card">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        </div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-secondary/15 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-5">
                <Wand2 className="w-4 h-4" />
                Feature Set
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 gradient-text">
                Mystical Features
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Unveil the hidden magic in your stories
              </p>
            </div>

            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {content.features.map((feature, index) => {
                const IconComponent = iconMap[feature.icon as keyof typeof iconMap]
                return (
                  <div key={index} className="group h-full">
                    <div className="relative rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl p-6 sm:p-8 h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
                      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                      <div className="relative">
                        {/* Icon */}
                        <div className="mb-5 sm:mb-7">
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 ${iconSolid} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          </div>
                        </div>
                        {/* Content */}
                        <h3 className="text-2xl font-bold leading-tight mb-3 text-foreground group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground text-base leading-relaxed mb-4">
                          {feature.description}
                        </p>
                        {/* Example */}
                        <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg mt-auto">
                          <p className="text-primary text-sm italic font-medium">
                            &ldquo;{feature.example}&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Process — Patterned Background (no image) */}
      <section className="relative py-24 lg:py-36 px-4 sm:px-6 bg-card parallax-fixed overflow-hidden">
        {/* Subtle shuttle pattern + mesh for motion */}
        <div className="absolute inset-0 bg-shuttle opacity-50" />
        <div className="absolute inset-0 gradient-mesh opacity-15" />
        <div className="absolute inset-0 grain" />
        {/* Gentle vignette for readability */}
        <div className="absolute inset-0 bg-black/5 dark:bg-black/30" />
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16 lg:mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/15 text-primary px-5 py-2 rounded-full text-sm font-medium mb-6 border border-primary/30">
              <Compass className="w-4 h-4" />
              Our Process
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 gradient-text">
              {content.process.title}
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto">
              {content.process.subtitle}
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-7xl mx-auto">
            <div className="hidden lg:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-full" />
            <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {content.process.steps.map((step, index) => {
                const IconComponent = iconMap[step.icon as keyof typeof iconMap]
                return (
                  <div key={index} className="group relative">
                    <div className="relative rounded-3xl border border-border/50 bg-background/70 backdrop-blur-xl p-8 text-center hover:-translate-y-1 transition-transform duration-300">
                      <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                      <div className="relative mb-6 flex justify-center">
                        <IconComponent className="w-12 h-12 text-primary" />
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Audience — Minimal Infographic Grid */}
      <section className="relative py-20 lg:py-28 px-4 sm:px-6 bg-card overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-20" />
        <div className="absolute inset-0 grain" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
              <Users className="w-4 h-4" />
              Who it's for
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 gradient-text">
              {content.audience.title}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-10">
              {content.audience.subtitle}
            </p>

            {/* Icon badges with short labels (no cards) */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(8.5rem,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))] gap-6 sm:gap-8 place-items-center">
              {content.audience.segments.map((segment, index) => {
                const IconComponent = iconMap[segment.icon as keyof typeof iconMap]
                return (
                  <div key={index} className="flex flex-col items-center gap-3 group">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/10 group-hover:scale-105 transition-transform">
                      <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                    </div>
                    <div className="text-sm sm:text-base font-semibold text-foreground text-center leading-tight">
                      {segment.title}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Micro copy */}
            <div className="mt-10 text-sm sm:text-base text-muted-foreground">
              Built for creators, founders, and teams who value clarity and speed.
            </div>
          </div>
        </div>
      </section>

      {/* Pricing — Dark Mesh with Glass Tiers */}
      <section id="pricing" className="relative py-24 lg:py-36 px-4 sm:px-6 bg-black overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-25" />
        <div className="absolute inset-0 grain" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
                <Crown className="w-4 h-4" />
                Choose Your Path
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
                {content.pricing.title}
              </h2>
              <p className="text-2xl text-white/70 max-w-4xl mx-auto">
                {content.pricing.subtitle}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
              {content.pricing.plans.map((plan, index) => (
                <div key={index} className={`group relative ${plan.popular ? 'lg:-translate-y-2' : ''}`}>
                  <div className={`absolute -inset-4 rounded-3xl blur-2xl transition-all duration-500 ${plan.popular
                      ? 'bg-gradient-to-r from-primary/40 to-secondary/40 opacity-100'
                      : 'bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100'
                    }`} />

                  <div className={`relative bg-white/[0.06] backdrop-blur-xl rounded-3xl border transition-all duration-500 hover:shadow-2xl overflow-hidden group-hover:-translate-y-2 ${plan.popular
                      ? 'border-white/30 shadow-2xl shadow-primary/20'
                      : 'border-white/15 hover:border-white/25 hover:shadow-primary/10'
                    }`}>
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0">
                        <div className="bg-gradient-to-r from-primary to-secondary text-white text-center py-3 text-sm font-bold">
                          ✨ Most Popular ✨
                        </div>
                      </div>
                    )}

                    <div className={`text-center p-8 ${plan.popular ? 'pt-16' : 'pt-8'}`}>
                      <h3 className="text-3xl font-bold mb-4 text-white">
                        {plan.name}
                      </h3>
                      <div className="mb-6">
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-6xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            ${plan.price}
                          </span>
                          <span className="text-white/70 text-lg">/{plan.period}</span>
                        </div>
                      </div>
                      <p className="text-white/70 text-lg leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    <div className="px-8 pb-8">
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-4">
                            <div className="w-6 h-6 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-white/80 font-medium">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <NextLink href="#" passHref>
                        <Button
                          className={`w-full py-6 text-lg font-semibold transition-all duration-300 ${plan.popular
                              ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-xl'
                              : 'hover:bg-white/10 border-2 border-white/20 hover:border-white/40 text-white'
                            }`}
                          variant={plan.popular ? 'default' : 'outline'}
                        >
                          {plan.cta}
                        </Button>
                      </NextLink>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA — Stark Solid with Chroma Headline */}
      <section className="relative py-24 lg:py-36 px-4 sm:px-6 bg-black overflow-hidden">
        <div className="absolute inset-0 gradient-mesh opacity-15" />
        <div className="absolute inset-0 grain" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full text-sm font-medium mb-10 border border-white/20">
              <Rocket className="w-5 h-5" />
              Begin Your Journey
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
              {content.closingCTA.headline}
            </h2>
            <p className="text-2xl md:text-3xl mb-14 text-white/70 max-w-4xl mx-auto leading-relaxed">
              {content.closingCTA.subheadline}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <NextLink href={content.closingCTA.primaryCTA.href} passHref>
                <Button className="group relative px-12 py-6 text-xl font-bold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-2xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105">
                  <span className="relative z-10">{content.closingCTA.primaryCTA.label}</span>
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" />
                </Button>
              </NextLink>
              <Button variant="outline" className="px-12 py-6 text-xl font-semibold border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                {content.closingCTA.secondaryCTA.label}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-20 px-6 overflow-hidden">
        {/* Footer background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/70 to-card/50 backdrop-blur-xl" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Main footer content */}
            <div className="grid lg:grid-cols-5 gap-12 mb-16">
              {/* Brand section */}
              <div className="lg:col-span-2">
                <div className="mb-8">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                    {content.footer.brand}
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    {content.footer.tagline}
                  </p>

                  {/* Decorative element */}
                  <div className="flex items-center gap-2 text-primary/60">
                    <Fortuna className="w-4 h-4" />
                    <span className="text-sm font-medium">Crafting magical stories since 2024</span>
                  </div>
                </div>
              </div>

              {/* Links sections */}
              <div className="space-y-6">
                <h4 className="font-bold text-foreground text-lg mb-6 relative">
                  Product
                  <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                </h4>
                <div className="space-y-4">
                  {content.footer.links.product.map((link, index) => (
                    <a key={index} href={link.href} className="block text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="font-bold text-foreground text-lg mb-6 relative">
                  Company
                  <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                </h4>
                <div className="space-y-4">
                  {content.footer.links.company.map((link, index) => (
                    <a key={index} href={link.href} className="block text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="font-bold text-foreground text-lg mb-6 relative">
                  Support
                  <div className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                </h4>
                <div className="space-y-4">
                  {content.footer.links.support.map((link, index) => (
                    <a key={index} href={link.href} className="block text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom section */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 rounded-2xl" />
              <div className="relative border border-border/30 rounded-2xl p-8 backdrop-blur-sm">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                  <div className="text-muted-foreground">
                    © 2024 {content.footer.brand}. All rights reserved.
                  </div>
                  <div className="flex gap-8">
                    {content.footer.links.legal.map((link, index) => (
                      <a key={index} href={link.href} className="text-muted-foreground hover:text-primary transition-colors duration-300">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
