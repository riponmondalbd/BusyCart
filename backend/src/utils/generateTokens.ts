import jwt from "jsonwebtoken";

export const generateAccessToken = (id: String, role: String) => {
  return jwt.sign({ id, role }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (id: String) => {
  return jwt.sign(
    { id },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: "7d" }, // long live
  );
};
