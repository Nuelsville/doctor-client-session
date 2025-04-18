import { Router } from "express";
import { initiateSession, joinSession, getActiveSessions } from "../controllers/session.controller";
import { authenticateToken, onlyDoctor, onlyPatient } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /sessions/initiate:
 *   post:
 *     summary: Initiate a new consultation session between doctor and patient
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []  # Requires JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - patientId
 *             properties:
 *               doctorId:
 *                 type: string
 *                 example: "e8e5d9eb-c360-4389-b230-853e2f170669"
 *               patientId:
 *                 type: string
 *                 example: "eee6c988-f4d7-4d70-a22e-fcd33601e047"
 *     responses:
 *       200:
 *         description: Session initiated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 session:
 *                   type: object
 *                   description: Session details
 *                 uid:
 *                   type: string
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (non-doctor trying to initiate)
 */

router.post("/initiate", authenticateToken, onlyDoctor, initiateSession);

/**
 * @swagger
 * /sessions/join:
 *   post:
 *     summary: Join an active Jitsi session using room name
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomName
 *             properties:
 *               roomName:
 *                 type: string
 *                 example: consult-1744984977537
 *     responses:
 *       200:
 *         description: Successfully joined session
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jitsiRoomUrl:
 *                   type: string
 *                   example: https://meet.jit.si/consult-1744984977537
 *                 roomName:
 *                   type: string
 *                   example: consult-1744984977537
 *                 doctor:
 *                   type: string
 *                   example: Dr. Emmanuel
 *       400:
 *         description: roomName is required
 *       404:
 *         description: Session not found
 *       410:
 *         description: Session has expired
 */

router.post("/join", authenticateToken, joinSession);

/**
 * @swagger
 * /sessions/active:
 *   get:
 *     summary: Get all ongoing (not expired) sessions
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: List of active sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   doctor:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   patient:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   roomName:
 *                     type: string
 *                   jitsiToken:
 *                     type: string
 *                   status:
 *                     type: string
 *                     example: pending
 *                   expiresAt:
 *                     type: string
 *                     format: date-time
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/active", authenticateToken, getActiveSessions);

export default router;
