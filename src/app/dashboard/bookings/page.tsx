import CancelBookingButton from "@/components/buttons/CancelBookingButton";
import BookingForm from "@/components/forms/BookingForm";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  getOrCreateUserSessionRow,
  getUserPets,
  getUserAddresses,
  getUserBookings,
} from "@/lib/db/queries";
import {
  PetRow,
  UserAddressRow,
  BookingRow,
} from "@/types";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function BookingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const clerkUser = await currentUser();

  const userEmail =
    clerkUser?.primaryEmailAddress
      ?.emailAddress ??
    clerkUser?.emailAddresses?.[0]
      ?.emailAddress;

  if (!userEmail) {
    redirect("/sign-in");
  }

  let pets: PetRow[] = [];
  let addresses: UserAddressRow[] = [];
  let bookings: BookingRow[] = [];

  try {
    const dbUser =
      await getOrCreateUserSessionRow(
        userId,
        userEmail
      );

    pets =
      (await getUserPets(dbUser.id)) ??
      [];

    addresses =
      (await getUserAddresses(
        dbUser.id
      )) ?? [];

    bookings =
      (await getUserBookings(
        dbUser.id
      )) ?? [];
  } catch (error) {
    console.error(error);
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

        <BookingForm
          pets={pets}
          addresses={addresses}
        />

        <div className="space-y-3">
          <h2 className="text-lg font-bold">
            Existing Bookings
          </h2>

          {bookings.length === 0 ? (
            <div className="rounded-lg border p-4">
              No bookings found.
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-lg border p-4 bg-white dark:bg-slate-900"
              >
                <p>
                  <strong>Pet:</strong>{" "}
                  {booking.pets?.name ??
                    "Unknown"}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {booking
                    .user_addresses
                    ?.label ??
                    "Unknown"}
                </p>

                <p>
                  <strong>Service:</strong>{" "}
                  {booking.service_type}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(
                    booking.booking_date
                  ).toLocaleString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute:
                        "2-digit",
                    }
                  )}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {booking.status}
                </p>

                {booking.status !==
                  "cancelled" && (
                  <CancelBookingButton
                    bookingId={
                      booking.id
                    }
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}