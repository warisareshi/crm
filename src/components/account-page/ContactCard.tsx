"use client";

import { Card } from "@/components/ui/card";
import { Contact, ContactEmail, ContactPhone } from "@database/types";
import React from "react";
import { ArrowUpRight, MailIcon, PhoneIcon } from "lucide-react";
import { NewContactForm } from "../forms/NewContactForm";

export function ContactCard({
  contacts,
  accountId,
}: {
  contacts: Array<
    Contact & { contactPhone: ContactPhone; contactEmail: ContactEmail }
  >;
  accountId: string;
}) {
  return (
    <Card>
      <div className="flex justify-between border-b border-gray-200 p-3">
        <h1>Contacts</h1>
        <NewContactForm accountId={accountId} />
      </div>
      <div className="flex flex-col gap-2 p-2">
        {contacts && contacts.length > 0 ? (
          contacts.map(
            (
              contact: Contact & {
                contactPhone: ContactPhone;
                contactEmail: ContactEmail;
              },
            ) => (
              <Card key={contact.id}>
                <div className="flex w-full justify-between p-2">
                  <div className="flex items-center gap-2">
                    <h1 className="max-w-[11rem] truncate">
                      {contact.contactName}
                    </h1>
                    <div className="flex">
                      <button
                        className="rounded-y flex h-6 w-7 items-center justify-center rounded-l border-y border-l border-gray-200 hover:bg-gray-200"
                        onClick={() =>
                          (window.location.href = `tel:${contact.contactPhone.countryCode ?? ""}${contact.contactPhone.phoneNumber ?? ""}`)
                        }
                      >
                        <PhoneIcon className="h-4 w-4" />
                      </button>
                      <button
                        className="rounded-y flex h-6 w-7 items-center justify-center rounded-r border-y border-r border-gray-200 hover:bg-gray-200"
                        onClick={() =>
                          (window.location.href = `mailto:${contact.contactEmail.email ?? ""}`)
                        }
                      >
                        <MailIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-200 hover:bg-gray-200">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            ),
          )
        ) : (
          <p className="py-2 text-center text-sm text-gray-500">
            Create a contact above.
          </p>
        )}
      </div>
    </Card>
  );
}
