"use client"

import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

interface FruitItem {
    id: number;
    customerId: number;
    fruitId: number;
    quantity: number;
    createdAt: string;  // since the API returns a date in string format (ISO 8601)
    updatedAt: string;  // same as above
    fruit: {
        name: string;
        price: number;
        owner: object;  // you may want to further define the 'owner' field if necessary
    };
}


export default function Cart() {

    const [fruits, setFruits] = useState<FruitItem[]>([]);

    const router = useRouter()
    const fetchFruits = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push('/')
                return;
            }

            const response = await fetch("/api/customer/cart/get", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Failed to fetch fruits");
                return;
            }

            setFruits(data.cart);
        } catch (error) {
            console.error("Error fetching fruits:", error);
        }
    };

    useEffect(() => {
        fetchFruits();
    }, []);

    const calculateTotal = () => {
        return fruits.reduce((total, item) => total + item.fruit.price * item.quantity, 0)
    }

    const checkout = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push('/')
                return;
            }

            const response = await fetch("/api/customer/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Checkout failed");
                return;
            }

            alert("Checkout successful! Your order has been placed.");
            setFruits([]);
        } catch (error) {
            console.error("Error during checkout:", error);
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center gap-2 mb-6">
                <ShoppingCart className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Your Cart</h1>
            </div>

            {fruits.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">Your cart is empty</p>
                    <Button className="mt-4">Continue Shopping</Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <Card>
                            <CardContent className="p-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Fruit</TableHead>
                                            <TableHead className="text-center">Quantity</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fruits.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.fruit.name}</TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right">${(item.fruit.price * item.quantity).toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${calculateTotal().toFixed(2)}</span>
                                    </div>

                                    <Separator />
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>${calculateTotal().toFixed(2)}</span>
                                    </div>
                                    <Button className="w-full mt-4" onClick={checkout}>Checkout</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}