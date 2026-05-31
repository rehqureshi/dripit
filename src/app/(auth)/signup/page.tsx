"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { signUp, signInWithGoogle, type AuthActionResult } from "@/features/auth/actions/auth-actions";

// Adapt server action signatures for `useActionState` and form `action` props.
async function signUpAction(
  _state: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  return await signUp(formData);
}

async function signInWithGoogleAction(_formData: FormData) {
  await signInWithGoogle();
}

type Role = "buyer" | "designer";

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

function EditorialPanel({ role }: { role: Role }) {
  const isDesigner = role === "designer";
  return (
    <div className="hidden lg:flex relative flex-col justify-between overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={isDesigner
            ? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85&fit=crop"
            : "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1200&q=85&fit=crop"}
          alt="" aria-hidden="true"
          className="h-full w-full object-cover brightness-[0.28] transition-all duration-700"
          draggable={false}
        />
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-zinc-950 to-transparent" />
        {isDesigner && <div className="absolute inset-0 bg-brand-purple/8 transition-opacity duration-700" />}
      </div>
      <div className="relative z-10 p-14">
        <Link href="/" className="text-wordmark text-2xl tracking-[0.22em] text-white select-none hover:opacity-60 transition-opacity">DRIPIT</Link>
      </div>
      <div className="relative z-10 p-14 space-y-6">
        <p className="text-[9px] uppercase tracking-[0.28em] text-zinc-500">{isDesigner ? "For Creators" : "For Shoppers"}</p>
        <h2 className="text-editorial text-[3.5rem] leading-[0.92] tracking-[-0.04em] font-bold text-white uppercase">
          {isDesigner ? (<>Upload.<br /><span style={{ color: "#9B7EC8" }}>Earn.</span><br />Repeat.</>) : (<>Wear<br /><span style={{ color: "#9B7EC8" }}>original</span><br />art.</>)}
        </h2>
        <p className="text-sm text-zinc-400 font-light leading-relaxed max-w-xs">
          {isDesigner ? "Submit your artwork. We print, ship, and pay you 20% on every sale." : "Every piece carries an original design from an independent artist."}
        </p>
        <div className="flex items-center gap-6 border border-white/10 bg-white/5 backdrop-blur-md px-6 py-4 w-fit">
          {isDesigner ? (
            <div><p className="text-2xl font-bold text-white">$4,200</p><p className="text-[9px] uppercase tracking-widest text-zinc-400 mt-0.5">avg. creator earnings / 6mo</p></div>
          ) : (
            <div><p className="text-2xl font-bold text-white">3,200+</p><p className="text-[9px] uppercase tracking-widest text-zinc-400 mt-0.5">original designs</p></div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, id, name, type = "text", placeholder, autoComplete, hint, suffix }: {
  label: string; id: string; name: string; type?: string; placeholder: string;
  autoComplete?: string; hint?: string; suffix?: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <label htmlFor={id} className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2 transition-colors group-focus-within:text-foreground">
        {label}
      </label>
      <div className="relative flex items-center border-b-2 border-border transition-colors group-focus-within:border-foreground">
        <input id={id} name={name} type={type} placeholder={placeholder} autoComplete={autoComplete}
          className="w-full bg-transparent py-3 pr-10 text-sm font-medium text-foreground placeholder:text-muted-foreground/40 outline-none" />
        {suffix && <div className="absolute right-0">{suffix}</div>}
      </div>
      {hint && <p className="mt-1.5 text-[10px] text-muted-foreground/60">{hint}</p>}
    </div>
  );
}

function Checkbox({ id, checked, onChange, children }: {
  id: string; checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
      <button type="button" id={id} role="checkbox" aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 shrink-0 h-4 w-4 border flex items-center justify-center transition-all duration-150 ${checked ? "bg-foreground border-foreground" : "border-border group-hover:border-foreground"}`}>
        {checked && <Check className="h-2.5 w-2.5 text-background" strokeWidth={3} />}
      </button>
      <span className="text-[11px] leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">{children}</span>
    </label>
  );
}

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState<Role>(searchParams.get("role") === "designer" ? "designer" : "buyer");
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const r = searchParams.get("role");
    if (r === "designer" || r === "buyer") setRole(r);
  }, [searchParams]);

  /**
   * useActionState wires signUp server action to the form.
   * state holds the last error returned. pending is true while the
   * action is running. No manual fetch(), useState, or loading flags needed.
   */
  const [state, action, pending] = useActionState<AuthActionResult | null, FormData>(
    signUpAction,
    null
  );

  const isDesigner = role === "designer";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <EditorialPanel role={role} />

      <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-16 bg-background overflow-y-auto">
        <Link href="/" className="lg:hidden text-wordmark text-xl tracking-[0.22em] mb-14 select-none hover:opacity-60 transition-opacity">DRIPIT</Link>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-10">
            <p className="text-tagline text-muted-foreground mb-3">Join Dripit</p>
            <h1 className="text-editorial text-[clamp(2.4rem,5.5vw,3.8rem)] leading-[0.92] tracking-[-0.04em] font-bold uppercase">
              {isDesigner ? (<>Start<br />Earning.</>): (<>Create<br />Account.</>)}
            </h1>
          </div>

          {/* Role toggle — updates state and the hidden `role` input */}
          <div className="flex border border-border h-10 w-full mb-10">
            {(["buyer", "designer"] as Role[]).map((r) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={`flex-1 text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-200 ${role === r ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}>
                {r === "buyer" ? "Shop & Buy" : "Upload & Earn"}
              </button>
            ))}
          </div>

          {/* Designer perks */}
          {isDesigner && (
            <div className="grid grid-cols-3 gap-3 mb-8 p-5 border border-brand-purple/20 bg-brand-purple/5">
              {[{ stat: "20%", desc: "royalty per sale" }, { stat: "Free", desc: "to join & upload" }, { stat: "48hr", desc: "design review" }].map((p) => (
                <div key={p.desc}>
                  <p className="text-xl font-bold text-foreground tracking-tight">{p.stat}</p>
                  <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{p.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Google OAuth */}
          <form action={signInWithGoogleAction} className="mb-6">
            <button type="submit"
              className="group flex items-center justify-center gap-2.5 h-11 w-full border border-border text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground hover:border-foreground transition-all duration-200">
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          <div className="flex items-center gap-4 mb-7">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Error from action */}
          {state && !state.success && (
            <div role="alert" className="mb-6 border border-error/30 bg-error/5 px-4 py-3">
              <p className="text-xs font-medium text-error">{state.error}</p>
            </div>
          )}

          {/**
           * form action={action} — the entire form submits as FormData to signUp().
           * Hidden inputs pass role and agreement state (checkboxes aren't reliably
           * included in FormData when unchecked, so we mirror agreed as a hidden field).
           */}
          <form action={action} className="space-y-6">
            {/* Hidden fields — role and terms agreement */}
            <input type="hidden" name="role" value={role} />
            <input type="hidden" name="agreed" value={agreed ? "true" : "false"} />

            <Field label={isDesigner ? "Display Name / Studio" : "Full Name"}
              id="displayName" name="displayName"
              placeholder={isDesigner ? "e.g. Dark Matter Studio" : "Your name"}
              autoComplete="name"
              hint={isDesigner ? "This is how your shop will appear on Dripit" : undefined}
            />

            <Field label="Email" id="email" name="email" type="email"
              placeholder="you@example.com" autoComplete="email" />

            <Field label="Password" id="password" name="password"
              type={showPass ? "text" : "password"}
              placeholder="Min. 8 characters" autoComplete="new-password"
              suffix={
                <button type="button" onClick={() => setShowPass((p) => !p)}
                  aria-label={showPass ? "Hide" : "Show"}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            {isDesigner && (
              <Field label="Portfolio URL (optional)" id="portfolio" name="portfolio"
                type="url" placeholder="behance.net/you or instagram.com/you"
                hint="Helps our team review your application faster" />
            )}

            <Checkbox id="terms" checked={agreed} onChange={setAgreed}>
              I agree to Dripit&apos;s{" "}
              <Link href="/terms" className="underline underline-offset-3 hover:opacity-70 text-foreground font-medium">Terms</Link>{" "}and{" "}
              <Link href="/privacy" className="underline underline-offset-3 hover:opacity-70 text-foreground font-medium">Privacy Policy</Link>
              {isDesigner && (<>{" "}and the{" "}<Link href="/designers/royalties" className="underline underline-offset-3 hover:opacity-70 text-foreground font-medium">Creator Royalty Agreement</Link></>)}
            </Checkbox>

            <button type="submit" disabled={pending || !agreed}
              className="group flex items-center justify-between w-full h-14 px-6 bg-foreground text-background text-[11px] font-bold uppercase tracking-[0.18em] hover:bg-foreground/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <span>{pending ? "Creating account…" : isDesigner ? "Apply as Designer" : "Create Account"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mt-8 text-[11px] text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity">Sign in</Link>
          </p>

          <Link href={isDesigner ? "/signup" : "/signup?role=designer"}
            className="group mt-5 flex items-center justify-between border border-border/50 px-5 py-4 hover:border-foreground transition-colors duration-200">
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground mb-0.5">{isDesigner ? "Just shopping?" : "Are you a creator?"}</p>
              <p className="text-sm font-semibold text-foreground">{isDesigner ? "Switch to buyer account" : "Upload art. Earn royalties."}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}