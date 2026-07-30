import { Router } from "express";
import * as products from "../controllers/productController";
import * as reviews from "../controllers/reviewController";
import { optionalAuth, protect, restrictTo } from "../middleware/auth";
import { uploadImages } from "../middleware/upload";
import { validate } from "../middleware/validate";
import { objectIdParam, paginationQuery, productKeyParam } from "../validators/common";
import { createProductBody, listProductsQuery, updateProductBody } from "../validators/product";
import { reviewBody } from "../validators/commerce";

const router = Router();

/* ── Public catalogue ──────────────────────────────────────────────────── */

router.get("/", validate({ query: listProductsQuery }), products.listProducts);
router.get("/facets", products.getFacets);
router.get("/featured", products.getFeatured);

/* ── Reviews (mounted under the product they belong to) ────────────────── */

router
  .route("/:id/reviews")
  .get(validate({ params: objectIdParam, query: paginationQuery }), reviews.listProductReviews)
  .post(protect, validate({ params: objectIdParam, body: reviewBody }), reviews.upsertReview);

/* ── Admin catalogue management ────────────────────────────────────────── */

const admin = [protect, restrictTo("admin")] as const;

router.get("/admin/all", ...admin, validate({ query: listProductsQuery }), products.adminListProducts);
router.post("/", ...admin, validate({ body: createProductBody }), products.createProduct);
router.post("/uploads", ...admin, uploadImages.array("images", 8), products.uploadProductImages);

router
  .route("/:id")
  .patch(
    ...admin,
    validate({ params: objectIdParam, body: updateProductBody }),
    products.updateProduct
  )
  .delete(...admin, validate({ params: objectIdParam }), products.deleteProduct);

/* ── Single product by slug, legacy id, or Mongo id ────────────────────── */
// Declared last so it can't shadow /facets, /featured or /admin/all.

router.get("/:key", optionalAuth, validate({ params: productKeyParam }), products.getProduct);

export default router;
