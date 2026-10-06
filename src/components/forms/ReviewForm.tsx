"use client";

import { useState } from "react";
import { createReviewRecord } from "@/lib/actions/review";

interface ReviewFormProps {
  bookingId: string;
  providerId: string;
}

export default function ReviewForm({
  bookingId,
  providerId,
}: ReviewFormProps) {
  const [rating, setRating] =
    useState(5);

  const [review, setReview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [status, setStatus] =
    useState<string | null>(null);

  async function submitReview() {
    setLoading(true);

    const result =
      await createReviewRecord(
        bookingId,
        providerId,
        rating,
        review
      );

    if (result.success) {
      setStatus(
        "Review submitted successfully."
      );

      window.location.reload();
    } else {
      setStatus(
        result.error ??
          "Failed to submit review."
      );
    }

    setLoading(false);
  }

  return (
    <div className="mt-4 border rounded-lg p-4">
      <h3 className="font-bold">
        Leave Review
      </h3>

      <div className="mt-3">
        <label className="block text-sm mb-1">
          Rating
        </label>

        <select
          value={rating}
          onChange={(e) =>
            setRating(
              Number(e.target.value)
            )
          }
          className="w-full border rounded p-2"
        >
          <option value={5}>
            ⭐⭐⭐⭐⭐ (5)
          </option>

          <option value={4}>
            ⭐⭐⭐⭐ (4)
          </option>

          <option value={3}>
            ⭐⭐⭐ (3)
          </option>

          <option value={2}>
            ⭐⭐ (2)
          </option>

          <option value={1}>
            ⭐ (1)
          </option>
        </select>
      </div>

      <div className="mt-3">
        <label className="block text-sm mb-1">
          Review
        </label>

        <textarea
          value={review}
          onChange={(e) =>
            setReview(
              e.target.value
            )
          }
          rows={4}
          className="w-full border rounded p-2"
          placeholder="Share your experience..."
        />
      </div>

      {status && (
        <p className="mt-2 text-sm">
          {status}
        </p>
      )}

      <button
        type="button"
        onClick={submitReview}
        disabled={loading}
        className="mt-3 px-4 py-2 rounded bg-slate-900 text-white"
      >
        {loading
          ? "Submitting..."
          : "Submit Review"}
      </button>
    </div>
  );
}