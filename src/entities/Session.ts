import { v4 as uuidv4 } from "uuid";
import {
    Entity,
    PrimaryColumn,
    Column,
    BeforeInsert,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from "typeorm";
import { User } from "./User";

export type SessionStatus = "pending" | "connecting" | "in_session" | "ended" | "expired";

@Entity()
export class Session {
    @PrimaryColumn("uuid")
    id?: string;

    @BeforeInsert()
    generateId() {
        this.id = uuidv4();
    }

    @ManyToOne(() => User)
    doctor?: User;

    @ManyToOne(() => User)
    patient?: User;

    @Column({ type: "varchar" })
    status?: SessionStatus;

    @Column()
    roomName?: string;

    @Column({ nullable: true })
    jitsiToken?: string;

    @Column({ type: "timestamp", nullable: true })
    scheduledFor?: Date;

    @Column({ type: "timestamp", nullable: true })
    startedAt?: Date;

    @Column({ type: "timestamp", nullable: true })
    endedAt?: Date;

    @Column({ type: "timestamp", nullable: true })
    expiresAt?: Date;

    @CreateDateColumn()
    createdAt?: Date;

    @UpdateDateColumn()
    updatedAt?: Date;
}
