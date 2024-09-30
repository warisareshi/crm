"use server";
import { createServerAction } from "zsa";
import { authenticatedAction } from "@/lib/zsa";
import { z } from "zod";
import {
  createAccount,
  deleteAccount,
  getAccountById,
  updateAccount,
} from "@/data-access/accounts";
import { selectedWorkspaceCookie } from "@/config";
import { cookies } from "next/headers";
import { accountCreateSchema } from "@/schemas/account.schema";
import {
  createContact,
  deleteContact,
  deleteContactEmail,
  deleteContactPhone,
  getAllAccountContacts,
} from "@/data-access/contacts";
import { getAllUserWorkspaces } from "@/data-access/workspaces";
import { deleteDeal, getAllAccountDeals } from "@/data-access/deal";

export const updateAccountAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      columnId: z.string(),
      itemId: z.string(),
      newValue: z.string(),
    }),
  )
  .handler(async ({ input }) => {
    const { columnId, itemId, newValue } = input;
    const res = await updateAccount(itemId, {
      [columnId]: newValue,
    });
    if (!res) {
      throw new Error("Couldn't update account"); // Inline error
    }
    return true;
  });

export const deleteAccountAction = authenticatedAction
  .createServerAction()
  .input(
    z.object({
      itemIds: z.array(z.string()),
    }),
  )
  .handler(async ({ input, ctx }) => {
    const { itemIds } = input;

    for (const itemId of itemIds) {
      const deals = await getAllAccountDeals(itemId);

      for (const deal of deals) {
        await deleteDeal(deal.id);
      }

      const contacts = await getAllAccountContacts(itemId);

      for (const contact of contacts) {
        await deleteContactEmail(contact.id);
        await deleteContactPhone(contact.id);
        await deleteContact(contact.id);
      }

      const res = await deleteAccount(itemId);
      if (!res) {
        throw new Error("Couldn't delete account");
      }
    }
    return true;
  });

export const createAccountAction = authenticatedAction
  .createServerAction()
  .input(accountCreateSchema)
  .output(z.object({ success: z.boolean(), data: z.any() }))
  .handler(async ({ input, ctx }) => {
    const { accountName, type, contactName } = input;
    const { user } = ctx;
    const currentWorkspaceId = cookies().get(selectedWorkspaceCookie)?.value;
    if (!currentWorkspaceId) {
      throw new Error("Workspace not found"); // Inline error
    }
    const accountRes = await createAccount(
      currentWorkspaceId,
      user.id,
      accountName,
      type,
    );
    const contactRes = await createContact(
      currentWorkspaceId,
      user.id,
      accountRes.id,
      contactName,
    );

    if (!accountRes || !contactRes) {
      throw new Error("Couldn't create account"); // Inline error
    }
    const account = await getAccountById(accountRes.id);
    if (!account) {
      throw new Error("Account not found after creation");
    }
    return {
      success: true,
      data: account,
    };
  });
