import Link from "next/link";
import CancelBookingButton from "@/components/buttons/CancelBookingButton";
import UpdateBookingStatusButton from "@/components/buttons/UpdateBookingStatusButton";
import BookingForm from "@/components/forms/BookingForm";
import ReviewForm from "@/components/forms/ReviewForm";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  getOrCreateUserSessionRow,
  getUserPets,
  getUserAddresses,
  getUserBookings,
  getServiceProviders,
} from "@/lib/db/queries";
import {
  PetRow,
  UserAddressRow,
  BookingRow,
  ServiceProviderRow,
} from "@/types";
import { redirect } from "next/navigation";

export const revalidate = 0;

function getServiceIcon(serviceType: string) {
  switch (serviceType) {
    case "Grooming":
      return "✂️";
    case "Vet Visit":
      return "🩺";
    case "Boarding":
      return "🏠";
    default:
      return "🐾";
  }
}

function getStatusStyles(status: string) {
  switch (status) {
    case "pending":
      return "bg-amber-400/10 text-amber-300 border-amber-400/20";

    case "confirmed":
      return "bg-blue-400/10 text-blue-300 border-blue-400/20";

    case "completed":
      return "bg-emerald-400/10 text-emerald-300 border-emerald-400/20";

    case "cancelled":
      return "bg-red-400/10 text-red-300 border-red-400/20";

    default:
      return "bg-white/10 text-slate-300 border-white/10";
  }
}

function formatBookingDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

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

  let pets: PetRow[] = [];
  let addresses: UserAddressRow[] = [];
  let bookings: BookingRow[] = [];
  let providers: ServiceProviderRow[] = [];

  try {
    const dbUser = await getOrCreateUserSessionRow(
      userId,
      userEmail
    );

    pets = (await getUserPets(dbUser.id)) ?? [];

    addresses =
      (await getUserAddresses(dbUser.id)) ?? [];

    providers =
      (await getServiceProviders()) ?? [];

    bookings =
      (await getUserBookings(dbUser.id)) ?? [];
  } catch (error) {
    console.error(error);
  }

  const pendingCount = bookings.filter(
    (booking) =>
      booking.status === "pending"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) =>
      booking.status === "confirmed"
  ).length;

  const completedCount = bookings.filter(
    (booking) =>
      booking.status === "completed"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            🐾 Pawggy
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/providers"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950"
            >
              Find Services
            </Link>
          </div>
        </div>
      </header>

      {/* PAGE */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* HERO */}
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Pawggy bookings
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Book and manage pet care.
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-400">
            Choose a trusted provider, select your pet,
            and schedule the care they need.
          </p>
        </div>

        {/* STATS */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Pending"
            value={pendingCount}
          />

          <StatCard
            label="Confirmed"
            value={confirmedCount}
          />

          <StatCard
            label="Completed"
            value={completedCount}
          />
        </div>

        {/* BOOKING FORM */}
        <section className="mt-12">
          <div className="mb-5">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              New booking
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Schedule a service
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Book grooming, veterinary care or boarding.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 md:p-8">
            <BookingForm
              pets={pets}
              addresses={addresses}
              providers={providers}
            />
          </div>
        </section>

        {/* EXISTING BOOKINGS */}
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
                Your activity
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Booking history
              </h2>
            </div>

            <Link
              href="/dashboard/providers"
              className="text-sm font-semibold text-slate-300 hover:text-white"
            >
              Find another provider →
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-10 text-center">
              <div className="text-4xl">🐾</div>

              <h3 className="mt-4 text-xl font-bold">
                No bookings yet
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Your upcoming and previous pet services
                will appear here.
              </p>

              <Link
                href="/dashboard/providers"
                className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950"
              >
                Browse Providers
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {bookings.map((booking) => (
                <article
                  key={booking.id}
                  className="rounded-3xl border border-white/10 bg-slate-900 p-6 md:p-7"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    {/* LEFT */}
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                        {getServiceIcon(
                          booking.service_type
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold">
                            {booking.service_type}
                          </h3>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getStatusStyles(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <p className="mt-2 text-lg font-semibold text-slate-200">
                          {booking.service_providers
                            ?.name ?? "Provider"}
                        </p>

                        <p className="mt-2 text-sm text-slate-400">
                          {booking.pets?.name ??
                            "Pet"}{" "}
                          ·{" "}
                          {booking.user_addresses
                            ?.label ?? "Address"}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 lg:min-w-[250px]">
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Scheduled
                      </p>

                      <p className="mt-2 font-semibold">
                        {formatBookingDate(
                          booking.booking_date
                        )}
                      </p>

                      <p className="mt-2 text-sm text-slate-400">
                        📍{" "}
                        {booking.user_addresses
                          ?.label ?? "Saved address"}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {booking.service_providers
                          ?.city ?? "Hyderabad"}
                      </p>
                    </div>
                  </div>

                  {/* PROVIDER DETAILS */}
                  <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 md:grid-cols-3">
                    <InfoItem
                      label="Provider"
                      value={
                        booking.service_providers
                          ?.name ?? "Unknown"
                      }
                    />

                    <InfoItem
                      label="Type"
                      value={
                        booking.service_providers
                          ?.provider_type ??
                        "Unknown"
                      }
                    />

                    <InfoItem
                      label="Rating"
                      value={
                        booking.service_providers
                          ? `★ ${booking.service_providers.rating.toFixed(
                              1
                            )}`
                          : "—"
                      }
                    />
                  </div>

                  {/* ACTIONS */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {booking.status ===
                      "pending" && (
                      <UpdateBookingStatusButton
                        bookingId={booking.id}
                        nextStatus="confirmed"
                      />
                    )}

                    {booking.status ===
                      "confirmed" && (
                      <UpdateBookingStatusButton
                        bookingId={booking.id}
                        nextStatus="completed"
                      />
                    )}

                    {booking.status !==
                      "cancelled" &&
                      booking.status !==
                        "completed" && (
                        <CancelBookingButton
                          bookingId={booking.id}
                        />
                      )}
                  </div>

                  {/* REVIEW */}
                  {booking.status ===
                    "completed" &&
                    booking.provider_id && (
                      <div className="mt-5 border-t border-white/10 pt-5">
                        <ReviewForm
                          bookingId={booking.id}
                          providerId={
                            booking.provider_id
                          }
                        />
                      </div>
                    )}
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
      <p className="text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-4xl font-black">
        {value}
      </p>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold text-slate-200 capitalize">
        {value}
      </p>
    </div>
  );
}