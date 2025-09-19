import { useAuthStore } from "@/stores/auth"
import { UserInterface } from "@/types/type"

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  function logout() {
    router.push({ path: '/auth/sign-in' })
  }

  function toHome() {
    router.push({ path: '/workspace' })
  }

  function login(token: string, user: UserInterface) {
    authStore.isLogin = true
    authStore.token = token
    authStore.userInfo = user
    toHome()
  }

  return {
    logout,
    login,
  }
}
