"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { Address } from "@/lib/types";
import { deleteAddress, saveAddress } from "@/store/authSlice";
import { useAppDispatch, useAuth } from "@/store/hooks";
import { AddressCard, AddressForm } from "@/components/commerce/AddressForm";
import { EmptyState, Panel } from "@/components/commerce/Bits";
import { MapPin, Pencil, Trash } from "@/components/Icons";

export default function AddressesPage() {
  const dispatch = useAppDispatch();
  const { user, submitting } = useAuth();
  const [editing, setEditing] = useState<Address | null>(null);
  const [adding, setAdding] = useState(false);

  const addresses = user?.addresses ?? [];

  async function onSubmit(address: Address) {
    const result = await dispatch(saveAddress({ address, id: editing?._id }));
    if (saveAddress.fulfilled.match(result)) {
      toast.success(editing ? "Address updated" : "Address added");
      setEditing(null);
      setAdding(false);
    } else {
      toast.error(result.payload ?? "Could not save that address");
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Delete this address?")) return;
    const result = await dispatch(deleteAddress(id));
    if (deleteAddress.fulfilled.match(result)) toast.success("Address deleted");
    else toast.error(result.payload ?? "Could not delete that address");
  }

  const showForm = adding || editing;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-white">Addresses</h2>
          <p className="mt-1 text-sm text-fog">
            Saved delivery addresses, reusable at checkout.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setAdding(true)}
            className="rounded-md bg-teal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            + Add address
          </button>
        )}
      </div>

      {showForm ? (
        <Panel className="mt-6">
          <h3 className="mb-5 font-display text-base font-bold text-white">
            {editing ? "Edit address" : "New address"}
          </h3>
          <AddressForm
            initial={editing}
            saving={submitting}
            submitLabel={editing ? "Save changes" : "Add address"}
            onSubmit={onSubmit}
            onCancel={() => {
              setEditing(null);
              setAdding(false);
            }}
          />
        </Panel>
      ) : addresses.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              actions={
                <span className="flex shrink-0 gap-1">
                  <button
                    onClick={() => setEditing(address)}
                    aria-label="Edit address"
                    className="rounded-lg p-2 text-fog transition hover:bg-base-800 hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => address._id && onDelete(address._id)}
                    aria-label="Delete address"
                    className="rounded-lg p-2 text-fog transition hover:bg-base-800 hover:text-red-300"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </span>
              }
            />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={<MapPin className="h-10 w-10" />}
            title="No saved addresses"
            intro="Add a delivery address now and it'll be ready at checkout."
          />
        </div>
      )}
    </div>
  );
}
