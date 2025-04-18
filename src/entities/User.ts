import { v4 as uuidv4 } from "uuid";
import {
    Entity,
    PrimaryColumn,
    Column,
    BeforeInsert,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {

    @PrimaryColumn("uuid")
    id?: string;

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }

    @Column()
    name?: string;

    @Column({ unique: true })
    email?: string;

    @Column({ nullable: true })
    password?: string;

    @Column()
    role?: "doctor" | "patient";

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
