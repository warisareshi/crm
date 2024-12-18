"use client";
import { NewActivityForm } from "./NewActivityForm";
import { Button } from "@/components/ui/button";
import { AccountContext } from "@/providers/account-provider";
import { ActivityType } from "@/types/entities";
import { PhoneCall, MailPlus, MessageSquareMore } from "lucide-react";
import { useContext, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommentActivityCard } from "./CommentActivityCard";
import { CallLogActivityCard } from "./CallLogActivityCard";
import { EntityActivityCard } from "./EntityActivityCard";
import { TaskActivityCard } from "./TaskActivityCard";
import React from "react";
type ActivityButton = {
  type: ActivityType;
  icon: React.ElementType;
  label: string;
};

const activityButtons: ActivityButton[] = [
  {
    type: "comment",
    icon: MessageSquareMore,
    label: "Add comment",
  },
  {
    type: "call",
    icon: PhoneCall,
    label: "Log call",
  },
];

export function ActivityPanel() {
  const { activities } = useContext(AccountContext);
  const [activityFormOpen, setActivityFormOpen] = useState(false);
  const [activityType, setActivityType] = useState<ActivityType>();

  const buttonOnClickHandler = (button: ActivityButton) => {
    return () => {
      if (button.type !== "email") {
        if (activityFormOpen && activityType === button.type) {
          // Close the form
          setActivityFormOpen(false);
          setActivityType(undefined);
        } else {
          // Open the form with selected activity type
          setActivityType(button.type);
          setActivityFormOpen(true);
        }
      } else return;
    };
  };

  return (
    <section className="grid w-full gap-3">
      <section className="absolute right-[1rem] top-[4.12rem]">
        <div className="flex gap-2">
          {activityButtons.map((button) => (
            <Button
              key={button.type}
              className="inline-flex !h-fit !max-h-fit gap-1.5 px-1.5 py-1"
              variant="outline"
              onClick={buttonOnClickHandler(button)}
            >
              <button.icon size={14} />
              {button.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Render the form only when it is open */}
      {activityFormOpen && (
        <NewActivityForm
          activityType={activityType!}
          setActivityFormOpen={setActivityFormOpen}
        />
      )}

      <ScrollArea
        className={`flex flex-col ${activityFormOpen ? "max-h-[70vh]" : "max-h-[81vh]"} min-w-full overflow-hidden overflow-y-auto`}
      >
        <div className="grid gap-2">
          {activities && activities.length > 0
            ? activities
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .map((activity, index) => {
                  switch (true) {
                    case activity.isEntityActivity:
                      return (
                        <EntityActivityCard
                          activity={activity}
                          key={activity.id}
                          firstItem={index === 0}
                        />
                      );
                    case activity.activityType === "comment":
                      return (
                        <CommentActivityCard
                          activity={activity}
                          key={activity.id}
                          firstItem={index === 0}
                        />
                      );
                    case activity.activityType === "call":
                      return (
                        <CallLogActivityCard
                          activity={activity}
                          key={activity.id}
                          firstItem={index === 0}
                        />
                      );
                    default:
                      return null;
                  }
                })
            : null}
        </div>
      </ScrollArea>
    </section>
  );
}
