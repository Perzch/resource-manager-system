import { defineStore } from 'pinia'

import type { UserInterface } from '@/types/type'

export const useAuthStore = defineStore('user', () => {
  const router = useRouter()
  const isLogin = ref(false)
  const token = ref('')
  const userInfo = ref<UserInterface>({})
  const logout = () => {
    isLogin.value = false
    token.value = ''
    userInfo.value = {}
    router.push({ path: '/auth/sign-in' })
  }
  return {
    isLogin,
    token,
    userInfo,
    logout,
  }
}, {
  persist: true,
})
