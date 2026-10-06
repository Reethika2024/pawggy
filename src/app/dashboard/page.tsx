import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  getOrCreateUserSessionRow,
  getUserPets,
  getUserAddresses,
  getUserBookings,
} from "@/lib/db/queries";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const clerkUser = await currentUser();

  const email =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress ??
    "";

  const dbUser = await getOrCreateUserSessionRow(
    userId,
    email
  );

  const [pets, addresses, bookings] =
    await Promise.all([
      getUserPets(dbUser.id),
      getUserAddresses(dbUser.id),
      getUserBookings(dbUser.id),
    ]);

  const firstName =
    dbUser.first_name ??
    clerkUser?.firstName ??
    "Pet Parent";

  const recentBookings = bookings.slice(0, 3);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-black"
          >
            🐾 Pawggy
          </Link>

          <Link
            href="/dashboard/bookings"
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950"
          >
            Book a Service
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* WELCOME */}
        <section>
          <p className="text-sm text-slate-500">
            Welcome back
          </p>

          <h1 className="mt-2 text-4xl font-black md:text-5xl">
            Hi, {firstName} 👋
          </h1>

          <p className="mt-3 text-slate-400">
            Manage your pets and everything they need.
          </p>
        </section>

        {/* QUICK ACTIONS */}
        <section className="mt-10 grid gap-4 md:grid-cols-4">
          <QuickAction
            href="/dashboard/providers"
            icon="🔎"
            title="Find Services"
            text="Discover providers"
          />

          <QuickAction
            href="/dashboard/bookings"
            icon="📅"
            title="Book Service"
            text="Create a booking"
          />

          <QuickAction
            href="/dashboard/pets"
            icon="🐶"
            title="My Pets"
            text={`${pets.length} pet${pets.length === 1 ? "" : "s"}`}
          />

          <QuickAction
            href="/dashboard/addresses"
            icon="📍"
            title="Addresses"
            text={`${addresses.length} saved`}
          />
        </section>

        {/* STATS */}
        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <StatCard
            label="My Pets"
            value={pets.length}
          />

          <StatCard
            label="Bookings"
            value={bookings.length}
          />

          <StatCard
            label="Saved Addresses"
            value={addresses.length}
          />
        </section>

        {/* RECENT BOOKINGS */}
        <section className="mt-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Activity
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Recent Bookings
              </h2>
            </div>

            <Link
              href="/dashboard/bookings"
              className="text-sm font-semibold text-slate-300 hover:text-white"
            >
              View all →
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-white/10 bg-slate-900 p-8">
              <p className="text-lg font-semibold">
                No bookings yet.
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Find a provider and book your pet's first
                service.
              </p>

              <Link
                href="/dashboard/providers"
                className="mt-5 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950"
              >
                Find Services
              </Link>
            </div>
          ) : (
            <div className="mt-5 grid gap-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-3xl border border-white/10 bg-slate-900 p-6"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <p className="text-sm text-slate-500">
                        {booking.service_type}
                      </p>

                      <h3 className="mt-1 text-lg font-bold">
                        {booking.service_providers
                          ?.name ?? "Provider"}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        {booking.pets?.name ?? "Pet"} ·{" "}
                        {booking.user_addresses
                          ?.label ?? "Address"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
                        {booking.status}
                      </span>

                      <Link
                        href="/dashboard/bookings"
                        className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* NAVIGATION */}
        <section className="mt-12 grid gap-4 md:grid-cols-3">
          <DashboardLink
            href="/dashboard/providers"
            title="Service Providers"
            text="Browse grooming, vet and boarding providers."
          />

          <DashboardLink
            href="/dashboard/pets"
            title="Manage Pets"
            text="Keep your pet profiles organized."
          />

          <DashboardLink
            href="/dashboard/profile"
            title="My Profile"
            text="Manage your account details."
          />
        </section>
      </div>
    </main>
  );
}

function QuickAction({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-white/10 bg-slate-900 p-6 transition hover:border-white/20 hover:bg-slate-800"
    >
      <div className="text-3xl">{icon}</div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        {text}
      </p>
    </Link>
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

function DashboardLink({
  href,
  title,
  text,
}: {
  href: string;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-3xl border border-white/10 bg-slate-900 p-6 transition hover:bg-slate-800"
    >
      <h3 className="text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </Link>
  );
}