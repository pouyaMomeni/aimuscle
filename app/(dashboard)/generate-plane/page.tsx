"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Send, CheckCircle2, Dumbbell, Flame, Trophy, Timer, Sparkles, PenLine,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

/* ---------------- Types ------------------- */
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

type Answers = {
  goal: "muscle" | "fatloss" | "endurance" | "" ;
  experience: "beginner" | "intermediate" | "advanced" | "";
  days: number; // 1..7
  equipment: "none" | "dumbbells" | "fullgym" | "";
  session: number; // minutes
  focus: string; // free text (areas, injuries)
};

/* -------------- Helpers ------------------- */
function TierBadge({ tier }: { tier: Tier }) {
  if (tier === "emerald") {
    return (
      <Badge className="gap-1 rounded-full px-3 py-1 text-sm bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow">
        <Sparkles className="h-4 w-4" /> Emerald
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

/* -------------- Fake generator (swap with API later) ------------------- */
function generatePlan(a: Answers): Plan {
  const isEmerald = a.days >= 4 || a.equipment === "fullgym";
  const tier: Tier = isEmerald ? "emerald" : "free";
  const name =
    a.goal === "muscle" ? "Hypertrophy" :
    a.goal === "fatloss" ? "Lean Cut" :
    a.goal === "endurance" ? "Engine" : "Custom";

  const vol = a.experience === "advanced" ? 5 : a.experience === "intermediate" ? 4 : 3;
  const sets = a.experience === "advanced" ? "5 x 8–10" : a.experience === "intermediate" ? "4 x 10–12" : "3 x 12–15";
  const cap = a.session <= 40 ? "8–10 min" : a.session <= 60 ? "10–12 min" : "12–15 min";
  const cue = a.goal === "muscle" ? "Controlled tempo, full ROM"
            : a.goal === "fatloss" ? "Short rests, steady pace"
            : "Smooth breathing, steady cadence";
  const today: Exercise[] = [
    { id: "ex1", title: a.goal === "endurance" ? "Row / Bike" : "Goblet Squat", scheme: sets, cap, notes: cue },
    { id: "ex2", title: a.goal === "fatloss" ? "KB Swings" : "DB Bench Press", scheme: sets, cap, notes: cue },
    { id: "ex3", title: a.goal === "muscle" ? "Lat Pulldown" : "Plank", scheme: sets, cap, notes: cue },
  ];

  return {
    id: `plan-${Math.random().toString(36).slice(2, 8)}`,
    name,
    tier,
    level: a.experience === "advanced" ? 6 : a.experience === "intermediate" ? 3 : 1,
    xp: 3000,
    xpToNext: 5000,
    weeklyWorkouts: a.days || 3,
    completedThisWeek: 0,
    streakDays: 0,
    nextWorkoutETA: "ready now",
    today,
  };
}

/* -------------- Typewriter chat bubble ------------------- */
function useTypewriter(text: string, play: boolean) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    if (!play) return;
    setDisplay("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplay(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 10);
    return () => clearInterval(id);
  }, [text, play]);
  return display;
}

/* -------------- Main Page ------------------- */
export default function GeneratePlanPage() {
  const [answers, setAnswers] = useState<Answers>({
    goal: "", experience: "", days: 3, equipment: "", session: 45, focus: "",
  });
  const [step, setStep] = useState(0);
  const [ready, setReady] = useState(false);

  const plan = useMemo(() => (ready ? generatePlan(answers) : null), [answers, ready]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: 9999, behavior: "smooth" });
  }, [step]);

  const questions = [
    {
      id: "goal",
      bot: "What’s your main goal?",
      ui: (
        <Select onValueChange={(v: any) => setAnswers(a => ({ ...a, goal: v }))}>
          <SelectTrigger><SelectValue placeholder="Choose a goal" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="muscle">Build muscle</SelectItem>
            <SelectItem value="fatloss">Lose fat</SelectItem>
            <SelectItem value="endurance">Improve endurance</SelectItem>
          </SelectContent>
        </Select>
      ),
      canNext: () => !!answers.goal,
    },
    {
      id: "experience",
      bot: "How experienced are you?",
      ui: (
        <Select onValueChange={(v: any) => setAnswers(a => ({ ...a, experience: v }))}>
          <SelectTrigger><SelectValue placeholder="Select level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      ),
      canNext: () => !!answers.experience,
    },
    {
      id: "days",
      bot: "How many days per week can you train?",
      ui: (
        <div className="px-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>1</span><span>7</span>
          </div>
          <Slider
            defaultValue={[answers.days]}
            min={1}
            max={7}
            step={1}
            onValueChange={([v]) => setAnswers(a => ({ ...a, days: v }))}
          />
          <div className="mt-2 text-sm">Days/week: <span className="font-medium">{answers.days}</span></div>
        </div>
      ),
      canNext: () => answers.days >= 1 && answers.days <= 7,
    },
    {
      id: "equipment",
      bot: "What equipment do you have?",
      ui: (
        <Select onValueChange={(v: any) => setAnswers(a => ({ ...a, equipment: v }))}>
          <SelectTrigger><SelectValue placeholder="Select equipment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Bodyweight only</SelectItem>
            <SelectItem value="dumbbells">Dumbbells / Bands</SelectItem>
            <SelectItem value="fullgym">Full gym</SelectItem>
          </SelectContent>
        </Select>
      ),
      canNext: () => !!answers.equipment,
    },
    {
      id: "session",
      bot: "How long should each session be?",
      ui: (
        <div className="px-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>20m</span><span>90m</span>
          </div>
          <Slider
            defaultValue={[answers.session]}
            min={20}
            max={90}
            step={5}
            onValueChange={([v]) => setAnswers(a => ({ ...a, session: v }))}
          />
          <div className="mt-2 text-sm">Session length: <span className="font-medium">{answers.session} min</span></div>
        </div>
      ),
      canNext: () => answers.session >= 20,
    },
    {
      id: "focus",
      bot: "Any focus areas or injuries I should consider?",
      ui: (
        <Textarea
          placeholder="e.g., knees sensitive, focus on glutes & core"
          value={answers.focus}
          onChange={(e) => setAnswers(a => ({ ...a, focus: e.target.value }))}
          rows={3}
        />
      ),
      canNext: () => true,
    },
  ];

  const current = questions[step];
  const botText = current?.bot ?? "All set! Generating your plan…";
  const typed = useTypewriter(botText, true);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background px-4 py-10">
      {/* ambient glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(50%_50%_at_50%_20%,#000_40%,transparent)]">
        <div className="absolute left-[10%] top-20 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute right-[8%] top-48 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <section className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-3">
        {/* Chat-like generator */}
        <Card className="border-border/60 shadow-lg lg:col-span-1">
          <CardHeader className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" /> Generate your plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={containerRef}
              className="h-[460px] overflow-y-auto pr-1 rounded-lg bg-muted/30 p-4"
            >
              {/* Conversation bubbles */}
              <AnimatePresence initial={false}>
                <motion.div
                  key={`bot-${step}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-4"
                >
                  <div className="inline-flex items-start gap-2 rounded-2xl bg-card border px-3 py-2">
                    <Bot className="h-4 w-4 mt-0.5 text-primary" />
                    <p className="text-sm">{typed}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Input UI for current step */}
              <div className="rounded-xl border bg-background p-3">
                {current?.ui}
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    Step {step + 1} / {questions.length}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStep(s => Math.max(0, s - 1))}
                      disabled={step === 0}
                      className="rounded-xl"
                    >
                      Back
                    </Button>
                    {step < questions.length - 1 ? (
                      <Button
                        size="sm"
                        onClick={() => current?.canNext() && setStep(s => s + 1)}
                        disabled={!current?.canNext()}
                        className="rounded-xl gap-2"
                      >
                        Next <Send className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setReady(true)}
                        className="rounded-xl gap-2"
                      >
                        Generate Plan <Dumbbell className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Confirmation */}
              {ready && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm">Done — your plan is ready on the right.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Plan preview (reuses your design language) */}
        <Card className="border-border/60 shadow-xl lg:col-span-2 min-h-[600px]">
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              {plan ? `${plan.name} Plan` : "Your plan preview"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!plan ? (
              <p className="text-sm text-muted-foreground">
                Answer the questions to generate a personalized program. Your plan details will render here.
              </p>
            ) : (
              <>
                {/* Status badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <TierBadge tier={plan.tier} />
                  <Badge variant="outline" className="rounded-full px-3 py-1">Level {plan.level}</Badge>
                  <Badge variant="secondary" className="rounded-full px-3 py-1 flex items-center gap-1">
                    <Timer className="h-4 w-4" /> Next workout {plan.nextWorkoutETA}
                  </Badge>
                </div>

                {/* Progress */}
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="md:col-span-2 border-border/60">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-base">Today&apos;s Workout</CardTitle>
                      <Badge className="gap-1"><Dumbbell className="h-4 w-4" /> Session</Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
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
                        <div className="text-sm text-muted-foreground">Estimated time · {Math.max(25, Math.min(75, Math.round(plan.today.length * (plan.xpToNext/plan.xpToNext ? 10 : 10))))} min</div>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" className="rounded-xl gap-2"><PenLine className="h-4 w-4" /> Edit session</Button>
                          <Button className="rounded-xl gap-2">Start workout</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/60">
                    <CardHeader>
                      <CardTitle className="text-base">Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Ring value={Math.round((plan.xp / plan.xpToNext) * 100)} />
                        <div>
                          <div className="font-medium">Level {plan.level}</div>
                          <div className="text-sm text-muted-foreground">{plan.xp} / {plan.xpToNext} XP</div>
                        </div>
                      </div>
                      <div>
                        <div className="mb-2 flex items-center gap-2 text-sm"><Flame className="h-4 w-4 text-primary" /> Weekly target</div>
                        <Progress value={Math.round((plan.completedThisWeek / plan.weeklyWorkouts) * 100)} className="h-2" />
                        <div className="mt-1 text-xs text-muted-foreground">{plan.completedThisWeek}/{plan.weeklyWorkouts} completed this week</div>
                      </div>
                      <div className="rounded-xl border bg-card/60 p-3 flex items-center gap-2 text-sm">
                        <Trophy className="h-4 w-4 text-primary" /> Keep the streak alive to level faster.
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* CTA */}
                <Card className="relative overflow-hidden border-border/60">
                  <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-emerald-500" /> {plan.name} Plan
                      </CardTitle>
                      <div className="text-sm text-muted-foreground">Adaptive progression, smart deloads, habit nudges</div>
                    </div>
                    <TierBadge tier={plan.tier} />
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">Next recommended session is ready. Keep your momentum.</div>
                    <div className="flex items-center gap-3">
                      <Button variant="secondary" className="rounded-xl">Save plan</Button>
                      <Button className="rounded-xl">Start now</Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
