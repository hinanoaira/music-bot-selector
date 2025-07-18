# Music Bot Selector

Vue 3 + TypeScript + MVVM パターンによる音楽ボットセレクター

## 🏗️ アーキテクチャ

このプロジェクトは **MVVM (Model-View-ViewModel) パターン** を採用しており、以下の層で構成されています：

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
│   ├── QueuePanel.vue         # キュー表示・操作パネル
│   └── ToastContainer.vue     # 通知表示
├── stores/                  # 状態管理（Pinia）
│   └── toast.ts
├── router/                  # ルーティング
│   └── index.ts
├── assets/                  # 静的ファイル
├── App.vue
└── main.ts
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

### **View層**

- **Views**: ページコンポーネント
- **Components**: 再利用可能なUIコンポーネント
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

### 推奨IDE

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### プロジェクトセットアップ

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

### 型チェック

```bash
npm run type-check
```

### ビルド

```bash
npm run build
```

### リント

```bash
npm run lint
```

### フォーマット

```bash
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

This project is private.
