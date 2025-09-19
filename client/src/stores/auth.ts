import { UserInterface } from '@/types/type'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('user', () => {
  const isLogin = ref(false)
  const token = ref('')
  const userInfo = ref<UserInterface>({})
  return {
    isLogin,
    token,
    userInfo,
  }
})
