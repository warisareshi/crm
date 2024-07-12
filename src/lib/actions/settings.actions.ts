"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { getUser } from "../lucia";
import { redirect } from "next/navigation";
import { updateAccountSchema } from "@/validators/settings";
import { userTable } from "@/db/schema";
import { z } from "zod";

export const updateAccount = async (
  data: z.infer<typeof updateAccountSchema>
) => {
  try {
    const user = await getUser();
    if (!user) {
      return {
        success: false,
        message: "You must be logged in to be changing account settings",
      };
    }

    if (user.name !== null || user.name !== undefined) {
      user.name = data.name;
    }

    const updateQuery = await db
      .update(userTable)
      .set(user)
      .where(eq(userTable.id, user.id));

    if (!updateQuery) {
      return {
        success: false,
        message: "Failed to update user",
      };
    }

    return {
      success: true,
      message: "Updated Account Settings Successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Internal error while updating account settings",
    };
  }
};