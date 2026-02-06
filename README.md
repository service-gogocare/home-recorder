# 居家照顧督導訪視紀錄系統

居家照顧督導的訪視紀錄輔助系統，整合 AI 分析功能，協助督導更有效率地管理個案和撰寫訪視紀錄。

## ✨ 主要功能

- 📊 **儀表板** - 即時掌握服務概況和待辦事項
- 👥 **個案管理** - 完整的個案資料管理和查詢
- 📝 **訪視紀錄** - AI 輔助撰寫訪視紀錄
- 🗂️ **案件列表** - 系統化管理所有案件

## 🔥 Firebase / Firestore 整合

本專案使用 Firebase Firestore 作為資料庫，支援：

- ✅ 個案資料批次匯入（從 Google Sheets / Excel / CSV）
- ✅ 即時資料同步
- ✅ 完整的 CRUD 操作
- ✅ 搜尋和篩選功能

### 快速開始

1. **安裝依賴**
   \`\`\`bash
   npm install
   \`\`\`

2. **設定 Firebase**
   
   參考 [快速開始指南](./docs/QUICKSTART.md) 完成 Firebase 設定：
   - 建立 Firebase 專案
   - 啟用 Firestore
   - 設定 `.env` 環境變數

3. **匯入個案資料**
   
   從 Google Sheets 或 Excel 匯入：
   \`\`\`bash
   # 從 Excel/Sheets 匯入
   npm run import:sheets -- data/cases.xlsx
   
   # 從 CSV 匯入
   npm run import:csv -- data/cases.csv
   \`\`\`

4. **啟動開發伺服器**
   \`\`\`bash
   npm run dev
   \`\`\`

## 📖 文件

- [快速開始指南](./docs/QUICKSTART.md) - 完整的設定和使用教學
- [匯入指南](./docs/IMPORT_GUIDE.md) - 資料匯入詳細說明
- [實作總結](./docs/IMPLEMENTATION_SUMMARY.md) - 技術實作細節

## 🛠️ 技術棧

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Firebase Firestore
- **Testing**: Vitest + Testing Library

## 📝 可用腳本

\`\`\`bash
npm run dev          # 啟動開發伺服器
npm run build        # 建置生產版本
npm run preview      # 預覽生產版本
npm run test         # 執行測試
npm run lint         # 執行 ESLint

# 資料匯入
npm run import:sheets -- <file.xlsx>  # 從 Excel/Sheets 匯入
npm run import:csv -- <file.csv>      # 從 CSV 匯入
\`\`\`

## 📂 專案結構

\`\`\`
recorder/
├── src/
│   ├── config/          # 設定檔 (Firebase 等)
│   ├── types/           # TypeScript 型別定義
│   ├── services/        # 資料服務層 (Firestore CRUD)
│   ├── components/      # React 元件
│   ├── pages/           # 頁面元件
│   └── App.tsx
├── scripts/             # 工具腳本 (資料匯入等)
├── data/                # 資料檔案和範本
├── docs/                # 文件
└── public/
\`\`\`

## 🚀 部署

建議部署到 Firebase Hosting：

\`\`\`bash
npm run build
firebase deploy
\`\`\`

## 📄 授權

Private - 內部使用

---

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)
