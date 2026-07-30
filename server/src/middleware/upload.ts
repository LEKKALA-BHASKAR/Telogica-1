import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import { ApiError } from "../utils/ApiError";

/**
 * Admin uploads land in the Next.js public directory, so they are served as
 * plain static assets at /uploads/<file> with no extra routing.
 */
export const UPLOAD_DIR = path.resolve(__dirname, "../../../public/uploads");
export const UPLOAD_URL_PREFIX = "/uploads";

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".bin";
    const stem = path
      .basename(file.originalname, path.extname(file.originalname))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    cb(null, `${stem || "image"}-${crypto.randomBytes(6).toString("hex")}${ext}`);
  },
});

export const uploadImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      cb(ApiError.badRequest("Only JPEG, PNG, WebP, AVIF or SVG images are allowed"));
      return;
    }
    cb(null, true);
  },
});
