"use client";

import {
  Building,
  Clock,
  Inbox,
  Map,
  Search,
  Settings,
  SquareUserRound,
  Zap,
} from "lucide-react";

import Link from "next/link";
import React from "react";
import { User } from "@/db/schema/types";
import { UserBtn } from "./user-btn";
import { usePathname } from "next/navigation";

const Sidebar = ({ user }: { user: User }) => {
  const sidebarItemClassName =
    "flex font-medium gap-2 items-center text-black/80 text-sm hover:bg-muted-foreground/10 rounded-lg px-2 my-[2.25px] py-[3.75px] cursor-pointer";
  const pathname = usePathname();
  return (
    <div className="flex h-screen w-60 select-none flex-col justify-between border-r bg-card outline-none">
      <div className="flex flex-col pl-2 pr-2 pt-3">
        <div className="mb-2 ml-2 flex items-center">
          <UserBtn email={user.email} />
        </div>
        <ul className="mb-2">
          <div className={`${sidebarItemClassName}`}>
            <Search className="h-4 w-4" />
            <span>Search</span>
          </div>
          <Link
            href="/inbox"
            className={`${sidebarItemClassName} ${
              pathname === "/inbox" ? "bg-muted-foreground/10 !text-black" : ""
            }`}
            >
            <Inbox className="h-4 w-4" />
            <span>Inbox</span>
          </Link>
        </ul>
        <ul className="">
          <Link
            href="/deals"
            className={`${sidebarItemClassName} ${
              pathname === "/deals" ? "bg-muted-foreground/10 !text-black" : ""
            }`}
            >
            <Zap className="h-4 w-4" />
            <span>Deals</span>
          </Link>
          <Link
            href="/leads"
            prefetch={false}
            className={`${sidebarItemClassName} ${
              pathname === "/leads" ? "bg-muted-foreground/10 !text-black" : ""
            }`}
          >
            <Building className="h-4 w-4" />
            <span>Leads</span>
          </Link>
          <Link
            href="/contacts"
            prefetch={false}
            className={`${sidebarItemClassName} ${
              pathname === "/contacts"
                ? "bg-muted-foreground/10 !text-black"
                : ""
            }`}
          >
            <SquareUserRound className="h-4 w-4" />
            <span>Contacts</span>
          </Link>
        </ul>
      </div>
      <div className="flex flex-col pl-2 pr-2 pt-3">
        <ul className="pb-3">
          <Link href="/updates" className={`${sidebarItemClassName}`}>
            <Clock className="h-4 w-4" />
            <span>What's New</span>
          </Link>
          <Link href="/roadmap" className={`${sidebarItemClassName}`}>
            <Map className="h-4 w-4" />
            <span>Roadmap</span>
          </Link>
          <Link href="/settings" className={`${sidebarItemClassName}`}>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
