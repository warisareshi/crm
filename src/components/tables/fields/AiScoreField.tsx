"use client";

import { Account } from "@database/types";
import { Row } from "@tanstack/react-table";
import { Sparkle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface AiScoreFieldProps {
  getValue: () => any;
  row: any;
}

export function AiScoreField({ getValue, row }: AiScoreFieldProps) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const router = useRouter();
  const id = row.original.id;
  return (
    <div
      className="select-none border-l border-gray-200 px-2 py-1"
      onClick={() => router.push(`/app/leads/${id}`)}
    >
      <div className="flex items-center gap-1 py-0.5">
        {value ? (
          <>
            <Sparkle className="mr-1 h-4 w-4" />
            <span className="underline decoration-muted-foreground decoration-2">
              {value}
            </span>
          </>
        ) : (
          "\u3164"
        )}
      </div>
    </div>
  );
}
