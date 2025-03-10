"use client";

import { useEffect, useState } from "react";
import { Plus, Eye, CheckCircle, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Fruit {
  id: number;
  name: string;
  stock: number;
  price: number;
}

interface OrderItem {
  id: number;
  orderId: number;
  fruitId: number;
  quantity: number;
  price: number;
  fruit: Fruit;
}

interface Customer {
  id: number;
  name: string;
  email: string;
}

interface Order {
  id: number;
  customerId: number;
  totalAmount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED"; // Assuming possible statuses
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  orderItems: OrderItem[];
}
// Remove the static `initialFruits`
export default function Dashboard() {
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [newFruit, setNewFruit] = useState({ name: "", stock: 0, price: 0, category: "" });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  // const handleFulfillOrder = (orderId: number) => {
  //   setOrdersList(ordersList.map((order) => (order.id === orderId ? { ...order, status: "fulfilled" } : order)))
  // }

  // const handleCancelOrder = (orderId: number) => {
  //   setOrdersList(ordersList.map((order) => (order.id === orderId ? { ...order, status: "cancelled" } : order)))
  // }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  // Function to fetch fruits from API
  const fetchFruits = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized: Please log in.");
        return;
      }

      const response = await fetch("/api/owner/fruits/get", {
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

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized: Please log in.");
        return;
      }

      const response = await fetch("/api/owner/orders/get", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to fetch orders");
        return;
      }
      console.log(data.orders)
      setOrdersList(data.orders);
    } catch (error) {
      console.error("Error fetching fruits:", error);
    }
  }

  // Fetch fruits when component mounts
  useEffect(() => {
    fetchFruits();
    fetchOrders()
  }, []);


  const handleAddFruit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized: Please log in.");
        return;
      }

      const response = await fetch("/api/owner/fruits/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newFruit),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to add fruit");
        return;
      }

      setFruits([...fruits, data.fruit]);
      setNewFruit({ name: "", stock: 0, price: 0, category: "" });
    } catch (error) {
      console.error("Error adding fruit:", error);
    }
  };

  const handleDeleteFruit = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Unauthorized: Please log in.");
        return;
      }

      const response = await fetch(`/api/owner/fruits/${id}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        alert("Failed to delete fruit");
        return;
      }

      // Remove fruit from state
      setFruits(fruits.filter((fruit) => fruit.id !== id));
    } catch (error) {
      console.error("Error deleting fruit:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">

      {/* Main Content */}
      <div className="flex flex-1 flex-col">

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Tabs defaultValue="inventory">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Fruit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Fruit</DialogTitle>
                    <DialogDescription>Enter fruit details.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={newFruit.name} onChange={(e) => setNewFruit({ ...newFruit, name: e.target.value })} />
                    <Label htmlFor="stock">Stock</Label>
                    <Input id="stock" type="number" value={newFruit.stock} onChange={(e) => setNewFruit({ ...newFruit, stock: Number(e.target.value) })} />
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" type="number" step="0.01" value={newFruit.price} onChange={(e) => setNewFruit({ ...newFruit, price: Number(e.target.value) })} />
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddFruit}>Add Fruit</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="inventory" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fruit Inventory</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fruits.map((fruit) => (
                        <TableRow key={fruit.id}>
                          <TableCell>{fruit.name}</TableCell>
                          <TableCell className="text-right">{fruit.stock}</TableCell>
                          <TableCell className="text-right">${fruit.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Customer Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount Paid</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ordersList.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{order.customer.name}</TableCell>
                          <TableCell>{order.orderItems.length} items</TableCell>
                          <TableCell>{formatDate(order.createdAt)}</TableCell>
                          <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                            
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="icon" onClick={() => setSelectedOrder(order)}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View order details</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>Order Details - {order.id}</DialogTitle>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div className="font-medium">Customer:</div>
                                      {/* <div>{order.customer.name}</div> */}
                                      <div className="font-medium">Date:</div>
                                      <div>{formatDate(order.createdAt)}</div>
                                      <div className="font-medium">Status:</div>
                                      <div>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
                                      
                                      </div>
                                    </div>

                                    <div className="border rounded-md p-3">
                                      <div className="font-medium mb-2">Items Ordered:</div>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Fruit</TableHead>
                                            <TableHead className="text-right">Quantity</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead className="text-right">Subtotal</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {order.orderItems.map((item) => (
                                            <TableRow key={item.id}>
                                              <TableCell>{item.fruit.name}</TableCell>
                                              <TableCell className="text-right">{item.quantity}</TableCell>
                                              <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                              <TableCell className="text-right">
                                                ${(item.quantity * item.price).toFixed(2)}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                          <TableRow>
                                            <TableCell colSpan={3} className="text-right font-medium">
                                              Total:
                                            </TableCell>
                                            <TableCell className="text-right font-bold">${order.totalAmount.toFixed(2)}</TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </div>

                                  </div>
                                </DialogContent>
                              </Dialog>

                              
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
