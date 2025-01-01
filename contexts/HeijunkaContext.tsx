"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Order = {
  id: string
  retailerName: string
  toyType: string
  quantity: number
  deliveryDate: string
}

type Toy = {
  id: string
  name: string
  assemblyTime: number
  rawMaterials: { [key: string]: number }
}

type RawMaterial = {
  id: string
  name: string
  unit: string
  inventory: number
}

type Supplier = {
  id: string
  name: string
  materialSupplied: string
  leadTime: number
  deliverySchedule: "daily" | "weekly"
}

type SimulationResult = any; // Replace 'any' with the actual type of SimulationResult

type HeijunkaContextType = {
  orders: Order[]
  toys: Toy[]
  rawMaterials: RawMaterial[]
  suppliers: Supplier[]
  addOrder: (order: Omit<Order, "id">) => void
  updateOrder: (order: Order) => void
  removeOrder: (id: string) => void
  addToy: (toy: Omit<Toy, "id">) => void
  updateToy: (toy: Toy) => void
  removeToy: (id: string) => void
  addRawMaterial: (material: Omit<RawMaterial, "id">) => void
  updateRawMaterial: (material: RawMaterial) => void
  removeRawMaterial: (id: string) => void
  addSupplier: (supplier: Omit<Supplier, "id">) => void
  updateSupplier: (supplier: Supplier) => void
  removeSupplier: (id: string) => void
  simulationResult: SimulationResult | null;
  setSimulationResult: (result: SimulationResult | null) => void;
}

const HeijunkaContext = createContext<HeijunkaContextType | undefined>(undefined)

export const useHeijunka = () => {
  const context = useContext(HeijunkaContext)
  if (!context) {
    throw new Error("useHeijunka must be used within a HeijunkaProvider")
  }
  return context
}

export const HeijunkaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [toys, setToys] = useState<Toy[]>([])
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  // Load initial data from localStorage
  useEffect(() => {
    const storedOrders = localStorage.getItem("orders")
    if (storedOrders) setOrders(JSON.parse(storedOrders))

    const storedToys = localStorage.getItem("toys")
    if (storedToys) setToys(JSON.parse(storedToys))

    const storedRawMaterials = localStorage.getItem("rawMaterials")
    if (storedRawMaterials) setRawMaterials(JSON.parse(storedRawMaterials))

    const storedSuppliers = localStorage.getItem("suppliers")
    if (storedSuppliers) setSuppliers(JSON.parse(storedSuppliers))

    const storedSimulationResult = localStorage.getItem("simulationResult");
    if (storedSimulationResult) setSimulationResult(JSON.parse(storedSimulationResult));
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders))
  }, [orders])

  useEffect(() => {
    localStorage.setItem("toys", JSON.stringify(toys))
  }, [toys])

  useEffect(() => {
    localStorage.setItem("rawMaterials", JSON.stringify(rawMaterials))
  }, [rawMaterials])

  useEffect(() => {
    localStorage.setItem("suppliers", JSON.stringify(suppliers))
  }, [suppliers])

  useEffect(() => {
    localStorage.setItem("simulationResult", JSON.stringify(simulationResult));
  }, [simulationResult]);

  const addOrder = (order: Omit<Order, "id">) => {
    setOrders([...orders, { ...order, id: Date.now().toString() }])
  }

  const updateOrder = (updatedOrder: Order) => {
    setOrders(orders.map(order => order.id === updatedOrder.id ? updatedOrder : order))
  }

  const removeOrder = (id: string) => {
    setOrders(orders.filter(order => order.id !== id))
  }

  const addToy = (toy: Omit<Toy, "id">) => {
    setToys([...toys, { ...toy, id: Date.now().toString() }])
  }

  const updateToy = (updatedToy: Toy) => {
    setToys(toys.map(toy => toy.id === updatedToy.id ? updatedToy : toy))
  }

  const removeToy = (id: string) => {
    setToys(toys.filter(toy => toy.id !== id))
  }

  const addRawMaterial = (material: Omit<RawMaterial, "id">) => {
    setRawMaterials([...rawMaterials, { ...material, id: Date.now().toString() }])
  }

  const updateRawMaterial = (updatedMaterial: RawMaterial) => {
    setRawMaterials(rawMaterials.map(material => material.id === updatedMaterial.id ? updatedMaterial : material))
  }

  const removeRawMaterial = (id: string) => {
    setRawMaterials(rawMaterials.filter(material => material.id !== id))
  }

  const addSupplier = (supplier: Omit<Supplier, "id">) => {
    setSuppliers([...suppliers, { ...supplier, id: Date.now().toString() }])
  }

  const updateSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(suppliers.map(supplier => supplier.id === updatedSupplier.id ? updatedSupplier : supplier))
  }

  const removeSupplier = (id: string) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id))
  }

  return (
    <HeijunkaContext.Provider
      value={{
        orders,
        toys,
        rawMaterials,
        suppliers,
        addOrder,
        updateOrder,
        removeOrder,
        addToy,
        updateToy,
        removeToy,
        addRawMaterial,
        updateRawMaterial,
        removeRawMaterial,
        addSupplier,
        updateSupplier,
        removeSupplier,
        simulationResult,
        setSimulationResult,
      }}
    >
      {children}
    </HeijunkaContext.Provider>
  )
}

