"use client"
import { ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

interface DecodedToken {
    role: string;
}

export default function Navbar() {
    const [isCustomer, setIsCustomer] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded: DecodedToken = jwtDecode(token);

                if (decoded.role === "CUSTOMER") {
                    setIsCustomer(true);
                }
            } catch (error) {
                console.error("Invalid token", error);
            }
        }
    }, []);
    return (
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
            <div className="flex-1">
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    Fresh Fruits Marketplace
                </h1>
            </div>

            <div className="flex items-center gap-6">
                {isCustomer && (
                    <Link
                        href="/cart"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="hidden sm:inline">Cart</span>
                    </Link>
                )}

            </div>
            <div className="border-l pl-6 h-8 flex items-center">
                <LogoutButton />
            </div>
        </header>
    )
}