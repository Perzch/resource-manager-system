import type { AxiosError } from 'axios'

import { useMutation } from '@tanstack/vue-query'

import { useAxios } from '@/composables/use-axios'

export interface UploadSignatureResponse {
  bucketName: string
  fileKey: string
  presignedUrl: string
}

export function useGetUploadSignatureMutation() {
  const { axiosInstance } = useAxios()
  return useMutation<UploadSignatureResponse, AxiosError, string>({
    mutationKey: ['getUploadSignature'],
    mutationFn: async (fileType: string) => {
      const { data } = await axiosInstance.get(`/getSignature/${fileType}`)
      return data
    },
  })
}

export async function uploadFileToPresignedUrl(presignedUrl: string, file: File): Promise<void> {
  const response = await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }
}
