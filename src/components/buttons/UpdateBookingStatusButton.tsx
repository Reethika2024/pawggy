"use client";

import { useState } from "react";
import { updateBookingStatusRecord } from "@/lib/actions/booking";

interface UpdateBookingStatusButtonProps {
  bookingId: string;
  nextStatus: "confirmed" | "completed";
}

export default function UpdateBookingStatusButton({
  bookingId,
  nextStatus,
}: UpdateBookingStatusButtonProps) {
  const [loading, setLoading] =
    useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    const result =
      await updateBookingStatusRecord(
        bookingId,
        nextStatus
      );

    if (result.success) {
      window.location.reload();
    } else {
      alert(
        result.error ??
          "Failed to update booking"
      );

      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUpdate}
      disabled={loading}
      className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-500"
    >
      {loading
        ? "Updating..."
        : nextStatus === "confirmed"
        ? "Confirm Booking"
        : "Complete Booking"}
    </button>
  );
}