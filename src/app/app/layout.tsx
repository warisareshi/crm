// layout.tsx
import React, { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUserById } from "@/data-access/users";
import { fetchAuthenticatedUser } from "@/lib/session";
import {
  afterSignUpUrl,
  afterVerifyUrl,
  unauthenticatedUrl,
} from "@/constants";
import { getAllUserWorkspaces } from "@/data-access/workspaces";
import { selectedWorkspaceCookie } from "@/constants";
import { validateRequest } from "@/lib/lucia";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/sidebar/app-sidebar";
import { UserWithWorkspaceAndProfile } from "@/types/entities";
import { Profile } from "@database/types";
import { CommandPaletteProvider } from "@/providers/commandProvider";
import { CommandPalette } from "@/components/command-palette";
import { getAllWorkspaceAccounts } from "@/data-access/accounts";

export default async function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const validator = await validateRequest();
  if (!validator.user) {
    return redirect(unauthenticatedUrl);
  }
  const dbUser = await getUserById(validator.user.id);
  if (!dbUser) {
    return redirect(unauthenticatedUrl);
  }
  if (!dbUser.verifiedAt) {
    return redirect(afterSignUpUrl);
  }
  if (!dbUser.onboardedAt) {
    return redirect(afterVerifyUrl);
  }

  const workspaces = await getAllUserWorkspaces(dbUser.id);

  const cookieSelectedWorkspaceId =
    (await cookies()).get(selectedWorkspaceCookie)?.value || "";

  const userProfileWorkspace: UserWithWorkspaceAndProfile = {
    ...dbUser,
    profile: dbUser.profile as Profile,
    workspaces: workspaces,
  };

  const workspaceAccounts = await getAllWorkspaceAccounts(
    cookieSelectedWorkspaceId,
  );

  return (
    // <main className="grid min-h-screen w-full grid-cols-[240px_1fr]">
    //   <Sidebar
    //     user={dbUser}
    //     workspaces={workspaces}
    //     cookieSelectedWorkspaceId={cookieSelectedWorkspaceId}
    //   />
    //   <div>{children}</div>
    // </main>
    <CommandPaletteProvider>
      <SidebarProvider>
        <CommandPalette accounts={workspaceAccounts} />
        <AppSidebar
          user={userProfileWorkspace}
          cookieselectedworkspaceid={cookieSelectedWorkspaceId}
        />{" "}
        <main className="grid min-h-screen w-full">
          {" "}
          <Suspense fallback={<div>Loading...</div>}>{children} </Suspense>
        </main>
      </SidebarProvider>
    </CommandPaletteProvider>
  );
}
