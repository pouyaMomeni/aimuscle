import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ActivityPageSkeleton() {
  return (
    <section className="flex-1 p-4 lg:p-8">
      <h1 className="text-lg lg:text-2xl font-medium text-foreground mb-6">
        Activity Log
      </h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Fake activity rows */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-6 w-full rounded-md bg-muted animate-pulse"
            />
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
