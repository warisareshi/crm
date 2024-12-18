"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CalendarDays, Component, LucideUsers, Users } from "lucide-react";
import {
  CheckboxHead,
  LogoHead,
  PrimaryHead,
} from "@/app/app/_components/table_headers";
import {
  AiScoreField,
  LastInteractionField,
  PrimaryField,
  SecondaryField,
  StatusField,
  CheckboxField,
} from "@/app/app/_components/table_fields";
import { AccountFull } from "@/types/entities";

export const LeadsColumns: ColumnDef<AccountFull>[] = [
  {
    id: "select",
    header: CheckboxHead,
    cell: CheckboxField,
  },
  {
    id: "accountName",
    accessorKey: "accountName",
    header: () => <PrimaryHead title="Lead name" />,
    cell: ({ getValue, row }) => (
      <PrimaryField getValue={getValue} row={row} isAccount={true} />
    ),
  },
  {
    id: "contacts",
    accessorKey: "contacts",
    header: () => <LogoHead title="Contacts" Icon={LucideUsers} />,
    cell: ({ getValue, row }) => (
      <SecondaryField
        row={row}
        urlType="lead"
        accountId={row.original.id}
        entityType="contact"
      />
    ),
  },
  {
    id: "status",
    accessorKey: "status",
    header: () => <LogoHead title="Status" Icon={Component} />,
    cell: ({ getValue, row }) => <StatusField getValue={getValue} />,
  },
  {
    id: "ai score",
    accessorKey: "score",
    header: () => <LogoHead title="AI score" Icon={CalendarDays} />,
    cell: AiScoreField,
  },
  {
    id: "last activity",
    accessorKey: "activities",
    header: () => <LogoHead title="Last activity" Icon={Users} />,
    cell: ({ getValue, row }) => <LastInteractionField getValue={getValue} />,
  },
];
