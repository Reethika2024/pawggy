import EditPetButton from "@/components/buttons/EditPetButton";
import DeletePetButton from "@/components/buttons/DeletePetButton";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  getOrCreateUserSessionRow,
  getUserPets,
} from "@/lib/db/queries";
import { PetRow } from "@/types";
import PetForm from "@/components/forms/PetForm";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function PetsPage() {
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

  try {
    const dbUser = await getOrCreateUserSessionRow(
      userId,
      userEmail
    );

    pets = (await getUserPets(dbUser.id)) ?? [];
  } catch (error) {
    console.error("Failed to load pets:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tight sm:text-2xl">
            My Pets
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Register and manage your pet profiles within the Pawggy ecosystem.
          </p>
        </div>

        <PetForm />

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
            Saved Pets
          </h2>

          {pets.length === 0 ? (
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
              No pets added yet.
            </div>
          ) : (
            pets.map((pet) => (
              <div
                key={pet.id}
                className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900"
              >
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">
                  {pet.name}
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {pet.species}
                  {pet.breed ? ` • ${pet.breed}` : ""}
                </p>

                {pet.age_months !== null && (
                  <p className="text-xs text-slate-500 mt-1">
                    Age: {pet.age_months} months
                  </p>
                )}

                {pet.weight_kg !== null && (
                  <p className="text-xs text-slate-500">
                    Weight: {pet.weight_kg} kg
                  </p>
                )}

                <div className="flex items-center gap-4 mt-3">
                  <EditPetButton pet={pet} />
                  <DeletePetButton petId={pet.id} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}