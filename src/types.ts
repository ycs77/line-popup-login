export interface LINEAuthResponse {
  code: string
  state: string
}

export interface LINEAuthErrorResponse {
  error: string
  error_description?: string
  state?: string
}
