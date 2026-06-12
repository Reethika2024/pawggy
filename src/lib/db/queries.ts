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