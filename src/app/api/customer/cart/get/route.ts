import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt, { TokenExpiredError } from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";


export async function GET(req: Request) {
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

        const customerId = decoded.id
        const cartItems = await prisma.cart.findMany({
            where: {
                customerId
            },
            include: {
                fruit: {
                    select: {
                        name: true,
                        price: true,
                        owner: {
                            select: {
                                name: true // Owner's name
                            }
                        }
                    }
                }
            }
        });
        return NextResponse.json({ cart: cartItems }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
