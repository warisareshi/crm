"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schemas/auth.schema";
import { cn } from "@/utils/tailwind";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useServerAction } from "zsa-react";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { PasswordField } from "../ui/password-input";
import { useRouter } from "next/navigation";
import { getGoogleOauthConsentUrlAction } from "@/server/oauth";

export const LoginForm = ({
  login,
}: {
  login: (formData: z.infer<typeof loginSchema>) => Promise<any>;
}) => {
  const { execute } = useServerAction(login);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const getGoogleOauthConsentUrlActionCaller = useServerAction(
    getGoogleOauthConsentUrlAction,
  );

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { handleSubmit, control, reset } = form;

  const onSubmit = async (formData: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    const [data, err] = await execute(formData);

    if (err) {
      toast.error(err.message, {
        duration: 2000,
      });
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(false);
    reset();
  };

  const handleOAuthButtonClick = async (
    type: "google" | "microsoft" | "apple",
  ) => {
    setIsSubmitting(true);
    try {
      switch (type) {
        case "google": {
          const [data, err] =
            await getGoogleOauthConsentUrlActionCaller.execute();
          if (!data?.success || err) {
            toast.error("Failed to continue with Google");
            return;
          } else {
            router.push(data?.url);
          }
        }
      }
    } catch (error) {
      toast.error("Something Went Wrong. Failed to continue with Google");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid h-screen items-center">
      <Link
        href="/signup"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-4 top-4 md:right-8 md:top-8",
        )}
      >
        Sign Up
      </Link>
      <div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="flex flex-row items-center justify-center gap-2 text-2xl font-semibold tracking-tight">
              <Image
                src={"/assets/logo_app.svg"}
                alt="Logo"
                width={25}
                height={25}
              />
              Login to Asend
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password below to login.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Button
              variant="outline"
              type="button"
              disabled={isSubmitting}
              onClick={async () => await handleOAuthButtonClick("google")}
            >
              {isSubmitting ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Image
                  src="/logos/google.png"
                  alt="Google"
                  height={16}
                  width={16}
                  className="mr-2"
                />
              )}{" "}
              Continue with Google
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  OR
                </span>
              </div>
            </div>
            <Form {...form}>
              <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
                <FormField
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
                          autoCapitalize="none"
                          autoComplete="email"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <PasswordField placeholder="Enter your password" />
                <Button disabled={isSubmitting} type="submit" className="mt-1">
                  {isSubmitting && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};
