import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  unit?: string
  quantity: number
}

const STORAGE_KEY = 'seleste-cart'

const loadItems = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadItems())
  const isOpen = ref(false)

  const count = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const total = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const isEmpty = computed(() => items.value.length === 0)

  const addItem = (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    const existing = items.value.find((i) => i.id === item.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ ...item, quantity })
    }
    isOpen.value = true
  }

  const removeItem = (id: string) => {
    items.value = items.value.filter((i) => i.id !== id)
  }

  const updateQuantity = (id: string, quantity: number) => {
    const item = items.value.find((i) => i.id === id)
    if (!item) return
    if (quantity <= 0) {
      removeItem(id)
    } else {
      item.quantity = quantity
    }
  }

  const clear = () => {
    items.value = []
  }

  const open = () => { isOpen.value = true }
  const close = () => { isOpen.value = false }
  const toggle = () => { isOpen.value = !isOpen.value }

  watch(
    items,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true }
  )

  return {
    items,
    isOpen,
    count,
    total,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    open,
    close,
    toggle,
  }
})
