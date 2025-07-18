// src/viewmodels/MusicViewModel.ts
import { ref, computed } from 'vue'
import { MusicService } from '@/models/services/MusicService'
import type { Artist, Album, Track } from '@/models/musicTypes'

/**
 * 音楽関連のViewModel
 */
export class MusicViewModel {
  private musicService: MusicService

  // 状態
  public readonly artists = ref<Artist[]>([])
  public readonly albums = ref<Album[]>([])
  public readonly tracks = ref<Track[]>([])
  public readonly selectedArtist = ref<Artist | null>(null)
  public readonly selectedAlbum = ref<Album | null>(null)
  public readonly isLoading = ref(false)
  public readonly error = ref<string | null>(null)

  // 計算プロパティ
  public readonly hasArtists = computed(() => this.artists.value.length > 0)
  public readonly hasAlbums = computed(() => this.albums.value.length > 0)
  public readonly hasTracks = computed(() => this.tracks.value.length > 0)
  public readonly isArtistSelected = computed(() => this.selectedArtist.value !== null)
  public readonly isAlbumSelected = computed(() => this.selectedAlbum.value !== null)

  constructor() {
    this.musicService = MusicService.getInstance()
  }

  /**
   * 初期化処理
   */
  async initialize(): Promise<void> {
    this.isLoading.value = true
    this.error.value = null

    try {
      this.artists.value = await this.musicService.getArtists()
    } catch (error) {
      this.error.value = error instanceof Error ? error.message : 'アーティストの取得に失敗しました'
      console.error('MusicViewModel.initialize error:', error)
    } finally {
      this.isLoading.value = false
    }
  }

  /**
   * アーティストを選択
   */
  async selectArtist(artist: Artist): Promise<void> {
    if (this.selectedArtist.value === artist) return

    this.isLoading.value = true
    this.error.value = null
    this.selectedArtist.value = artist
    this.selectedAlbum.value = null
    this.albums.value = []
    this.tracks.value = []

    try {
      this.albums.value = await this.musicService.getAlbums(artist)
    } catch (error) {
      this.error.value = error instanceof Error ? error.message : 'アルバムの取得に失敗しました'
      console.error('MusicViewModel.selectArtist error:', error)
    } finally {
      this.isLoading.value = false
    }
  }

  /**
   * アルバムを選択
   */
  async selectAlbum(album: Album): Promise<void> {
    if (this.selectedAlbum.value === album || !this.selectedArtist.value) return

    this.isLoading.value = true
    this.error.value = null
    this.selectedAlbum.value = album
    this.tracks.value = []

    try {
      this.tracks.value = await this.musicService.getTracks(this.selectedArtist.value, album)
    } catch (error) {
      this.error.value = error instanceof Error ? error.message : 'トラックの取得に失敗しました'
      console.error('MusicViewModel.selectAlbum error:', error)
    } finally {
      this.isLoading.value = false
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
    this.error.value = null
  }

  /**
   * アーティストの選択をリセット
   */
  resetArtistSelection(): void {
    this.selectedArtist.value = null
    this.selectedAlbum.value = null
    this.albums.value = []
    this.tracks.value = []
  }

  /**
   * アルバムの選択をリセット
   */
  resetAlbumSelection(): void {
    this.selectedAlbum.value = null
    this.tracks.value = []
  }

  /**
   * アルバムカバーURLを取得
   */
  getAlbumCoverUrl(artist: Artist, album: Album): string {
    return this.musicService.getAlbumCoverUrl(artist, album)
  }
}
