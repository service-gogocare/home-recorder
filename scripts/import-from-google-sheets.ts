import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import fetch from 'node-fetch';
import { parse } from 'csv-parse/sync';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

interface SheetRow {
  [key: string]: any;
}

// 將 Google Sheets 編輯 URL 轉換為 CSV 匯出 URL
function convertToCSVExportURL(sheetsURL: string): string {
  // 提取 spreadsheet ID
  const match = sheetsURL.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) {
    throw new Error('無效的 Google Sheets URL');
  }
  
  const spreadsheetId = match[1];
  
  // 提取 gid (工作表 ID)
  const gidMatch = sheetsURL.match(/[#&]gid=(\d+)/);
  const gid = gidMatch ? gidMatch[1] : '0';
  
  // 建立 CSV 匯出 URL
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
}

async function importFromGoogleSheets(sheetsURL: string) {
  try {
    console.log('📊 從 Google Sheets 讀取資料...');
    console.log(`URL: ${sheetsURL}\n`);
    
    // 轉換為 CSV 匯出 URL
    const csvURL = convertToCSVExportURL(sheetsURL);
    console.log(`CSV 匯出 URL: ${csvURL}\n`);
    
    // 下載 CSV 資料
    const response = await fetch(csvURL);
    
    if (!response.ok) {
      throw new Error(`無法讀取 Google Sheets。請確認：
1. Google Sheets 已設定為「知道連結的任何人」可以檢視
2. URL 是正確的

錯誤狀態: ${response.status} ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    // 解析 CSV
    const records: SheetRow[] = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true
    });
    
    console.log(`✓ 找到 ${records.length} 筆資料\n`);
    
    if (records.length === 0) {
      console.log('⚠️ 沒有資料可匯入');
      return;
    }
    
    // 顯示第一筆資料
    console.log('資料範例:');
    console.log(records[0]);
    console.log('');
    
    // 批次寫入
    const batches: any[] = [];
    let currentBatch = writeBatch(db);
    let operationCount = 0;
    const BATCH_SIZE = 500;
    
    for (const record of records) {
      // 欄位對應（支援中文或英文欄位名稱）
      const caseData = {
        name: record['姓名'] || record['name'] || '',
        gender: record['性別'] || record['gender'] || '',
        age: parseInt(record['年齡'] || record['age'] || '0'),
        phone: record['電話'] || record['phone'] || '',
        address: record['地址'] || record['address'] || '',
        status: mapStatus(record['狀態'] || record['status'] || 'active'),
        careLevel: record['照顧等級'] || record['careLevel'] || '',
        caregiver: record['居服員'] || record['caregiver'] || '',
        lastVisit: record['上次訪視'] || record['lastVisit'] || '',
        category: record['類別'] || record['category'] || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 跳過空白行
      if (!caseData.name) continue;
      
      const docRef = doc(collection(db, 'cases'));
      currentBatch.set(docRef, caseData);
      operationCount++;
      
      if (operationCount === BATCH_SIZE) {
        batches.push(currentBatch);
        currentBatch = writeBatch(db);
        operationCount = 0;
      }
    }
    
    if (operationCount > 0) {
      batches.push(currentBatch);
    }
    
    console.log(`開始匯入 ${batches.length} 個 batch...`);
    for (let i = 0; i < batches.length; i++) {
      await batches[i].commit();
      console.log(`✓ 完成 batch ${i + 1}/${batches.length}`);
    }
    
    console.log('\n✅ 所有資料匯入完成！');
    console.log(`成功匯入 ${records.filter(r => r['姓名'] || r['name']).length} 筆個案資料`);
    
  } catch (error) {
    console.error('\n❌ 匯入失敗:', error);
    throw error;
  }
}

function mapStatus(status: string): 'active' | 'pending' | 'archived' {
  if (!status) return 'active';
  const s = status.toLowerCase();
  if (s.includes('活躍') || s.includes('服務中') || s === 'active') return 'active';
  if (s.includes('待評估') || s === 'pending') return 'pending';
  if (s.includes('存檔') || s.includes('archived')) return 'archived';
  return 'active';
}

// 執行匯入
const sheetsURL = process.argv[2];

if (!sheetsURL) {
  console.error('❌ 請提供 Google Sheets URL');
  console.log('\n使用方式:');
  console.log('npm run import:google-sheets -- "YOUR_GOOGLE_SHEETS_URL"');
  console.log('\n範例:');
  console.log('npm run import:google-sheets -- "https://docs.google.com/spreadsheets/d/1fE4N.../edit"');
  process.exit(1);
}

console.log('🚀 開始從 Google Sheets 匯入資料\n');

importFromGoogleSheets(sheetsURL)
  .then(() => {
    console.log('\n🎉 匯入程序完成');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n匯入失敗:', error.message);
    process.exit(1);
  });
