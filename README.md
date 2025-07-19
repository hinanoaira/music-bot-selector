# Music Bot Selector

Vue 3 + TypeScript + MVVM パターンによる音楽ボットセレクター

## 🏗️ アーキテクチャ

このプロジェクトは **MVVM (Model-View-ViewModel) パターン** と **Atomic Design** を組み合わせた設計を採用しており、以下の層で構成されています：

### 📂 プロジェクト構造

```
src/
├── config/                    # 設定ファイル
│   └── api.ts                # API設定とエンドポイント（WebSocket含む）
├── models/                   # Model層
│   ├── repositories/         # データアクセス層
│   │   └── MusicRepository.ts
│   ├── services/            # ビジネスロジック層
│   │   ├── MusicService.ts
│   │   └── QueueService.ts    # WebSocket通信とキュー管理
│   └── musicTypes.ts        # 型定義（QueueItem、PlaybackStatus等）
├── viewmodels/              # ViewModel層
│   ├── MusicViewModel.ts
│   ├── MusicRequestViewModel.ts
│   ├── NavigationViewModel.ts
│   └── QueueViewModel.ts
├── composables/             # View層とViewModel層の橋渡し
│   ├── useMusicViewModelMVVM.ts
│   ├── useQueueViewModel.ts
│   └── useGuildParam.ts
├── views/                   # View層（ページ）
│   └── MusicRequestView.vue
├── components/              # View層（コンポーネント）
│   ├── atoms/               # 最小単位のコンポーネント
│   │   ├── AlbumCover.vue
│   │   ├── BaseButton.vue
│   │   ├── BaseIcon.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseList.vue
│   │   ├── BaseText.vue
│   │   └── ProgressBar.vue
│   ├── molecules/           # atomsを組み合わせたコンポーネント
│   │   ├── AlbumItem.vue
│   │   ├── ListItem.vue
│   │   ├── PlaybackInfo.vue
│   │   ├── QueueControls.vue
│   │   ├── QueueHeader.vue
│   │   ├── QueueItem.vue
│   │   ├── ToastItem.vue
│   │   ├── TrackHeader.vue
│   │   ├── TrackItem.vue
│   │   └── YouTubeInput.vue
│   ├── organisms/           # moleculesを組み合わせた複合コンポーネント
│   │   ├── AlbumList.vue
│   │   ├── ArtistList.vue
│   │   ├── QueueBody.vue
│   │   ├── ToastList.vue
│   │   └── TrackList.vue
│   └── templates/           # ページレベルのレイアウトコンポーネント
│       ├── QueuePanel.vue     # キュー表示・操作パネル
│       └── ToastContainer.vue # 通知表示
├── stores/                  # 状態管理（Pinia）
│   └── toast.ts
├── router/                  # ルーティング
│   └── index.ts
├── assets/                  # 静的ファイル
│   ├── base.css
│   ├── logo.svg
│   └── main.css
├── App.vue
├── main.ts
└── shims.d.ts              # TypeScript型定義補完
```

## 🎯 MVVM パターンの役割分担

### **Model層**

- **Repository**: データアクセス（API通信）
- **Service**: ビジネスロジック（バリデーション、データ変換、WebSocket通信）
- **Types**: 型定義

### **ViewModel層**

- **MusicViewModel**: 音楽データの状態管理
- **MusicRequestViewModel**: リクエスト処理の状態管理
- **NavigationViewModel**: ナビゲーション状態管理
- **QueueViewModel**: キュー管理とWebSocket通信

### **View層（Atomic Design）**

- **Templates**: ページレベルのレイアウトコンポーネント
- **Organisms**: 複合的な機能を持つコンポーネント群
- **Molecules**: 複数のatomsを組み合わせた意味のある単位
- **Atoms**: 最小単位の再利用可能なUIコンポーネント
- **Views**: ページコンポーネント
- **Composables**: ViewModelとViewの橋渡し

## 📋 主要機能

### 🎵 音楽リクエスト機能

- アーティスト、アルバム、トラック選択
- YouTubeトラックリクエスト
- リアルタイム状態管理
- アルバムカバー画像表示

### 🎼 キュー管理機能

- WebSocketによるリアルタイム更新
- 現在再生中トラック表示
- スキップ機能
- 再生時間・プログレスバー表示
- 待機中トラック数表示

### 🧭 ナビゲーション機能

- ブラウザ履歴管理
- スクロール位置保持
- 戻る/進む対応
- モバイル対応

### 🔔 通知機能

- トースト通知システム
- 成功・エラー・警告・情報メッセージ
- 自動消去機能

## 🔧 開発環境

### 技術スタック

- **フロントエンド**: Vue 3.5.13
- **言語**: TypeScript 5.7.3
- **ビルドツール**: Vite 6.0.11
- **状態管理**: Pinia 2.3.1
- **ルーティング**: Vue Router 4.5.0
- **リアルタイム通信**: WebSocket
- **開発ツール**: Vue DevTools 7.7.1
- **コード品質**: ESLint 9.18.0, Prettier 3.4.2

### アーキテクチャパターン

- **MVVM (Model-View-ViewModel)**: ビジネスロジックとUIの分離
- **Atomic Design**: コンポーネントの階層的設計
- **Composable Pattern**: ロジックの再利用性向上

### 推奨IDE

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### プロジェクトセットアップ

```bash
# 依存関係のインストール
npm install
```

### 開発サーバー起動

```bash
# 開発サーバーを起動（ホットリロード有効）
npm run dev
```

### 型チェック

```bash
# TypeScriptの型チェックを実行
npm run type-check
```

### ビルド

```bash
# プロダクション用ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

### コード品質管理

```bash
# ESLintによるリンティング（自動修正付き）
npm run lint

# Prettierによるコードフォーマット
npm run format
```

## 🌐 API エンドポイント

### 音楽データ取得

- `GET /artist` - アーティスト一覧取得
- `GET /artist/{artist}` - アルバム一覧取得
- `GET /artist/{artist}/{album}` - トラック一覧取得

### 音楽リクエスト

- `GET /requestplay/{artist}/{album}/{track}` - トラックリクエスト
- `GET /youtubeplay/{url}` - YouTubeトラックリクエスト
- `GET /skip` - スキップリクエスト

### その他

- `GET /cover/{artist}/{album}` - アルバムカバー画像取得
- `WSS /` - WebSocket接続（キュー更新）

## 🎨 レスポンシブデザイン

- デスクトップ: 左右ペイン分割レイアウト
- モバイル（700px以下）: 単一ペインレイアウト
- アダプティブなUIコンポーネント

## 📝 ライセンス

This project is MIT License.
See [LICENSE](./LICENSE) for details.
