import type { AxiosError } from 'axios'
import { useQuery } from '@tanstack/vue-query'
import { useAxios } from '@/composables/use-axios'

export interface DashboardStats {
  totalResources: number
  totalUsers: number
  totalCategories: number
  totalDownloads: number
  topUploaders: TopUploaderStats[]
  topCategories: TopCategoryStats[]
  recentResources: RecentResourceStats[]
  downloadTrends: DownloadTrendStats[]
}

export interface TopUploaderStats {
  userId: number
  username: string
  avatar?: string
  resourceCount: number
  totalDownloads: number
}

export interface TopCategoryStats {
  categoryId: number
  categoryName: string
  resourceCount: number
  totalDownloads: number
}

export interface RecentResourceStats {
  id: number
  name: string
  username: string
  categoryName: string
  downloadCount: number
  createDate: Date
}

export interface DownloadTrendStats {
  date: string
  downloads: number
}

export function useGetDashboardStatsQuery() {
  const { axiosInstance } = useAxios()
  return useQuery<DashboardStats, AxiosError>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/statistic/dashboard')
      return data
    },
  })
}