import { z } from "zod";

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be 72 characters or fewer")
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/[0-9]/, "Password must contain a number");

export const registerBody = z.object({
  name: z.string().trim().min(2, "Name is required").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password,
  phone: z.string().trim().max(20).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
});

export const loginBody = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileBody = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().max(20).optional(),
  company: z.string().trim().max(120).optional(),
});

export const updatePasswordBody = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: password,
});

export const forgotPasswordBody = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address"),
});

export const resetPasswordBody = z.object({
  token: z.string().min(10, "Reset token is required"),
  password,
});
