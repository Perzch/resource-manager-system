import type { UserInterface } from '@/types/type'

import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  function logout() {
    authStore.isLogin = false
    authStore.token = ''
    authStore.userInfo = {}
    router.push({ path: '/auth/sign-in' })
  }

  function toHome() {
    router.push({ path: '/dashboard' })
  }

  function login({ accessToken, user }: { accessToken: string, user: UserInterface }) {
    authStore.isLogin = true
    authStore.token = accessToken
    authStore.userInfo = user
    toHome()
  }

  return {
    logout,
    login,
  }
}
