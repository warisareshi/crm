"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Building,
  CalendarDays, DollarSign, Route
} from "lucide-react";
import {
  CheckboxHead,
  LogoHead,
  PrimaryHead,
} from "@/app/app/_components/table_headers";
import {
  SecondaryField, CheckboxField,
  DealStageField,
  ValueField,
  ExpectedCloseField
} from "@/app/app/_components/table_fields";
import { DealWithPrimaryContact } from "@/types/entities";

export const DealColumns: ColumnDef<DealWithPrimaryContact>[] = [
  {
    id: "select",
    header: CheckboxHead,
    cell: CheckboxField,
  },
  {
    id: "title",
    header: () => <PrimaryHead title="Deal title" />,
    cell: ({ getValue, row }) => (
      <SecondaryField
        row={row}
        urlType={row.original.account?.type ?? ""} // Account type is used to determine the URL path
        accountId={row.original.accountId}
        entityId={row.original.id}
        entityType={"deal"}
        showAvatar={false} // Hides avatar in the title column for a cleaner look
      />
    ),
    accessorKey: "title",
  },
  {
    id: "account",
    header: () => <LogoHead title="Lead or Client" Icon={Building} />,
    cell: ({ getValue, row }) => (
      <SecondaryField
        row={row}
        urlType={row.original.account?.type ?? ""}
        isPrimary
        accountId={row.original.accountId}
      />
    ),
    accessorKey: "account",
  },
  {
    id: "stage",
    header: () => <LogoHead title="Deal stage" Icon={Route} />,
    cell: DealStageField,
    accessorKey: "stage",
  },
  {
    id: "value",
    header: () => <LogoHead title="Deal value" Icon={DollarSign} />,
    cell: ValueField,
    accessorKey: "value",
  },
  {
    id: "expected close",
    header: () => <LogoHead title="Expected close" Icon={CalendarDays} />,
    cell: ExpectedCloseField,
    accessorKey: "expectedCloseDate",
  },
];
