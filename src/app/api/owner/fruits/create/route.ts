import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt, { JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Define the expected payload structure of the JWT
interface DecodedToken extends JwtPayload {
    role: string;
    id: number;
}

export async function POST(req: Request) {
    try {
        const { name, price, stock } = await req.json();
        const authHeader = req.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        let decoded: DecodedToken;

        try {
            decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
        } catch (error) {
            return NextResponse.json({ error }, { status: 401 });
        }

        if (decoded.role !== "OWNER") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        if (!name || !price || !stock) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const newFruit = await prisma.fruit.create({
            data: {
                name,
                price,
                stock,
                ownerId: decoded.id,
            },
        });

        return NextResponse.json({ message: "Fruit added successfully", fruit: newFruit }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
