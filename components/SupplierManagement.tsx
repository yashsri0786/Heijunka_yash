"use client"

import { useState } from "react"
import { useHeijunka } from "@/contexts/HeijunkaContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

export default function SupplierManagement() {
  const { suppliers, rawMaterials, addSupplier, updateSupplier, removeSupplier } = useHeijunka()
  const { toast } = useToast()
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    materialSupplied: "",
    leadTime: 0,
    deliverySchedule: "daily" as "daily" | "weekly",
  })

  const handleAddSupplier = () => {
    if (!newSupplier.name || !newSupplier.materialSupplied || newSupplier.leadTime < 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields correctly. Lead time must be 0 or greater.",
        variant: "destructive",
      })
      return
    }
    addSupplier(newSupplier)
    setNewSupplier({ name: "", materialSupplied: "", leadTime: 0, deliverySchedule: "daily" })
    toast({
      title: "Success",
      description: "Supplier added successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="supplierName">Supplier Name</Label>
          <Input
            id="supplierName"
            value={newSupplier.name}
            onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="materialSupplied">Material Supplied</Label>
          <Select
            value={newSupplier.materialSupplied}
            onValueChange={(value) => setNewSupplier({ ...newSupplier, materialSupplied: value })}
          >
            <SelectTrigger id="materialSupplied">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              {rawMaterials.map((material) => (
                <SelectItem key={material.id} value={material.id}>
                  {material.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="leadTime">Lead Time (days)</Label>
          <Input
            id="leadTime"
            type="number"
            value={newSupplier.leadTime}
            onChange={(e) => setNewSupplier({ ...newSupplier, leadTime: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="deliverySchedule">Delivery Schedule</Label>
          <Select
            value={newSupplier.deliverySchedule}
            onValueChange={(value) => setNewSupplier({ ...newSupplier, deliverySchedule: value as "daily" | "weekly" })}
          >
            <SelectTrigger id="deliverySchedule">
              <SelectValue placeholder="Select schedule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={handleAddSupplier}>Add Supplier</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier Name</TableHead>
            <TableHead>Material Supplied</TableHead>
            <TableHead>Lead Time (days)</TableHead>
            <TableHead>Delivery Schedule</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell>{supplier.name}</TableCell>
              <TableCell>{rawMaterials.find(m => m.id === supplier.materialSupplied)?.name}</TableCell>
              <TableCell>{supplier.leadTime}</TableCell>
              <TableCell>{supplier.deliverySchedule}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => removeSupplier(supplier.id)}>
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

