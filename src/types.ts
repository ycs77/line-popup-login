export interface LINEAuthResponse {
  code: string
  state: string
  friendship_status_changed?: boolean
  liffClientId?: string
  liffRedirectUri?: string
  lineAppVersion?: string
}

export interface LINEAuthErrorResponse {
  error: string
  error_description?: string
  state?: string
}
