import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken" // 🔥 FIXED HERE

const userRepo = AppDataSource.getRepository(User);
const jwtSecret = process.env.JWT_SECRET as string;
const jwtExpiry = (process.env.JWT_EXPIRES_IN || "1d")

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    try {
        const user = await userRepo.findOneBy({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const passwordMatch = await bcrypt.compare(password, user.password || "");
        if (!passwordMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            jwtSecret,
            {
                expiresIn: jwtExpiry
            } as any // 👈 just cast it and move on
        );

        return res.status(200).json({ token, user });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Login failed" });
    }
};
