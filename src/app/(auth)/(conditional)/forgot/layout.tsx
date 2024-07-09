import Navbar from "@/components/Navbar";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col h-screen ">
      <Navbar />
      {children}
    </main>
  );
}
