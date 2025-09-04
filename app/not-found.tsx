"use client";

import Link from "next/link";
import { CircleSlash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex items-center justify-center min-h-[100dvh] bg-gradient-to-b from-background via-muted/30 to-background px-4">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_40%,#000_50%,transparent)]">
        <div className="absolute left-[15%] top-20 h-64 w-64 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="absolute right-[20%] bottom-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <CircleSlash2 className="h-16 w-16 text-orange-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Page Not Found
        </h1>
        <p className="text-base text-muted-foreground">
          The page you’re looking for doesn’t exist, has been moved, or is
          temporarily unavailable.
        </p>
        <Button asChild className="rounded-full px-6 py-2">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  );
}
