// Values are loaded from .env.local file with VITE_ prefix
export const weatherBackendUrl = import.meta.env.VITE_WEATHER_BACKEND_URL ?? 'http://localhost:3001'
export const HSL_API_KEY = import.meta.env.VITE_HSL_API_KEY
