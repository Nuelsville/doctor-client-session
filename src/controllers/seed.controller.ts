import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";

export const seedUsers = async (req: Request, res: Response): Promise<any> => {
    const userRepo = AppDataSource.getRepository(User);

    const doctor = userRepo.create({
        name: "Dr. Who",
        email: "who@example.com",
        password: await bcrypt.hash("doctor123", 10),
        role: "doctor",
    });

    const patient = userRepo.create({
        name: "John Doe",
        email: "doe@example.com",
        password: await bcrypt.hash("patient123", 10),
        role: "patient",
    });

    try {
        const saved = await userRepo.save([doctor, patient]);
        return res.status(201).json({
            message: "Seeded users",
            users: saved,
        });
    } catch (err) {
        console.error("Seed error:", err);
        return res.status(500).json({ message: "Error seeding users" });
    }
};
