# NextJS DevTools (Unofficial)

This extension to provide some insights about which page props are being loaded
on the initial page load for hydration.

## Chrome Web Store

[Next DevTools on Chrome Web Store](https://chrome.google.com/webstore/detail/next-devtools/admidbamafmdejfidoeijgghcffngbmp)

## Features

- On initial load a badge on the Extension icon will display the size of props in bytes.
- A DevTools panel will look for the requests made by NextJS to preload page
  props on `Link` component and will display the size of the corresponding
  page props in bytes.

![Screenshot](./assets/screenshot.png)
