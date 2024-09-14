import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { Table } from "drizzle-orm";

export function DataTableHeaderCheckbox({ table }: { table: any }) {
  return (
    <div
      className="flex cursor-pointer items-center select-none"
      onClick={() => table.toggleAllPageRowsSelected()}
    >
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </div>
  );
}
