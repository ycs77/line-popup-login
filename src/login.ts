import type { LINEAuthErrorResponse, LINEAuthResponse } from './types'

export interface LINEAuthLoginOptions {
  client_id: string
  state: string
  redirect_uri: string
  scope: string
  nonce?: string
  consent?: boolean
  max_age?: number
  ui_locales?: string
  bot_prompt?: 'normal' | 'aggressive'
  initial_amr_display?: string
  switch_amr?: boolean
  disable_auto_login?: boolean
  disable_ios_auto_login?: boolean
  code_challenge?: string
  code_challenge_method?: string
  error?: (response: LINEAuthErrorResponse) => void
}

export function lineAuthLogin(options: LINEAuthLoginOptions) {
  return new Promise<LINEAuthResponse>((resolve, reject) => {
    const {
      client_id,
      state,
      redirect_uri,
      scope,
      nonce,
      consent,
      max_age,
      ui_locales,
      bot_prompt,
      initial_amr_display,
      switch_amr,
      disable_auto_login,
      disable_ios_auto_login,
      code_challenge,
      code_challenge_method,
    } = options

    let result = null as (LINEAuthResponse & LINEAuthErrorResponse) | null

    let url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${state}&scope=${encodeURIComponent(scope)}`

    if (nonce) url += `&nonce=${nonce}`
    if (consent) url += `&prompt=consent`
    if (max_age) url += `&max_age=${max_age}`
    if (ui_locales) url += `&ui_locales=${ui_locales}`
    if (bot_prompt) url += `&bot_prompt=${bot_prompt}`
    if (initial_amr_display) url += `&initial_amr_display=${initial_amr_display}`
    if (switch_amr) url += `&switch_amr=${switch_amr ? 'true' : 'false'}`
    if (disable_auto_login) url += `&disable_auto_login=${disable_auto_login ? 'true' : 'false'}`
    if (disable_ios_auto_login) url += `&disable_ios_auto_login=${disable_ios_auto_login ? 'true' : 'false'}`
    if (code_challenge) url += `&code_challenge=${code_challenge}`
    if (code_challenge_method) url += `&code_challenge_method=${code_challenge_method}`

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
