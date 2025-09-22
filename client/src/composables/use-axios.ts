import type { AxiosError } from 'axios'

import axios from 'axios'
import { toast } from 'vue-sonner'

import { useAuthStore } from '@/stores/auth'
import env from '@/utils/env'

export function useAxios() {
  const axiosInstance = axios.create({
    baseURL: env.VITE_SERVER_API_URL + env.VITE_SERVER_API_PREFIX,
    timeout: env.VITE_SERVER_API_TIMEOUT,
  })
  axiosInstance.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  }, (error) => {
    return Promise.reject(error)
  })

  axiosInstance.interceptors.response.use((response) => {
    if (response.data.code !== 200) {
      toast(response.data.message || '请求错误', {
        position: 'top-center',
      })
      return Promise.reject(new Error(response.data.message || 'Error'))
    }
    return response.data
  }, (error: AxiosError) => {
    if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
      toast(error.response.data.message || '请求错误', {
        position: 'top-center',
      })
    }
    if (error.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }
    return Promise.reject(error)
  })

  return {
    axiosInstance,
  }
}
