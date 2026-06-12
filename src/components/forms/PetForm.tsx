"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { petFormSchema } from "@/lib/validation/schemas";
import { instantiatePetProfileRecord } from "@/lib/actions/pet";

type PetFormValues = z.infer<typeof petFormSchema>;

export default function PetForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      species: "",
      breed: "",
    },
  });

  const onSubmit = async (data: PetFormValues) => {
    setStatus(null);
    try {
      const response = await instantiatePetProfileRecord(data);
      if (response?.success) {
        setStatus({ type: "success", message: "Pet profile created successfully." });
        reset();
      } else {
        setStatus({ type: "error", message: response?.error || "Failed to create pet profile." });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setStatus({ type: "error", message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
          Pet Name
        </label>
        <input
          type="text"
          {...register("name")}
          placeholder="e.g., Rocky"
          className="w-full text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none transition duration-150"
        />
        {errors.name && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Species
          </label>
          <input
            type="text"
            {...register("species")}
            placeholder="e.g., Dog, Cat"
            className="w-full text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none transition duration-150"
          />
          {errors.species && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{errors.species.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Breed <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            {...register("breed")}
            placeholder="e.g., Golden Retriever"
            className="w-full text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none transition duration-150"
          />
          {errors.breed && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{errors.breed.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Age <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">(months, optional)</span>
          </label>
          <input
            type="number"
            step="1"
            {...register("age_months", { valueAsNumber: true })}
            placeholder="e.g., 18"
            className="w-full text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none transition duration-150"
          />
          {errors.age_months && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{errors.age_months.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Weight <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">(kg, optional)</span>
          </label>
          <input
            type="number"
            step="any"
            {...register("weight_kg", { valueAsNumber: true })}
            placeholder="e.g., 12.5"
            className="w-full text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none transition duration-150"
          />
          {errors.weight_kg && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{errors.weight_kg.message}</p>
          )}
        </div>
      </div>

      {status && (
        <div className={`p-3.5 rounded-lg text-xs font-medium border transition-colors ${
          status.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900" 
            : "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-900"
        }`}>
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center items-center font-semibold text-xs tracking-wider uppercase bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-950 py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 dark:focus:ring-slate-50 transition duration-150 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Registering..." : "Add Pet"}
      </button>
    </form>
  );
}