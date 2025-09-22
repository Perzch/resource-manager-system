import type { AxiosError } from 'axios'

import { useMutation, useQuery } from '@tanstack/vue-query'

import type { ResourceInterface } from '@/types/type'

import { useAxios } from '@/composables/use-axios'

// Query params type based on server QueryResourceDto
export interface QueryResourcesParams {
  sort?: 'asc' | 'desc'
  sortColumn?: keyof ResourceInterface
  name?: string
  owner?: boolean
  columns?: (keyof ResourceInterface)[]
}

export interface PagedResult<T> {
  data: T[]
  total: number
}

export function useGetResourcesQuery(params?: QueryResourcesParams) {
  const { axiosInstance } = useAxios()
  return useQuery<PagedResult<ResourceInterface>, AxiosError>({
    queryKey: ['resources', params],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/resource', { params })
      return data
    },
  })
}

export function useGetResourceQuery(id: number) {
  const { axiosInstance } = useAxios()
  return useQuery<ResourceInterface, AxiosError>({
    queryKey: ['resource', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/resource/${id}`)
      return data
    },
  })
}

export function useCreateResourceMutation() {
  const { axiosInstance } = useAxios()
  return useMutation<ResourceInterface, AxiosError, ResourceInterface>({
    mutationKey: ['createResource'],
    mutationFn: async (payload: ResourceInterface) => {
      const { data } = await axiosInstance.post('/resource', payload)
      return data
    },
  })
}

export function useUpdateResourceMutation() {
  const { axiosInstance } = useAxios()
  return useMutation<ResourceInterface, AxiosError, Partial<ResourceInterface> & { id: number }>({
    mutationKey: ['updateResource'],
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.put('/resource', payload)
      return data
    },
  })
}

export function useDeleteResourcesMutation() {
  const { axiosInstance } = useAxios()
  // server expects /resource/:ids where :ids could be an array path param; we'll send comma-separated list
  return useMutation<any, AxiosError, number[]>({
    mutationKey: ['deleteResources'],
    mutationFn: async (ids: number[]) => {
      const idsParam = ids.join(',')
      const { data } = await axiosInstance.delete(`/resource/${idsParam}`)
      return data
    },
  })
}
