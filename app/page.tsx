"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBank } from "@/components/AuthProvider";
import { AuthScreen } from "@/components/AuthScreen";

export default function HomePage() {
  const { ready, user } = useBank();
  const router = useRouter();

  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user, router]);

  if (!ready || user) return null;
  return <AuthScreen />;
}
