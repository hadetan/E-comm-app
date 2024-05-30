import { Router } from "express";
import { addProduct, getAllProduct, getProductById, getProductByCollectionId, updateProduct, deleteProduct  } from "../../controllers/product.controller.js";
import { isLoggedIn, authorize } from "../../Middlewares/auth.middleware.js"
import AuthRoles from "../../utils/authRoles.js";

const router = Router();

router.post("/", isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR), addProduct);

router.get("/all", getAllProduct);

router.get("/all/:id", getProductById);

router.get("/products/:id", getProductByCollectionId);

router.put("/:id", isLoggedIn, authorize(AuthRoles.ADMIN, AuthRoles.MODERATOR), updateProduct);

router.delete("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), deleteProduct);

export default router;