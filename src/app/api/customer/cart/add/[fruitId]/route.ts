import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt, { TokenExpiredError } from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

interface Params {
    fruitId: string;
}

export async function POST(req: Request, { params }: { params: Params }) {
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

        const customerId = decoded.id;
        const fruitId = parseInt(params.fruitId, 10);

        if (isNaN(fruitId)) {
            return NextResponse.json({ error: "Invalid fruit ID" }, { status: 400 });
        }

        // Check if fruit exists
        const fruit = await prisma.fruit.findUnique({ where: { id: fruitId } });
        if (!fruit) {
            return NextResponse.json({ error: "Fruit not found" }, { status: 404 });
        }

        // Check if the fruit is already in the cart
        const existingCartItem = await prisma.cart.findFirst({
            where: { customerId, fruitId }
        });

        if (existingCartItem) {
            await prisma.cart.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + 1 }
            });
        } else {
            await prisma.cart.create({
                data: { customerId, fruitId, quantity: 1 }
            });
        }

        return NextResponse.json({ message: 'Added to Cart' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
