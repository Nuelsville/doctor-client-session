import { RtcTokenBuilder, RtcRole } from "agora-access-token";

export function generateAgoraToken(channel: string, uid: string, role: "doctor" | "patient") {
    const appID = process.env.AGORA_APP_ID!;
    const appCertificate = process.env.AGORA_APP_CERT!;
    const expirationTimeInSeconds = 3600; // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const agoraRole = role === "doctor" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

    return RtcTokenBuilder.buildTokenWithUid(
        appID,
        appCertificate,
        channel,
        parseInt(uid),
        agoraRole,
        privilegeExpiredTs
    );
}
