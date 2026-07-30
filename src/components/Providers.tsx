"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { makeStore, type AppStore } from "@/store/store";
import { fetchSession } from "@/store/authSlice";
import { fetchStoreConfig, loadCart, mergeGuestCart } from "@/store/cartSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

/**
 * Restores the session and cart once on mount, and folds a guest cart into the
 * account cart the first time a session is found.
 */
function SessionBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { user, status } = useAppSelector((s) => s.auth);
  const mode = useAppSelector((s) => s.cart.mode);
  const merged = useRef(false);

  useEffect(() => {
    void dispatch(fetchStoreConfig());
    void dispatch(fetchSession());
  }, [dispatch]);

  useEffect(() => {
    if (status !== "ready") return;

    if (user && mode === "guest" && !merged.current) {
      merged.current = true;
      void dispatch(mergeGuestCart());
      return;
    }
    if (!user) merged.current = false;

    void dispatch(loadCart({ authenticated: Boolean(user) }));
    // `mode` is intentionally excluded: reacting to it would re-run on merge.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user, status]);

  return <>{children}</>;
}

export function Providers({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) storeRef.current = makeStore();

  return (
    <Provider store={storeRef.current}>
      <SessionBootstrap>{children}</SessionBootstrap>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#0F1311",
            color: "#fff",
            border: "1px solid #2A302C",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#16C0A8", secondary: "#0F1311" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#0F1311" } },
        }}
      />
    </Provider>
  );
}
