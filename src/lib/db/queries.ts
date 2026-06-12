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

  if (error || !newUser) {
    throw new Error("Failed to create user record");
  }

  return newUser as UserRow;
}