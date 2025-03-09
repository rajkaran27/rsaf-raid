import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { TokenExpiredError } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    if (!token) {
        // Redirect unauthenticated users to login, except for the root page
        if (pathname !== "/") {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return NextResponse.next();
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { role: string; exp: number };

        // **Redirect if the token is expired**
        if (decoded.exp * 1000 < Date.now()) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // **Prevent authenticated users from visiting the root page**
        if (pathname === "/") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        // **Role-based access control**
        if (pathname.startsWith("/dashboard") && decoded.role !== "OWNER") {
            return NextResponse.redirect(new URL("/shop", req.url));
        }

        if (pathname.startsWith("/shop") && decoded.role !== "CUSTOMER") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        return NextResponse.next();
    } catch (err) {
        // **Handle expired tokens explicitly**
        if (err instanceof TokenExpiredError) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // **Catch other JWT errors (invalid token, malformed, etc.)**
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/", "/shop/:path*", "/dashboard/:path*"],
};
