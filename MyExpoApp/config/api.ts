// API Configuration
// 
// IMPORTANT: Expo tunnel (npx expo start --tunnel) only tunnels the Metro bundler,
// NOT your backend API!
//
// OPTION 1: Use Production Backend on Render (Recommended - Always available)
//   ✅ Backend deployed at: https://samaj-app-api.onrender.com
//   ✅ Stays awake with self-ping cron job
//   ✅ Works from any device/network
//
// OPTION 2: Use Local Development Backend
//   1. Start backend: cd backend && npm run dev
//   2. Set USE_PRODUCTION to false below
//
// OPTION 3: Use Cloudflare Tunnel (For local testing with remote access)
//   1. Run: cloudflared tunnel --url http://localhost:3001
//   2. Update TUNNEL_URL below
//
// Toggle between options by changing USE_PRODUCTION below

const USE_PRODUCTION = true; // Set to false for local development, true for production backend

// You can override this without editing code by setting:
// - EXPO_PUBLIC_API_BASE_URL (full base url including /api, e.g. https://samaj-app-api.onrender.com/api)
// OR
// - EXPO_PUBLIC_API_ORIGIN (origin only, e.g. https://samaj-app-api.onrender.com)
const PRODUCTION_URL = 'https://samaj-app-api.onrender.com'; // ✅ Your Render Production URL
const TUNNEL_URL = 'https://subscriber-dublin-acrylic-bloomberg.trycloudflare.com'; // Cloudflare Tunnel (for testing)
const LOCAL_IP = '192.168.1.251'; // Your computer's IP address (local network only)

const envApiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;
const envApiOrigin = process.env.EXPO_PUBLIC_API_ORIGIN;

const normalizeOriginToApiBaseUrl = (origin: string) => {
  const trimmed = origin.trim().replace(/\/+$/, '');
  return `${trimmed}/api`;
};

export const API_BASE_URL = __DEV__
  ? envApiBaseUrl
    ? envApiBaseUrl.trim().replace(/\/+$/, '')
    : envApiOrigin
      ? normalizeOriginToApiBaseUrl(envApiOrigin)
      : USE_PRODUCTION
        ? `${PRODUCTION_URL}/api` // ✅ Using Production Backend on Render (always available)
        : `http://${LOCAL_IP}:3001/api` // Using local development backend
  : envApiBaseUrl
    ? envApiBaseUrl.trim().replace(/\/+$/, '')
    : envApiOrigin
      ? normalizeOriginToApiBaseUrl(envApiOrigin)
      : `${PRODUCTION_URL}/api`; // Production URL
