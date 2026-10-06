import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* NAVBAR */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            🐾 Pawggy
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/dashboard/providers"
              className="text-sm text-slate-300 hover:text-white"
            >
              Services
            </Link>

            <Link
              href="/dashboard/bookings"
              className="text-sm text-slate-300 hover:text-white"
            >
              Bookings
            </Link>

            <Link
              href="/dashboard/pets"
              className="text-sm text-slate-300 hover:text-white"
            >
              My Pets
            </Link>

            {userId ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950"
              >
                Sign In
              </Link>
            )}
          </nav>

          <div className="md:hidden">
            <Link
              href={userId ? "/dashboard" : "/sign-in"}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
            >
              {userId ? "Dashboard" : "Sign In"}
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              🐶 Pet care made simple
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-7xl">
              Everything your pet needs,
              <span className="block text-slate-400">
                in one place.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">
              Discover trusted pet services, manage your pets,
              book care, and keep every part of your pet's
              journey in one simple platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={
                  userId
                    ? "/dashboard/providers"
                    : "/sign-in"
                }
                className="rounded-full bg-white px-7 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Find Pet Services
              </Link>

              <Link
                href="/dashboard/bookings"
                className="rounded-full border border-white/20 px-7 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                View Bookings
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-8 shadow-2xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-slate-400">
                Your pet care journey
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
                  <div className="text-3xl">✂️</div>

                  <div>
                    <p className="font-semibold">
                      Grooming
                    </p>
                    <p className="text-sm text-slate-400">
                      Book trusted groomers
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
                  <div className="text-3xl">🩺</div>

                  <div>
                    <p className="font-semibold">
                      Veterinary Care
                    </p>
                    <p className="text-sm text-slate-400">
                      Find nearby care
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4">
                  <div className="text-3xl">🏠</div>

                  <div>
                    <p className="font-semibold">
                      Boarding
                    </p>
                    <p className="text-sm text-slate-400">
                      Safe stays for your pet
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-y border-white/10 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
              One platform
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Pet care, organized around you.
            </h2>

            <p className="mt-4 text-slate-400">
              Pawggy brings everyday pet services into one
              connected experience.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <ServiceCard
              icon="✂️"
              title="Grooming"
              text="Book trusted groomers for routine and premium care."
            />

            <ServiceCard
              icon="🩺"
              title="Veterinary"
              text="Find and book veterinary services for your pet."
            />

            <ServiceCard
              icon="🏠"
              title="Boarding"
              text="Arrange safe stays and boarding services."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            How Pawggy works
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            From discovery to care in a few steps.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <StepCard
            number="01"
            title="Discover"
            text="Find the service and provider that fits your pet."
          />

          <StepCard
            number="02"
            title="Book"
            text="Choose your pet, address, service and preferred time."
          />

          <StepCard
            number="03"
            title="Review"
            text="Track the booking and share your experience."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl bg-white px-8 py-14 text-center text-slate-950 md:px-16">
          <h2 className="text-3xl font-black md:text-5xl">
            Better pet care starts with Pawggy.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Manage your pet's services, bookings and care
            from one place.
          </p>

          <Link
            href={
              userId
                ? "/dashboard"
                : "/sign-in"
            }
            className="mt-8 inline-block rounded-full bg-slate-950 px-7 py-3 font-semibold text-white"
          >
            {userId
              ? "Open Dashboard"
              : "Get Started"}
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 text-sm text-slate-500 md:flex-row">
          <p>
            © 2026 Pawggy. Pet care, simplified.
          </p>

          <div className="flex gap-5">
            <Link href="/dashboard/providers">
              Services
            </Link>

            <Link href="/dashboard/bookings">
              Bookings
            </Link>

            <Link href="/dashboard/profile">
              Profile
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ServiceCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950 p-7">
      <div className="text-4xl">{icon}</div>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {text}
      </p>

      <Link
        href="/dashboard/providers"
        className="mt-6 inline-block text-sm font-semibold text-white"
      >
        Explore →
      </Link>
    </div>
  );
}

function StepCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7">
      <p className="text-sm font-bold text-slate-500">
        {number}
      </p>

      <h3 className="mt-6 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-400">
        {text}
      </p>
    </div>
  );
}