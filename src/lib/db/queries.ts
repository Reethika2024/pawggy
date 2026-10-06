import { createSupabaseServerClient } from "@/lib/supabase/server";
import { UserRow } from "@/types";

export async function getOrCreateUserSessionRow(
  clerkId: string,
  email: string
): Promise<UserRow> {
  const supabase = await createSupabaseServerClient();

  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .single();

  if (existingUser) {
    return existingUser as UserRow;
  }

  const { data: newUser, error } = await supabase
    .from("users")
    .insert({
      clerk_id: clerkId,
      email,
    })
    .select()
    .single();

  if (error) {
    console.error("SUPABASE ERROR:", error);
    throw new Error(error.message);
  }

  if (!newUser) {
    throw new Error("No user returned from insert");
  }

  return newUser as UserRow;
}

export async function getUserPets(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getUserAddresses(userId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("user_addresses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("SUPABASE ERROR:", error);
    return [];
  }

  return data ?? [];
}

export async function getUserBookings(
  userId: string
) {
  const supabase =
    await createSupabaseServerClient();

  const { data, error } =
    await supabase
      .from("bookings")
      .select(`
        *,
        pets (
          name
        ),
        user_addresses (
          label
        ),
        service_providers (
          name,
          provider_type,
          city,
          rating
        )
      `)
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function getServiceProviders() {
  const supabase =
    await createSupabaseServerClient();

  const { data, error } =
    await supabase
      .from("service_providers")
      .select("*")
      .order("rating", {
        ascending: false,
      });

  console.log(
    "SERVICE PROVIDERS DATA:",
    data
  );

  console.log(
    "SERVICE PROVIDERS ERROR:",
    error
  );

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}