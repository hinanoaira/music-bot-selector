// src/viewmodels/MusicRequestViewModel.ts
import { ref } from 'vue'
import { MusicService } from '@/models/services/MusicService'
import type { Artist, Album, Track } from '@/models/musicTypes'

/**
 * 音楽リクエストのViewModel
 */
export class MusicRequestViewModel {
  private musicService: MusicService

  // 状態
  public readonly isRequestingTrack = ref(false)
  public readonly isRequestingYoutube = ref(false)
  public readonly requestError = ref<string | null>(null)

  // 成功・エラーコールバック
  public onRequestSuccess: ((message: string) => void) | null = null
  public onRequestError: ((message: string) => void) | null = null

  constructor() {
    this.musicService = MusicService.getInstance()
  }

  /**
   * 通常のトラックをリクエスト
   */
  async requestTrack(
    artist: Artist | null,
    album: Album | null,
    track: Track,
    guildId: string | null,
  ): Promise<void> {
    if (!artist || !album || !guildId) {
      this.handleError('必要な情報が不足しています')
      return
    }

    this.isRequestingTrack.value = true
    this.requestError.value = null

    try {
      await this.musicService.requestTrack({ artist, album, track, guildId })
      this.handleSuccess(`「${track}」をリクエストしました！`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'リクエストに失敗しました'
      this.handleError(message)
    } finally {
      this.isRequestingTrack.value = false
    }
  }

  /**
   * YouTubeトラックをリクエスト
   */
  async requestYoutubeTrack(url: string, guildId: string | null): Promise<void> {
    if (!guildId) {
      this.handleError('ギルドIDが設定されていません')
      return
    }

    this.isRequestingYoutube.value = true
    this.requestError.value = null

    try {
      await this.musicService.requestYoutubeTrack({ url, guildId })
      this.handleSuccess('YouTubeトラックをリクエストしました！')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'YouTubeリクエストに失敗しました'
      this.handleError(message)
    } finally {
      this.isRequestingYoutube.value = false
    }
  }

  /**
   * リクエスト処理中かどうか
   */
  get isRequesting(): boolean {
    return this.isRequestingTrack.value || this.isRequestingYoutube.value
  }

  /**
   * 成功時の処理
   */
  private handleSuccess(message: string): void {
    if (this.onRequestSuccess) {
      this.onRequestSuccess(message)
    }
  }

  /**
   * エラー時の処理
   */
  private handleError(message: string): void {
    this.requestError.value = message
    if (this.onRequestError) {
      this.onRequestError(message)
    }
  }
}
