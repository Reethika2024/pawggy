"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { bookingFormSchema } from "@/lib/validation/schemas";
import { getOrCreateUserSessionRow } from "@/lib/db/queries";
import { revalidatePath } from "next/cache";

export async function createBookingRecord(
  formData: unknown
) {
  const { userId } = await auth();

  if (!userId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const clerkUser = await currentUser();

  const userEmail =
    clerkUser?.primaryEmailAddress?.emailAddress ??
    clerkUser?.emailAddresses?.[0]?.emailAddress;

  if (!userEmail) {
    return {
      success: false,
      error: "User email not found",
    };
  }

  const parsed =
    bookingFormSchema.safeParse(
      formData
    );

  if (!parsed.success) {
    return {
      success: false,
      error:
        parsed.error.issues[0]
          ?.message,
    };
  }

  try {
    const dbUser =
      await getOrCreateUserSessionRow(
        userId,
        userEmail
      );

    const supabase =
      await createSupabaseServerClient();

    const { error } =
      await supabase
        .from("bookings")
        .insert({
          user_id: dbUser.id,
          pet_id:
            parsed.data.pet_id,
          address_id:
            parsed.data.address_id,
          service_type:
            parsed.data.service_type,
          booking_date:
            parsed.data.booking_date,
          status: "pending",
        });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath(
      "/dashboard/bookings"
    );

    return {
      success: true,
    };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to create booking";

    return {
      success: false,
      error: message,
    };
  }
}