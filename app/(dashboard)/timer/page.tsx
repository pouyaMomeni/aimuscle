"use client";

import { useEffect, useMemo, useState } from "react";
import { Play, Pause, RotateCcw, Timer as TimerIcon, AlarmClock, Hourglass } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

/* ---------------- helpers ---------------- */
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function toSeconds(min: number, sec: number) {
  return clamp(Math.floor(min), 0, 999) * 60 + clamp(Math.floor(sec), 0, 59);
}
function fromSeconds(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return { m, s };
}

/* ---------------- page ---------------- */
export default function TimerScreen() {
  // setup state
  const [m, setM] = useState(5);
  const [s, setS] = useState(0);
  const [preset, setPreset] = useState<null | string>(null);

  // runtime state
  const [initial, setInitial] = useState(300); // seconds
  const [secondsLeft, setSecondsLeft] = useState(300);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false); // switches UI from setup → timer

  // tick
  useEffect(() => {
    if (!running) return;
    if (secondsLeft <= 0) return setRunning(false);
    const id = setInterval(() => setSecondsLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [running, secondsLeft]);

  // tab title
  useEffect(() => {
    if (!started) return;
    const { m, s } = fromSeconds(secondsLeft);
    document.title = `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")} • Timer`;
    return () => {
      document.title = "Timer";
    };
  }, [started, secondsLeft]);

  const timeText = useMemo(() => {
    const { m, s } = fromSeconds(secondsLeft);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }, [secondsLeft]);

  // actions
  const startTimer = () => {
    const total = toSeconds(m, s);
    if (total <= 0) return;
    setInitial(total);
    setSecondsLeft(total);
    setStarted(true);
    setRunning(true);
  };
  const resetTimer = () => {
    setRunning(false);
    setSecondsLeft(initial);
  };

  // UI
  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background px-4 py-10">
      {/* ambient glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(50%_50%_at_50%_20%,#000_40%,transparent)]">
        <div className="absolute left-[10%] top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-[8%] top-48 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>

      <section className="mx-auto max-w-3xl space-y-8">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-primary">
            <TimerIcon className="h-6 w-6" />
            <span className="font-semibold">AiMuscle</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Workout Timer</h1>
          <p className="text-muted-foreground">Set your duration, hit start, stay focused.</p>
        </header>

        {!started ? (
          // -------- Setup Card --------
          <Card className="border-border/60 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlarmClock className="h-5 w-5 text-primary" />
                Choose duration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Inputs */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">Minutes</label>
                  <Input
                    type="number"
                    min={0}
                    max={999}
                    value={m}
                    onChange={(e) => setM(clamp(parseInt(e.target.value || "0", 10), 0, 999))}
                  />
                  <Slider
                    className="mt-3"
                    defaultValue={[m]}
                    min={0}
                    max={60}
                    step={1}
                    onValueChange={([v]) => setM(v)}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm text-muted-foreground">Seconds</label>
                  <Input
                    type="number"
                    min={0}
                    max={59}
                    value={s}
                    onChange={(e) => setS(clamp(parseInt(e.target.value || "0", 10), 0, 59))}
                  />
                  <Slider
                    className="mt-3"
                    defaultValue={[s]}
                    min={0}
                    max={59}
                    step={1}
                    onValueChange={([v]) => setS(v)}
                  />
                </div>
              </div>

              {/* Quick presets */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Presets:</span>
                {[
                  { label: "30s", m: 0, s: 30 },
                  { label: "45s", m: 0, s: 45 },
                  { label: "1:00", m: 1, s: 0 },
                  { label: "2:00", m: 2, s: 0 },
                  { label: "5:00", m: 5, s: 0 },
                  { label: "10:00", m: 10, s: 0 },
                ].map((p) => (
                  <Badge
                    key={p.label}
                    variant={preset === p.label ? "default" : "secondary"}
                    className="cursor-pointer rounded-full px-3 py-1"
                    onClick={() => {
                      setPreset(p.label);
                      setM(p.m);
                      setS(p.s);
                    }}
                  >
                    {p.label}
                  </Badge>
                ))}
              </div>

              {/* Start */}
              <div className="flex justify-end">
                <Button className="rounded-xl gap-2" onClick={startTimer} disabled={toSeconds(m, s) <= 0}>
                  Start <Play className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // -------- Timer Card --------
          <Card className="border-border/60 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hourglass className="h-5 w-5 text-primary" />
                Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
              {/* Big time */}
              <div className="text-6xl md:text-7xl font-bold tabular-nums tracking-tight">
                {timeText}
              </div>

              {/* Progress bar (optional) */}
              <div className="w-full h-2 rounded bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-[width] duration-1000"
                  style={{
                    width: `${Math.max(0, (secondsLeft / Math.max(1, initial)) * 100)}%`,
                  }}
                />
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {!running ? (
                  <Button onClick={() => setRunning(true)} className="rounded-xl gap-2">
                    <Play className="h-4 w-4" /> Resume
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={() => setRunning(false)} className="rounded-xl gap-2">
                    <Pause className="h-4 w-4" /> Pause
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={resetTimer}
                  className="rounded-xl gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setRunning(false);
                    setStarted(false);
                  }}
                  className="rounded-xl"
                >
                  Change duration
                </Button>
              </div>

              {/* Hint */}
              <p className="text-xs text-muted-foreground">
                Tip: keep this tab open — the title shows the live countdown.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
