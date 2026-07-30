import type { Server } from "http";
import { createApp, API_PREFIX } from "./app";
import { connectDB, disconnectDB } from "./config/db";
import { env } from "./config/env";

async function bootstrap(): Promise<void> {
  await connectDB();

  const app = createApp();
  const server: Server = app.listen(env.PORT, () => {
    console.log(
      `\n🚀 Telogica API listening on http://localhost:${env.PORT}${API_PREFIX}` +
        `\n   environment : ${env.NODE_ENV}` +
        `\n   storefront  : ${env.CLIENT_URL}` +
        `\n   payments    : ${env.razorpayEnabled ? "Razorpay (live keys detected)" : "mock gateway + COD"}\n`
    );
  });

  let shuttingDown = false;
  const shutdown = async (signal: string) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`\n${signal} received — shutting down.`);

    // Keep-alive sockets would otherwise hold the port open long enough for a
    // watch-mode restart to fail with EADDRINUSE.
    server.closeAllConnections?.();
    server.close(async () => {
      await disconnectDB().catch(() => undefined);
      process.exit(0);
    });

    setTimeout(() => process.exit(0), 3000).unref();
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGHUP", () => void shutdown("SIGHUP"));
  process.on("unhandledRejection", (reason) => {
    console.error("✖ Unhandled promise rejection:", reason);
    void shutdown("unhandledRejection");
  });
}

bootstrap().catch((err) => {
  console.error("✖ Failed to start the API:", err);
  process.exit(1);
});
