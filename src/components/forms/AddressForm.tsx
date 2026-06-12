"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { appendUserAddressRow } from "@/lib/actions/address";

const addressFormSchema = z.object({
  label: z.string().min(1, "Label is required (e.g., Home, Work)"),
  street_address: z.string().min(5, "Street address must be at least 5 characters"),
  landmark: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State or region is required"),
  postal_code: z.string().min(3, "Postal code must be at least 3 characters"),
  is_default: z.boolean().default(false),
});

type AddressFormValues = z.infer<typeof addressFormSchema>;

export default function AddressForm() {
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema as any),
    defaultValues: {
      label: "",
      street_address: "",
      landmark: "",
      city: "",
      state: "",
      postal_code: "",
      is_default: false,
    },
  });

  const onSubmit: SubmitHandler<AddressFormValues> = async (data) => {
    setStatus(null);
    try {
      const response = await appendUserAddressRow(data);
      if (response?.success) {
        setStatus({ type: "success", message: "Address saved successfully." });
        reset();
      } else {
        setStatus({ type: "error", message: response?.error || "Failed to save address details." });
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
          Label
        </label>
        <input
          type="text"
          {...register("label")}
          placeholder="e.g., Home, Office"
          className="w-full text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none transition duration-150"
        />
        {errors.label && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{errors.label.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
          Street Address
        </label>
        <input
          type="text"
          {...register("street_address")}
          placeholder="Building number, street name, or apartment details"
          className="w-full text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none transition duration-150"
        />
        {errors.street_address && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{errors.street_address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
          Landmark <span className="text-slate-400 dark:text-slate-500 font-normal lowercase">(optional)</span>
        </label>
        <input
          type="text"
          {...register("landmark")}
          placeholder="Nearby notable locations or descriptive indicators"
          className="w-full text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none transition duration-150"
        />
        {errors.landmark && (
          <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{errors.landmark.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            City
          </label>
          <input
            type="text"
            {...register("city")}
            className="w-full text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none transition duration-150"
          />
          {errors.city && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{errors.city.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            State / Region
          </label>
          <input
            type="text"
            {...register("state")}
            className="w-full text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none transition duration-150"
          />
          {errors.state && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
            Postal Code
          </label>
          <input
            type="text"
            {...register("postal_code")}
            className="w-full text-sm px-3.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 border border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 outline-none transition duration-150"
          />
          {errors.postal_code && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mt-1.5">{errors.postal_code.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 py-1">
        <input
          type="checkbox"
          id="is_default"
          {...register("is_default")}
          className="h-4 w-4 rounded bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-50 focus:ring-1 focus:ring-slate-400 dark:focus:ring-slate-600 accent-slate-900 dark:accent-slate-100 cursor-pointer"
        />
        <label htmlFor="is_default" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 cursor-pointer select-none">
          Set as Default Address
        </label>
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
        {isSubmitting ? "Saving..." : "Save Address"}
      </button>
    </form>
  );
}