import { auth, currentUser } from "@clerk/nextjs/server";
import {
  getOrCreateUserSessionRow,
  getUserBookings,
} from "@/lib/db/queries";
import { BookingRow } from "@/types";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function BookingsPage() {
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

  let bookings: BookingRow[] = [];

  try {
    const dbUser =
      await getOrCreateUserSessionRow(
        userId,
        userEmail
      );

    bookings =
      (await getUserBookings(
        dbUser.id
      )) ?? [];
  } catch (error) {
    console.error(
      "Failed to load bookings:",
      error
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-black">
            Bookings
          </h1>

          <p className="text-sm text-slate-500">
            Manage service bookings.
          </p>
        </div>

        <div className="rounded-lg border p-4">
          Booking form coming next.
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold">
            My Bookings
          </h2>

          {bookings.length === 0 ? (
            <div className="rounded-lg border p-4">
              No bookings yet.
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-lg border p-4"
              >
                <p>
                  {booking.service_type}
                </p>

                <p className="text-sm text-slate-500">
                  {booking.status}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}