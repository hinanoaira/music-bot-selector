// src/config/api.ts
export const API_CONFIG = {
  BASE_URL: 'https://msbot-api.home.hinasense.jp',
  WS_URL: 'wss://msbot-api.home.hinasense.jp',
  ENDPOINTS: {
    ARTIST: '/artist',
    ALBUM: (artist: string) => `/artist/${encodeURIComponent(artist)}`,
    TRACK: (artist: string, album: string) =>
      `/artist/${encodeURIComponent(artist)}/${encodeURIComponent(album)}`,
    REQUEST_PLAY: (artist: string, album: string, track: string) =>
      `/requestplay/${encodeURIComponent(artist)}/${encodeURIComponent(album)}/${encodeURIComponent(track)}`,
    YOUTUBE_PLAY: (url: string) => `/youtubeplay/${encodeURIComponent(url)}`,
    COVER: (artist: string, album: string) =>
      `/cover/${encodeURIComponent(artist)}/${encodeURIComponent(album)}`,
    SKIP: '/skip',
  },
} as const
