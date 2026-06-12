import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUserSessionRow } from "@/lib/db/queries";
import AddressForm from "../../../components/forms/AddressForm";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function AddressesPage() {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();

  const userEmail =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress;

  if (!userEmail) redirect("/sign-in");

  try {
    await getOrCreateUserSessionRow(userId, userEmail);
  } catch {}

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black">
            Addresses
          </h1>

          <p className="text-sm text-slate-500">
            Manage delivery and service addresses.
          </p>
        </div>

        <AddressForm />
      </div>
    </div>
  );
}