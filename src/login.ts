import type { LINEAuthErrorResponse, LINEAuthResponse } from './types'

export interface LINEAuthLoginOptions {
  channelId: string
  state: string
  redirectUrl?: string
  scope?: string
  nonce?: string
  consent?: boolean
  maxAge?: number
  uiLocales?: string
  botPrompt?: 'normal' | 'aggressive'
  initialAmrDisplay?: string
  switchAmr?: boolean
  disableAutoLogin?: boolean
  disableIosAutoLogin?: boolean
  codeChallenge?: string
  codeChallengeMethod?: string
  error?: (response: LINEAuthErrorResponse) => void
}

export function lineAuthLogin(options: LINEAuthLoginOptions) {
  return new Promise<LINEAuthResponse>((resolve, reject) => {
    const {
      channelId,
      state,
      redirectUrl = location.origin,
      scope = 'openid profile',
      nonce,
      consent,
      maxAge,
      uiLocales,
      botPrompt,
      initialAmrDisplay,
      switchAmr,
      disableAutoLogin,
      disableIosAutoLogin,
      codeChallenge,
      codeChallengeMethod,
    } = options

    let result = null as (LINEAuthResponse & LINEAuthErrorResponse) | null

    let url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&&client_id=${channelId}&redirect_uri=${encodeURIComponent(redirectUrl)}&state=${state}&scope=${encodeURIComponent(scope)}`

    if (nonce) url += `&nonce=${nonce}`
    if (consent) url += `&prompt=consent`
    if (maxAge) url += `&max_age=${maxAge}`
    if (uiLocales) url += `&ui_locales=${uiLocales}`
    if (botPrompt) url += `&bot_prompt=${botPrompt}`
    if (initialAmrDisplay) url += `&initial_amr_display=${initialAmrDisplay}`
    if (switchAmr) url += `&switch_amr=${switchAmr ? 'true' : 'false'}`
    if (disableAutoLogin) url += `&disable_auto_login=${disableAutoLogin ? 'true' : 'false'}`
    if (disableIosAutoLogin) url += `&disable_ios_auto_login=${disableIosAutoLogin ? 'true' : 'false'}`
    if (codeChallenge) url += `&code_challenge=${codeChallenge}`
    if (codeChallengeMethod) url += `&code_challenge_method=${codeChallengeMethod}`

    const width = Math.min(500, window.screen.width - 40)
    const height = Math.min(550, window.screen.height - 40)

    const features = [
      'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=no',
      `width=${width}`,
      `height=${height}`,
      `top=${window.screen.height / 2 - height / 2}`,
      `left=${window.screen.width / 2 - width / 2}`,
    ].join()

    const popupWindow = window.open(url, 'line_login', features)
    if (!popupWindow || popupWindow.closed || typeof popupWindow.closed === 'undefined') {
      console.error(`Failed to open popup window on url: ${url}. Maybe blocked by the browser?`)
      return
    }

    window.addEventListener('message', e => {
      if (location.origin === e.origin && e.data.command === 'close') {
        result = e.data.data
        popupWindow.close()
      }
    })

    let timer: ReturnType<typeof setInterval> | null = null
    timer = setInterval(() => {
      if (!popupWindow || popupWindow.closed || typeof popupWindow.closed === 'undefined') {
        if (timer !== null) {
          clearInterval(timer)
        }
        timer = null
        if (result !== null) {
          if ('code' in result && 'state' in result && result.state === state) {
            resolve(result as LINEAuthResponse)
          } else {
            options.error?.(result)
            reject(new Error('Login failed'))
          }
        } else {
          reject(new Error('Popup window closed'))
        }
      }
    }, 500)

    popupWindow.focus()
  })
}
