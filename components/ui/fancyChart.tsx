"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", uv: 400, pv: 240 },
  { name: "Feb", uv: 300, pv: 139 },
  { name: "Mar", uv: 200, pv: 980 },
  { name: "Apr", uv: 278, pv: 390 },
  { name: "May", uv: 189, pv: 480 },
]

export default function FancyChart() {
  return (
    <div className="rounded-3xl border border-border bg-card/60 p-8 shadow-xl">
      <div
        className="
          aspect-[16/10] w-full rounded-2xl
          bg-[linear-gradient(135deg,rgba(173,216,230,0.15),transparent),radial-gradient(500px_250px_at_20%_20%,hsl(var(--primary)/0.12),transparent),radial-gradient(500px_250px_at_80%_80%,hsl(var(--accent)/0.12),transparent)]
        "
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <CartesianGrid stroke="hsl(var(--border)/0.2)" strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Line
              type="monotone"
              dataKey="uv"
              stroke="hsl(var(--primary)/0.85)"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="hsl(var(--accent)/0.85)"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
