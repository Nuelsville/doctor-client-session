import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const userRepo = AppDataSource.getRepository(User);

// 📌 Get all users
export const getAllUsers = async (_req: Request, res: Response): Promise<any> => {
    try {
        const users = await userRepo.find();
        users.forEach((user) => {
            delete user.password
        })
        return res.status(200).json(users);
    } catch (err) {
        console.error("Fetch users error:", err);
        return res.status(500).json({ message: "Failed to fetch users" });
    }
};

// 📌 Get single user by ID
export const getUserById = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
        const user = await userRepo.findOneBy({ id });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Remove password from the response
        delete user.password;

        return res.status(200).json(user);
    } catch (err) {
        console.error("Fetch user error:", err);
        return res.status(500).json({ message: "Failed to fetch user" });
    }
};

// 📌 Get all patients
export const getAllPatients = async (_req: Request, res: Response): Promise<any> => {
    try {
        const patients = await userRepo.find({
            where: { role: "patient" }
        });

        patients.forEach((patient) => {
            delete patient.password;
        });

        return res.status(200).json(patients);
    } catch (err) {
        console.error("Fetch patients error:", err);
        return res.status(500).json({ message: "Failed to fetch patients" });
    }
};

// 📌 Get all doctors
export const getAllDoctors = async (_req: Request, res: Response): Promise<any> => {
    try {
        const doctors = await userRepo.find({
            where: { role: "doctor" }
        });

        doctors.forEach((doctor) => {
            delete doctor.password
        })

        return res.status(200).json(doctors);
    } catch (err) {
        console.error("Fetch doctors error:", err);
        return res.status(500).json({ message: "Failed to fetch doctors" });
    }
};
