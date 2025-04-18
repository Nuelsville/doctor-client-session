import { v4 as uuidv4 } from "uuid";

export function generateJitsiRoomName(): string {
    return `video-room-${uuidv4()}`;
}

export function generateJitsiToken(roomName: string, _userName: string): string {
    // In dev mode with meet.jit.si, just return the URL
    return `https://meet.jit.si/${roomName}`;
}
