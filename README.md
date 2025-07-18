# Music Bot Selector

Vue 3 + TypeScript + MVVM パターンによる音楽ボットセレクター

## 🏗️ アーキテクチャ

このプロジェクトは **MVVM (Model-View-ViewModel) パターン** を採用しており、以下の層で構成されています：

### 📂 プロジェクト構造

```
src/
├── config/                    # 設定ファイル
│   └── api.ts                # API設定とエンドポイント
├── models/                   # Model層
│   ├── repositories/         # データアクセス層
│   │   └── MusicRepository.ts
│   ├── services/            # ビジネスロジック層
│   │   ├── MusicService.ts
│   │   └── QueueService.ts
│   └── musicTypes.ts        # 型定義
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
│   ├── QueuePanel.vue
│   └── ToastContainer.vue
├── stores/                  # 状態管理
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
- **Service**: ビジネスロジック（バリデーション、データ変換）
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

### 🎼 キュー管理機能

- WebSocketによるリアルタイム更新
- 現在再生中トラック表示
- スキップ機能

### 🧭 ナビゲーション機能

- ブラウザ履歴管理
- スクロール位置保持
- 戻る/進む対応

## 🔧 開発環境

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

## 🎨 設計思想

### **責務の分離**

各層が明確な責務を持ち、依存関係が一方向になるよう設計

### **型安全性**

TypeScriptによる厳格な型チェック

### **テスタビリティ**

ViewModel層のビジネスロジックが独立してテスト可能

### **再利用性**

Repository、Service、ViewModelが他のプロジェクトでも再利用可能

### **保守性**

機能ごとにモジュール化され、変更影響範囲が限定的

## 🚀 今後の拡張性

- 新しいViewModel追加による機能拡張
- Repository層の差し替えによるデータソース変更
- Service層でのビジネスロジック拡張
- Component層での UI拡張

## 📝 ライセンス

This project is private.
