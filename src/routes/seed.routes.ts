import { Router } from "express";
import { seedUsers } from "../controllers/seed.controller";

const router = Router();

router.post("/seed-users", seedUsers);

export default router;
