# Firestore 個案資料批次匯入指南

## 前置準備

### 1. 設定 Firebase 專案

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 建立新專案或選擇現有專案
3. 點擊「新增應用程式」→ 選擇「Web」
4. 複製 Firebase 配置資訊

### 2. 配置環境變數

複製 `.env.example` 為 `.env`，填入你的 Firebase 配置：

```bash
cp .env.example .env
```

編輯 `.env` 填入實際值：

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. 在 Firebase Console 建立 Firestore 資料庫

1. 在 Firebase Console → 選擇「Firestore Database」
2. 點擊「建立資料庫」
3. 選擇「以測試模式啟動」(開發階段)
4. 選擇資料庫位置 (建議選擇 asia-east1)

## 資料匯入方法

### 方法一：從 CSV 匯入

#### 1. 準備 CSV 檔案

參考 `data/cases-template.csv`，格式如下：

```csv
name,gender,age,phone,address,status,careLevel,caregiver,lastVisit,category
林阿嬤,女,82,0912-345-678,台北市士林區中正路123號,活躍,CMS 4級,張大美,2025/12/15,居家照顧
```

欄位說明：
- `name`: 姓名 (必填)
- `gender`: 性別
- `age`: 年齡 (必填)
- `phone`: 電話 (必填)
- `address`: 地址 (必填)
- `status`: 狀態 (活躍/服務中/待評估/存檔)
- `careLevel`: 照顧等級
- `caregiver`: 居服員
- `lastVisit`: 上次訪視日期
- `category`: 類別

#### 2. 執行匯入

```bash
npm run import:csv -- path/to/your/cases.csv
```

或直接使用預設路徑 `data/cases.csv`：

```bash
npm run import:csv
```

### 方法二：從 Google Sheets / Excel 匯入

#### 1. 準備 Excel 檔案

從 Google Sheets 匯出為 Excel 格式 (.xlsx)，或直接準備 Excel 檔案。

**欄位名稱** (使用中文)：
| 姓名 | 性別 | 年齡 | 電話 | 地址 | 狀態 | 照顧等級 | 居服員 | 上次訪視 | 類別 |

#### 2. 從 Google Sheets 匯出

1. 開啟你的 Google Sheet
2. 檔案 → 下載 → Microsoft Excel (.xlsx)
3. 將檔案儲存到 `data/cases.xlsx`

#### 3. 執行匯入

```bash
npm run import:sheets -- path/to/your/cases.xlsx
```

如果有多個工作表，可指定工作表名稱：

```bash
npm run import:sheets -- path/to/your/cases.xlsx "Sheet1"
```

## package.json 腳本

在 `package.json` 加入以下腳本：

```json
{
  "scripts": {
    "import:csv": "tsx scripts/import-cases-from-csv.ts",
    "import:sheets": "tsx scripts/import-cases-from-sheets.ts"
  }
}
```

## 資料結構

Firestore 中儲存的個案資料結構：

```typescript
{
  name: string;        // 姓名
  gender: string;      // 性別
  age: number;         // 年齡
  phone: string;       // 電話
  address: string;     // 地址
  status: 'active' | 'pending' | 'archived';  // 狀態
  careLevel: string;   // 照顧等級
  caregiver: string;   // 居服員
  lastVisit: string;   // 上次訪視
  category: string;    // 類別
  createdAt: string;   // 建立時間 (自動產生)
  updatedAt: string;   // 更新時間 (自動產生)
}
```

## 在應用程式中使用

```typescript
import { caseService } from './services/caseService';

// 取得所有個案
const cases = await caseService.getAll();

// 搜尋個案
const results = await caseService.search('林阿嬤');

// 依狀態篩選
const activeCases = await caseService.getByStatus('active');

// 新增個案
const newId = await caseService.create({
  name: '新個案',
  age: 75,
  phone: '0912-345-678',
  address: '台北市中正區...',
  status: 'active',
  careLevel: 'CMS 4級',
  caregiver: '王小明',
  lastVisit: '2025/12/20'
});
```

## 注意事項

1. **批次限制**：Firestore 單一 batch 最多 500 筆，腳本會自動分批處理
2. **成本**：注意 Firestore 讀寫配額，大量匯入可能產生費用
3. **測試模式**：開發時使用測試模式，正式上線前記得設定安全規則
4. **資料備份**：匯入前建議先備份現有資料

## 安全規則範例

在 Firestore 規則中加入：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cases/{caseId} {
      // 開發階段：允許所有讀寫
      allow read, write: if true;
      
      // 正式環境：加入驗證
      // allow read: if request.auth != null;
      // allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```
