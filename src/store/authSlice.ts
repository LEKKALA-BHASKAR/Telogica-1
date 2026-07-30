import { createAsyncThunk, createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import { apiDelete, apiGet, apiPatch, apiPost, toApiError } from "@/lib/api";
import type { Address, AuthUser } from "@/lib/types";

interface AuthState {
  user: AuthUser | null;
  /** `idle` until the session has been checked once, so guards don't flash. */
  status: "idle" | "loading" | "ready";
  submitting: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  submitting: false,
  error: null,
};

type UserPayload = { user: AuthUser };

export const fetchSession = createAsyncThunk<AuthUser | null>(
  "auth/fetchSession",
  async () => {
    try {
      const { user } = await apiGet<UserPayload>("/auth/me");
      return user;
    } catch {
      // A missing or expired cookie is the normal signed-out case, not an error.
      return null;
    }
  }
);

export const login = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { user } = await apiPost<UserPayload>("/auth/login", credentials);
    return user;
  } catch (err) {
    return rejectWithValue(toApiError(err).message);
  }
});

export const register = createAsyncThunk<
  AuthUser,
  { name: string; email: string; password: string; phone?: string; company?: string },
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { user } = await apiPost<UserPayload>("/auth/register", payload);
    return user;
  } catch (err) {
    return rejectWithValue(toApiError(err).message);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await apiPost("/auth/logout");
});

export const updateProfile = createAsyncThunk<
  AuthUser,
  { name?: string; phone?: string; company?: string },
  { rejectValue: string }
>("auth/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    const { user } = await apiPatch<UserPayload>("/auth/me", payload);
    return user;
  } catch (err) {
    return rejectWithValue(toApiError(err).message);
  }
});

export const saveAddress = createAsyncThunk<
  AuthUser,
  { address: Address; id?: string },
  { rejectValue: string }
>("auth/saveAddress", async ({ address, id }, { rejectWithValue }) => {
  try {
    const { user } = id
      ? await apiPatch<UserPayload>(`/users/addresses/${id}`, address)
      : await apiPost<UserPayload>("/users/addresses", address);
    return user;
  } catch (err) {
    return rejectWithValue(toApiError(err).message);
  }
});

export const deleteAddress = createAsyncThunk<AuthUser, string, { rejectValue: string }>(
  "auth/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const { user } = await apiDelete<UserPayload>(`/users/addresses/${id}`);
      return user;
    } catch (err) {
      return rejectWithValue(toApiError(err).message);
    }
  }
);

export const toggleWishlist = createAsyncThunk<
  { added: boolean; wishlist: string[] },
  string,
  { rejectValue: string }
>("auth/toggleWishlist", async (productId, { rejectWithValue }) => {
  try {
    return await apiPost<{ added: boolean; wishlist: string[] }>(`/users/wishlist/${productId}`);
  } catch (err) {
    return rejectWithValue(toApiError(err).message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.status = "ready";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "ready";
      })
      .addCase(fetchSession.rejected, (state) => {
        state.user = null;
        state.status = "ready";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "ready";
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (state.user) state.user.wishlist = action.payload.wishlist;
      });

    // login / register / profile / address thunks all resolve to the same user shape.
    const userThunks = [login, register, updateProfile, saveAddress, deleteAddress] as const;
    builder
      .addMatcher(
        isAnyOf(...userThunks.map((t) => t.pending)),
        (state) => {
          state.submitting = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(...userThunks.map((t) => t.fulfilled)),
        (state, action: PayloadAction<AuthUser>) => {
          state.submitting = false;
          state.user = action.payload;
          state.status = "ready";
        }
      )
      .addMatcher(isAnyOf(...userThunks.map((t) => t.rejected)), (state, action) => {
        state.submitting = false;
        state.error = (action.payload as string | undefined) ?? "That request failed";
      });
  },
});

export const { clearAuthError, setUser } = authSlice.actions;
export default authSlice.reducer;
