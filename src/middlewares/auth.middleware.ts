import { Request, Response, NextFunction, RequestHandler } from "express";
import * as jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

const jwtSecret = process.env.JWT_SECRET as string;
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token missing or malformed" });
        return;
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
        (req as any).user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
};

export const onlyDoctor = (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (user?.role !== "doctor") {
        res.status(403).json({ message: "Only doctors can perform this action" });
        return;
    }

    next();
};

export const onlyPatient = (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (user?.role !== "patient") {
        res.status(403).json({ message: "Only patients can perform this action" });
        return;
    }

    next();
};

