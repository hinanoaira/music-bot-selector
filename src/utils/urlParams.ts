// src/utils/urlParams.ts

/**
 * URLクエリパラメータからguildIdを取得
 */
export function getGuildIdFromUrl(): string | null {
  const searchParams = new URLSearchParams(window.location.search)
  return searchParams.get('guildid')
}
