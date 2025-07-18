// src/viewmodels/NavigationViewModel.ts
import { ref } from 'vue'
import type { Artist, Album } from '@/models/musicTypes'

/**
 * ナビゲーション関連のViewModel
 */
export class NavigationViewModel {
  // 状態
  public readonly navigationHistory = ref<string[]>([])
  public readonly currentScrollPosition = ref(0)

  /**
   * 現在のスクロール位置を保存
   */
  saveCurrentScrollPosition(): void {
    const rightPane = document.querySelector('.right-pane')
    if (rightPane) {
      this.currentScrollPosition.value = rightPane.scrollTop
    }
  }

  /**
   * スクロール位置を復元
   */
  restoreScrollPosition(position?: number): void {
    const targetPosition = position ?? this.currentScrollPosition.value
    setTimeout(() => {
      const rightPane = document.querySelector('.right-pane')
      if (rightPane) {
        rightPane.scrollTop = targetPosition
      }
    }, 0)
  }

  /**
   * アーティスト選択時のナビゲーション
   */
  navigateToArtist(artist: Artist, pushHistory = true): void {
    if (pushHistory) {
      this.saveCurrentScrollPosition()
    }

    const state = {
      stage: 'artistSelected',
      artist,
      rightScroll: this.currentScrollPosition.value,
    }

    history.pushState(state, '', '')
    this.navigationHistory.value.push(`artist:${artist}`)
  }

  /**
   * アルバム選択時のナビゲーション
   */
  navigateToAlbum(album: Album): void {
    this.saveCurrentScrollPosition()

    const state = {
      stage: 'albumSelected',
      album,
      rightScroll: this.currentScrollPosition.value,
    }

    history.pushState(state, '', '')
    this.navigationHistory.value.push(`album:${album}`)
  }

  /**
   * ブラウザバック/フォワード処理
   */
  handlePopState(event: PopStateEvent): {
    action: 'resetAll' | 'resetAlbum' | 'selectArtist' | 'none'
    artist?: Artist
    scrollPosition?: number
  } {
    const state = event.state

    if (state) {
      switch (state.stage) {
        case 'albumSelected':
          return { action: 'none' }
        case 'artistSelected':
          return {
            action: 'selectArtist',
            artist: state.artist,
            scrollPosition: state.rightScroll,
          }
        default:
          return { action: 'resetAll', scrollPosition: state.rightScroll }
      }
    } else {
      return { action: 'resetAll' }
    }
  }

  /**
   * ナビゲーション履歴をクリア
   */
  clearHistory(): void {
    this.navigationHistory.value = []
  }
}
