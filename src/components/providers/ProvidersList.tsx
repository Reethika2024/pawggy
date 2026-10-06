"use client";

import { useMemo, useState } from "react";
import { ServiceProviderRow } from "@/types";

interface ProvidersListProps {
  providers: ServiceProviderRow[];
}

export default function ProvidersList({
  providers,
}: ProvidersListProps) {
  const [filter, setFilter] =
    useState("all");

  const filteredProviders =
    useMemo(() => {
      if (filter === "all") {
        return providers;
      }

      return providers.filter(
        (provider) =>
          provider.provider_type ===
          filter
      );
    }, [providers, filter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() =>
            setFilter("all")
          }
          className="border rounded px-3 py-1"
        >
          All
        </button>

        <button
          onClick={() =>
            setFilter("groomer")
          }
          className="border rounded px-3 py-1"
        >
          Groomers
        </button>

        <button
          onClick={() =>
            setFilter("vet")
          }
          className="border rounded px-3 py-1"
        >
          Vets
        </button>

        <button
          onClick={() =>
            setFilter("boarding")
          }
          className="border rounded px-3 py-1"
        >
          Boarding
        </button>
      </div>

      {filteredProviders.length ===
      0 ? (
        <div className="rounded-lg border p-4">
          No providers found.
        </div>
      ) : (
        filteredProviders.map(
          (provider) => (
            <div
              key={provider.id}
              className="rounded-lg border p-4 bg-white dark:bg-slate-900"
            >
              <h2 className="font-bold text-lg">
                {provider.name}
              </h2>

              <p>
                Type:{" "}
                {
                  provider.provider_type
                }
              </p>

              <p>
                City:{" "}
                {provider.city}
              </p>

              <p>
                Rating: ⭐{" "}
                {provider.rating}
              </p>

              <p>
                Verified:{" "}
                {provider.is_verified
                  ? "Yes"
                  : "No"}
              </p>
            </div>
          )
        )
      )}
    </div>
  );
}