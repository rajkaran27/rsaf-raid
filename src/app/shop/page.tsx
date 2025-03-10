"use client"

import { useState, useEffect } from "react"
import { ShoppingBag, Store } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

import { useRouter } from "next/navigation"

interface Fruit {
    id: number;
    name: string;
    stock: number;
    price: number;
    OwnerName: string;
}


export default function CustomerPage() {

    const [fruits, setFruits] = useState<Fruit[]>([]);

    const router = useRouter()

    const fetchFruits = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log(token)
            if (!token) {
                router.push('/')
                return;
            }

            const response = await fetch("/api/customer/fruits/get", {
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

            setFruits(data.fruits);
        } catch (error) {
            console.error("Error fetching fruits:", error);
        }
    };

    useEffect(() => {
        fetchFruits();
    }, []);

    const onSubmit = async (fruitId: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push('/')
            return;
        }

        const response = await fetch(`/api/customer/cart/add/${fruitId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        const result = await response.json();
        console.log(result)
        if (response.ok) {

        }
    };


    return (
        <div className="flex min-h-screen bg-background">

            <div className="flex flex-1 flex-col">

                <main className="flex-1 overflow-auto p-4 sm:p-6">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {
                            fruits.map((fruit, index) => (
                                <div key={index}>
                                    <Card key={fruit.id} className="overflow-hidden">
                                        {/* <div className="aspect-square relative">
                                            <Image
                                                src={fruit.image || "/placeholder.svg"}
                                                alt={fruit.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div> */}
                                        <CardHeader className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">{fruit.name}</CardTitle>
                                                    <CardDescription className="flex items-center mt-1">
                                                        <Store className="mr-1 h-3 w-3" />
                                                        {fruit.OwnerName}
                                                    </CardDescription>
                                                </div>
                                                <Badge variant={fruit.stock < 10 ? "destructive" : "default"}>
                                                    {fruit.stock < 10 ? "Low Stock" : "In Stock"}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-0">
                                            {/* <div className="flex items-center gap-1 text-sm">
                                                <Star className="h-4 w-4 fill-primary text-primary" />
                                                <span>{fruit.rating}</span>
                                            </div> */}
                                            {/* <div className="mt-2 flex items-center justify-between">
                                                <span className="text-lg font-bold">${fruit.price.toFixed(2)}</span>
                                                <Badge variant="outline">{fruit.category}</Badge>
                                            </div> */}
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0 flex items-center justify-between">
                                            <div className="text-lg font-bold">${fruit.price.toFixed(2)}</div>
                                            <Button onClick={() => onSubmit(fruit.id)} size="sm" className="transition-all hover:scale-105">
                                                <ShoppingBag className="mr-2 h-4 w-4" />
                                                Add to Cart
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            ))
                        }


                    </div>
                </main>
            </div>
        </div>
    )
}

