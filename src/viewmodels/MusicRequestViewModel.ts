import { ref, computed } from 'vue'
import { MusicRequestModel } from '@/models/MusicRequestModel'
import { useToastStore } from '@/stores/toast.store'
import type { Artist, Album, Track } from '@/models/types/music-types'

/**
 * 音楽リクエスト画面のViewModel
 * 音楽リクエストの表示制御、UI ロジックを担当
 */
export class MusicRequestViewModel {
  private musicRequestModel = new MusicRequestModel()
  private toastStore = useToastStore()

  private _artists = ref<Artist[]>([])
  private _albums = ref<Album[]>([])
  private _tracks = ref<Track[]>([])
  private _selectedArtist = ref<Artist | null>(null)
  private _selectedAlbum = ref<Album | null>(null)
  private _isLoading = ref(false)
  private _error = ref<string | null>(null)
  private _isRequestingTrack = ref(false)
  private _isRequestingYoutube = ref(false)

  constructor() {
    this.initializeData()
  }

  /** アーティスト一覧 */
  public readonly artists = computed(() => this._artists.value)

  /** アルバム一覧 */
  public readonly albums = computed(() => this._albums.value)

  /** トラック一覧 */
  public readonly tracks = computed(() => this._tracks.value)

  /** 選択中のアーティスト */
  public readonly selectedArtist = computed(() => this._selectedArtist.value)

  /** 選択中のアルバム */
  public readonly selectedAlbum = computed(() => this._selectedAlbum.value)

  /** ローディング状態 */
  public readonly isLoading = computed(() => this._isLoading.value)

  /** エラー状態 */
  public readonly error = computed(() => this._error.value)

  /** トラックリクエスト中かどうか */
  public readonly isRequestingTrack = computed(() => this._isRequestingTrack.value)

  /** YouTubeリクエスト中かどうか */
  public readonly isRequestingYoutube = computed(() => this._isRequestingYoutube.value)

  /** アーティストが存在するかどうか */
  public readonly hasArtists = computed(() => this._artists.value.length > 0)

  /** アルバムが存在するかどうか */
  public readonly hasAlbums = computed(() => this._albums.value.length > 0)

  /** トラックが存在するかどうか */
  public readonly hasTracks = computed(() => this._tracks.value.length > 0)

  /** アーティストが選択されているかどうか */
  public readonly isArtistSelected = computed(() => this._selectedArtist.value !== null)

  /** アルバムが選択されているかどうか */
  public readonly isAlbumSelected = computed(() => this._selectedAlbum.value !== null)

  /**
   * 初期データの取得
   */
  private async initializeData(): Promise<void> {
    try {
      this._isLoading.value = true
      const artists = await this.musicRequestModel.getArtists()
      this._artists.value = artists
    } catch (error) {
      console.error('MusicRequestViewModel initialization failed:', error)
      this._artists.value = []
      this._error.value = 'アーティスト一覧の取得に失敗しました'
    } finally {
      this._isLoading.value = false
    }
  }

  /**
   * アーティストを選択
   */
  public async selectArtist(artist: Artist): Promise<void> {
    try {
      this._isLoading.value = true
      this._error.value = null

      const shouldResetAlbum = this.musicRequestModel.shouldResetAlbumSelection(
        this._selectedArtist.value,
        artist,
      )

      if (shouldResetAlbum) {
        this._selectedAlbum.value = null
        this._tracks.value = []
      }

      this._selectedArtist.value = artist

      const albums = await this.musicRequestModel.getAlbums(artist)
      this._albums.value = albums
    } catch (error) {
      this._error.value = error instanceof Error ? error.message : 'アーティスト選択に失敗しました'
      this.toastStore.showErrorToast('アルバム取得に失敗しました')
    } finally {
      this._isLoading.value = false
    }
  }

  /**
   * アルバムを選択
   */
  public async selectAlbum(album: Album): Promise<void> {
    if (!this.selectedArtist.value) {
      this._error.value = 'アーティストが選択されていません'
      return
    }

    try {
      this._isLoading.value = true
      this._error.value = null

      this._selectedAlbum.value = album

      const tracks = await this.musicRequestModel.getTracks(this.selectedArtist.value, album)
      this._tracks.value = tracks
    } catch (error) {
      this._error.value = error instanceof Error ? error.message : 'アルバム選択に失敗しました'
      this.toastStore.showErrorToast('トラック取得に失敗しました')
    } finally {
      this._isLoading.value = false
    }
  }

  /**
   * トラックをリクエスト
   */
  public async requestTrack(track: Track, guildId: string): Promise<void> {
    if (!this.selectedArtist.value || !this.selectedAlbum.value) {
      this.toastStore.showErrorToast('リクエストに必要な情報が不足しています')
      throw new Error('リクエストできない状態です')
    }

    try {
      this._isRequestingTrack.value = true
      this._error.value = null

      await this.musicRequestModel.requestTrack({
        artist: this.selectedArtist.value,
        album: this.selectedAlbum.value,
        track,
        guildId,
      })

      this.toastStore.showSuccessToast('トラックをリクエストしました')
    } catch (error) {
      this._error.value =
        error instanceof Error ? error.message : 'トラックリクエストに失敗しました'
      this.toastStore.showErrorToast('トラックリクエストに失敗しました')
    } finally {
      this._isRequestingTrack.value = false
    }
  }

  /**
   * YouTubeをリクエスト
   */
  public async requestYoutube(url: string, guildId: string): Promise<void> {
    if (!this.musicRequestModel.validateYoutubeRequest(url, guildId)) {
      this.toastStore.showErrorToast('URLまたはギルドIDが無効です')
      throw new Error('リクエストできない状態です')
    }

    try {
      this._isRequestingYoutube.value = true
      this._error.value = null

      await this.musicRequestModel.requestYoutubeTrack({ url, guildId })

      this.toastStore.showSuccessToast('YouTubeをリクエストしました')
    } catch (error) {
      this._error.value = error instanceof Error ? error.message : 'YouTubeリクエストに失敗しました'
      this.toastStore.showErrorToast('YouTubeリクエストに失敗しました')
    } finally {
      this._isRequestingYoutube.value = false
    }
  }

  /**
   * アルバムカバー画像のURLを取得
   */
  public getAlbumCoverUrl(artist: string, album: string): string {
    return this.musicRequestModel.getAlbumCoverUrl(artist, album)
  }

  /**
   * 選択状態をリセット
   */
  public resetSelection(): void {
    this._selectedArtist.value = null
    this._selectedAlbum.value = null
    this._albums.value = []
    this._tracks.value = []
  }

  /**
   * アルバム選択のリセット（アーティスト選択は保持）
   */
  public resetAlbumSelection(): void {
    if (this.selectedArtist.value) {
      this.resetSelection()
      this.selectArtist(this.selectedArtist.value)
    }
  }
}
