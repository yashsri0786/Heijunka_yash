"use client"

import { useState } from "react"
import { useHeijunka } from "@/contexts/HeijunkaContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

export default function OrderManagement() {
  const { orders, toys, addOrder, updateOrder, removeOrder } = useHeijunka()
  const { toast } = useToast()
  const [newOrder, setNewOrder] = useState({
    retailerName: "",
    toyType: "",
    quantity: 0,
    deliveryDate: "",
  })

  const handleAddOrder = () => {
    if (!newOrder.retailerName || !newOrder.toyType || newOrder.quantity <= 0 || !newOrder.deliveryDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields correctly.",
        variant: "destructive",
      })
      return
    }
    addOrder(newOrder)
    setNewOrder({ retailerName: "", toyType: "", quantity: 0, deliveryDate: "" })
    toast({
      title: "Success",
      description: "Order added successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="retailerName">Retailer Name</Label>
          <Input
            id="retailerName"
            value={newOrder.retailerName}
            onChange={(e) => setNewOrder({ ...newOrder, retailerName: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="toyType">Toy Type</Label>
          <Select
            value={newOrder.toyType}
            onValueChange={(value) => setNewOrder({ ...newOrder, toyType: value })}
          >
            <SelectTrigger id="toyType">
              <SelectValue placeholder="Select toy type" />
            </SelectTrigger>
            <SelectContent>
              {toys.map((toy) => (
                <SelectItem key={toy.id} value={toy.name}>
                  {toy.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={newOrder.quantity.toString()}
            onChange={(e) => setNewOrder({ ...newOrder, quantity: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="deliveryDate">Delivery Date</Label>
          <Input
            id="deliveryDate"
            type="date"
            value={newOrder.deliveryDate}
            onChange={(e) => setNewOrder({ ...newOrder, deliveryDate: e.target.value })}
          />
        </div>
      </div>
      <Button onClick={handleAddOrder}>Add Order</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Retailer</TableHead>
            <TableHead>Toy Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.retailerName}</TableCell>
              <TableCell>{order.toyType}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>{order.deliveryDate}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => removeOrder(order.id)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

