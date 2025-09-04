"use client";

import { Dumbbell, Users, Target, Sparkles, Heart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background px-4 py-12">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_20%,#000_50%,transparent)]">
        <div className="absolute left-[5%] top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-[10%] top-48 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>

      <section className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Dumbbell className="h-6 w-6" />
            <span className="font-semibold">AiMuscle</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            About Us
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            AiMuscle is your AI-powered fitness companion. We combine smart
            training algorithms with expert-designed programs to help you get
            stronger, healthier, and more consistent — whether you’re just
            starting or chasing elite goals.
          </p>
        </header>

        {/* Mission + Vision */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-border/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" /> Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              Empower people worldwide to build lasting fitness habits through
              personalized, data-driven training — no guesswork, just progress.
            </CardContent>
          </Card>
          <Card className="border-border/60 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" /> Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              A future where AI coaches adapt to your lifestyle, unlocking your
              potential and making sustainable health accessible to everyone.
            </CardContent>
          </Card>
        </div>

        {/* Core values */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-center">
            Our Core Values
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Card className="border-border/60 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-primary" /> Community
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                We believe fitness is better together — motivation, support, and
                shared progress.
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="h-5 w-5 text-primary" /> Wellness
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Fitness is more than numbers — it’s about health, balance, and
                long-term wellbeing.
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" /> Innovation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                We blend science, design, and technology to create smarter,
                simpler training experiences.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
