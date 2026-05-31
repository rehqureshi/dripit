"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { signIn, signInWithGoogle, type AuthActionResult } from "@/features/auth/actions/auth-actions";

// The server actions exported from `auth-actions` return an `AuthActionResult`.
// `useActionState` expects an action with signature `(state, payload) => newState`,
// and the `form` `action` prop expects a function that returns `void | Promise<void>`.
// Wrap the server actions to adapt their signatures for the client-side hooks/forms.
async function signInAction(
  _state: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  return await signIn(formData);
}

async function signInWithGoogleAction(_formData: FormData) {
  // call server action and ignore return for the form action's void return type
  await signInWithGoogle();
}

// ─── Google icon ───
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ─── Editorial left panel ───
function EditorialPanel() {
  return (
    <div className="hidden lg:flex relative flex-col justify-between bg-zinc-950 p-14 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=85&fit=crop"
          alt="" aria-hidden="true"
          className="h-full w-full object-cover brightness-[0.35]"
          draggable={false}
        />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>
      <div className="relative z-10">
        <Link href="/" className="text-wordmark text-2xl tracking-[0.22em] text-white select-none hover:opacity-60 transition-opacity">
          DRIPIT
        </Link>
      </div>
      <div className="relative z-10 space-y-6">
        <p className="text-[9px] uppercase tracking-[0.28em] text-zinc-500">Independent Design</p>
        <h2 className="text-editorial text-[3.8rem] leading-[0.92] tracking-[-0.04em] font-bold text-white uppercase">
          Art on<br /><span style={{ color: "#9B7EC8" }}>every</span><br />thread.
        </h2>
        <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-xs">
          Thousands of original designs from independent creators — worn by people who refuse the ordinary.
        </p>
        <div className="flex items-center gap-8 pt-2">
          {[{ v: "840+", l: "Creators" }, { v: "3.2K", l: "Designs" }, { v: "20%", l: "Royalty" }].map((s) => (
            <div key={s.l}>
              <p className="text-xl font-bold text-white tracking-tight">{s.v}</p>
              <p className="text-[9px] uppercase tracking-widest text-zinc-500 mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Field ───
function Field({ label, id, type = "text", placeholder, autoComplete, name, suffix }: {
  label: string; id: string; type?: string; placeholder: string;
  autoComplete?: string; name: string; suffix?: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <label htmlFor={id} className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2 transition-colors group-focus-within:text-foreground">
        {label}
      </label>
      <div className="relative flex items-center border-b-2 border-border transition-colors group-focus-within:border-foreground">
        <input
          id={id} name={name} type={type} placeholder={placeholder}
          autoComplete={autoComplete} required
          className="w-full bg-transparent py-3 pr-10 text-sm font-medium text-foreground placeholder:text-muted-foreground/40 outline-none"
        />
        {suffix && <div className="absolute right-0">{suffix}</div>}
      </div>
    </div>
  );
}

// ─── Page ───
export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [showPass, setShowPass] = useState(false);

  /**
   * useActionState wires the server action directly to the form.
   * - state: the last AuthActionResult returned by the action (or null initially)
   * - action: the wrapped action to pass to the form's `action` prop
   * - pending: true while the action is in flight (replaces manual loading state)
   *
   * This is the modern App Router pattern — no fetch(), no useState for loading,
   * no manual FormData construction.
   */
  const [state, action, pending] = useActionState<AuthActionResult | null, FormData>(
    signInAction,
    null
  );

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <EditorialPanel />

      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-16 bg-background">
        <Link href="/" className="lg:hidden text-wordmark text-xl tracking-[0.22em] mb-14 select-none hover:opacity-60 transition-opacity">
          DRIPIT
        </Link>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-12">
            <p className="text-tagline text-muted-foreground mb-3">Welcome back</p>
            <h1 className="text-editorial text-[clamp(2.6rem,6vw,4rem)] leading-[0.92] tracking-[-0.04em] font-bold uppercase">
              Sign<br />In.
            </h1>
          </div>

          {/* Google OAuth — calls signInWithGoogle server action */}
          <form action={signInWithGoogleAction} className="mb-4">
            <button
              type="submit"
              className="group flex items-center justify-center gap-2.5 h-11 w-full border border-border text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Error message from action */}
          {state && !state.success && (
            <div role="alert" className="mb-6 border border-error/30 bg-error/5 px-4 py-3">
              <p className="text-xs font-medium text-error">{state.error}</p>
            </div>
          )}

          {/**
           * form action={action} — this is the key wiring.
           * When submitted, Next.js serializes the FormData and calls signIn()
           * on the server. No fetch, no API route, no client-side state needed.
           *
           * Hidden `next` input preserves the redirect destination so signIn()
           * can send the user back to where they originally wanted to go.
           */}
          <form action={action} className="space-y-7">
            <input type="hidden" name="next" value={next} />

            <Field label="Email" id="email" name="email" type="email"
              placeholder="you@example.com" autoComplete="email" />

            <Field
              label="Password" id="password" name="password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••" autoComplete="current-password"
              suffix={
                <button type="button" onClick={() => setShowPass((p) => !p)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            <div className="flex justify-end -mt-4">
              <Link href="/forgot-password" className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit" disabled={pending}
              className="group flex items-center justify-between w-full h-14 px-6 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-foreground/85 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{pending ? "Signing in…" : "Sign In"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-10 text-[11px] text-muted-foreground text-center">
            No account?{" "}
            <Link href="/signup" className="font-semibold text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity">
              Create one free
            </Link>
          </p>

          <Link href="/signup?role=designer"
            className="group mt-6 flex items-center justify-between border border-border/60 px-5 py-4 hover:border-foreground transition-colors duration-200">
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground mb-0.5">Are you a creator?</p>
              <p className="text-sm font-semibold text-foreground">Upload art. Earn royalties.</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}