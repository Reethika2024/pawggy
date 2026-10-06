"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createReviewRecord(
  bookingId: string,
  providerId: string,
  rating: number,
  review: string
) {
  const { userId: clerkId } =
    await auth();

  if (!clerkId) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  try {
    const supabase =
      await createSupabaseServerClient();

    const {
      data: userRow,
      error: userError,
    } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkId)
      .single();

    if (
      userError ||
      !userRow
    ) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const { error } =
      await supabase
        .from("reviews")
        .insert({
          booking_id: bookingId,
          provider_id: providerId,
          user_id: userRow.id,
          rating,
          review,
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

    revalidatePath(
      "/dashboard/providers"
    );

    return {
      success: true,
    };
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to create review",
    };
  }
}