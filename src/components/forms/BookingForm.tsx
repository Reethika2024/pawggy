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
    .match(
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    );

  const timeMatch = timeText
    .trim()
    .match(
      /^([01]?\d|2[0-3]):([0-5]\d)$/
    );

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

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    return null;
  }

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
      className="space-y-7"
    >
      {/* PROVIDER */}
      <div>
        <FieldLabel
          title="Service Provider"
          hint="Choose who will provide the care"
        />

        <select
          name="provider_id"
          className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 text-white outline-none transition focus:border-white/30"
          required
        >
          <option value="">
            Select a provider
          </option>

          {providers.map((provider) => (
            <option
              key={provider.id}
              value={provider.id}
            >
              {provider.name} —{" "}
              {provider.provider_type}
            </option>
          ))}
        </select>
      </div>

      {/* PET */}
      <div>
        <FieldLabel
          title="Your Pet"
          hint="Who is receiving the service?"
        />

        <select
          name="pet_id"
          className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 text-white outline-none transition focus:border-white/30"
          required
        >
          <option value="">
            Select your pet
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

        {pets.length === 0 && (
          <p className="mt-2 text-xs text-amber-300">
            Add a pet before creating a booking.
          </p>
        )}
      </div>

      {/* ADDRESS */}
      <div>
        <FieldLabel
          title="Service Address"
          hint="Where should the service happen?"
        />

        <select
          name="address_id"
          className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 text-white outline-none transition focus:border-white/30"
          required
        >
          <option value="">
            Select an address
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

        {addresses.length === 0 && (
          <p className="mt-2 text-xs text-amber-300">
            Add an address before creating a booking.
          </p>
        )}
      </div>

      {/* SERVICE */}
      <div>
        <FieldLabel
          title="Service"
          hint="What does your pet need?"
        />

        <select
          name="service_type"
          className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 text-white outline-none transition focus:border-white/30"
          required
        >
          <option value="">
            Select a service
          </option>

          <option value="Grooming">
            ✂️ Grooming
          </option>

          <option value="Vet Visit">
            🩺 Vet Visit
          </option>

          <option value="Boarding">
            🏠 Boarding
          </option>
        </select>
      </div>

      {/* DATE + TIME */}
      <div>
        <FieldLabel
          title="When?"
          hint="Enter your preferred date and time"
        />

        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-500">
              Date
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
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 text-white outline-none placeholder:text-slate-600 transition focus:border-white/30"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">
              Time
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
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3.5 text-white outline-none placeholder:text-slate-600 transition focus:border-white/30"
              required
            />
          </div>
        </div>

        <p className="mt-2 text-xs text-slate-500">
          Example: 15/10/2026 · 11:30
        </p>
      </div>

      {/* STATUS */}
      {status && (
        <div
          className={
            status.type === "success"
              ? "rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300"
              : "rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          }
        >
          {status.message}
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={
          isSubmitting ||
          pets.length === 0 ||
          addresses.length === 0 ||
          providers.length === 0
        }
        className="w-full rounded-2xl bg-white px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting
          ? "Creating booking..."
          : "Confirm Booking"}
      </button>

      <p className="text-center text-xs text-slate-500">
        Your booking will start as pending and can
        then move through the care journey.
      </p>
    </form>
  );
}

function FieldLabel({
  title,
  hint,
}: {
  title: string;
  hint: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-white">
        {title}
      </label>

      <p className="mt-1 text-xs text-slate-500">
        {hint}
      </p>
    </div>
  );
}