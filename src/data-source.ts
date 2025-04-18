import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Session } from "./entities/Session";
import dotenv from "dotenv";

dotenv.config();

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
    ssl: true,
    extra: {
        ssl: {
        rejectUnauthorized: false,
        },
    },
});
