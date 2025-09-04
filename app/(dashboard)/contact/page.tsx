import { Mail, Phone, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center px-6 py-12">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_30%,hsl(var(--primary)/0.25),transparent_70%),radial-gradient(circle_at_80%_70%,hsl(var(--accent)/0.25),transparent_70%)]" />

      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Let’s Build Something <span className="text-primary">Awesome</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Got a project in mind or just want to say hi? Fill out the form and we’ll get back to you as soon as possible.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Mail className="h-5 w-5 text-primary" />
              <span>aimuscle@outlook.com</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Phone className="h-5 w-5 text-primary" />
              <span>+011 (323) 567-890</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              <span>Mazandaran, Irran</span>
            </div>
          </div>
        </div>

        {/* Right Side (Form) */}
        <Card className="backdrop-blur bg-card/70 shadow-2xl rounded-2xl border-border">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-2xl font-semibold text-center">Contact Us</h2>

            <form className="space-y-4">
              <Input type="text" placeholder="Your Name" className="h-12 text-base" />
              <Input type="email" placeholder="Your Email" className="h-12 text-base" />
<textarea
  placeholder="Your Message"
  className="w-full min-h-[140px] resize-none rounded-xl border border-border bg-background/70 px-4 py-3 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
/>


              <Button type="submit" className="w-full h-12 text-lg rounded-xl">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
