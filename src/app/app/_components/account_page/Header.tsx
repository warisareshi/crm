"use client";
import React, { useContext, useState } from "react";
import { AccountContext } from "@/providers/accountProvider";
import Link from "@/components/performance-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/tailwind";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader, MoreVertical, Share, Trash } from "lucide-react";
import { useServerAction } from "zsa-react";
import { deleteAccountAction, updateAccountAction } from "@/server/accounts";
import { toast } from "sonner";
import { useRouter } from "@/hooks/use-performance-router";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AccountShareDialog from "./AccountShareDialog";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function Header({ className }: { className?: string }) {
  const { account } = useContext(AccountContext);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [converting, setConverting] = useState<boolean>(false);
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const deleteActivityActionCaller = useServerAction(deleteAccountAction);
  const updateAccountActionCaller = useServerAction(updateAccountAction);
  const router = useRouter();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const [, err] = await deleteActivityActionCaller.execute({
        itemIds: [account?.id!],
      });
      if (!err) {
        router.replace(`/app/${account?.type}s/`);
        router.refresh();
      }
    } catch (error) {
      toast.error(
        "Something Went Wrong, Please contact support if issue persists.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleConvertToClient = async () => {
    if (account?.type === "client") {
      toast.error("This account is already a client.");
      return;
    }

    setConverting(true);
    try {
      const [, err] = await updateAccountActionCaller.execute({
        itemId: account?.id!,
        columnId: "type",
        newValue: "client",
      });
      if (!err) {
        toast.success("Converted to client successfully");
        router.push(`/app/clients/${account?.id}`);
      } else {
        toast.error("Failed to convert account to client.");
      }
    } catch (error) {
      toast.error(
        "Something Went Wrong, Please contact support if issue persists.",
      );
    } finally {
      setConverting(false);
    }
  };

  return (
    <section
      className={cn(
        "flex items-center justify-between border-b border-border",
        className,
      )}
    >
      {/* <SidebarTrigger /> */}
      <div className="text-lg">
        <Link
          className="capitalize opacity-70 hover:opacity-90"
          href={`/app/${account?.type}s/`}
        >
          {account?.type}
        </Link>
        {" / "}
        <span className="font-medium">{account?.accountName || ""}</span>
      </div>
      <div className="flex gap-2">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              size={"icon"}
              className="mr-0.5 h-7 w-7"
              variant={"outline"}
            >
              <MoreVertical className="size-4 p-[0.05rem]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-20">
            <DropdownMenuItem onClick={handleDelete} className="h-7">
              {deleting ? (
                <>
                  <Loader className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 size-4" />
                  Delete
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setShareDialogOpen(true)}
              className="h-7"
            >
              <Share className="mr-2 size-4" />
              Share
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {account?.type === "lead" && (
          <Button
            className="h-7"
            onClick={handleConvertToClient}
            variant={"outline"}
            disabled={converting}
          >
            {converting ? (
              <>
                <Loader className="mr-2 size-4 animate-spin" />
                Converting...
              </>
            ) : (
              "Convert to Client"
            )}
          </Button>
        )}
      </div>
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="p-4">
          <AccountShareDialog
            entityId={account?.id ?? ""}
            entityType="account"
          />
        </DialogContent>
      </Dialog>
    </section>
  );
}
