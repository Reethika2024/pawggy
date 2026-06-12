"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { userProfileSchema } from "@/lib/validation/schemas";
import { revalidatePath } from "next/cache";

export async function updateUserProfileDetails(formData: unknown) {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const parsed = userProfileSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message,
    };
  }

  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from("users")
      .update({
        first_name: parsed.data.first_name,
        last_name: parsed.data.last_name,
        phone: parsed.data.phone,
      })
      .eq("clerk_id", userId);

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
  } catch (error) {
    return {
      success: false,
      error: "Failed to update profile",
    };
  }
}