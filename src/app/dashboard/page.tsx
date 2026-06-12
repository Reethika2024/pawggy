import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUserSessionRow } from "@/lib/db/queries";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Not authenticated</div>;
  }

  const clerkUser = await currentUser();

  const email =
    clerkUser?.emailAddresses?.[0]?.emailAddress || "";

  const dbUser = await getOrCreateUserSessionRow(
    userId,
    email
  );

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        Pawggy Dashboard
      </h1>

      <div className="mt-6 border rounded-lg p-4">
        <p>Clerk User ID:</p>
        <p>{userId}</p>

        <br />

        <p>Database User ID:</p>
        <p>{dbUser.id}</p>

        <br />

        <p>Email:</p>
        <p>{dbUser.email}</p>
      </div>
    </main>
  );
}