import { Response } from "express";
import PDFDocument from "pdfkit";
import { prisma } from "../prisma/prisma";

// Generate Invoice PDF for a single order
export const generateInvoice = async (req: any, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    // Fetch order with items and product info
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Optional: Ensure user owns the order if not admin
    if (req.user.role === "USER" && order.userId !== userId) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    // Create PDF
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // Stream to response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${orderId}.pdf`,
    );
    doc.pipe(res);

    // Invoice Header
    doc.fontSize(20).text("BusyCart Invoice", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order.id}`);
    doc.text(`Date: ${order.createdAt.toDateString()}`);
    doc.text(`Status: ${order.status}`);
    doc.moveDown();

    // Table Header
    doc.text("Products:", { underline: true });
    doc.moveDown(0.5);

    order.items.forEach((item) => {
      doc.text(
        `${item.product.name} - Qty: ${item.quantity} - Price: $${item.price}`,
      );
    });

    doc.moveDown();
    doc.text(`Subtotal: $${order.subtotal}`);
    doc.text(`Total: $${order.total}`);

    // Footer
    doc.moveDown(2);
    doc.text("Thank you for shopping with BusyCart!", { align: "center" });

    doc.end();
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Failed to generate invoice",
      error: error.message,
    });
  }
};
