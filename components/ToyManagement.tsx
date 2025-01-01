"use client"

import { useState } from "react"
import { useHeijunka } from "@/contexts/HeijunkaContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

export default function ToyManagement() {
  const { toys, rawMaterials, addToy, updateToy, removeToy } = useHeijunka()
  const { toast } = useToast()
  const [newToy, setNewToy] = useState({
    name: "",
    assemblyTime: 0,
    rawMaterials: {} as { [key: string]: number },
  })

  const handleAddToy = () => {
    if (!newToy.name || newToy.assemblyTime <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields correctly.",
        variant: "destructive",
      })
      return
    }
    addToy(newToy)
    setNewToy({ name: "", assemblyTime: 0, rawMaterials: {} })
    toast({
      title: "Success",
      description: "Toy added successfully.",
    })
  }

  const handleUpdateRawMaterial = (toyId: string,materialId: string, quantity: number) => {
    const updatedToy = toys.find(toy => toy.id === toyId)
    if (updatedToy) {
      const newRawMaterials = { ...updatedToy.rawMaterials, [materialId]: quantity }
      updateToy({ ...updatedToy, rawMaterials: newRawMaterials })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="toyName">Toy Name</Label>
          <Input
            id="toyName"
            value={newToy.name}
            onChange={(e) => setNewToy({ ...newToy, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="assemblyTime">Assembly Time (hours)</Label>
          <Input
            id="assemblyTime"
            type="number"
            value={newToy.assemblyTime}
            onChange={(e) => setNewToy({ ...newToy, assemblyTime: parseFloat(e.target.value) })}
          />
        </div>
      </div>
      <Button onClick={handleAddToy}>Add Toy</Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Toy Name</TableHead>
            <TableHead>Assembly Time (hours)</TableHead>
            <TableHead>Raw Materials</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {toys.map((toy) => (
            <TableRow key={toy.id}>
              <TableCell>{toy.name}</TableCell>
              <TableCell>{toy.assemblyTime}</TableCell>
              <TableCell>
                {Object.entries(toy.rawMaterials).map(([materialId, quantity]) => (
                  <div key={materialId}>
                    {rawMaterials.find(m => m.id === materialId)?.name}: {quantity}
                  </div>
                ))}
                {rawMaterials.map((material) => (
                  <div key={material.id}>
                    <Label htmlFor={`${toy.id}-${material.id}`}>{material.name}</Label>
                    <Input
                      id={`${toy.id}-${material.id}`}
                      type="number"
                      value={toy.rawMaterials[material.id] || 0}
                      onChange={(e) => handleUpdateRawMaterial(toy.id, material.id, parseInt(e.target.value))}
                    />
                  </div>
                ))}
              </TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => removeToy(toy.id)}>
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

