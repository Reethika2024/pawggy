"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userProfileSchema } from "@/lib/validation/schemas";
import { updateUserProfileDetails } from "@/lib/actions/profile";

interface ProfileFormProps {
  initialData?: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  };
}

type ProfileFormValues = z.infer<typeof userProfileSchema>;

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      first_name: initialData?.first_name ?? "",
      last_name: initialData?.last_name ?? "",
      phone: initialData?.phone ?? "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setStatus(null);
    try {
      const response = await updateUserProfileDetails(data);
      if (response?.success) {
        setStatus({ type: "success", message: "Profile updated successfully." });
      } else {
        setStatus({ type: "error", message: response?.error || "Failed to update profile." });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setStatus({ type: "error", message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-xl bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            First Name
          </label>
          <input
            type="text"
            {...register("first_name")}
            className="w-full text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none transition duration-150"
          />
          {errors.first_name && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Last Name
          </label>
          <input
            type="text"
            {...register("last_name")}
            className="w-full text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none transition duration-150"
          />
          {errors.last_name && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
          Phone Number
        </label>
        <input
          type="tel"
          {...register("phone")}
          placeholder="9876543210"
          className="w-full text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none transition duration-150"
        />
        {errors.phone && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{errors.phone.message}</p>
        )}
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
        {isSubmitting ? "Saving changes..." : "Save Profile"}
      </button>
    </form>
  );
}