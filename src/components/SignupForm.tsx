"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const { register, handleSubmit, reset } = useForm();

    const onSubmit = async (data: any) => {
        setLoading(true);
        setMessage("");

        const response = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        setLoading(false);

        if (response.ok) {
            setMessage("User registered successfully!");
            reset();
        } else {
            setMessage(result.error || "Something went wrong.");
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input {...register("email")} placeholder="Email" type="email" required />
                <Input {...register("password")} placeholder="Password" type="password" required />
                <select {...register("role")} className="border p-2 w-full rounded-md">
                    <option value="CUSTOMER">Customer</option>
                    <option value="OWNER">Owner</option>
                </select>
                <Button type="submit" disabled={loading}>
                    {loading ? "Signing up..." : "Sign Up"}
                </Button>
            </form>
            {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
        </div>
    );
}
