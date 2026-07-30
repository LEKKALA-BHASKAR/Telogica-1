import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { apiDelete, apiGet, apiPatch, apiPost, toApiError } from "@/lib/api";
import { calculateTotals, DEFAULT_STORE_CONFIG } from "@/lib/commerce";
import type { ApiProduct, CartLine, OrderTotals, StoreConfig } from "@/lib/types";

const GUEST_CART_KEY = "telogica.cart.v1";

interface CartState {
  items: CartLine[];
  totals: OrderTotals;
  config: StoreConfig;
  /** `guest` lines live in localStorage; `server` lines live in MongoDB. */
  mode: "guest" | "server";
  loading: boolean;
  mutating: boolean;
  error: string | null;
  hydrated: boolean;
}

const emptyTotals: OrderTotals = { itemsPrice: 0, taxPrice: 0, shippingPrice: 0, totalPrice: 0 };

const initialState: CartState = {
  items: [],
  totals: emptyTotals,
  config: DEFAULT_STORE_CONFIG,
  mode: "guest",
  loading: false,
  mutating: false,
  error: null,
  hydrated: false,
};

/* ── Guest cart persistence ────────────────────────────────────────────── */

function readGuestCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_CART_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGuestCart(items: CartLine[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // A full or blocked localStorage must not break checkout.
  }
}

function clearGuestCart(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(GUEST_CART_KEY);
}

function lineFromProduct(product: ApiProduct, qty: number): CartLine {
  return {
    product: product._id,
    slug: product.slug,
    name: product.name,
    image: product.images[0] ?? "",
    sku: product.sku,
    price: product.price,
    mrp: product.mrp,
    qty,
    stock: product.stock,
    lineTotal: product.price * qty,
    outOfStock: product.stock < 1,
    qtyAdjusted: false,
  };
}

interface ServerCartPayload {
  items: CartLine[];
  totals: OrderTotals;
  removed?: string[];
}

/* ── Thunks ────────────────────────────────────────────────────────────── */

export const fetchStoreConfig = createAsyncThunk<StoreConfig>("cart/config", async () => {
  return apiGet<StoreConfig>("/config");
});

/** Loads the server cart for a signed-in user, or the local cart for a guest. */
export const loadCart = createAsyncThunk<
  { mode: "guest" | "server"; payload: ServerCartPayload },
  { authenticated: boolean },
  { state: { cart: CartState } }
>("cart/load", async ({ authenticated }, { getState }) => {
  if (!authenticated) {
    const items = readGuestCart();
    return {
      mode: "guest" as const,
      payload: { items, totals: calculateTotals(items, getState().cart.config) },
    };
  }
  const payload = await apiGet<ServerCartPayload>("/cart");
  return { mode: "server" as const, payload };
});

/** Pushes the guest cart into the account cart, then adopts the server copy. */
export const mergeGuestCart = createAsyncThunk<ServerCartPayload, void>(
  "cart/merge",
  async () => {
    const guest = readGuestCart();
    const payload = await apiPost<ServerCartPayload>("/cart/merge", {
      items: guest.map((l) => ({ productId: l.product, qty: l.qty })),
    });
    clearGuestCart();
    return payload;
  }
);

export const addItem = createAsyncThunk<
  { mode: "guest" | "server"; payload: ServerCartPayload },
  { product: ApiProduct; qty?: number },
  { state: { cart: CartState }; rejectValue: string }
>("cart/add", async ({ product, qty = 1 }, { getState, rejectWithValue }) => {
  const { cart } = getState();

  if (cart.mode === "server") {
    try {
      const payload = await apiPost<ServerCartPayload>("/cart/items", {
        productId: product._id,
        qty,
      });
      return { mode: "server" as const, payload };
    } catch (err) {
      return rejectWithValue(toApiError(err).message);
    }
  }

  const items = readGuestCart();
  const existing = items.find((l) => l.product === product._id);
  const desired = (existing?.qty ?? 0) + qty;

  if (desired > product.stock) {
    return rejectWithValue(
      `Only ${product.stock} unit${product.stock === 1 ? "" : "s"} of ${product.name} are in stock`
    );
  }
  if (desired > 20) {
    return rejectWithValue("You can order up to 20 units per line — contact sales for more");
  }

  const next = existing
    ? items.map((l) =>
        l.product === product._id ? { ...l, qty: desired, lineTotal: l.price * desired } : l
      )
    : [...items, lineFromProduct(product, qty)];

  writeGuestCart(next);
  return {
    mode: "guest" as const,
    payload: { items: next, totals: calculateTotals(next, cart.config) },
  };
});

export const setItemQty = createAsyncThunk<
  { mode: "guest" | "server"; payload: ServerCartPayload },
  { productId: string; qty: number },
  { state: { cart: CartState }; rejectValue: string }
>("cart/setQty", async ({ productId, qty }, { getState, rejectWithValue }) => {
  const { cart } = getState();

  if (cart.mode === "server") {
    try {
      const payload = await apiPatch<ServerCartPayload>(`/cart/items/${productId}`, { qty });
      return { mode: "server" as const, payload };
    } catch (err) {
      return rejectWithValue(toApiError(err).message);
    }
  }

  const items = readGuestCart()
    .map((l) => (l.product === productId ? { ...l, qty, lineTotal: l.price * qty } : l))
    .filter((l) => l.qty > 0);

  writeGuestCart(items);
  return {
    mode: "guest" as const,
    payload: { items, totals: calculateTotals(items, cart.config) },
  };
});

export const removeItem = createAsyncThunk<
  { mode: "guest" | "server"; payload: ServerCartPayload },
  string,
  { state: { cart: CartState }; rejectValue: string }
>("cart/remove", async (productId, { getState, rejectWithValue }) => {
  const { cart } = getState();

  if (cart.mode === "server") {
    try {
      const payload = await apiDelete<ServerCartPayload>(`/cart/items/${productId}`);
      return { mode: "server" as const, payload };
    } catch (err) {
      return rejectWithValue(toApiError(err).message);
    }
  }

  const items = readGuestCart().filter((l) => l.product !== productId);
  writeGuestCart(items);
  return {
    mode: "guest" as const,
    payload: { items, totals: calculateTotals(items, cart.config) },
  };
});

export const emptyCart = createAsyncThunk<
  { mode: "guest" | "server"; payload: ServerCartPayload },
  void,
  { state: { cart: CartState } }
>("cart/empty", async (_arg, { getState }) => {
  const { cart } = getState();
  if (cart.mode === "server") {
    const payload = await apiDelete<ServerCartPayload>("/cart");
    return { mode: "server" as const, payload };
  }
  clearGuestCart();
  return { mode: "guest" as const, payload: { items: [], totals: emptyTotals } };
});

/* ── Slice ─────────────────────────────────────────────────────────────── */

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError(state) {
      state.error = null;
    },
    /** Called after checkout succeeds — the server already emptied the cart. */
    cartCheckedOut(state) {
      state.items = [];
      state.totals = emptyTotals;
      clearGuestCart();
    },
    resetToGuest(state) {
      state.mode = "guest";
      state.items = readGuestCart();
      state.totals = calculateTotals(state.items, state.config);
    },
  },
  extraReducers: (builder) => {
    const apply = (
      state: CartState,
      action: PayloadAction<{ mode: "guest" | "server"; payload: ServerCartPayload }>
    ) => {
      state.mode = action.payload.mode;
      state.items = action.payload.payload.items;
      state.totals = action.payload.payload.totals;
      state.mutating = false;
      state.hydrated = true;
    };

    builder
      .addCase(fetchStoreConfig.fulfilled, (state, action) => {
        state.config = action.payload;
        if (state.mode === "guest") {
          state.totals = calculateTotals(state.items, action.payload);
        }
      })
      .addCase(loadCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCart.fulfilled, (state, action) => {
        state.loading = false;
        apply(state, action);
      })
      .addCase(loadCart.rejected, (state) => {
        state.loading = false;
        state.hydrated = true;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action) => {
        state.mode = "server";
        state.items = action.payload.items;
        state.totals = action.payload.totals;
        state.hydrated = true;
      })
      .addCase(addItem.fulfilled, apply)
      .addCase(setItemQty.fulfilled, apply)
      .addCase(removeItem.fulfilled, apply)
      .addCase(emptyCart.fulfilled, apply)
      .addCase(addItem.pending, (state) => {
        state.mutating = true;
        state.error = null;
      })
      .addCase(setItemQty.pending, (state) => {
        state.mutating = true;
      })
      .addCase(removeItem.pending, (state) => {
        state.mutating = true;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload ?? "Could not add that item";
      })
      .addCase(setItemQty.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload ?? "Could not update that item";
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.mutating = false;
        state.error = action.payload ?? "Could not remove that item";
      });
  },
});

export const { clearCartError, cartCheckedOut, resetToGuest } = cartSlice.actions;
export default cartSlice.reducer;
