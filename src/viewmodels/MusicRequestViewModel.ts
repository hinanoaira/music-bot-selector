import { ref, computed } from 'vue'
import { MusicRequestModel } from '@/models/MusicRequestModel'
import type { Artist, Album, Track } from '@/models/types/musicTypes'

/**
 * 音楽リクエスト画面のViewModel
 * 音楽データ管理、リクエスト処理を担当
 */
export class MusicRequestViewModel {
  private musicRequestModel: MusicRequestModel

  public readonly artists = ref<Artist[]>([])
  public readonly albums = ref<Album[]>([])
  public readonly tracks = ref<Track[]>([])
  public readonly selectedArtist = ref<Artist | null>(null)
  public readonly selectedAlbum = ref<Album | null>(null)
  public readonly isLoading = ref(false)
  public readonly error = ref<string | null>(null)

  public readonly isRequestingTrack = ref(false)
  public readonly isRequestingYoutube = ref(false)
  public readonly requestError = ref<string | null>(null)

  private eventListeners: {
    requestSuccess: Array<(message: string) => void>
    requestError: Array<(message: string) => void>
  } = {
    requestSuccess: [],
    requestError: [],
  }

  public readonly hasArtists = computed(() => this.artists.value.length > 0)
  public readonly hasAlbums = computed(() => this.albums.value.length > 0)
  public readonly hasTracks = computed(() => this.tracks.value.length > 0)
  public readonly isArtistSelected = computed(() => this.selectedArtist.value !== null)
  public readonly isAlbumSelected = computed(() => this.selectedAlbum.value !== null)

  constructor() {
    this.musicRequestModel = MusicRequestModel.getInstance()
  }

  /**
   * イベントリスナーを追加
   */
  addEventListener<T extends keyof typeof this.eventListeners>(
    event: T,
    listener: (typeof this.eventListeners)[T][0],
  ): void {
    this.eventListeners[event].push(listener as never)
  }

  /**
   * イベントリスナーを削除
   */
  removeEventListener<T extends keyof typeof this.eventListeners>(
    event: T,
    listener: (typeof this.eventListeners)[T][0],
  ): void {
    const index = this.eventListeners[event].indexOf(listener as never)
    if (index > -1) {
      this.eventListeners[event].splice(index, 1)
    }
  }

  /**
   * イベントを発火
   */
  private emit<T extends keyof typeof this.eventListeners>(
    event: T,
    ...args: Parameters<(typeof this.eventListeners)[T][0]>
  ): void {
    this.eventListeners[event].forEach((listener) => {
      ;(listener as (...args: unknown[]) => void)(...args)
    })
  }

  /**
   * 初期化処理
   */
  async initialize(): Promise<void> {
    this.isLoading.value = true
    this.error.value = null

    try {
      this.artists.value = await this.musicRequestModel.getArtists()
    } catch (error) {
      this.error.value = error instanceof Error ? error.message : 'アーティストの取得に失敗しました'
      console.error('IntegratedMusicRequestViewModel.initialize error:', error)
    } finally {
      this.isLoading.value = false
    }
  }

  /**
   * アーティストを選択
   */
  async selectArtist(artist: Artist): Promise<void> {
    if (this.musicRequestModel.shouldResetAlbumSelection(this.selectedArtist.value, artist)) {
      this.selectedAlbum.value = null
      this.tracks.value = []
    }

    this.selectedArtist.value = artist
    this.albums.value = []

    try {
      this.albums.value = await this.musicRequestModel.selectArtist(artist)
    } catch (error) {
      this.error.value = error instanceof Error ? error.message : 'アルバムの取得に失敗しました'
      console.error('selectArtist error:', error)
    }
  }

  /**
   * アルバムを選択
   */
  async selectAlbum(album: Album): Promise<void> {
    if (this.musicRequestModel.shouldResetTrackSelection(this.selectedAlbum.value, album)) {
      this.tracks.value = []
    }

    this.selectedAlbum.value = album

    if (!this.selectedArtist.value) return

    try {
      this.tracks.value = await this.musicRequestModel.selectAlbum(this.selectedArtist.value, album)
    } catch (error) {
      this.error.value = error instanceof Error ? error.message : 'トラックの取得に失敗しました'
      console.error('selectAlbum error:', error)
    }
  }

  /**
   * 選択状態をリセット
   */
  resetSelection(): void {
    this.selectedArtist.value = null
    this.selectedAlbum.value = null
    this.albums.value = []
    this.tracks.value = []
  }

  /**
   * アルバム選択をリセット
   */
  resetAlbumSelection(): void {
    this.selectedAlbum.value = null
    this.tracks.value = []
  }

  /**
   * 通常のトラックをリクエスト
   */
  async requestTrack(track: Track, guildId: string | null): Promise<void> {
    if (
      !this.musicRequestModel.validateTrackRequest(
        this.selectedArtist.value,
        this.selectedAlbum.value,
        track,
        guildId || '',
      )
    ) {
      this.handleRequestError('必要なパラメータが不足しています')
      return
    }

    this.isRequestingTrack.value = true
    this.requestError.value = null

    try {
      await this.musicRequestModel.requestTrack({
        artist: this.selectedArtist.value!,
        album: this.selectedAlbum.value!,
        track,
        guildId: guildId!,
      })
      this.handleRequestSuccess(`「${track}」をリクエストしました`)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'リクエストに失敗しました'
      this.handleRequestError(message)
    } finally {
      this.isRequestingTrack.value = false
    }
  }

  /**
   * YouTubeトラックをリクエスト
   */
  async requestYoutubeTrack(url: string, guildId: string | null): Promise<void> {
    if (!this.musicRequestModel.validateYoutubeRequest(url, guildId || '')) {
      this.handleRequestError('URLまたはguildIdが不足しています')
      return
    }

    this.isRequestingYoutube.value = true
    this.requestError.value = null

    try {
      await this.musicRequestModel.requestYoutubeTrack({ url, guildId: guildId! })
      this.handleRequestSuccess('YouTubeトラックをリクエストしました')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'YouTubeリクエストに失敗しました'
      this.handleRequestError(message)
    } finally {
      this.isRequestingYoutube.value = false
    }
  }

  /**
   * アルバムカバーURLを取得
   */
  getAlbumCoverUrl(artist: Artist, album: Album): string {
    return this.musicRequestModel.getAlbumCoverUrl(artist, album)
  }

  /**
   * リクエスト成功時の処理
   */
  private handleRequestSuccess(message: string): void {
    this.emit('requestSuccess', message)
  }

  /**
   * リクエストエラー時の処理
   */
  private handleRequestError(message: string): void {
    this.requestError.value = message
    this.emit('requestError', message)
  }
}
