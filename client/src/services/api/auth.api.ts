import type { AxiosError } from 'axios'

import { useMutation } from '@tanstack/vue-query'

import type { UserInterface } from '@/types/type'

import { useAxios } from '@/composables/use-axios'

// 登录接口返回类型
interface ILoginResponse {
  accessToken: string
  user: UserInterface
}

// 登录 Mutation
export function useLoginMutation() {
  const { axiosInstance } = useAxios()
  return useMutation<ILoginResponse, AxiosError, UserInterface>({
    mutationKey: ['useLoginMutation'],
    mutationFn: async (data: UserInterface) => {
      const response = await axiosInstance.post('/auth/signin', data)
      return response.data
    },
  })
}

// 注册 Mutation
export function useRegisterMutation() {
  const { axiosInstance } = useAxios()
  return useMutation<UserInterface, AxiosError, UserInterface>({
    mutationKey: ['useRegisterMutation'],
    mutationFn: async (data: UserInterface) => {
      const response = await axiosInstance.post('/auth/signup', data)
      return response.data
    },
  })
}
