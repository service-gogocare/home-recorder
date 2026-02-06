# Firestore 個案資料庫整合總結

## 📦 已完成項目

### 1. Firebase 設定
- ✅ Firebase SDK 安裝
- ✅ Firebase 配置檔案 (`src/config/firebase.ts`)
- ✅ 環境變數範例 (`.env.example`)
- ✅ TypeScript 型別定義 (`src/types/case.ts`)

### 2. 資料匯入工具
- ✅ CSV 批次匯入腳本 (`scripts/import-cases-from-csv.ts`)
- ✅ Excel/Sheets 批次匯入腳本 (`scripts/import-cases-from-sheets.ts`)
- ✅ 範本生成工具 (`scripts/create-template.ts`)
- ✅ CSV 範本檔案 (`data/cases-template.csv`)
- ✅ Excel 範本檔案 (`data/cases-template.xlsx`)

### 3. 資料服務層
- ✅ Firestore CRUD 服務 (`src/services/caseService.ts`)
  - `getAll()` - 取得所有個案
  - `getById(id)` - 取得單一個案
  - `search(term)` - 搜尋個案
  - `getByStatus(status)` - 依狀態篩選
  - `create(data)` - 新增個案
  - `update(id, data)` - 更新個案
  - `delete(id)` - 刪除個案
  - `getRecentVisits(limit)` - 取得最近訪視

### 4. UI 整合
- ✅ 更新 `CaseList.tsx` 整合 Firestore
- ✅ 實作搜尋功能
- ✅ Loading 狀態
- ✅ Empty 狀態處理
- ✅ Fallback 到 mock 資料（Firebase 未設定時）

### 5. 文件
- ✅ 快速開始指南 (`docs/QUICKSTART.md`)
- ✅ 完整匯入指南 (`docs/IMPORT_GUIDE.md`)
- ✅ 此總結文件

## 📁 檔案結構

\`\`\`
recorder/
├── src/
│   ├── config/
│   │   └── firebase.ts              # Firebase 初始化
│   ├── types/
│   │   └── case.ts                  # 個案資料型別
│   ├── services/
│   │   └── caseService.ts           # Firestore CRUD 服務
│   └── pages/
│       └── CaseList.tsx             # 個案列表（已整合 Firestore）
├── scripts/
│   ├── import-cases-from-csv.ts     # CSV 匯入腳本
│   ├── import-cases-from-sheets.ts  # Excel 匯入腳本
│   └── create-template.ts           # 範本生成工具
├── data/
│   ├── cases-template.csv           # CSV 範本
│   └── cases-template.xlsx          # Excel 範本
├── docs/
│   ├── QUICKSTART.md                # 快速開始
│   ├── IMPORT_GUIDE.md              # 匯入指南
│   └── IMPLEMENTATION_SUMMARY.md    # 本文件
├── .env.example                     # 環境變數範例
└── package.json                     # 新增匯入腳本
\`\`\`

## 🚀 使用流程

### 第一次設定

1. **建立 Firebase 專案** (參考 `docs/QUICKSTART.md`)
2. **設定環境變數** (`.env`)
3. **準備資料** (Google Sheets 或 CSV)
4. **執行匯入**
   \`\`\`bash
   npm run import:sheets -- data/your-cases.xlsx
   \`\`\`

### 日常使用

\`\`\`typescript
// 在任何元件中使用
import { caseService } from '@/services/caseService';

// 讀取資料
const cases = await caseService.getAll();

// 搜尋
const results = await caseService.search('關鍵字');

// 新增
const id = await caseService.create({...});

// 更新
await caseService.update(id, {...});
\`\`\`

## 🎯 npm 腳本

\`\`\`json
{
  "import:csv": "tsx scripts/import-cases-from-csv.ts",
  "import:sheets": "tsx scripts/import-cases-from-sheets.ts"
}
\`\`\`

**使用方式：**
\`\`\`bash
# CSV 匯入
npm run import:csv -- path/to/cases.csv

# Excel/Sheets 匯入
npm run import:sheets -- path/to/cases.xlsx

# 使用預設範本測試
npm run import:sheets -- data/cases-template.xlsx
\`\`\`

## 📊 資料結構

### Firestore Collection: `cases`

\`\`\`typescript
interface Case {
  id?: string;              // Firestore Document ID
  name: string;             // 姓名
  gender?: string;          // 性別
  age: number;              // 年齡
  phone: string;            // 電話
  address: string;          // 地址
  status: 'active' | 'pending' | 'archived';  // 狀態
  careLevel: string;        // 照顧等級 (e.g., "CMS 4級")
  caregiver: string;        // 居服員
  lastVisit: string;        // 上次訪視 (YYYY/MM/DD)
  category?: string;        // 類別
  createdAt?: string;       // 建立時間 (ISO)
  updatedAt?: string;       // 更新時間 (ISO)
}
\`\`\`

## 🔧 進階配置

### Firestore 安全規則

開發階段（測試模式）：
\`\`\`javascript
allow read, write: if true;
\`\`\`

正式環境：
\`\`\`javascript
allow read: if request.auth != null;
allow write: if request.auth != null && request.auth.token.role == 'admin';
\`\`\`

### 批次處理

- Firestore 限制：單一 batch 最多 500 筆
- 腳本會自動分批處理
- 大量資料匯入時會顯示進度

### 錯誤處理

- 匯入失敗會顯示詳細錯誤訊息
- UI 會 fallback 到 mock 資料（Firebase 未設定時）
- 網路錯誤自動在 console 記錄

## 📋 Checklist - 下一步

### 必須完成
- [ ] 在 Firebase Console 建立專案
- [ ] 設定 `.env` 環境變數
- [ ] 準備並匯入個案資料
- [ ] 測試 `CaseList` 頁面是否正常顯示

### 建議完成
- [ ] 實作「新增個案」功能
- [ ] 實作「編輯個案」功能
- [ ] 實作「篩選」功能（依狀態、居服員等）
- [ ] 實作「刪除個案」功能
- [ ] 加入分頁功能（大量資料時）

### 進階功能
- [ ] 設定 Firebase Authentication
- [ ] 實作使用者權限管理
- [ ] 加入即時同步（onSnapshot）
- [ ] 匯出功能（匯出為 CSV/Excel）
- [ ] 資料備份機制
- [ ] 部署到 Firebase Hosting

## 💡 Tips

1. **測試資料**：可以先用範本匯入測試，確認整合正常
2. **狀態對應**：腳本會自動轉換中文狀態（活躍→active）
3. **日期格式**：支援多種格式，包括 Excel 日期序號
4. **大量匯入**：建議分批匯入，每批不超過 1000 筆
5. **開發模式**：未設定 Firebase 時會自動使用 mock 資料

## 🐛 疑難排解

### 問題：Permission Denied
**解決**：檢查 Firestore 是否以測試模式啟動

### 問題：找不到環境變數
**解決**：確認 `.env` 檔案存在且格式正確，變數名稱必須以 `VITE_` 開頭

### 問題：匯入後看不到資料
**解決**：
1. 檢查 Firebase Console 確認資料已寫入
2. 檢查網路連線
3. 查看瀏覽器 console 是否有錯誤

### 問題：日期格式錯誤
**解決**：確保 Excel 日期欄位格式為「日期」而非「文字」

## 📞 支援

- 詳細文件：`docs/QUICKSTART.md`
- API 參考：`src/services/caseService.ts`
- Firebase 文件：https://firebase.google.com/docs/firestore

---

**建立時間**：2026-02-03  
**版本**：1.0.0  
**狀態**：已完成核心功能，可開始使用
