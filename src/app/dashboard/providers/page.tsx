import Link from "next/link";
import { getServiceProviders } from "@/lib/db/queries";
import { ServiceProviderRow } from "@/types";
import ProvidersList from "@/components/providers/ProvidersList";

export const revalidate = 0;

export default async function ProvidersPage() {
  const providers =
    (await getServiceProviders()) as ServiceProviderRow[];

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
              href="/dashboard/bookings"
              className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-950"
            >
              Book a Service
            </Link>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Pawggy marketplace
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-5xl">
            Find trusted pet care.
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-400">
            Discover verified groomers, veterinary clinics and
            boarding partners for everything your pet needs.
          </p>
        </div>

        <div className="mt-10">
          <ProvidersList providers={providers} />
        </div>
      </section>
    </main>
  );
}