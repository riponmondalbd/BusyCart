import cloudinary from "../config/cloudinary";
import { prisma } from "../prisma/prisma";

// admin only
// get all users list - admin only
export const getAllUsers = async (req: any, res: any) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: "USER" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// delete user - admin only
export const deleteUserByAdmin = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "User id is required" });

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // prevent admin from deleting other admins or super admins
    if (user.role !== "USER") {
      return res
        .status(403)
        .json({ message: "You can only delete regular users" });
    }

    // delete profile image from cloudinary
    if (user.imagePublicId) {
      await cloudinary.uploader.destroy(user.imagePublicId);
    }

    // delete user from database
    await prisma.user.delete({ where: { id } });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
