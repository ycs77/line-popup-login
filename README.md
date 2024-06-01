# LINE Login with Popup Modal

[![NPM version][ico-version]][link-npm]
[![Software License][ico-license]](LICENSE)
[![Total Downloads][ico-downloads]][link-downloads]

> This package status is experimental, it works on Windows 11 desktops but can't work on mobile, please don't use it for production.

## Installation

Install the package:

```bash
npm i line-popup-login
# or
yarn add line-popup-login
```

Then add the callback page `line-callback.html` into the `public` folder (static assets folder):

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>LINE OAuth 2 Callback</title>
</head>
<body>
  <script>
  const searchParams = window.location.search
    .replace(/^\?/, '')
    .split('&')
    .reduce((carry, item) => {
      const [key, value] = item.split('=')
      return { ...carry, [key]: value }
    }, {})

  window.opener.postMessage({
    command: 'close',
    data: searchParams,
  }, '*')
  </script>
</body>
</html>
```

## Usage

Call `lineAuthLogin()` when you want to log in with LINE:

```js
lineAuthLogin({
  client_id: YOUR_LINE_CHANNEL_ID,
  scope: 'profile openid',
  state: SET_RANDOM_TEXT,
  redirect_uri: `${location.origin}/line-callback.html`,
}).then(res => {
  console.log('Handle the LINE response', res)
}).catch(error => {
  console.error(error)
})
```

## License

[MIT LICENSE](LICENSE)

[ico-version]: https://img.shields.io/npm/v/line-popup-login?style=flat-square
[ico-license]: https://img.shields.io/badge/license-MIT-brightgreen?style=flat-square
[ico-downloads]: https://img.shields.io/npm/dt/line-popup-login?style=flat-square

[link-npm]: https://www.npmjs.com/package/line-popup-login
[link-downloads]: https://www.npmjs.com/package/line-popup-login
