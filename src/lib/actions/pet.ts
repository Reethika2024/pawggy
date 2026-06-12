"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { petFormSchema } from "@/lib/validation/schemas";
import { getOrCreateUserSessionRow } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function instantiatePetProfileRecord(formData: unknown) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const clerkUser = await currentUser();

  const userEmail =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress;

  if (!userEmail) {
    return { success: false, error: "User email not found" };
  }

  const parsed = petFormSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message,
    };
  }

  try {
    const dbUser = await getOrCreateUserSessionRow(
      userId,
      userEmail
    );

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("pets")
      .insert({
        owner_id: dbUser.id,
        name: parsed.data.name,
        species: parsed.data.species,
        breed: parsed.data.breed || null,
        age_months: parsed.data.age_months,
        weight_kg: parsed.data.weight_kg,
      });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Failed to create pet profile",
    };
  }
}