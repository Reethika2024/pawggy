import DeleteAddressButton from "@/components/buttons/DeleteAddressButton";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  getOrCreateUserSessionRow,
  getUserAddresses,
} from "@/lib/db/queries";
import AddressForm from "@/components/forms/AddressForm";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function AddressesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const clerkUser = await currentUser();

  const userEmail =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress;

  if (!userEmail) {
    redirect("/sign-in");
  }

  let addresses: any[] = [];

  try {
    const dbUser = await getOrCreateUserSessionRow(
      userId,
      userEmail
    );

    addresses = await getUserAddresses(dbUser.id);
  } catch (error) {
    console.error("Failed to load addresses:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight sm:text-2xl">
            Addresses
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage delivery and service addresses.
          </p>
        </div>

        <AddressForm />

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Saved Addresses
          </h2>

          {addresses.length === 0 ? (
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
              No addresses added yet.
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900"
              >
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  {address.label}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {address.street_address}
                </p>

                {address.landmark && (
                  <p className="text-sm text-slate-500">
                    {address.landmark}
                  </p>
                )}

                <p className="text-sm text-slate-500">
                  {address.city}, {address.state}
                </p>

                <p className="text-sm text-slate-500">
                  {address.postal_code}
                </p>

                {address.is_default && (
                  <span className="inline-block mt-2 px-2 py-1 rounded bg-green-100 text-xs text-green-700">
                    Default Address
                  </span>
                )}

                <DeleteAddressButton
                  addressId={address.id}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}