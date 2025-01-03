import "server-only";
import { db } from "@/database";
import {
  accountTable,
  contactEmailTable,
  contactPhoneTable,
} from "@/database/tables";
import { and, eq } from "drizzle-orm";
import { ulid } from "ulid";
import { Account } from "@/database/types";
import { State } from "@/providers/account-provider";
import { AccountFull } from "@/types/entities";

export async function getAccountById(id: string) {
  const account = await db.query.accountTable.findFirst({
    where: eq(accountTable.id, id),
    with: {
      workspace: true,
      contacts: {
        with: {
          contactEmail: true,
          contactPhone: true,
        },
      },
      deals: {
        with: {
          account: true,
          primaryContact: {
            with: {
              contactEmail: true,
              contactPhone: true,
            },
          },
        },
      },
      activities: {
        with: {
          associatedContact: true,
        },
      },
      tasks: true,
    },
  });
  return account;
}

export async function getAccountTypeById(
  id: string,
  type: "lead" | "client",
): Promise<AccountFull | undefined> {
  const account = await db.query.accountTable.findFirst({
    where: and(eq(accountTable.id, id), eq(accountTable.type, type)),
    with: {
      workspace: true,
      emails: true,
      contacts: {
        with: {
          account: true,
          contactEmail: true,
          contactPhone: true,
        },
      },
      deals: {
        with: {
          workspace: true,
          account: true,
          primaryContact: {
            with: {
              account: true,
              contactEmail: true,
              contactPhone: true,
            },
          },
        },
      },
      activities: {
        with: {
          associatedContact: true,
        },
      },
      tasks: true,
    },
  });

  return account as AccountFull | undefined; // Cast to AccountFull
}

export async function getAllWorkspaceAccounts(workspaceId: string) {
  const workspaceAccounts = await db.query.accountTable.findMany({
    where: eq(accountTable.workspaceId, workspaceId),
    with: {
      contacts: true,
    },
  });
  return workspaceAccounts;
}

export async function getAllWorkspaceLeads(workspaceId: string) {
  const workspaceAccounts = await db.query.accountTable.findMany({
    where: and(
      eq(accountTable.workspaceId, workspaceId),
      eq(accountTable.type, "lead"),
    ),
    with: {
      workspace: true,
      emails: true,
      contacts: {
        with: {
          contactEmail: true,
          contactPhone: true,
        },
      },
      activities: {
        with: {
          associatedContact: true,
        },
      },
      tasks: true,
      deals: {
        with: {
          primaryContact: {
            with: {
              contactEmail: true,
              contactPhone: true,
            },
          },
        },
      },
    },
  });
  return workspaceAccounts as AccountFull[];
}

export async function getAllWorkspaceClients(workspaceId: string) {
  const workspaceAccounts = await db.query.accountTable.findMany({
    where: and(
      eq(accountTable.workspaceId, workspaceId),
      eq(accountTable.type, "client"),
    ),
    with: {
      emails: true,
      contacts: {
        with: {
          contactEmail: true,
          contactPhone: true,
        },
      },
      activities: {
        with: {
          associatedContact: true,
        },
      },
      tasks: true,
      deals: {
        with: {
          primaryContact: {
            with: {
              contactEmail: true,
              contactPhone: true,
            },
          },
        },
      },
    },
  });
  return workspaceAccounts;
}

export async function createAccount(
  workspaceId: string,
  userId: string,
  accountName: string,
  type: "lead" | "client",
): Promise<Account> {
  const [created] = await db
    .insert(accountTable)
    .values({
      id: ulid(),
      workspaceId,
      accountName,
      type,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: userId,
      updatedById: userId,
    })
    .returning();
  return created;
}

export async function updateAccount(
  accountId: string,
  updates: Partial<Account>,
) {
  const [updated] = await db
    .update(accountTable)
    .set(updates)
    .where(eq(accountTable.id, accountId))
    .returning();
  return updated;
}

export async function deleteAccount(accountId: string) {
  const deleted = await db
    .delete(accountTable)
    .where(eq(accountTable.id, accountId));
  return deleted;
}

export async function updateContactEmail(contactId: string, email: string) {
  const [updated] = await db
    .update(contactEmailTable)
    .set({ email })
    .where(eq(contactEmailTable.contactId, contactId))
    .returning();
  return updated;
}

export async function updateContactPhone(
  contactId: string,
  phoneNumber: string,
  countryCode?: string,
) {
  const [updated] = await db
    .update(contactPhoneTable)
    .set({ phoneNumber, countryCode })
    .where(eq(contactPhoneTable.contactId, contactId))
    .returning();
  return updated;
}
