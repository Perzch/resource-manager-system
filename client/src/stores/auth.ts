import { defineStore } from 'pinia'

import type { UserInterface } from '@/types/type'

export const useAuthStore = defineStore('user', () => {
  const isLogin = ref(false)
  const token = ref('')
  const userInfo = ref<UserInterface>({})
  return {
    isLogin,
    token,
    userInfo,
  }
}, {
  persist: true,
})
