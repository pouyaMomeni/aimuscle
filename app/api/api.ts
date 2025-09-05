async function fetchPlan(answers: Answers): Promise<Plan> {
  const res = await fetch("/api/generate-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}

// src/types/fitness.ts
export type Tier = "emerald" | "free";

export type Exercise = {
  id: string;
  title: string;
  scheme: string;
  cap: string;
  notes: string;
};

export type Plan = {
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

export type Answers = {
  goal: "muscle" | "fatloss" | "endurance" | "";
  experience: "beginner" | "intermediate" | "advanced" | "";
  days: number;        // 1..7
  equipment: "none" | "dumbbells" | "fullgym" | "";
  session: number;     // minutes
  focus: string;       // free text (areas, injuries)
};
