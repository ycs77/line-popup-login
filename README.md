# LINE Login with Popup Modal package for JavaScript

[![NPM version][ico-version]][link-npm]
[![Software License][ico-license]](LICENSE)
[![GitHub Tests Action Status][ico-github-action]][link-github-action]
[![Total Downloads][ico-downloads]][link-downloads]

> This package status is experimental, it works on Windows 11 desktops but can't work on mobile, please don't use it for production.

## Installation

Install the package:

```bash
npm i inertia-plugin
# or
yarn add inertia-plugin
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
  channelId: YOUR_LINE_CHANNEL_ID,
  state: SET_RANDOM_TEXT,
  redirectUrl: `${location.origin}/line-callback.html`,
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
[ico-github-action]: https://img.shields.io/github/actions/workflow/status/ycs77/line-popup-login/tests.yml?branch=main&label=tests&style=flat-square
[ico-downloads]: https://img.shields.io/npm/dt/line-popup-login?style=flat-square

[link-npm]: https://www.npmjs.com/package/line-popup-login
[link-github-action]: https://github.com/ycs77/line-popup-login/actions/workflows/tests.yml?query=branch%3Amain
[link-downloads]: https://www.npmjs.com/package/line-popup-login
