import {
  getServiceProviders,
} from "@/lib/db/queries";
import {
  ServiceProviderRow,
} from "@/types";

export const revalidate = 0;

export default async function ProvidersPage() {
  const providers =
    (await getServiceProviders()) as ServiceProviderRow[];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black">
            Service Providers
          </h1>

          <p className="text-sm text-slate-500">
            Browse groomers, vets and
            boarding partners.
          </p>
        </div>

        {providers.length === 0 ? (
          <div className="rounded-lg border p-4">
            No providers found.
          </div>
        ) : (
          providers.map(
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
                  City: {provider.city}
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
    </div>
  );
}