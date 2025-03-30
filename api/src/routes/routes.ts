import express from "express";
import { getPriceHandler, getHistoryHandler } from '../controller/controller';
const router = express.Router();

router.get("/price/:symbol", getPriceHandler);
router.get("/history/:symbol/:days", getHistoryHandler);

export default router;