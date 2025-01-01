"use client"

import { useState, useEffect } from "react"
import { useHeijunka } from "@/contexts/HeijunkaContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type SimulationResult = {
  productionPlan: { [date: string]: { [toyType: string]: number } }
  materialRequirements: { [date: string]: { [material: string]: number } }
  inventoryLevels: { [date: string]: { [material: string]: number } }
}

export default function Reports() {
  const { orders, toys, rawMaterials, suppliers, simulationResult, setSimulationResult } = useHeijunka()
  const [explanation, setExplanation] = useState<string>("")

  const runSimulation = () => {
    const sortedOrders = [...orders].sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime())

    const productionPlan: { [date: string]: { [toyType: string]: number } } = {}
    const materialRequirements: { [date: string]: { [material: string]: number } } = {}
    const inventoryLevels: { [date: string]: { [material: string]: number } } = {}

    const currentDate = new Date().toISOString().split('T')[0]
    
    // Initialize inventory levels for all materials for all dates
    let currentDateObj = new Date(currentDate)
    let simulationEndDate = currentDate
    const endDateObj = new Date(simulationEndDate)
    while (currentDateObj <= endDateObj) {
      const dateStr = currentDateObj.toISOString().split('T')[0]
      inventoryLevels[dateStr] = { ...inventoryLevels[currentDate] }
      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }


    // Initialize inventory levels for all materials
    rawMaterials.forEach(material => {
      inventoryLevels[currentDate] = {
        ...inventoryLevels[currentDate],
        [material.name]: material.inventory
      }
    })

    let explanationText = "Heijunka Box Calculation Explanation:\n\n"

    sortedOrders.forEach(order => {
      const toy = toys.find(t => t.name === order.toyType)
      if (!toy) return

      const daysUntilDelivery = Math.max(1, Math.ceil((new Date(order.deliveryDate).getTime() - new Date(currentDate).getTime()) / (1000 * 3600 * 24)))
      const dailyProduction = Math.ceil(order.quantity / daysUntilDelivery)

      explanationText += `Order: ${order.quantity} ${order.toyType} for ${order.retailerName}, due on ${order.deliveryDate}\n`
      explanationText += `Days until delivery: ${daysUntilDelivery}\n`
      explanationText += `Daily production: ${dailyProduction} (${order.quantity} / ${daysUntilDelivery} days, rounded up)\n\n`

      for (let i = 0; i < daysUntilDelivery; i++) {
        const date = new Date(new Date(currentDate).getTime() + i * 24 * 3600 * 1000).toISOString().split('T')[0]
        simulationEndDate = date

        productionPlan[date] = {
          ...productionPlan[date],
          [order.toyType]: (productionPlan[date]?.[order.toyType] || 0) + dailyProduction
        }

        // Calculate material requirements and update inventory levels
        Object.entries(toy.rawMaterials).forEach(([materialId, quantity]) => {
          const material = rawMaterials.find(m => m.id === materialId)
          if (material) {
            const requiredAmount = quantity * dailyProduction
            materialRequirements[date] = {
              ...materialRequirements[date],
              [material.name]: (materialRequirements[date]?.[material.name] || 0) + requiredAmount
            }

            explanationText += `\nDate: ${date}\n`;
            explanationText += `Production: ${dailyProduction} ${order.toyType}\n`;
            explanationText += `Calculation: ${order.quantity} total / ${daysUntilDelivery} days = ${dailyProduction} per day\n`;

            explanationText += `Material: ${material.name}, Required: ${requiredAmount} (${quantity} per toy * ${dailyProduction} toys)\n`;

            // Update inventory levels
            const previousInventory = inventoryLevels[date][material.name]
            const newInventory = Math.max(0, previousInventory - requiredAmount)
            inventoryLevels[date][material.name] = newInventory

            explanationText += `Inventory: ${material.name}, Previous: ${previousInventory}, New: ${newInventory}\n`;
          }
        })
      }
    })

    // Ensure all dates between start and end have entries, even if there's no production
    currentDateObj = new Date(currentDate)
    endDateObj = new Date(simulationEndDate)
    while (currentDateObj <= endDateObj) {
      const dateStr = currentDateObj.toISOString().split('T')[0]
      if (!productionPlan[dateStr]) {
        productionPlan[dateStr] = {}
      }
      if (!materialRequirements[dateStr]) {
        materialRequirements[dateStr] = {}
      }
      if (!inventoryLevels[dateStr]) {
        const previousDay = new Date(currentDateObj.getTime() - 24 * 3600 * 1000).toISOString().split('T')[0]
        inventoryLevels[dateStr] = { ...inventoryLevels[previousDay] }
      }

      // Ensure all materials are represented in inventory levels
      rawMaterials.forEach(material => {
        if (!(material.name in inventoryLevels[dateStr])) {
          const previousDay = new Date(currentDateObj.getTime() - 24 * 3600 * 1000).toISOString().split('T')[0]
          inventoryLevels[dateStr][material.name] = inventoryLevels[previousDay]?.[material.name] || 0
        }
      })

      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }

    explanationText += "\nDaily Production Plan:\n"
    Object.entries(productionPlan).forEach(([date, production]) => {
      const productionStr = Object.entries(production)
        .filter(([_, quantity]) => quantity > 0)
        .map(([toy, quantity]) => `${quantity} ${toy}`)
        .join(", ")
      explanationText += `${date}: ${productionStr || "No production"}\n`
    })

    explanationText += "\nMaterial Requirements:\n"
    Object.entries(materialRequirements).forEach(([date, materials]) => {
      const materialsStr = Object.entries(materials)
        .filter(([_, quantity]) => quantity > 0)
        .map(([material, quantity]) => `${quantity} ${material}`)
        .join(", ")
      explanationText += `${date}: ${materialsStr || "No materials required"}\n`
    })

    explanationText += "\nInventory Levels:\n"
    Object.entries(inventoryLevels).forEach(([date, levels]) => {
      const levelsStr = Object.entries(levels)
        .map(([material, quantity]) => `${material}: ${quantity}`)
        .join(", ")
      explanationText += `${date}: ${levelsStr}\n`
    })

    setSimulationResult({ productionPlan, materialRequirements, inventoryLevels })
    setExplanation(explanationText)
  }

  const formatDataForChart = (data: { [date: string]: { [key: string]: number } }) => {
    return Object.entries(data).map(([date, values]) => ({
      date,
      ...values
    }))
  }

  return (
    <div className="space-y-6">
      <Button onClick={runSimulation}>Run Simulation</Button>

      {simulationResult && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Production Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formatDataForChart(simulationResult.productionPlan)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {toys.map((toy, index) => (
                    <Bar key={toy.id} dataKey={toy.name} fill={`hsl(${index * 30}, 70%, 50%)`} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Material Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formatDataForChart(simulationResult.materialRequirements)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {rawMaterials.map((material, index) => (
                    <Bar key={material.id} dataKey={material.name} fill={`hsl(${index * 30 + 15}, 70%, 50%)`} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={formatDataForChart(simulationResult.inventoryLevels)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {rawMaterials.map((material, index) => (
                    <Bar key={material.id} dataKey={material.name} fill={`hsl(${index * 30 + 30}, 70%, 50%)`} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Heijunka Box</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    {toys.map(toy => (
                      <TableHead key={toy.id}>{toy.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(simulationResult.productionPlan).map(([date, production]) => (
                    <TableRow key={date}>
                      <TableCell>{date}</TableCell>
                      {toys.map(toy => (
                        <TableCell key={toy.id}>{production[toy.name] || 0}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Heijunka Box Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap">{explanation}</pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

