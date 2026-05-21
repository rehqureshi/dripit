/**
 * @file src/features/auth/index.ts
 *
 * Public API of the auth feature.
 *
 * External features (products, cart, designers) import ONLY from this barrel,
 * never from deep paths like "@/features/auth/utils/session".
 *
 * Why? If we restructure internals — split session.ts, rename utils — no
 * external import paths break. The barrel is the stable contract; internals
 * are implementation details.
 *
 * "use server" actions are NOT re-exported here because Next.js requires
 * server action imports to trace back to files that explicitly declare
 * "use server". Re-exporting them through a non-"use server" barrel
 * can break the action boundary. Import actions directly:
 *   import { signIn } from "@/features/auth/actions"
 */

// Types
export type {
  AuthUser,
  AuthSession,
  AuthState,
  AuthStatus,
  AuthError,
  AuthErrorCode,
  ActionResult,
} from "./types";

// Schemas
export {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  updatePasswordSchema,
} from "./schemas";
export type {
  SignUpInput,
  SignInInput,
  ForgotPasswordInput,
  UpdatePasswordInput,
} from "./schemas";

// Session utilities (server-only)
export {
  getOptionalUser,
  getCurrentUser,
  requireUser,
} from "./utils/session";

// Client hook
export { useAuthUser } from "./components/auth-user-provider";