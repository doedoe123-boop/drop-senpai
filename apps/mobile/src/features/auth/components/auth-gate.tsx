import type { PropsWithChildren } from "react";

import { LoadingState } from "../../../components/loading-state";
import { useAuth } from "../hooks/use-auth";
import { AuthRequiredState } from "./auth-required-state";

export function AuthGate({ children }: PropsWithChildren) {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingState label="Restoring session..." />;
  }

  if (!user) {
    return <AuthRequiredState />;
  }

  return <>{children}</>;
}
