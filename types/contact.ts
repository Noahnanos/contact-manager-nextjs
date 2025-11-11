export interface Contact {
  id: number
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  address?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  details?: Record<string, unknown>[]
}

export interface ContactsResponse {
  contacts: Contact[]
  total: number
}