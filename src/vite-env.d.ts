/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEATHER_API_KEY: string
  readonly VITE_GIPHY_API_KEY: string
  readonly VITE_HSL_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
