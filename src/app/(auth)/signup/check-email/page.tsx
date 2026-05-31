import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full border border-border p-10 text-center">
        <p className="text-tagline text-muted-foreground mb-3">
          Verify your email
        </p>

        <h1 className="text-editorial text-4xl font-bold uppercase mb-6">
          Check your inbox.
        </h1>

        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          We sent you a verification link.  
          Click the link in your email to activate your account.
        </p>

        <Link
          href="/login"
          className="inline-flex items-center justify-center h-12 px-6 bg-foreground text-background text-xs font-bold uppercase tracking-widest hover:opacity-90 transition"
        >
          Back to Login
        </Link>
      </div>
    </main>
  );
}