import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useBackend } from '@/lib/backend/context'
import type { AdminUpdate, NewOrderInput, Order, Profile } from '@/lib/backend/types'
import type { PlanId } from '@/lib/catalog'
import { useAuth } from './useAuth'

export const keys = {
  profile: ['profile'] as const,
  orders: ['orders'] as const,
  order: (id: string) => ['orders', id] as const,
  adminOrders: ['admin', 'orders'] as const,
}

export function useProfile() {
  const backend = useBackend()
  const { user } = useAuth()
  return useQuery({ queryKey: keys.profile, queryFn: () => backend.getProfile(), enabled: !!user })
}

export function useOrders() {
  const backend = useBackend()
  return useQuery({ queryKey: keys.orders, queryFn: () => backend.listOrders() })
}

export function useOrder(id: string) {
  const backend = useBackend()
  return useQuery({ queryKey: keys.order(id), queryFn: () => backend.getOrder(id) })
}

export function useAdminOrders() {
  const backend = useBackend()
  return useQuery({ queryKey: keys.adminOrders, queryFn: () => backend.adminListOrders() })
}

function useOrderSaved() {
  const qc = useQueryClient()
  return (order: Order) => {
    qc.setQueryData(keys.order(order.id), order)
    qc.invalidateQueries({ queryKey: keys.orders })
    qc.invalidateQueries({ queryKey: keys.adminOrders })
  }
}

export function useCreateOrder() {
  const backend = useBackend()
  const saved = useOrderSaved()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: NewOrderInput) => backend.createOrder(input),
    onSuccess: (order) => {
      saved(order)
      qc.invalidateQueries({ queryKey: keys.profile })
    },
  })
}

export function useCancelOrder() {
  const backend = useBackend()
  const saved = useOrderSaved()
  return useMutation({ mutationFn: (id: string) => backend.cancelOrder(id), onSuccess: saved })
}

export function useAdminUpdateOrder() {
  const backend = useBackend()
  const saved = useOrderSaved()
  return useMutation({
    mutationFn: ({ id, update }: { id: string; update: AdminUpdate }) => backend.adminUpdateOrder(id, update),
    onSuccess: saved,
  })
}

export function useUpdateProfile() {
  const backend = useBackend()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (patch: Partial<Pick<Profile, 'fullName' | 'company' | 'address'>>) => backend.updateProfile(patch),
    onSuccess: (p) => qc.setQueryData(keys.profile, p),
  })
}

export function useChangePlan() {
  const backend = useBackend()
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (plan: PlanId) => backend.changePlan(plan),
    onSuccess: (p) => qc.setQueryData(keys.profile, p),
  })
}
