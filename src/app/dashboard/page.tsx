import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Pawggy Dashboard</h1>

      <div className="mt-6 rounded-lg border p-4">
        <p>Authenticated User:</p>
        <p className="font-mono">{userId}</p>
      </div>
    </main>
  );
}