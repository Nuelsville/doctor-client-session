import { Router } from "express";
import { getAgoraToken } from "../controllers/agora.controller";

const router = Router();

router.get("/token", getAgoraToken);

export default router;
