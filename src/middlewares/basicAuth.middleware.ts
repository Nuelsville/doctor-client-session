import { Request, Response, NextFunction } from "express";
import auth from "basic-auth";

export const swaggerAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const credentials = auth(req);

  const username = process.env.SWAGGER_USER || "admin";
  const password = process.env.SWAGGER_PASS || "password123";

  if (
    !credentials ||
    credentials.name !== username ||
    credentials.pass !== password
  ) {
    res.setHeader("WWW-Authenticate", "Basic realm='Swagger Docs'");
    res.status(401).send("Access denied");
    return;
  }

  next(); // you can await next() if needed, but it's sync by default
};
