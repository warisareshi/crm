import { LucideIcon } from "lucide-react";
import React from "react";

export const LogoHead = ({
  title,
  Icon,
}: {
  title: string;
  Icon: LucideIcon;
}) => {
  return (
    <div className="flex select-none items-center gap-1.5 border-l border-gray-200 px-2 py-1.5 font-medium">
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </div>
  );
};