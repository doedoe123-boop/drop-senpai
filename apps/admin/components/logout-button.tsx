"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Button
      onClick={logout}
      variant="outline"
      className="rounded-full border-white/15 bg-white/[0.03] text-white hover:bg-white/10 hover:text-white"
    >
      Sign out
    </Button>
  );
}
