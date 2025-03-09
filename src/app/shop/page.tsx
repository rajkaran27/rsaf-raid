"use client"

import { useState, useEffect } from "react"
import { Apple, Filter, LogOut, Search, ShoppingBag, ShoppingCart, Star, Store } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


interface Fruit {
    id: number;
    name: string;
    stock: number;
    price: number;
    OwnerName:string;
}


export default function CustomerPage() {

    const [fruits, setFruits] = useState<Fruit[]>([]);

    const fetchFruits = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Unauthorized: Please log in.");
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


    return (
        <div className="flex min-h-screen bg-background">

            <div className="flex flex-1 flex-col">

                <main className="flex-1 overflow-auto p-4 sm:p-6">
                    {/* <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> */}
                    {/* <div className="relative max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search fruits..."
                                className="w-full pl-8 md:w-[260px]"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div> */}

                    {/* <div className="flex items-center gap-2">
                            <Select value={sortOption} onValueChange={setSortOption}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="featured">Featured</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div> */}
                    {/* </div> */}

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {
                            fruits.map((fruit,index) => (
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
                                        <CardFooter className="p-4 pt-0">
                                            <div>
                                                ${fruit.price}
                                            </div>
                                            <Button>
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

