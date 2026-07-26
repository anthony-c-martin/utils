# Ant's Utils

A small collection of minimal, self-contained web utilities I find useful for day-to-day life — built to avoid depending on 3rd party tools that are commonly full of ads and visual distractions. Think of it like a personal recipe site, but for tools.

Everything runs client-side in the browser, and the app works offline as a PWA.

## Utilities

- **Text Utils** — common text transformations.
- **Conversions** — convert between everyday formats and units.
- **Baking** — baking-related calculations and conversions.
- **QR Code** — generate QR codes from text.
- **Quick Share** — encode text into a compressed, shareable link (and QR code).
- **Generation** — generate GUIDs and random passwords.
- **Matter** — Matter/smart-home related helpers.

## Tech stack

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) with [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)
- [React Bootstrap](https://react-bootstrap.netlify.app/)

## Getting started

```bash
npm install       # install dependencies
npm run dev       # start the dev server
npm run build     # type-check and build for production
npm run preview   # preview the production build
npm run lint      # run ESLint
npm test          # run the test suite
```

## License

See [LICENSE](LICENSE).
