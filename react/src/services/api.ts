import axios from 'axios'

export const BASE_URL = 'https://to-dos-api.softclub.tj'

export interface ApiResponse<T> {
  data: T
  errors: string[]
  statusCode: number
}

const api = axios.create({
  baseURL: BASE_URL,
})

api.interceptors.response.use((response) => {
  const errors = response.data?.errors
  if (Array.isArray(errors) && errors.length > 0) {
    return Promise.reject(new Error(errors.join(', ')))
  }
  return response
})

export function getImageUrl(imageName: string) {
  return `${BASE_URL}/images/${imageName}`
}

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Cannot connect to the server. Check your internet connection or try again later.'
    }

    const responseData = error.response.data
    if (responseData && responseData.errors) {
      if (Array.isArray(responseData.errors)) {
        return responseData.errors.join(', ')
      }
      const errorMessages = Object.values(responseData.errors).flat()
      return errorMessages.join(', ')
    }

    return `Server error: ${error.response.status}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong'
}

export default api
