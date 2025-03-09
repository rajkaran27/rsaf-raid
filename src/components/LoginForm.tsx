"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation"; // Import Next.js router
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter(); // Initialize router

    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        setMessage("");

        const response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        setLoading(false);

        if (response.ok) {
            localStorage.setItem("token", result.token); // Store JWT token

            if (result.role === "CUSTOMER") {
                router.push("/shop"); 
            } else if (result.role === "OWNER") {
                router.push("/dashboard"); // Redirect owners to dashboard
            }
        } else {
            setMessage(result.error || "Something went wrong.");
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input {...register("email")} placeholder="Email" type="email" required />
                <Input {...register("password")} placeholder="Password" type="password" required />
                <Button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
            </form>
            {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
        </div>
    );
}
