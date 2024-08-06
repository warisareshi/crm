"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useEffect, useRef } from "react";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface DataTablePrimaryFieldProps {
  getValue: () => any;
  row: any;
}

export function DataTablePrimaryField({
  getValue,
  row,
}: DataTablePrimaryFieldProps) {
  const initialValue = getValue();

  return (
    <Link
      href={`/lead/${row.original.id} || ""}`}
      className="flex items-center gap-2 underline hover:text-blue-600 px-2.5 w-full min-w-36"
    >
      <span
        className="select-none" // Ensure padding-right for space
      > 
        {initialValue || ""}
      </span>
    </Link>
  );
}
