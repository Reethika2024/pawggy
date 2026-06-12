import { z } from "zod";

export const userProfileSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
});

export const petFormSchema = z.object({
  name: z.string().min(2, "Pet name is required"),
  species: z.string().min(2, "Species is required"),
  breed: z.string().optional(),
  age_months: z.number().min(0).optional(),
  weight_kg: z.number().min(0).optional(),
});

export const addressFormSchema = z.object({
  label: z.string().min(2, "Label is required"),
  street_address: z.string().min(5, "Street address is required"),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postal_code: z.string().regex(
    /^[1-9][0-9]{5}$/,
    "Enter a valid 6-digit PIN code"
  ),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  is_default: z.boolean().default(false),
});