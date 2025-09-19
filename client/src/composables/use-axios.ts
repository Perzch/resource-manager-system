import type { AxiosError } from 'axios'

import axios from 'axios'
import { toast } from 'vue-sonner'

import env from '@/utils/env'

export function useAxios() {
  const axiosInstance = axios.create({
    baseURL: env.VITE_SERVER_API_URL + env.VITE_SERVER_API_PREFIX,
    timeout: env.VITE_SERVER_API_TIMEOUT,
  })
  axiosInstance.interceptors.request.use((config) => {
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  axiosInstance.interceptors.response.use((response) => {
    if (response.data.code !== 200) {
      toast.error(response.data.message || '请求错误')
      return Promise.reject(new Error(response.data.message || 'Error'))
    }
    return response.data
  }, (error: AxiosError) => {
    if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
      toast.error(error.response.data.message || '请求错误')
    }
    return Promise.reject(error)
  })

  return {
    axiosInstance,
  }
}
