import { Router } from "express";
import { createCollection, deleteCollection, getAllCollections, updateCollection } from "../../controllers/collection.controller.js";
import { authorize, isLoggedIn } from "../../Middlewares/auth.middleware.js"
import AuthRoles from "../../utils/authRoles.js";

const router = Router();

//create new collection
router.post("/", isLoggedIn, authorize(AuthRoles.ADMIN), createCollection);

//update an existing collection
router.put("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), updateCollection);

//delete a collection
router.delete("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), deleteCollection);

//get all collection
router.get("/", getAllCollections);

export default router;