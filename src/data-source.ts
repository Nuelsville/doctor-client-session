import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Session } from "./entities/Session";
import dotenv from "dotenv";

dotenv.config();

console.log({
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
});

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, Session],
    synchronize: true,
    logging: true,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});
