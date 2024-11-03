import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import {
  createTransaction,
  notify,
} from "../controllers/transaction.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createTransaction);
router.post("/notify", notify);

export default router;
