import type { AxiosError } from 'axios'

import { useMutation, useQuery } from '@tanstack/vue-query'

import type { UserInterface } from '@/types/type'

import { useAxios } from '@/composables/use-axios'

// Query params type based on server QueryUserDto
export interface QueryUsersParams {
  sort?: 'asc' | 'desc'
  sortColumn?: keyof UserInterface
  username?: string
  columns?: (keyof UserInterface)[]
}

export interface PagedResult<T> {
  data: T[]
  total: number
}

export function useGetUsersQuery() {
  const { axiosInstance } = useAxios()
  return useQuery<PagedResult<UserInterface>, AxiosError>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/user')
      return data
    },
  })
}

export function useGetUserQuery(id: number) {
  const { axiosInstance } = useAxios()
  return useQuery<UserInterface, AxiosError>({
    queryKey: ['user', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/user/${id}`)
      return data
    },
  })
}

export function useCreateUserMutation() {
  const { axiosInstance } = useAxios()
  return useMutation<UserInterface, AxiosError, UserInterface>({
    mutationKey: ['createUser'],
    mutationFn: async (payload: UserInterface) => {
      const { data } = await axiosInstance.post('/user', payload)
      return data
    },
  })
}

export function useUpdateUserMutation() {
  const { axiosInstance } = useAxios()
  return useMutation<UserInterface, AxiosError, Partial<UserInterface> & { id: number }>({
    mutationKey: ['updateUser'],
    mutationFn: async (payload) => {
      const { data } = await axiosInstance.put('/user', payload)
      return data
    },
  })
}

export function useDeleteUsersMutation() {
  const { axiosInstance } = useAxios()
  // server expects /user/:ids where :ids could be an array path param; we'll send comma-separated list
  return useMutation<any, AxiosError, number[]>({
    mutationKey: ['deleteUsers'],
    mutationFn: async (ids: number[]) => {
      const idsParam = ids.join(',')
      const { data } = await axiosInstance.delete(`/user/${idsParam}`)
      return data
    },
  })
}
