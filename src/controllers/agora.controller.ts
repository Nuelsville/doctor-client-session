import { Request, Response } from "express";
import { generateAgoraToken } from "../utils/generateAgoraToken";

export const getAgoraToken = async (req: Request, res: Response): Promise<void> => {
    const { channel, uid, role } = req.query;

    if (!channel || !uid || !role) {
        res.status(400).json({ message: "Missing params: channel, uid, or role" });
        return;
    }

    const token = generateAgoraToken(
        channel as string,
        uid as string,
        role as "doctor" | "patient"
    );

    res.json({ token });
};
