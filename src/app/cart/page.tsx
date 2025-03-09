"use client"

import { useState, useEffect } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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


    const fetchFruits = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Unauthorized: Please log in.");
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
                                <div className="grid gap-6">
                                    {fruits.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">

                                            <div className="flex-grow">
                                                <h3 className="font-medium">{item.fruit.name}</h3>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {/* <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => decreaseQuantity(item.id)}
                                                    aria-label={`Decrease quantity of ${item.name}`}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button> */}
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                {/* <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => increaseQuantity(item.id)}
                                                    aria-label={`Increase quantity of ${item.name}`}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button> */}
                                            </div>
                                            <div className="text-right font-medium">${(item.fruit.price * item.quantity).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>
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
                                    <Button className="w-full mt-4">Checkout</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}