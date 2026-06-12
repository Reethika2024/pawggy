import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUserSessionRow } from "@/lib/db/queries";
import ProfileForm from "@/components/forms/ProfileForm";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();
  const userEmail =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress;
    
  if (!userEmail) redirect("/sign-in");

  let sessionRow = null;
  try {
    sessionRow = await getOrCreateUserSessionRow(userId, userEmail);
  } catch (error) {
    // Fail-safe logic blocks database compilation issues from triggering app-level shell crashes
  }

  const initialData = sessionRow ? {
    first_name: sessionRow.first_name,
    last_name: sessionRow.last_name,
    phone: sessionRow.phone,
  } : undefined;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight sm:text-2xl">
            Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your profile information and contact details.
          </p>
        </div>

        <ProfileForm initialData={initialData} />
      </div>
    </div>
  );
}