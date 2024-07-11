import { Sidebar } from "@/components/internal/Sidebar";
import UserButton from "@/components/global/UserButton";
import { getUser } from "@/lib/lucia";
import { redirect } from "next/navigation";
import { signOut } from "../(auth)/auth.actions";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  try {
    const user = await getUser();
    if (!user) {
      redirect("/signin");
    }
  } catch (error) {
    await signOut();
    console.error(error);
    redirect("/signin");
  }
  return (
    <div className="flex flex-row min-h-screen max-w-screen">
      <UserButton className="absolute top-5 right-4"/>
      <div className="absolute w-[12.5vw]">
        <Sidebar />
      </div>
      <div className="ml-48 w-[80vw] h-screen">{children}</div>
    </div>
  );
}