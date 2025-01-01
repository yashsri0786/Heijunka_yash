"use client"

import { useState } from "react"
import { useHeijunka } from "@/contexts/HeijunkaContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function RawMaterialManagement() {
  const { rawMaterials, addRawMaterial, updateRawMaterial, removeRawMaterial } = useHeijunka()
  const { toast } = useToast()
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    unit: "",
    inventory: 0,
  })

  const handleAddMaterial = () => {
    if (!newMaterial.name || !newMaterial.unit) {
      toast({
        title: "Error",
        description: "Please fill in all fields correctly.",
        variant: "destructive",
      })
      return
    }
    addRawMaterial(newMaterial)
    setNewMaterial({ name: "", unit: "", inventory: 0 })
    toast({
      title: "Success",
      description: "Raw material added successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="materialName">Material Name</Label>
          <Input
            id="materialName"
            value={newMaterial.name}
            onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="unit">Unit of Measurement</Label>
          <Select
            value={newMaterial.unit}
            onValueChange={(value) => setNewMaterial({ ...newMaterial, unit: value })}
          >
            <SelectTrigger id="unit">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inch">inch</SelectItem>
              <SelectItem value="cm">cm</SelectItem>
              <SelectItem value="meter">meter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="inventory">Initial Inventory</Label>
          <Input
            id="inventory"
            type="number"
            value={newMaterial.inventory}
            onChange={(e) => setNewMaterial({ ...newMaterial, inventory: parseInt(e.target.value) })}
          />
        </div>
      </div>
      <Button onClick={handleAddMaterial}>Add Raw Material</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material Name</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rawMaterials.map((material) => (
            <TableRow key={material.id}>
              <TableCell>{material.name}</TableCell>
              <TableCell>{material.unit}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  value={material.inventory}
                  onChange={(e) => updateRawMaterial({ ...material, inventory: parseInt(e.target.value) })}
                />
              </TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => removeRawMaterial(material.id)}>
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

