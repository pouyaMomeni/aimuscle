'use client';

import Link from 'next/link';
import { useState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Dumbbell, LogOut, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut } from '@/app/(login)/actions';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/db/schema';
import useSWR, { mutate } from 'swr';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';


const fetcher = (url: string) => fetch(url).then((res) => res.json());

function initialsFrom(user?: User) {
  if (!user) return '';
  if (user.name && user.name.trim().length > 0) {
    return user.name
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  if (user.email) {
    const first = user.email.split('@')[0];
    return first.slice(0, 2).toUpperCase();
  }
  return '';
}

function UserMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    mutate('/api/user');
    router.push('/');
  }

  if (!user) {
    return (
      <>
        <Link
          href="/pricing"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Pricing
        </Link>
        <Button asChild className="rounded-full">
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </>
    );
  }

  const menuLinks = [
    { href: '/timer', label: 'Timer' },
    { href: '/todo', label: 'Todo' },
    { href: '/contact', label: 'Contact Us' },
    { href: '/about', label: 'About Us' },
  ];

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer size-9">
          <AvatarImage alt={user.name || ''} />
          <AvatarFallback>{initialsFrom(user)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="flex flex-col gap-1 rounded-xl border border-border bg-card shadow-lg"
      >
        {/* Navigation links */}
        {menuLinks.map((link) => (
          <Link key={link.href} href={link.href} className="w-full">
            <DropdownMenuItem className="cursor-pointer">
              {link.label}
            </DropdownMenuItem>
          </Link>
        ))}

        <div className="border-t my-1" />

        {/* Sign out */}
        <form action={handleSignOut} className="w-full">
          <button type="submit" className="flex w-full">
            <DropdownMenuItem className="w-full flex-1 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


function NavLinks({ onClick }: { onClick?: () => void }) {
  // Show these routes to everyone; adjust if you want auth-gated.
  const links = [
    { href: '/pricing', label: 'Pricing' },
    { href: '/my-plans', label: 'My Plans' },
    { href: '/generate-plane', label: 'Generate Plane' },
  ];

  return (
    <>
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          onClick={onClick}
          className="text-sm font-medium text-muted-foreground  hover:text-blue-400"
        >
          {l.label}
        </Link>
      ))}
    </>
  );
}

function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden rounded-full" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[280px] p-4">
        {/* A11y title (hidden visually, announced to screen readers) */}
        <SheetHeader>
          <VisuallyHidden>
            <SheetTitle>Navigation menu</SheetTitle>
          </VisuallyHidden>
        </SheetHeader>

        <div className="flex items-center gap-2 mb-6">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">AiMuscle</span>
        </div>

        <nav className="flex flex-col gap-4">
          <NavLinks onClick={() => setOpen(false)} />
        </nav>

        <div className="mt-6 border-t pt-4">
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu />
          </Suspense>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Header() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Left: Mobile menu + Brand */}
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link href="/" className="flex items-center">
            <Dumbbell className="h-6 w-6 text-primary" />
            <span className="ml-2 text-xl font-semibold text-foreground">
              AiMuscle
            </span>
          </Link>
        </div>

        {/* Center/Right: Desktop nav + user */}
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </div>
          <Suspense fallback={<div className="h-9" />}>
            <UserMenu />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col min-h-screen">
      <Header />
      {children}
    </section>
  );
}
