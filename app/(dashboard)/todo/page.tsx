"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Trash2, PlusCircle, ClipboardList } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

/* ---------------- Types ---------------- */
type Task = { id: string; text: string; done: boolean };

/* ---------------- Page ---------------- */
export default function TodoScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { id: crypto.randomUUID(), text: input.trim(), done: false }]);
    setInput("");
  };

  const toggleTask = (id: string) =>
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const removeTask = (id: string) =>
    setTasks(tasks.filter((t) => t.id !== id));

  const doneCount = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background px-4 py-10">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(50%_50%_at_50%_20%,#000_40%,transparent)]">
        <div className="absolute left-[10%] top-20 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-[8%] top-48 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
      </div>

      <section className="mx-auto max-w-2xl space-y-8">
        {/* Header */}
        <header className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-primary">
            <ClipboardList className="h-6 w-6" />
            <span className="font-semibold">AiMuscle</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My To-Do List</h1>
          <p className="text-muted-foreground">
            Stay on track with your daily tasks & workouts.
          </p>
        </header>

        {/* Main card */}
        <Card className="border-border/60 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Tasks
              <Badge variant="outline">{doneCount}/{tasks.length} done</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add a new task..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
              />
              <Button onClick={addTask} className="rounded-xl gap-2">
                <PlusCircle className="h-4 w-4" /> Add
              </Button>
            </div>

            {/* Progress */}
            <div>
              <Progress value={progress} className="h-2" />
              <div className="mt-1 text-xs text-muted-foreground">{progress}% completed</div>
            </div>

            {/* Task list */}
            <ul className="space-y-3">
              {tasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between rounded-xl border bg-card/60 px-4 py-3"
                >
                  <button
                    onClick={() => toggleTask(t.id)}
                    className="flex items-center gap-3 text-left flex-1"
                  >
                    {t.done ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className={t.done ? "line-through text-muted-foreground" : ""}>
                      {t.text}
                    </span>
                  </button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => removeTask(t.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}

              {!tasks.length && (
                <p className="text-sm text-muted-foreground text-center">
                  No tasks yet. Add your first one!
                </p>
              )}
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
