"use client";

import { useState } from "react";
import { removeUserAddressRow } from "@/lib/actions/address";

interface DeleteAddressButtonProps {
  addressId: string;
}

export default function DeleteAddressButton({
  addressId,
}: DeleteAddressButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this address?")) {
      return;
    }

    setIsDeleting(true);

    try {
      await removeUserAddressRow(addressId);
      window.location.reload();
    } catch (error) {
      console.error(error);
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="mt-3 text-xs font-semibold text-red-600 hover:text-red-500"
    >
      {isDeleting ? "Deleting..." : "Delete Address"}
    </button>
  );
}