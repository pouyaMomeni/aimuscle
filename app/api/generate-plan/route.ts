import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

/** Input validation */
const AnswersSchema = z.object({
  goal: z.enum(["muscle", "fatloss", "endurance", ""]).default(""),
  experience: z.enum(["beginner", "intermediate", "advanced", ""]).default(""),
  days: z.number().int().min(1).max(7).default(3),
  equipment: z.enum(["none", "dumbbells", "fullgym", ""]).default(""),
  session: z.number().int().min(20).max(90).default(45),
  focus: z.string().max(280).default(""),
});
type Answers = z.infer<typeof AnswersSchema>;

/** Output schema (Structured Outputs) */
const PlanSchema = {
  name: "Plan",
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      tier: { type: "string", enum: ["emerald", "free"] },
      level: { type: "number" },
      xp: { type: "number" },
      xpToNext: { type: "number" },
      weeklyWorkouts: { type: "number" },
      completedThisWeek: { type: "number" },
      streakDays: { type: "number" },
      nextWorkoutETA: { type: "string" },
      today: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            scheme: { type: "string" },
            cap: { type: "string" },
            notes: { type: "string" },
          },
          required: ["id", "title", "scheme", "cap", "notes"],
        },
        minItems: 3,
        maxItems: 3,
      },
    },
    required: [
      "id","name","tier","level","xp","xpToNext","weeklyWorkouts",
      "completedThisWeek","streakDays","nextWorkoutETA","today"
    ],
  },
  strict: true,
} as const;

/** Fallback local generator if API fails (your current logic) */
function localGeneratePlan(a: Answers) {
  const isEmerald = a.days >= 4 || a.equipment === "fullgym";
  const tier = isEmerald ? "emerald" : "free";
  const name =
    a.goal === "muscle" ? "Hypertrophy" :
    a.goal === "fatloss" ? "Lean Cut" :
    a.goal === "endurance" ? "Engine" : "Custom";
  const sets =
    a.experience === "advanced" ? "5 x 8–10" :
    a.experience === "intermediate" ? "4 x 10–12" : "3 x 12–15";
  const cap = a.session <= 40 ? "8–10 min" : a.session <= 60 ? "10–12 min" : "12–15 min";
  const cue =
    a.goal === "muscle" ? "Controlled tempo, full ROM" :
    a.goal === "fatloss" ? "Short rests, steady pace" :
    "Smooth breathing, steady cadence";
  const today = [
    { id: "ex1", title: a.goal === "endurance" ? "Row / Bike" : "Goblet Squat", scheme: sets, cap, notes: cue },
    { id: "ex2", title: a.goal === "fatloss" ? "KB Swings" : "DB Bench Press", scheme: sets, cap, notes: cue },
    { id: "ex3", title: a.goal === "muscle" ? "Lat Pulldown" : "Plank", scheme: sets, cap, notes: cue },
  ];
  return {
    id: `plan-${Math.random().toString(36).slice(2, 8)}`,
    name, tier,
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

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const a = AnswersSchema.parse(json);

    const system =
      "You are a fitness planning assistant. Output ONLY compact JSON under 1200 characters, matching the provided JSON schema exactly. No prose, no markdown.";
    const user =
      `INPUT (answers): ${JSON.stringify(a)}\n\n` +
      `RULES:\n` +
      `1) tier="emerald" if days>=4 OR equipment="fullgym"; else "free".\n` +
      `2) name by goal: muscle→Hypertrophy, fatloss→Lean Cut, endurance→Engine, else Custom.\n` +
      `3) level: advanced→6, intermediate→3, beginner/empty→1.\n` +
      `4) sets: advanced→"5 x 8–10", intermediate→"4 x 10–12", else→"3 x 12–15".\n` +
      `5) cap by session: ≤40→"8–10 min"; 41–60→"10–12 min"; >60→"12–15 min".\n` +
      `6) cue: muscle→"Controlled tempo, full ROM"; fatloss→"Short rests, steady pace"; endurance→"Smooth breathing, steady cadence".\n` +
      `7) today has exactly 3 items (ids ex1..ex3) with sensible titles for the goal/equipment.\n` +
      `8) Fixed: xp=3000, xpToNext=5000, completedThisWeek=0, streakDays=0, nextWorkoutETA="ready now".\n` +
      `9) weeklyWorkouts=days (or 3 if empty).\n` +
      `10) No null/undefined. Short strings.`;

    // Use Structured Outputs (JSON Schema) for guaranteed shape
    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: {
        type: "json_schema",
        json_schema: PlanSchema,
      },
      // Enough tokens for short JSON
      max_tokens: 500,
    });

    // With structured outputs, content should be valid JSON matching schema
    const content = resp.choices?.[0]?.message?.content ?? "";
    const plan = JSON.parse(content);
    return NextResponse.json(plan);
  } catch (err) {
    // On any error, fall back to local generator so UX never blocks
    try {
      const body = await req.json().catch(() => ({}));
      const a = AnswersSchema.safeParse(body).success
        ? (body as Answers)
        : { goal: "", experience: "", days: 3, equipment: "", session: 45, focus: "" };
      const plan = localGeneratePlan(a as Answers);
      return NextResponse.json(plan, { status: 200, headers: { "x-fallback": "local" } });
    } catch {
      return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
    }
  }
}
