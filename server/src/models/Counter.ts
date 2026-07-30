import { Schema, model, type Model, type Types } from "mongoose";

export interface ICounter {
  _id: string;
  seq: number;
}

type CounterModel = Model<ICounter>;

const counterSchema = new Schema<ICounter, CounterModel>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const Counter = model<ICounter, CounterModel>("Counter", counterSchema);

/**
 * Atomically reserves the next number in a named sequence — used for
 * human-readable order and quote references.
 */
export async function nextSequence(name: string): Promise<number> {
  const doc = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  ).lean<{ _id: string; seq: number } | null>();
  return doc?.seq ?? 1;
}

/** e.g. formatRef("TLG", 2026, 42) → "TLG-2026-000042" */
export function formatRef(prefix: string, year: number, seq: number): string {
  return `${prefix}-${year}-${String(seq).padStart(6, "0")}`;
}

export type { Types };
