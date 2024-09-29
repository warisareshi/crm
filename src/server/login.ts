"use server";
import { createServerAction } from "zsa";
import { loginSchema } from "@/schemas/auth.schema";
import { checkUserPassword } from "@/data-access/users";
import { createSessionForUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { unauthenticatedAction } from "@/lib/zsa";
import { authenticatedUrl } from "@/urls";

export const loginAction = unauthenticatedAction
  .createServerAction()
  .input(loginSchema)
  .handler(async ({ input }) => {
    const { email, password } = input;
    const user = await checkUserPassword(email, password);
    if (!user) {
      throw new Error("Invalid email or password"); // Inline error
    }
    await createSessionForUser(user.id);
    return redirect(authenticatedUrl);
  });
