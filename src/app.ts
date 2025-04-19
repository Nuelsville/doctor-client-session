import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import { swaggerAuth } from "./middlewares/basicAuth.middleware";
import { generateJitsiRoomName, generateJitsiToken } from "./utils/jitsi";
import sessionRoutes from "./routes/session.routes";
import seedRoutes from "./routes/seed.routes";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import agoraRoutes from "./routes/agora.routes"; // 👈 FIXED HERE  
import cors from "cors";
import morgan from "morgan";

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProd = process.env.NODE_ENV === "production";

const app = express();
app.use(cors(
  {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }
));
app.use(express.json());
app.use(morgan("dev"));
app.use((req: Request, res: Response, next) => {
  console.log(`🛬 ${req.method} ${req.originalUrl}`);
  console.log("📥 Request Body:", req.body);

  const originalSend = res.send;
  res.send = function (body) {
    console.log("📤 Response Body:", body);
    return originalSend.call(this, body);
  };

  next();
});


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/sessions", sessionRoutes);
app.use("/seed", seedRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/agora", agoraRoutes); // 👈 FIXED HERE



// ✅ Test route for generating a Jitsi room + token
app.get("/test-room", async (req, res): Promise<any> => {
  const room = generateJitsiRoomName();
  const token = generateJitsiToken(room, "Dr. Test");
  return res.json({ room, token });
});

AppDataSource.initialize()
  .then(() => {
    console.log("📦 DB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ DB connection error:", err);
  });
