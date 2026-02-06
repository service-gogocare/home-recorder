# Firestore 個案資料庫快速開始

## 🚀 快速開始（3 步驟）

### 步驟 1：設定 Firebase

1. **建立 Firebase 專案**
   - 前往 https://console.firebase.google.com/
   - 點擊「新增專案」，輸入專案名稱（如：recorder-app）
   - 等待專案建立完成

2. **建立 Web 應用程式**
   - 在專案總覽中，點擊「新增應用程式」→ 選擇 Web (圖示: `</>`）
   - 輸入應用程式名稱（如：web-app）
   - **複製** 顯示的 Firebase 配置資訊

3. **啟用 Firestore**
   - 左側選單 → Firestore Database
   - 點擊「建立資料庫」
   - 選擇「以測試模式啟動」
   - 選擇位置：`asia-east1 (台灣)`

### 步驟 2：配置應用程式

在專案根目錄建立 `.env` 檔案（已有 `.env.example` 可參考）：

```bash
# 複製範例檔案
cp .env.example .env
```

編輯 `.env`，貼上你的 Firebase 配置：

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 步驟 3：匯入資料

#### 選項 A：從 Google Sheets 匯入 ⭐ 推薦

1. **準備 Google Sheet**
   - 開啟你的 Google Sheets
   - 確保第一列是欄位名稱（參考下方範本）
   
   | 姓名 | 性別 | 年齡 | 電話 | 地址 | 狀態 | 照顧等級 | 居服員 | 上次訪視 | 類別 |
   |------|------|------|------|------|------|----------|--------|----------|------|
   | 林阿嬤 | 女 | 82 | 0912-345-678 | 台北市士林區中正路123號 | 活躍 | CMS 4級 | 張大美 | 2025/12/15 | 居家照顧 |

2. **匯出為 Excel**
   - 檔案 → 下載 → Microsoft Excel (.xlsx)
   - 儲存到專案的 `data/` 資料夾，例如 `data/cases.xlsx`

3. **執行匯入**
   ```bash
   npm run import:sheets -- data/cases.xlsx
   ```

#### 選項 B：從 CSV 匯入

1. **準備 CSV 檔案**
   - 參考 `data/cases-template.csv`
   - 或從 Excel/Sheets 匯出為 CSV

2. **執行匯入**
   ```bash
   npm run import:csv -- data/cases.csv
   ```

#### 選項 C：使用範本

如果還沒有資料，可以使用我們提供的範本：

```bash
# 使用 Excel 範本
npm run import:sheets -- data/cases-template.xlsx

# 或使用 CSV 範本
npm run import:csv -- data/cases-template.csv
```

## ✅ 驗證匯入

### 方法 1：Firebase Console

1. 開啟 Firebase Console
2. 左側選單 → Firestore Database
3. 查看 `cases` collection 是否有資料

### 方法 2：應用程式測試

在你的 React 元件中測試：

```typescript
import { useEffect, useState } from 'react';
import { caseService } from './services/caseService';
import type { Case } from './types/case';

function TestComponent() {
  const [cases, setCases] = useState<Case[]>([]);

  useEffect(() => {
    caseService.getAll().then(setCases);
  }, []);

  return (
    <div>
      <h2>個案數量：{cases.length}</h2>
      <ul>
        {cases.map(c => (
          <li key={c.id}>{c.name} - {c.status}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 📊 資料欄位說明

| 欄位 | 類型 | 必填 | 說明 | 範例 |
|------|------|------|------|------|
| 姓名 / name | 文字 | ✓ | 個案姓名 | 林阿嬤 |
| 性別 / gender | 文字 |  | 性別 | 女 |
| 年齡 / age | 數字 | ✓ | 年齡 | 82 |
| 電話 / phone | 文字 | ✓ | 聯絡電話 | 0912-345-678 |
| 地址 / address | 文字 | ✓ | 住址 | 台北市士林區... |
| 狀態 / status | 文字 | ✓ | 活躍/服務中/待評估/存檔 | 活躍 |
| 照顧等級 / careLevel | 文字 |  | CMS 等級 | CMS 4級 |
| 居服員 / caregiver | 文字 |  | 負責居服員 | 張大美 |
| 上次訪視 / lastVisit | 日期 |  | 最後訪視日期 | 2025/12/15 |
| 類別 / category | 文字 |  | 服務類別 | 居家照顧 |

**狀態對應規則：**
- `活躍`、`服務中`、`active` → `active`
- `待評估`、`pending` → `pending`
- `存檔`、`archived` → `archived`

## 🔧 進階使用

### API 使用範例

```typescript
import { caseService } from '@/services/caseService';

// 取得所有個案
const allCases = await caseService.getAll();

// 搜尋個案
const results = await caseService.search('林阿嬤');

// 依狀態篩選
const activeCases = await caseService.getByStatus('active');

// 取得最近訪視
const recentCases = await caseService.getRecentVisits(10);

// 新增個案
const newId = await caseService.create({
  name: '新個案',
  age: 75,
  phone: '0912-345-678',
  address: '台北市...',
  status: 'active',
  careLevel: 'CMS 5級',
  caregiver: '王小明',
  lastVisit: '2025/12/20'
});

// 更新個案
await caseService.update('case-id', {
  status: 'archived'
});

// 刪除個案
await caseService.delete('case-id');
```

### 大量資料匯入

Firestore 單一 batch 限制 500 筆，腳本會自動分批處理。如果有超過 500 筆資料，你會看到類似輸出：

```
找到 1250 筆資料
開始匯入 3 個 batch...
✓ 完成 batch 1/3
✓ 完成 batch 2/3
✓ 完成 batch 3/3
✅ 所有資料匯入完成！
```

## 🛡️ 安全規則設定

開發階段使用測試模式，上線前需設定安全規則：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cases/{caseId} {
      // 允許認證用戶讀取
      allow read: if request.auth != null;
      
      // 只允許管理員寫入
      allow write: if request.auth != null 
                   && request.auth.token.role == 'admin';
    }
  }
}
```

## ❗ 常見問題

### Q: 匯入時出現 "permission-denied" 錯誤？
**A:** 確認 Firestore 是以「測試模式」啟動，或檢查安全規則設定。

### Q: 日期格式問題？
**A:** 支援以下格式：
- `2025/12/15`
- `2025-12-15`
- Excel 日期序號（自動轉換）

### Q: 如何清空資料庫重新匯入？
**A:** 在 Firebase Console → Firestore Database → 手動刪除 `cases` collection

### Q: 可以增量匯入嗎？
**A:** 可以，腳本會新增資料不會覆蓋現有資料。如需更新，需先刪除舊資料。

## 📝 下一步

1. ✅ 整合到 `CaseList.tsx`，從 Firestore 讀取資料
2. ✅ 實作搜尋和篩選功能
3. ✅ 建立新增/編輯個案表單
4. 🔒 設定 Firebase Authentication
5. 🚀 部署到 Firebase Hosting

## 📚 相關文件

- [完整匯入指南](./IMPORT_GUIDE.md)
- [Firebase 文件](https://firebase.google.com/docs/firestore)
- [API 參考](../src/services/caseService.ts)
