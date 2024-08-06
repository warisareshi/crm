import Landing from "@/components/marketing/Landing";
import { getUser } from "@/lib/user";
import { redirect } from "next/navigation";
export default async function LandingPage() {
  const user = await getUser();
  if (user) {
    return redirect("/auth");
  }
  return <Landing />;
}
