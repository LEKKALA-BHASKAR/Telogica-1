import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/db";
import { env } from "../config/env";
import { Cart } from "../models/Cart";
import { Counter } from "../models/Counter";
import { Message } from "../models/Message";
import { Order } from "../models/Order";
import { Product, type Category } from "../models/Product";
import { Quote } from "../models/Quote";
import { Review } from "../models/Review";
import { User } from "../models/User";
import { commerceOverlay, defaultOverlay } from "./catalogue";

interface StaticProduct {
  id: string;
  name: string;
  category: Category;
  sectors: Category[];
  description: string;
  images: string[];
  features: string[];
  warrantyMonths: number | null;
  requiresQuote: boolean;
}

const CATALOGUE_PATH = path.resolve(__dirname, "../../../src/data/products.json");

/** Splits the long marketing copy into a lead paragraph and bullet features. */
function parseDescription(desc: string): { lead: string; bullets: string[] } {
  const text = desc.replace(/\r/g, "").trim();
  const keyIdx = text.search(/key features\s*:/i);
  if (keyIdx === -1) return { lead: text.split("\n")[0].trim(), bullets: [] };

  const lead = text.slice(0, keyIdx).trim();
  const rest = text.slice(keyIdx).replace(/key features\s*:/i, "");
  const stopIdx = rest.search(/\n\s*(applications|technical highlights)\s*:/i);
  const featureBlock = stopIdx === -1 ? rest : rest.slice(0, stopIdx);

  const bullets = featureBlock
    .split(/\n|,(?=\s*[A-Z0-9])/)
    .map((s) => s.replace(/^[•\-\s]+/, "").trim())
    .filter((s) => s.length > 2)
    .slice(0, 24);

  return { lead: lead || text.split("\n")[0].trim(), bullets };
}

function shortDesc(desc: string, max = 180): string {
  const first = desc.split("\n")[0].trim();
  if (first.length <= max) return first;
  return `${first.slice(0, max).replace(/[\s,]+\S*$/, "")}…`;
}

async function seedUsers() {
  const admin = await User.findOneAndUpdate(
    { email: env.ADMIN_EMAIL },
    {
      $setOnInsert: {
        name: env.ADMIN_NAME,
        email: env.ADMIN_EMAIL,
        role: "admin",
        phone: "+91 93966 10682",
        company: "Telogica Limited",
      },
    },
    { new: true, upsert: true }
  );

  // Set the password through save() so the hashing hook runs.
  admin.password = env.ADMIN_PASSWORD;
  admin.role = "admin";
  admin.isActive = true;
  await admin.save();

  const demoEmail = "customer@example.com";
  let demo = await User.findOne({ email: demoEmail });
  if (!demo) {
    demo = new User({
      name: "Demo Customer",
      email: demoEmail,
      password: "Customer@123",
      phone: "+91 90000 00000",
      company: "Bharat Networks Pvt Ltd",
      addresses: [
        {
          label: "Office",
          fullName: "Demo Customer",
          phone: "+91 90000 00000",
          line1: "Empire Square, Plot 233-A",
          line2: "Road No 36, Jubilee Hills",
          city: "Hyderabad",
          state: "Telangana",
          postalCode: "500033",
          country: "India",
          isDefault: true,
        },
      ],
    });
    await demo.save();
  }

  return { admin, demo };
}

async function seedProducts() {
  if (!fs.existsSync(CATALOGUE_PATH)) {
    throw new Error(`Catalogue not found at ${CATALOGUE_PATH}`);
  }

  const raw = JSON.parse(fs.readFileSync(CATALOGUE_PATH, "utf8")) as StaticProduct[];
  let created = 0;
  let updated = 0;

  for (const item of raw) {
    const overlay = commerceOverlay[item.id] ?? {
      ...defaultOverlay,
      sku: `TLG-${item.id.slice(-6).toUpperCase()}`,
    };
    const name = item.name.replace(/\s+/g, " ").trim();
    const { lead, bullets } = parseDescription(item.description);

    const existing = await Product.findOne({ legacyId: item.id });
    const product = existing ?? new Product({ legacyId: item.id });

    product.name = name;
    product.sku = overlay.sku;
    product.category = item.category;
    product.sectors = item.sectors;
    product.description = item.description;
    product.shortDescription = shortDesc(lead || item.description);
    product.images = item.images;
    product.features = item.features.length ? item.features : bullets;
    product.tags = overlay.tags ?? [];
    product.warrantyMonths = item.warrantyMonths;
    product.requiresQuote = overlay.requiresQuote ?? false;
    product.price = overlay.price;
    product.mrp = overlay.mrp;
    product.stock = overlay.stock;
    product.isFeatured = overlay.isFeatured ?? false;
    product.isActive = true;

    await product.save();
    existing ? updated++ : created++;
  }

  return { created, updated, total: raw.length };
}

async function destroy() {
  await Promise.all([
    Product.deleteMany({}),
    Order.deleteMany({}),
    Cart.deleteMany({}),
    Review.deleteMany({}),
    Quote.deleteMany({}),
    Message.deleteMany({}),
    Counter.deleteMany({}),
    User.deleteMany({}),
  ]);
  console.log("🗑  All collections cleared.");
}

async function main() {
  const shouldDestroy = process.argv.includes("--destroy");
  const shouldReset = process.argv.includes("--fresh");

  await connectDB();

  if (shouldDestroy) {
    await destroy();
    await disconnectDB();
    return;
  }

  if (shouldReset) {
    await Promise.all([Product.deleteMany({}), Cart.deleteMany({})]);
    console.log("🗑  Products and carts cleared before reseeding.");
  }

  const { admin, demo } = await seedUsers();
  const products = await seedProducts();

  // Indexes are declared on the schemas; build them once up front.
  await Promise.all([
    Product.syncIndexes(),
    User.syncIndexes(),
    Order.syncIndexes(),
    Review.syncIndexes(),
  ]);

  const buyable = await Product.countDocuments({ requiresQuote: false, isActive: true });
  const quoteOnly = await Product.countDocuments({ requiresQuote: true, isActive: true });

  console.log(
    `\n✔ Seed complete\n` +
      `  products      : ${products.total} (${products.created} created, ${products.updated} updated)\n` +
      `                  ${buyable} buyable · ${quoteOnly} quote-only\n` +
      `  admin login   : ${admin.email} / ${env.ADMIN_PASSWORD}\n` +
      `  demo customer : ${demo.email} / Customer@123\n`
  );

  await disconnectDB();
}

main().catch(async (err) => {
  console.error("✖ Seed failed:", err);
  await mongoose.connection.close().catch(() => undefined);
  process.exit(1);
});
