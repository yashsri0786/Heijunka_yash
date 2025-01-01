"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OrderManagement from "@/components/OrderManagement"
import ToyManagement from "@/components/ToyManagement"
import RawMaterialManagement from "@/components/RawMaterialManagement"
import SupplierManagement from "@/components/SupplierManagement"
import Reports from "@/components/Reports"
import { HeijunkaProvider } from "@/contexts/HeijunkaContext"

export default function Home() {
  const [activeTab, setActiveTab] = useState("materials")

  return (
    <HeijunkaProvider>
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Birbal's Heijunka Simulator</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="materials">Raw Materials</TabsTrigger>
            <TabsTrigger value="toys">Toys</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="materials">
            <RawMaterialManagement />
          </TabsContent>
          <TabsContent value="toys">
            <ToyManagement />
          </TabsContent>
          <TabsContent value="suppliers">
            <SupplierManagement />
          </TabsContent>
          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
          <TabsContent value="reports">
            <Reports />
          </TabsContent>
        </Tabs>
      </main>
    </HeijunkaProvider>
  )
}

