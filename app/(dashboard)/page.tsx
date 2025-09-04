import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Dumbbell,
  Activity,
  ChartLine,
  HeartPulse,
  Timer,
  Trophy,
  Users,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import heroImage from 'public/images/heroImgae.png'
import chartPic from 'public/images/chart.png'
import FancyChart from "@/components/ui/fancyChart";

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      {/* HERO */}
      <section className="relative py-24 sm:py-28 lg:py-32">
        {/* soft radial glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(1200px 500px at -10% -10%, hsl(var(--primary)/0.25), transparent), radial-gradient(900px 400px at 110% 120%, hsl(var(--accent)/0.25), transparent)",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-10 items-center">
            {/* Copy */}
            <div className="sm:text-center md:max-w-3xl md:mx-auto lg:col-span-7 lg:text-left">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs uppercase tracking-wide text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" />
                Elite Online Coaching
              </span>

              <h1 className="mt-5 text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[0.95] tracking-tight">
                <span className="block">AiMuscle</span>
                <span
                  className="block bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)",
                  }}
                >
                  Train smarter. Grow faster.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl lg:max-w-none">
                Personalised programs, habit & nutrition coaching, and progress
                analytics — designed for lifters who want real results, not guesswork.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 sm:justify-center lg:justify-start">
                <a href="/sign-up">
                  <Button size="lg" className="text-lg rounded-full px-7 py-6">
                    Start free trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <a href="/features">
                  <Button size="lg" variant="outline" className="text-lg rounded-full px-7 py-6">
                    See how it works
                  </Button>
                </a>
              </div>

              <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground sm:justify-center lg:justify-start">
                <ShieldCheck className="h-4 w-4" />
                <span>No credit card required • Cancel anytime</span>
              </div>
            </div>

            {/* Visual / Mockup */}
            <div className="mt-14 lg:mt-0 lg:col-span-5">
              <div className="rounded-3xl border border-border bg-card/60 backdrop-blur p-2 shadow-2xl">
                <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[radial-gradient(300px_200px_at_20%_10%,hsl(var(--primary)/0.25),transparent),radial-gradient(300px_200px_at_80%_90%,hsl(var(--accent)/0.25),transparent)]">
                  <Image
                    src={heroImage} // put your file name here
                    alt="AiMuscle Athlete"
                    width={800}
                    height={1000}
                    className="h-full w-full object-cover rounded-2xl"
                    priority
                  />
                </div>
              </div>
              <p className="mt-3 text-xs text-center text-muted-foreground">
                Train smarter. Grow faster with AiMuscle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Kpi title="Workouts Logged" value="120k+" icon={<Activity className="h-5 w-5" />} />
          <Kpi title="PRs Achieved" value="48k+" icon={<Trophy className="h-5 w-5" />} />
          <Kpi title="Avg. Adherence" value="92%" icon={<Timer className="h-5 w-5" />} />
          <Kpi title="Athletes Coached" value="10k+" icon={<Users className="h-5 w-5" />} />
        </div>
      </section>

      {/* FEATURES ROW 1 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-8">
          <Feature
            icon={<Dumbbell className="h-6 w-6" />}
            title="Periodized Programs"
            text="Blocks, phases, and progressions. Supersets, tempo, and RIR/RPE built into every session."
          />
          <Feature
            icon={<HeartPulse className="h-6 w-6" />}
            title="Habits & Nutrition"
            text="Daily habits with streaks plus macro targets and simple check-ins to keep you accountable."
          />
          <Feature
            icon={<ChartLine className="h-6 w-6" />}
            title="Progress Analytics"
            text="1RM estimates, weekly volume, and adherence trends so you see what actually moves the needle."
          />
        </div>
      </section>

      {/* FEATURED SECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <div className="rounded-3xl border border-border bg-card/60 p-8">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Built for real lifters</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              AiMuscle adapts to your goals and equipment, recommends progressions when you hit PRs,
              and keeps recovery in check. You focus on execution — we handle the plan.
            </p>
            <ul className="mt-6 space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-[10px] font-bold">✓</span>
                </span>
                Smart progressions and deload guidance
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-[10px] font-bold">✓</span>
                </span>
                Mobile-first workout logger with rest timers
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <span className="text-[10px] font-bold">✓</span>
                </span>
                Habit streaks, weekly check-ins, and PR tracking
              </li>
            </ul>
            <div className="mt-8">
              <a href="/sign-up">
                <Button size="lg" className="rounded-full px-7 py-6">
                  Start free trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Placeholder chart/mock */}


<FancyChart/>


        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Ready to build strength with clarity?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join AiMuscle and get a plan that adapts as you improve — not one that holds you back.
          </p>
          <div className="mt-8">
            <a href="/sign-up">
              <Button size="lg" className="text-lg rounded-full px-8 py-7">
                Get started free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* --- Small presentation components --- */

function Kpi({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/15 text-primary">
          {icon}
        </span>
        {title}
      </div>
      <div className="mt-2 text-2xl sm:text-3xl font-bold">{value}</div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group rounded-2xl border border-border bg-card/60 p-6 transition-all hover:border-primary/40 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.35)]">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-base text-muted-foreground">{text}</p>
    </div>
  );
}
