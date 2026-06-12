"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { addressFormSchema } from "@/lib/validation/schemas";
import { getOrCreateUserSessionRow } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function appendUserAddressRow(formData: unknown) {
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

  const parsed = addressFormSchema.safeParse(formData);

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

    if (parsed.data.is_default) {
      await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", dbUser.id);
    }

    const { error } = await supabase
      .from("user_addresses")
      .insert({
        user_id: dbUser.id,
        label: parsed.data.label,
        street_address: parsed.data.street_address,
        landmark: parsed.data.landmark || null,
        city: parsed.data.city,
        state: parsed.data.state,
        postal_code: parsed.data.postal_code,
        latitude: parsed.data.latitude || null,
        longitude: parsed.data.longitude || null,
        is_default: parsed.data.is_default,
      });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/dashboard/addresses");

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      error: "Failed to create address",
    };
  }
}