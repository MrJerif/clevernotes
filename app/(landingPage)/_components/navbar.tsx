"use client";
import { ModeToggle } from '@/components/mode-toggle';
import { Spinner } from '@/components/spinner';
import { Button } from '@/components/ui/button';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { cn } from '@/lib/utils';
import { SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import { SparkleIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export const Navbar = () => {
  // Custom hook
  const scrolled = useScrollTop();

  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <div className={cn(
      "z-50 bg-background fixed top-0 flex items-center w-full p-6",
      scrolled && 'border-b shadow-sm'
    )}>
      <h2 className="text-lg font-semibold flex px-1">
        CleverNotes
        <p>
          <SparkleIcon className='w-5 flex-shrink-0' />
        </p>
      </h2>

      <div className='md:ml-auto justify-end
        w-full flex items-center gap-x-2'>
        {isLoading && (
          <Spinner />
        )}
        {/* If Not Logged-In */}
        {!isAuthenticated && !isLoading && (
          <>
            {/* Login Button from clerk */}
            <SignInButton mode='modal'>
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </SignInButton>
            {/* Sign up */}
            <SignUpButton mode='modal'>
              <Button size="sm">
                SignUp
              </Button>
            </SignUpButton>
          </>
        )
        }
        {/* If Logged-In */}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">
                Enter CleverNotes
              </Link>
            </Button>

            <UserButton
              afterSwitchSessionUrl='/'
            />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  )
}
