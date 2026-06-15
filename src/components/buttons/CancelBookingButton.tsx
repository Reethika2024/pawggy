"use client";

import { useState } from "react";
import { cancelBookingRecord } from "@/lib/actions/booking";

interface CancelBookingButtonProps {
  bookingId: string;
}

export default function CancelBookingButton({
  bookingId,
}: CancelBookingButtonProps) {
  const [loading, setLoading] =
    useState(false);

  const handleCancel = async () => {
    const confirmed = confirm(
      "Cancel this booking?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    const result =
      await cancelBookingRecord(
        bookingId
      );

    if (result.success) {
      window.location.reload();
    } else {
      alert(
        result.error ??
          "Failed to cancel booking"
      );

      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="mt-3 text-xs font-semibold text-red-600 hover:text-red-500"
    >
      {loading
        ? "Cancelling..."
        : "Cancel Booking"}
    </button>
  );
}