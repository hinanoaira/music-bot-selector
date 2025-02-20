// 例: composables/useGuildParam.ts
import { ref } from 'vue'

/**
 * クエリパラメータから guildid を取得して返す
 * もし無ければ null
 */
export function useGuildParam() {
  const guildId = ref<string | null>(null)

  // パース
  const searchParams = new URLSearchParams(window.location.search)
  const param = searchParams.get('guildid') // 例: "?guildid=1005418663731531807"

  // 無い場合はnull
  guildId.value = param ? param : null

  return {
    guildId,
  }
}
