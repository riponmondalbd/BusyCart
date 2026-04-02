import { prisma } from "../prisma/prisma";

// create coupon only for admin super admin
export const createCoupon = async (req: any, res: any) => {
  try {
    const { code, discount, type, minAmount, expiresAt } = req.body;

    // Validate input
    if (!code || !discount || !type || !expiresAt) {
      return res
        .status(400)
        .json({ success: false, message: "All required fields missing" });
    }

    // Create coupon
    const coupon = await prisma.coupon.create({
      data: {
        code,
        discount,
        type, // "FIXED" or "PERCENTAGE"
        minAmount,
        expiresAt: new Date(expiresAt),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: coupon,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to create coupon",
      error: error.message,
    });
  }
};

// apply coupon only for user
export const applyCoupon = async (req: any, res: any) => {
  try {
    const { code, orderId } = req.body;
    const userId = (req.user as any).id;

    // Find order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      console.log(`[Coupon Error] Order not found for orderId: ${orderId}`);
      return res
        .status(404)
        .json({
          success: false,
          message: `Order not found with ID: ${orderId}`,
        });
    }

    if (order.userId !== userId) {
      console.log(
        `[Coupon Error] User mismatch. Order UserId: ${order.userId}, Token UserId: ${userId}`,
      );
      return res.status(404).json({
        success: false,
        message: "Order does not belong to the authenticated user",
      });
    }

    // Check if order already paid
    if (order.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Cannot apply coupon on completed order",
      });
    }

    // Find coupon
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon)
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });

    if (new Date() > coupon.expiresAt) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon expired" });
    }

    if (coupon.minAmount && order.subtotal < coupon.minAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount ${coupon.minAmount} required`,
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === "FIXED") discountAmount = coupon.discount;
    if (coupon.type === "PERCENTAGE")
      discountAmount = (order.subtotal * coupon.discount) / 100;

    // Update order total
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        total: order.subtotal - discountAmount,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: { order: updatedOrder, discount: discountAmount, coupon },
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to apply coupon",
      error: error.message,
    });
  }
};
