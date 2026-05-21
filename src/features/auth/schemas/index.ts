/**
 * @file src/features/auth/schemas/index.ts
 *
 * Zod validation schemas for all auth operations.
 *
 * Architecture note — ONE schema file, TWO uses:
 * 1. Client-side: React Hook Form uses these for real-time field validation.
 * 2. Server-side: Server Actions call `.safeParse()` before touching Supabase.
 *
 * This single-source-of-truth approach means the validation rules can never
 * drift between client and server, which is a common production bug.
 *
 * Why `safeParse` not `parse`?
 * Server Actions must never throw unhandled errors to the client — they return
 * typed ActionResult objects. `safeParse` returns a result object; `parse`
 * throws. We use `safeParse` everywhere in action files.
 */

import { z } from "zod";

// ---------------------------------------------------------------------------
// Reusable field schemas
// ---------------------------------------------------------------------------

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be under 72 characters") // bcrypt hard limit
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const displayNameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be under 50 characters")
  .trim();

// ---------------------------------------------------------------------------
// Sign Up
// ---------------------------------------------------------------------------

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    displayName: displayNameSchema,
    /**
     * Agree to terms is a boolean field rendered as a checkbox.
     * `literal(true)` means unchecked (false) fails validation — the user
     * must explicitly check the box.
     */
    agreeToTerms: z
  .boolean()
  .refine((val) => val === true, {
    message: "You must agree to the terms to continue",
  }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

// ---------------------------------------------------------------------------
// Sign In
// ---------------------------------------------------------------------------

export const signInSchema = z.object({
  email: emailSchema,
  /**
   * Sign-in password intentionally has NO complexity rules.
   * We're authenticating an existing account, not setting a new password.
   * Applying complexity rules here would lock out users with old passwords
   * that predate any rule change.
   */
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export type SignInInput = z.infer<typeof signInSchema>;

// ---------------------------------------------------------------------------
// Password Reset (request email)
// ---------------------------------------------------------------------------

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ---------------------------------------------------------------------------
// Password Update (after clicking reset link)
// ---------------------------------------------------------------------------

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;