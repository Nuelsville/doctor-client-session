import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Session } from "../entities/Session";
import { MoreThan } from "typeorm";
import { User } from "../entities/User";
import { AuthRequest } from "../middlewares/auth.middleware";
import { generateAgoraToken } from "../utils/generateAgoraToken";
import { generateJitsiRoomName, generateJitsiToken } from "../utils/jitsi";

export const initiateSession = async (req: Request, res: Response): Promise<any> => {
    const { doctorId, patientId } = req.body;

    try {
        const userRepo = AppDataSource.getRepository(User);
        const sessionRepo = AppDataSource.getRepository(Session);

        const doctor = await userRepo.findOneBy({ id: doctorId });
        const patient = await userRepo.findOneBy({ id: patientId });

        if (!doctor || !patient) {
            return res.status(404).json({ message: "Doctor or Patient not found." });
        }

        const roomName = generateJitsiRoomName();
        const roomUrl = generateJitsiToken(roomName, doctor.name || "Unknown Doctor"); // Just returns meet.jit.si URL

        const session = sessionRepo.create({
            doctor,
            patient,
            roomName,
            jitsiToken: roomUrl, // actually the URL now
            status: "pending",
            expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 mins from now
        });

        const savedSession = await sessionRepo.save(session);

        return res.status(201).json(savedSession);
    } catch (err) {
        console.error("Error initiating session:", err);
        return res.status(500).json({ message: "Something went wrong." });
    }
};

// export const initiateSession = async (req: AuthRequest, res: Response): Promise<any> => {
//     const { patientId } = req.body;

//     try {
//         const userRepo = AppDataSource.getRepository(User);
//         const sessionRepo = AppDataSource.getRepository(Session);

//         const doctor = await userRepo.findOneBy({ id: req.user!.id });
//         const patient = await userRepo.findOneBy({ id: patientId });

//         if (!patient) return res.status(404).json({ message: "Patient not found" });

//         const channelName = `consult-${Date.now()}`;
//         const doctorUid = Math.floor(10000 + Math.random() * 90000).toString();
//         const token = generateAgoraToken(channelName, doctorUid, "doctor");

//         const session = sessionRepo.create({
//             doctor: { id: doctor!.id },
//             patient: { id: patient.id },
//             roomName: channelName,
//             jitsiToken: token,
//             status: "pending",
//             expiresAt: new Date(Date.now() + 30 * 60 * 1000),
//         });


//         const savedSession = await sessionRepo.save(session);
//         return res.status(201).json({ session: savedSession, uid: doctorUid });
//     } catch (err) {
//         console.error("Session error:", err);
//         return res.status(500).json({ message: "Session creation failed" });
//     }
// };

// export const joinSession = async (req: Request, res: Response): Promise<any> => {
//     const { roomName } = req.body;

//     if (!roomName) {
//         return res.status(400).json({ message: "roomName is required" });
//     }

//     try {
//         const sessionRepo = AppDataSource.getRepository(Session);
//         const session = await sessionRepo.findOne({
//             where: { roomName },
//             relations: ["doctor", "patient"],
//         });

//         if (!session) {
//             return res.status(404).json({ message: "Session not found" });
//         }

//         if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
//             return res.status(410).json({ message: "Session has expired" });
//         }

//         const uid = Math.floor(10000 + Math.random() * 90000).toString();
//         const token = generateAgoraToken(roomName, uid, "patient");

//         return res.status(200).json({
//             token,
//             uid,
//             channel: roomName,
//             doctor: session.doctor?.name,
//         });
//     } catch (err) {
//         console.error("Join session error:", err);
//         return res.status(500).json({ message: "Failed to join session" });
//     }
// };

export const joinSession = async (req: Request, res: Response): Promise<any> => {
    const { roomName } = req.body;

    if (!roomName) {
        return res.status(400).json({ message: "roomName is required" });
    }

    try {
        const sessionRepo = AppDataSource.getRepository(Session);
        const session = await sessionRepo.findOne({
            where: { roomName },
            relations: ["doctor", "patient"],
        });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
            return res.status(410).json({ message: "Session has expired" });
        }

        return res.status(200).json({
            jitsiRoomUrl: session.jitsiToken, // this is the actual Jitsi URL
            roomName: session.roomName,
            doctor: session.doctor?.name,
        });
    } catch (err) {
        console.error("Join session error:", err);
        return res.status(500).json({ message: "Failed to join session" });
    }
};

export const getActiveSessions = async (req: Request, res: Response): Promise<any> => {
    try {
        const sessionRepo = AppDataSource.getRepository(Session);
        const now = new Date();

        const sessions = await sessionRepo.find({
            where: {
                status: "pending", // or also include "in_progress"
                expiresAt: MoreThan(now),
            },
            relations: ["doctor", "patient"],
            order: {
                createdAt: "DESC"
            }
        });

        return res.status(200).json(sessions);
    } catch (err) {
        console.error("Error fetching active sessions:", err);
        return res.status(500).json({ message: "Failed to fetch sessions" });
    }
};
