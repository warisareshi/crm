"use client";
import {
  Building,
  Edit,
  EllipsisIcon,
  Handshake,
  Loader,
  MoreVertical,
  Trash,
  TrashIcon,
  User,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useServerAction } from "zsa-react";
import { deleteActivityAction } from "@/server/activity";
import { useRouter } from "@/hooks/use-performance-router";
import { ActivityWithContact } from "@/types/entities";
import { cn } from "@/lib/utils/tailwind";
import ActivityTimestamp from "./ActivityTimestamp";

export function EntityActivityCard({
  activity,
  firstItem,
}: {
  firstItem: boolean;
  activity: ActivityWithContact;
}) {
  const [deleting, setDeleting] = React.useState(false);
  const deleteActivityActionCaller = useServerAction(deleteActivityAction);
  const router = useRouter();
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const [, err] = await deleteActivityActionCaller.execute({
        itemIds: [activity.id],
      });
      if (!err) {
        router.refresh();
      }
    } finally {
      setDeleting(false);
    }
  };
  return (
    <section className="relative flex items-center justify-between text-sm">
      {!firstItem && (
        <div className="absolute -top-4 left-2 h-5 w-[0.05rem] bg-gray-400" />
      )}
      <div className="flex items-center gap-2">
        {activity.entityType === "deal" ? (
          <Handshake className="size-4 text-gray-500" />
        ) : activity.entityType === "contact" ? (
          <User className="size-4 text-gray-500" />
        ) : activity.entityType === "account" ? (
          <Building className="size-4 text-gray-500" />
        ) : (
          "\u3164"
        )}
        <div className="flex items-center gap-1 py-1">
          <span className="">{activity.entityType}</span>
          <span className="truncate rounded-lg border px-2 py-0.5 sm:max-w-28 md:max-w-32 lg:max-w-56">
            {activity.entityTitle}
          </span>
          <span className="py-0.5">
            {activity.activityType === "entity_creation"
              ? "was created"
              : "was deleted"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <ActivityTimestamp timestamp={activity.createdAt} />
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              size={"icon"}
              className="mr-0.5 h-6 w-7"
              variant={"outline"}
            >
              <MoreVertical className="size-4 p-[0.05rem]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-20">
            <DropdownMenuItem onClick={handleDelete}>
              {deleting ? (
                <Loader className="mr-1 size-4 animate-spin" />
              ) : (
                <Trash className="mr-1 size-4" />
              )}
              delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </section>
  );
}
