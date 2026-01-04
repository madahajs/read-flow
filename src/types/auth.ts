export interface User {
  id: string
  email: string
  username?: string
  nickname?: string
}

export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  email: string
  password: string
  username?: string
}

export interface AuthResponse {
  code: number
  message: string
  data: {
    token: string
    user: User
  }
}
