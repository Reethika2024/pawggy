"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { addressFormSchema } from "@/lib/validation/schemas";
import { updateUserAddressRow } from "@/lib/actions/address";
import { UserAddressRow } from "@/types";

interface AddressFormValues {
  label: string;
  street_address: string;
  landmark?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

interface EditAddressFormProps {
  address: UserAddressRow;
}

export default function EditAddressForm({
  address,
}: EditAddressFormProps) {
  const [status, setStatus] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema) as any,
    defaultValues: {
      label: address.label,
      street_address: address.street_address,
      landmark: address.landmark ?? "",
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      is_default: address.is_default ?? false,
    },
  });

  const onSubmit = async (
    data: AddressFormValues
  ) => {
    setStatus(null);

    const result =
      await updateUserAddressRow(
        address.id,
        data
      );

    if (result.success) {
      setStatus(
        "Address updated successfully."
      );

      window.location.reload();
    } else {
      setStatus(
        result.error ??
          "Failed to update address."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 border rounded-lg p-4 mt-3"
    >
      <input
        {...register("label")}
        placeholder="Label"
        className="w-full border rounded p-2"
      />

      {errors.label && (
        <p className="text-xs text-red-500">
          {errors.label.message}
        </p>
      )}

      <input
        {...register("street_address")}
        placeholder="Street Address"
        className="w-full border rounded p-2"
      />

      {errors.street_address && (
        <p className="text-xs text-red-500">
          {errors.street_address.message}
        </p>
      )}

      <input
        {...register("landmark")}
        placeholder="Landmark"
        className="w-full border rounded p-2"
      />

      <input
        {...register("city")}
        placeholder="City"
        className="w-full border rounded p-2"
      />

      {errors.city && (
        <p className="text-xs text-red-500">
          {errors.city.message}
        </p>
      )}

      <input
        {...register("state")}
        placeholder="State"
        className="w-full border rounded p-2"
      />

      {errors.state && (
        <p className="text-xs text-red-500">
          {errors.state.message}
        </p>
      )}

      <input
        {...register("postal_code")}
        placeholder="Postal Code"
        className="w-full border rounded p-2"
      />

      {errors.postal_code && (
        <p className="text-xs text-red-500">
          {errors.postal_code.message}
        </p>
      )}

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register("is_default")}
        />
        Set as default address
      </label>

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
          : "Update Address"}
      </button>
    </form>
  );
}