'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type CartItem = {
  slug: string
  name: string
  image: string
  price: number  // numeric, e.g. 1599
  quantity: number
  tag: string
}

type CartContextType = {
  items: CartItem[]
  savedItems: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (slug: string) => void
  updateQty: (slug: string, qty: number) => void
  saveForLater: (slug: string) => void
  moveToCart: (slug: string) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  shipping: number
  total: number
  hydrated: boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function parsePrice(priceStr: string): number {
  // "₹1,599" → 1599
  return parseInt(priceStr.replace(/[^\d]/g, ''), 10) || 0
}

const CART_KEY  = 'mz_cart'
const SAVED_KEY = 'mz_cart_saved'
export const FREE_SHIPPING_THRESHOLD = 999
export const FLAT_SHIPPING = 79

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items,      setItems]      = useState<CartItem[]>([])
  const [savedItems, setSavedItems] = useState<CartItem[]>([])
  const [hydrated,   setHydrated]   = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY)
      if (stored) setItems(JSON.parse(stored))
      const storedSaved = localStorage.getItem(SAVED_KEY)
      if (storedSaved) setSavedItems(JSON.parse(storedSaved))
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items, hydrated])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(SAVED_KEY, JSON.stringify(savedItems))
  }, [savedItems, hydrated])

  const addItem = useCallback((incoming: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === incoming.slug)
      if (existing) {
        return prev.map((i) =>
          i.slug === incoming.slug
            ? { ...i, quantity: i.quantity + (incoming.quantity ?? 1) }
            : i
        )
      }
      return [...prev, { ...incoming, quantity: incoming.quantity ?? 1 }]
    })
  }, [])

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug))
  }, [])

  const updateQty = useCallback((slug: string, qty: number) => {
    if (qty < 1) return
    setItems((prev) => prev.map((i) => i.slug === slug ? { ...i, quantity: qty } : i))
  }, [])

  const saveForLater = useCallback((slug: string) => {
    setItems((prev) => {
      const item = prev.find((i) => i.slug === slug)
      if (item) setSavedItems((s) => [...s.filter((i) => i.slug !== slug), item])
      return prev.filter((i) => i.slug !== slug)
    })
  }, [])

  const moveToCart = useCallback((slug: string) => {
    setSavedItems((prev) => {
      const item = prev.find((i) => i.slug === slug)
      if (item) {
        setItems((c) => {
          const existing = c.find((i) => i.slug === slug)
          if (existing) return c.map((i) => i.slug === slug ? { ...i, quantity: i.quantity + 1 } : i)
          return [...c, { ...item, quantity: 1 }]
        })
      }
      return prev.filter((i) => i.slug !== slug)
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const subtotal   = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const shipping   = items.length > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? FLAT_SHIPPING : 0
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const total      = subtotal - 0 + shipping  // discount applied per-page

  return (
    <CartContext.Provider value={{
      items, savedItems,
      addItem, removeItem, updateQty, saveForLater, moveToCart, clearCart,
      totalItems, subtotal, shipping, total, hydrated,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
