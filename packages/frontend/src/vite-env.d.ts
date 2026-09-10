/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEATHER_BACKEND_URL?: string
  readonly VITE_HSL_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
