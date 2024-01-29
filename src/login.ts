import type { LINEAuthErrorResponse, LINEAuthResponse } from './types'

export function lineAuthLogin(options: {
  channelId: string
  state: string
  redirectUrl?: string
  scope?: string
  error?: (response: LINEAuthErrorResponse) => void
}) {
  return new Promise<LINEAuthResponse>((resolve, reject) => {
    const {
      channelId,
      state,
      redirectUrl = location.origin,
      scope = 'openid profile',
    } = options

    let result = null as (LINEAuthResponse & LINEAuthErrorResponse) | null

    const url = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&&client_id=${channelId}&redirect_uri=${encodeURIComponent(redirectUrl)}&state=${state}&scope=${encodeURIComponent(scope)}`

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
