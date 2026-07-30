"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGet, toApiError } from "@/lib/api";
import type { ApiProduct } from "@/lib/types";
import { useAuth } from "@/store/hooks";
import { ProductCard } from "@/components/ProductCard";
import { EmptyState, ErrorNote, Loading } from "@/components/commerce/Bits";
import { Heart } from "@/components/Icons";

export default function WishlistPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet<{ items: ApiProduct[] }>("/users/wishlist");
      setItems(data.items);
      setError(null);
    } catch (err) {
      setError(toApiError(err).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    // Re-fetch whenever the saved set changes from a card elsewhere on the page.
  }, [load, user?.wishlist.length]);

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-white">Wishlist</h2>
      <p className="mt-1 text-sm text-fog">
        {items.length} saved instrument{items.length === 1 ? "" : "s"}
      </p>

      {error && (
        <div className="mt-6">
          <ErrorNote message={error} />
        </div>
      )}

      {loading ? (
        <Loading />
      ) : items.length ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={<Heart className="h-10 w-10" />}
            title="Nothing saved yet"
            intro="Tap the heart on any product to keep it here for later."
            action={{ label: "Browse products", href: "/products" }}
          />
        </div>
      )}
    </div>
  );
}
