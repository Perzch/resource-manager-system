import type { AxiosError } from 'axios'

import { useMutation, useQuery } from '@tanstack/vue-query'

import type { CategoryInterface } from '@/types/type'

import { useAxios } from '@/composables/use-axios'

export interface QueryCategoriesParams {
  sort?: 'asc' | 'desc'
  sortColumn?: keyof CategoryInterface
  name?: string
  columns?: (keyof CategoryInterface)[]
}

export interface PagedResult<T> {
  data: T[]
  total: number
}

export function useGetCategoriesQuery(params?: QueryCategoriesParams) {
  const { axiosInstance } = useAxios()
  return useQuery<PagedResult<CategoryInterface>, AxiosError>({
    queryKey: ['categories', params],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/category', { params })
      return data
    },
  })
}

export function useGetCategoryQuery(id: number) {
  const { axiosInstance } = useAxios()
  return useQuery<CategoryInterface, AxiosError>({
    queryKey: ['category', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/category/${id}`)
      return data
    },
  })
}

export function useCreateCategoryMutation() {
  const { axiosInstance } = useAxios()
  return useMutation<CategoryInterface, AxiosError, CategoryInterface>({
    mutationKey: ['createCategory'],
    mutationFn: async (payload: CategoryInterface) => {
      const { data } = await axiosInstance.post('/category', payload)
      return data
    },
  })
}

export function useUpdateCategoryMutation() {
  const { axiosInstance } = useAxios()
  return useMutation<CategoryInterface, AxiosError, Partial<CategoryInterface> & { id: number }>({
    mutationKey: ['updateCategory'],
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.put('/category', payload)
      return data
    },
  })
}

export function useDeleteCategoriesMutation() {
  const { axiosInstance } = useAxios()
  return useMutation<any, AxiosError, number[]>({
    mutationKey: ['deleteCategories'],
    mutationFn: async (ids: number[]) => {
      const idsParam = ids.join(',')
      const { data } = await axiosInstance.delete(`/category/${idsParam}`)
      return data
    },
  })
}
