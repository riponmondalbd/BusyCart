import jwt from "jsonwebtoken";
import { prisma } from "../prisma/prisma";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens";

export const refreshTokenHandler = async (req: any, res: any) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // check if token exist in db
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!storedToken) {
      res.status(401).json({ message: "Invalid refresh token" });
    }

    // verify token
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (error) {
      // token expired or invalid
      await prisma.refreshToken.delete({ where: { token } });
      return res.status(401).json({ message: "Token expired or invalid" });
    }

    const userID = decoded.id;

    // delete old token
    await prisma.refreshToken.delete({ where: { token } });

    // generate new token
    const newAccessToken = generateAccessToken(userID, decoded.role);
    const newRefreshToken = generateRefreshToken(userID);

    // store new refresh token to db
    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: userID,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // send new token
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Token refreshed successfully",
      token: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      message: "Something went wrong",
      error: (error as Error).message,
    });
  }
};
