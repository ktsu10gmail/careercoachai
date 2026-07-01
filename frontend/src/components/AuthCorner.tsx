"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusinessIcon,
  Building2Icon,
  LogInIcon,
  LogOutIcon,
  UserRoundIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  APPLICANT_TOKEN_KEY,
  clearAuthTokens,
  EMPLOYER_TOKEN_KEY,
  readToken,
} from "@/lib/auth";

type AuthState = {
  applicant: boolean;
  employer: boolean;
};

function readAuthState(): AuthState {
  return {
    applicant: Boolean(readToken(APPLICANT_TOKEN_KEY)),
    employer: Boolean(readToken(EMPLOYER_TOKEN_KEY)),
  };
}

export function AuthCorner() {
  const [authState, setAuthState] = useState<AuthState>({ applicant: false, employer: false });
  const [loginOpen, setLoginOpen] = useState(false);
  const isLoggedIn = authState.applicant || authState.employer;

  useEffect(() => {
    const syncAuthState = () => setAuthState(readAuthState());

    syncAuthState();
    window.addEventListener("storage", syncAuthState);
    window.addEventListener("focus", syncAuthState);
    const interval = window.setInterval(syncAuthState, 1000);

    return () => {
      window.removeEventListener("storage", syncAuthState);
      window.removeEventListener("focus", syncAuthState);
      window.clearInterval(interval);
    };
  }, []);

  function logout() {
    const wasApplicant = authState.applicant && !authState.employer;
    clearAuthTokens();
    setAuthState({ applicant: false, employer: false });
    window.location.href = wasApplicant ? "/applicant/login" : "/employer/login";
  }

  return (
    <div className="fixed right-3 top-3 z-[70] print:hidden">
      {isLoggedIn ? (
        <Button
          className="gap-1.5 border-background/70 bg-background/95 shadow-lg backdrop-blur"
          onClick={logout}
          size="sm"
          type="button"
          variant="outline"
        >
          <LogOutIcon className="size-3.5" />
          <span>Log out</span>
        </Button>
      ) : (
        <div className="relative">
          <Button
            aria-expanded={loginOpen}
            aria-haspopup="menu"
            className="gap-1.5 border-background/70 bg-background/95 shadow-lg backdrop-blur"
            onClick={() => setLoginOpen((open) => !open)}
            size="sm"
            type="button"
            variant="outline"
          >
            <LogInIcon className="size-3.5" />
            <span>Log in</span>
          </Button>
          {loginOpen ? (
            <div
              className="absolute right-0 mt-2 w-52 rounded-lg border bg-popover p-1 text-popover-foreground shadow-xl"
              role="menu"
            >
              <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Choose workspace
              </p>
              <Link
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                href="/applicant/login"
                role="menuitem"
              >
                <UserRoundIcon className="size-4" />
                Applicant login
              </Link>
              <Link
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                href="/employer/login"
                role="menuitem"
              >
                <BriefcaseBusinessIcon className="size-4" />
                Employer login
              </Link>
              <Link
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                href="/employer/login?next=/agency/clients"
                role="menuitem"
              >
                <Building2Icon className="size-4" />
                Agency login
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
