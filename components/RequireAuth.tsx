"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBank } from "./AuthProvider";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { ready, user } = useBank();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace("/");
  }, [ready, user, router]);

  if (!ready || !user) return null;
  return <>{children}</>;
}
