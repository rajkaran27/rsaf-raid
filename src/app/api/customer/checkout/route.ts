import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt, { TokenExpiredError } from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        const token = authHeader.split(" ")[1];
        let decoded;

        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                return NextResponse.redirect(new URL("/", req.url));
            }
            return NextResponse.redirect(new URL("/", req.url));
        }

        if (!decoded || typeof decoded !== "object" || decoded.role !== "CUSTOMER") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Fetch user's cart items
        const cartItems = await prisma.cart.findMany({
            where: { customerId: decoded.id },
            include: { fruit: true },
        });

        if (!cartItems.length) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Calculate total amount
        const totalAmount = cartItems.reduce((total, item) => total + item.fruit.price * item.quantity, 0);

        // Create an order
        const order = await prisma.order.create({
            data: {
                customerId: decoded.id,
                totalAmount,
                status: "PENDING",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        // Move cart items to order items
        await Promise.all(
            cartItems.map((item) =>
                prisma.orderItem.create({
                    data: {
                        orderId: order.id,
                        fruitId: item.fruitId,
                        quantity: item.quantity,
                        price: item.fruit.price,
                    },
                })
            )
        );
        // Clear the user's cart
        await prisma.cart.deleteMany({ where: { customerId: decoded.id } });

        return NextResponse.json({ message: "Checkout successful", orderId: order.id }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
