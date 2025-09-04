"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2, Crown, Flame, Trophy, Timer, Dumbbell, ArrowRight, Sparkles, PenLine,
} from "lucide-react";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// --- Demo data (replace with API data) --------------------------------------
type Tier = "emerald" | "free";
type Exercise = { id: string; title: string; scheme: string; cap: string; notes: string };
type Plan = {
  id: string;
  name: string;
  tier: Tier;
  level: number;
  xp: number;
  xpToNext: number;
  weeklyWorkouts: number;
  completedThisWeek: number;
  streakDays: number;
  nextWorkoutETA: string;
  today: Exercise[];
};

const demoPlans: Plan[] = [
  {
    id: "emerald-001",
    name: "Emerald",
    tier: "emerald",
    level: 7,
    xp: 5400,
    xpToNext: 6000,
    weeklyWorkouts: 5,
    completedThisWeek: 3,
    streakDays: 12,
    nextWorkoutETA: "in 2h 15m",
    today: [
      { id: "ex1", title: "Push-ups", scheme: "3 x 10", cap: "10 min", notes: "Tempo 2-1-1" },
      { id: "ex2", title: "Goblet Squat", scheme: "4 x 12", cap: "12 min", notes: "RPE 7" },
      { id: "ex3", title: "Plank", scheme: "3 x 60s", cap: "8 min", notes: "Hold tight core" },
    ],
  },
  {
    id: "free-101",
    name: "Starter",
    tier: "free",
    level: 2,
    xp: 320,
    xpToNext: 500,
    weeklyWorkouts: 3,
    completedThisWeek: 1,
    streakDays: 3,
    nextWorkoutETA: "ready now",
    today: [
      { id: "ex4", title: "Knee Push-ups", scheme: "3 x 8", cap: "8 min", notes: "Rest 60s" },
      { id: "ex5", title: "Bodyweight Squat", scheme: "3 x 12", cap: "10 min", notes: "Heels down" },
      { id: "ex6", title: "Dead Bug", scheme: "3 x 10/side", cap: "8 min", notes: "Controlled" },
    ],
  },
];

// --- UI helpers -------------------------------------------------------------
function TierBadge({ tier }: { tier: Tier }) {
  if (tier === "emerald") {
    return (
      <Badge className="gap-1 rounded-full px-3 py-1 text-sm bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow">
        <Crown className="h-4 w-4" /> Emerald
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1 rounded-full px-3 py-1 text-sm">
      Free
    </Badge>
  );
}

function Ring({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 36 36" className="h-full w-full">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(142 76% 36%)" />
            <stop offset="100%" stopColor="hsl(142 71% 45%)" />
          </linearGradient>
        </defs>
        <path
          className="stroke-muted"
          d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32"
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M18 2a16 16 0 1 1 0 32a16 16 0 1 1 0-32"
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          stroke="url(#grad)"
          strokeDasharray={`${clamped}, 100`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-sm">
        <span className="font-semibold">{clamped}%</span>
      </div>
    </div>
  );
}

// --- Detail modal content (reuses your design) ------------------------------
function PlanDetail({ plan }: { plan: Plan }) {
  const weekProgress = useMemo(
    () => Math.round((plan.completedThisWeek / Math.max(1, plan.weeklyWorkouts)) * 100),
    [plan.completedThisWeek, plan.weeklyWorkouts]
  );
  const xpProgress = useMemo(
    () => Math.round((plan.xp / Math.max(1, plan.xpToNext)) * 100),
    [plan.xp, plan.xpToNext]
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{plan.name} Plan</h2>
          <p className="text-muted-foreground">
            Your personalized program, levels, and today&apos;s session at a glance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <TierBadge tier={plan.tier} />
          <Badge variant="outline" className="rounded-full px-3 py-1">Level {plan.level}</Badge>
          <Badge variant="secondary" className="rounded-full px-3 py-1 flex items-center gap-1">
            <Timer className="h-4 w-4" /> Next workout {plan.nextWorkoutETA}
          </Badge>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Today */}
        <Card className="md:col-span-2 border-border/60 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl">Today&apos;s Workout</CardTitle>
            <Badge className="gap-1"><Dumbbell className="h-4 w-4" /> Session</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              {plan.today.map((ex) => (
                <li key={ex.id} className="group flex items-center justify-between rounded-xl border bg-card/60 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition" />
                    <div>
                      <div className="font-medium">{ex.title}</div>
                      <div className="text-xs text-muted-foreground">{ex.notes}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="rounded-full">{ex.scheme}</Badge>
                    <Badge variant="secondary" className="rounded-full">
                      <Timer className="mr-1 h-3 w-3" />{ex.cap}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
              <div className="text-sm text-muted-foreground">Estimated time · 28–35 min</div>
              <div className="flex items-center gap-3">
                <Button variant="outline" className="rounded-xl gap-2">
                  <PenLine className="h-4 w-4" /> Edit session
                </Button>
                <Button className="rounded-xl gap-2">
                  Start workout <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="border-border/60 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Ring value={xpProgress} />
                <div>
                  <div className="font-medium">Level {plan.level}</div>
                  <div className="text-sm text-muted-foreground">{plan.xp} / {plan.xpToNext} XP</div>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-sm">
                <Flame className="h-4 w-4 text-primary" /> Weekly target
              </div>
              <Progress value={weekProgress} className="h-2" />
              <div className="mt-1 text-xs text-muted-foreground">
                {plan.completedThisWeek}/{plan.weeklyWorkouts} completed this week
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-card/60 p-4">
                <div className="text-xs text-muted-foreground">Streak</div>
                <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
                  <Flame className="h-5 w-5 text-primary" /> {plan.streakDays} days
                </div>
              </div>
              <div className="rounded-xl border bg-card/60 p-4">
                <div className="text-xs text-muted-foreground">Milestone</div>
                <div className="mt-1 flex items-center gap-2 text-lg font-semibold">
                  <Trophy className="h-5 w-5 text-primary" /> 3 this week
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Highlight / CTA */}
      <Card className="relative overflow-hidden border-border/60 shadow-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-500" /> {plan.name} Plan
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Premium guidance, adaptive progression, priority support
            </div>
          </div>
          <TierBadge tier={plan.tier} />
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Next recommended session is ready. Keep your streak going.
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" className="rounded-xl">View plan</Button>
            <Button className="rounded-xl">Start now</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// --- Plans list + modal -----------------------------------------------------
export default function MyPlansScreen() {
  const [plans] = useState<Plan[]>(demoPlans); // replace with API
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Plan | null>(null);

  const openPlan = (p: Plan) => {
    setSelected(p);
    setOpen(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background px-4 py-10">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(50%_50%_at_50%_20%,#000_40%,transparent)]">
        <div className="absolute left-[10%] top-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute right-[8%] top-48 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <section className="mx-auto max-w-7xl space-y-10">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My Plans</h1>
            <p className="text-muted-foreground">Pick a plan to see today&apos;s session and your progress.</p>
          </div>
        </header>

        {/* Plans grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.id} className="border-border/60 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  {p.name} {p.tier === "emerald" && <Sparkles className="h-4 w-4 text-emerald-500" />}
                </CardTitle>
                <TierBadge tier={p.tier} />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="rounded-full bg-muted px-2 py-1">Level {p.level}</div>
                  <div className="rounded-full bg-muted px-2 py-1">Streak {p.streakDays}d</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {p.weeklyWorkouts} workouts/week · Next {p.nextWorkoutETA}
                </div>
                <div className="pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full rounded-xl" onClick={() => openPlan(p)}>
                        View details
                      </Button>
                    </DialogTrigger>
                    {/* Keep Dialog mounted for a11y & animation; control via outside state */}
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* The actual modal (single instance) */}
        <Dialog open={open}  onOpenChange={setOpen}>
          <DialogContent className="!max-w-6xl !w-[90vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              {/* a11y: title present but hidden visually */}
              <VisuallyHidden>
                <DialogTitle>Plan details</DialogTitle>
              </VisuallyHidden>
            </DialogHeader>

            {selected && <PlanDetail plan={selected} />}
          </DialogContent>
        </Dialog>
      </section>
    </main>
  );
}
