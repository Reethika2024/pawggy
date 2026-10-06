"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { petFormSchema } from "@/lib/validation/schemas";
import { updatePetProfileRecord } from "@/lib/actions/pet";
import { PetRow } from "@/types";

type PetFormValues = z.infer<typeof petFormSchema>;

interface EditPetFormProps {
  pet: PetRow;
}

export default function EditPetForm({
  pet,
}: EditPetFormProps) {
  const [status, setStatus] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: pet.name,
      species: pet.species,
      breed: pet.breed ?? "",
      age_months: pet.age_months ?? undefined,
      weight_kg: pet.weight_kg ?? undefined,
    },
  });

  const onSubmit = async (
    data: PetFormValues
  ) => {
    setStatus(null);

    const result =
      await updatePetProfileRecord(
        pet.id,
        data
      );

    if (result.success) {
      setStatus("Pet updated successfully.");
      window.location.reload();
    } else {
      setStatus(
        result.error ??
          "Failed to update pet."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 border rounded-lg p-4 mt-3"
    >
      <input
        {...register("name")}
        placeholder="Pet Name"
        className="w-full border rounded p-2"
      />

      {errors.name && (
        <p className="text-xs text-red-500">
          {errors.name.message}
        </p>
      )}

      <input
        {...register("species")}
        placeholder="Species"
        className="w-full border rounded p-2"
      />

      <input
        {...register("breed")}
        placeholder="Breed"
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        {...register("age_months", {
          valueAsNumber: true,
        })}
        placeholder="Age (months)"
        className="w-full border rounded p-2"
      />

      <input
        type="number"
        step="any"
        {...register("weight_kg", {
          valueAsNumber: true,
        })}
        placeholder="Weight (kg)"
        className="w-full border rounded p-2"
      />

      {status && (
        <p className="text-sm">
          {status}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 rounded bg-slate-900 text-white"
      >
        {isSubmitting
          ? "Updating..."
          : "Update Pet"}
      </button>
    </form>
  );
}