import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { AppSidebar, MobileNav } from "@/components/AppSidebar";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

function AuthLayout() {
  const { user, ready } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !user) navigate({ to: "/login" });
  }, [ready, user, navigate]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-4">
          <Logo />
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full w-1/3 animate-pulse-glow bg-gradient-primary" />
          </div>
          <p className="text-xs text-muted-foreground">Warming up the neural cores…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar onNewChat={() => navigate({ to: "/chat", search: { new: "1" } as never })} />
      <div className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <Outlet />
      </div>
      <MobileNav />
    </div>
  );
}
