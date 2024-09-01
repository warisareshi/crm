import React from "react";
import { Loader2 } from "lucide-react";
import { authGateways } from "@/lib/gateways";

export default async function AuthenticationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let isAuth = false;
  await authGateways.externalApp().then(() => {
    isAuth = true;
  });
  if (isAuth) {
    return <>{children}</>;
  }
  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-black/50" />
    </main>
  );
}
