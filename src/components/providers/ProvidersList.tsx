"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ServiceProviderRow } from "@/types";

interface ProvidersListProps {
  providers: ServiceProviderRow[];
}

const filters = [
  {
    value: "all",
    label: "All Services",
  },
  {
    value: "groomer",
    label: "Grooming",
  },
  {
    value: "vet",
    label: "Veterinary",
  },
  {
    value: "boarding",
    label: "Boarding",
  },
];

function getProviderIcon(providerType: string) {
  switch (providerType) {
    case "groomer":
      return "✂️";

    case "vet":
      return "🩺";

    case "boarding":
      return "🏠";

    default:
      return "🐾";
  }
}

function getProviderLabel(providerType: string) {
  switch (providerType) {
    case "groomer":
      return "Grooming";

    case "vet":
      return "Veterinary Care";

    case "boarding":
      return "Boarding";

    default:
      return "Pet Care";
  }
}

function getProviderDescription(providerType: string) {
  switch (providerType) {
    case "groomer":
      return "Professional grooming and hygiene services.";

    case "vet":
      return "Veterinary care and health services for your pet.";

    case "boarding":
      return "Comfortable boarding and stay services.";

    default:
      return "Trusted pet care services.";
  }
}

export default function ProvidersList({
  providers,
}: ProvidersListProps) {
  const [filter, setFilter] = useState("all");

  const filteredProviders = useMemo(() => {
    if (filter === "all") {
      return providers;
    }

    return providers.filter(
      (provider) =>
        provider.provider_type === filter
    );
  }, [providers, filter]);

  return (
    <div className="space-y-8">
      {/* FILTERS */}
      <div className="flex flex-wrap gap-3">
        {filters.map((item) => {
          const active = filter === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() =>
                setFilter(item.value)
              }
              className={
                active
                  ? "rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950"
                  : "rounded-full border border-white/10 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-300 hover:border-white/20 hover:text-white"
              }
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* RESULT COUNT */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {filteredProviders.length}{" "}
          {filteredProviders.length === 1
            ? "provider"
            : "providers"}{" "}
          available
        </p>

        <p className="text-sm text-slate-500">
          Hyderabad
        </p>
      </div>

      {/* PROVIDER CARDS */}
      {filteredProviders.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-10 text-center">
          <div className="text-4xl">🐾</div>

          <h2 className="mt-4 text-xl font-bold">
            No providers found
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            Try another service category.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="group flex flex-col rounded-3xl border border-white/10 bg-slate-900 p-6 transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-slate-800"
            >
              {/* ICON + VERIFIED */}
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                  {getProviderIcon(
                    provider.provider_type
                  )}
                </div>

                {provider.is_verified && (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    ✓ Verified
                  </span>
                )}
              </div>

              {/* NAME */}
              <h2 className="mt-6 text-xl font-bold">
                {provider.name}
              </h2>

              {/* TYPE */}
              <p className="mt-2 text-sm font-medium text-slate-300">
                {getProviderLabel(
                  provider.provider_type
                )}
              </p>

              {/* LOCATION */}
              <p className="mt-3 text-sm text-slate-400">
                📍 {provider.city}
              </p>

              {/* RATING */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-yellow-400">
                  ★
                </span>

                <span className="font-semibold">
                  {provider.rating.toFixed(1)}
                </span>

                <span className="text-sm text-slate-500">
                  trusted provider
                </span>
              </div>

              {/* DESCRIPTION */}
              <p className="mt-4 min-h-[48px] text-sm leading-6 text-slate-400">
                {getProviderDescription(
                  provider.provider_type
                )}
              </p>

              {/* CONTACT */}
              <div className="mt-5 border-t border-white/10 pt-5">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Contact
                </p>

                <p className="mt-2 truncate text-sm text-slate-300">
                  {provider.phone ??
                    provider.email}
                </p>
              </div>

              {/* ACTION */}
              <Link
                href="/dashboard/bookings"
                className="mt-6 flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
              >
                Book Service
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}