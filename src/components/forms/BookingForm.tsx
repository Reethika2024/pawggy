"use client";

import { useState } from "react";
import { createBookingRecord } from "@/lib/actions/booking";
import {
  PetRow,
  UserAddressRow,
  ServiceProviderRow,
} from "@/types";

interface BookingFormProps {
  pets: PetRow[];
  addresses: UserAddressRow[];
  providers: ServiceProviderRow[];
}

function createBookingDateTime(
  dateText: string,
  timeText: string
) {
  const dateMatch = dateText
    .trim()
    .match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  const timeMatch = timeText
    .trim()
    .match(/^([01]?\d|2[0-3]):([0-5]\d)$/);

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const day = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  const year = Number(dateMatch[3]);

  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  const date = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    0,
    0
  );

  // Prevent invalid dates such as 31/02/2026.
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    return null;
  }

  // Do not allow bookings in the past.
  if (date.getTime() < Date.now()) {
    return null;
  }

  return date.toISOString();
}

export default function BookingForm({
  pets,
  addresses,
  providers,
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [bookingDate, setBookingDate] =
    useState("");

  const [bookingTime, setBookingTime] =
    useState("");

  async function handleSubmit(
    formData: FormData
  ) {
    setIsSubmitting(true);
    setStatus(null);

    const bookingDateTime =
      createBookingDateTime(
        bookingDate,
        bookingTime
      );

    if (!bookingDateTime) {
      setStatus({
        type: "error",
        message:
          "Enter a valid future date in DD/MM/YYYY and time in HH:MM format.",
      });

      setIsSubmitting(false);
      return;
    }

    const result =
      await createBookingRecord({
        provider_id: String(
          formData.get("provider_id")
        ),
        pet_id: String(
          formData.get("pet_id")
        ),
        address_id: String(
          formData.get("address_id")
        ),
        service_type: String(
          formData.get("service_type")
        ),
        booking_date:
          bookingDateTime,
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
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 rounded-lg border p-4"
    >
      {/* Provider */}
      <div>
        <label className="block text-sm mb-1">
          Provider
        </label>

        <select
          name="provider_id"
          className="w-full border rounded p-2"
          required
        >
          <option value="">
            Select Provider
          </option>

          {providers.map((provider) => (
            <option
              key={provider.id}
              value={provider.id}
            >
              {provider.name} (
              {provider.provider_type})
            </option>
          ))}
        </select>
      </div>

      {/* Pet */}
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

      {/* Address */}
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

      {/* Service */}
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

      {/* Booking Date */}
      <div>
        <label className="block text-sm mb-1">
          Booking Date
        </label>

        <input
          type="text"
          value={bookingDate}
          onChange={(event) =>
            setBookingDate(
              event.target.value
            )
          }
          placeholder="DD/MM/YYYY"
          inputMode="numeric"
          className="w-full border rounded p-2"
          required
        />

        <p className="text-xs text-slate-500 mt-1">
          Example: 15/10/2026
        </p>
      </div>

      {/* Booking Time */}
      <div>
        <label className="block text-sm mb-1">
          Booking Time
        </label>

        <input
          type="text"
          value={bookingTime}
          onChange={(event) =>
            setBookingTime(
              event.target.value
            )
          }
          placeholder="HH:MM"
          inputMode="numeric"
          className="w-full border rounded p-2"
          required
        />

        <p className="text-xs text-slate-500 mt-1">
          Example: 11:30
        </p>
      </div>

      {/* Status */}
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

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 rounded bg-slate-900 text-white disabled:opacity-50"
      >
        {isSubmitting
          ? "Creating..."
          : "Create Booking"}
      </button>
    </form>
  );
}