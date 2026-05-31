import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getOptionalUser } from "@/features/auth/utils/session";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getOptionalUser();

  // Already authenticated — send them home
  if (user) {
    redirect("/dashboard");
  }

  // Pages handle their own full-screen split layout
  return <>{children}</>;
}