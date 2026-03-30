import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { prisma } from "../prisma/prisma";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, discount, stock } = req.body;

    // Basic validation
    if (!name || !price || stock === undefined) {
      return res.status(400).json({
        message: "Name, price and stock are required",
      });
    }

    if (!req.files || !(req.files instanceof Array) || req.files.length === 0) {
      return res.status(400).json({
        message: "At least one product image is required",
      });
    }

    if (req.files.length > 5) {
      return res.status(400).json({
        message: "Maximum 5 images allowed",
      });
    }

    const imageUrls: string[] = [];

    // 🔹 Single reliable upload method
    for (const file of req.files as Express.Multer.File[]) {
      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "busycart_products",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        stream.end(file.buffer);
      });

      imageUrls.push(uploadResult.secure_url);
    }

    // Optional validation
    if (discount && Number(discount) >= Number(price)) {
      return res.status(400).json({
        message: "Discount price must be less than regular price",
      });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        discount: discount ? Number(discount) : null,
        stock: Number(stock),
        images: imageUrls,
      },
    });

    return res.status(201).json({
      success: true,
      product: newProduct,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};
