import mongoose from "mongoose";
import { env } from "./env";

mongoose.set("strictQuery", true);

/** Connects to MongoDB, retrying with backoff so a slow local mongod isn't fatal. */
export async function connectDB(retries = 5): Promise<typeof mongoose> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(env.MONGO_URI, {
        serverSelectionTimeoutMS: 8000,
        autoIndex: !env.isProd,
      });
      console.log(`✔ MongoDB connected → ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`✖ MongoDB connection attempt ${attempt}/${retries} failed: ${message}`);
      if (attempt === retries) {
        console.error(
          "\n  Is MongoDB running? Start it with one of:\n" +
            "    brew services start mongodb-community\n" +
            "    docker run -d -p 27017:27017 --name telogica-mongo mongo:7\n" +
            "  …or point MONGO_URI at an Atlas cluster in server/.env\n"
        );
        throw err;
      }
      await new Promise((r) => setTimeout(r, attempt * 1000));
    }
  }
  throw new Error("unreachable");
}

export async function disconnectDB(): Promise<void> {
  await mongoose.connection.close();
}
