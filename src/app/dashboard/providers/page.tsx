import {
  getServiceProviders,
} from "@/lib/db/queries";
import {
  ServiceProviderRow,
} from "@/types";
import ProvidersList from "@/components/providers/ProvidersList";

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

        <ProvidersList
          providers={providers}
        />
      </div>
    </div>
  );
}