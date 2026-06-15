"use client";

import { useState } from "react";
import { createBookingRecord } from "@/lib/actions/booking";
import { PetRow, UserAddressRow } from "@/types";

interface BookingFormProps {
  pets: PetRow[];
  addresses: UserAddressRow[];
}

export default function BookingForm({
  pets,
  addresses,
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (
    formData: FormData
  ) => {
    setIsSubmitting(true);
    setStatus(null);

    const result =
      await createBookingRecord({
        pet_id: String(
          formData.get("pet_id")
        ),
        address_id: String(
          formData.get("address_id")
        ),
        service_type: String(
          formData.get("service_type")
        ),
        booking_date: String(
          formData.get("booking_date")
        ),
      });

    if (result.success) {
      setStatus({
        type: "success",
        message:
          "Booking created successfully.",
      });

      window.location.reload();
    } else {
      setStatus({
        type: "error",
        message:
          result.error ??
          "Failed to create booking.",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <form
      action={handleSubmit}
      className="space-y-4 rounded-lg border p-4"
    >
      <div>
        <label className="block text-sm mb-1">
          Pet
        </label>

        <select
          name="pet_id"
          className="w-full border rounded p-2"
          required
        >
          <option value="">
            Select Pet
          </option>

          {pets.map((pet) => (
            <option
              key={pet.id}
              value={pet.id}
            >
              {pet.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">
          Address
        </label>

        <select
          name="address_id"
          className="w-full border rounded p-2"
          required
        >
          <option value="">
            Select Address
          </option>

          {addresses.map((address) => (
            <option
              key={address.id}
              value={address.id}
            >
              {address.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">
          Service Type
        </label>

        <select
          name="service_type"
          className="w-full border rounded p-2"
          required
        >
          <option value="">
            Select Service
          </option>

          <option value="Grooming">
            Grooming
          </option>

          <option value="Vet Visit">
            Vet Visit
          </option>

          <option value="Boarding">
            Boarding
          </option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">
          Booking Date
        </label>

        <input
          type="datetime-local"
          name="booking_date"
          className="w-full border rounded p-2"
          required
        />
      </div>

      {status && (
        <div
          className={
            status.type === "success"
              ? "text-green-600"
              : "text-red-600"
          }
        >
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 rounded bg-slate-900 text-white"
      >
        {isSubmitting
          ? "Creating..."
          : "Create Booking"}
      </button>
    </form>
  );
}