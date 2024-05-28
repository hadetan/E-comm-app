import { Router } from "express";
import v1Routes from "./v1/index.js"
import cookieParser from "cookie-parser";
import cors from "cors"


const router = Router();

// const v1Routes = require("./v1");

router.use("/v1", v1Routes)

export default router