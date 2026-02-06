import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

// Firebase config - 請從環境變數或直接填入
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

interface CaseData {
    name: string;
    gender?: string;
    age: number;
    phone: string;
    address: string;
    status: string;
    careLevel: string;
    caregiver: string;
    lastVisit: string;
    category?: string;
}

async function importCasesFromCSV(csvFilePath: string) {
    try {
        // 讀取 CSV 檔案
        const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

        // 解析 CSV
        const records = parse(fileContent, {
            columns: true, // 使用第一行作為欄位名稱
            skip_empty_lines: true,
            trim: true,
            bom: true // 處理 UTF-8 BOM
        }) as CaseData[];

        console.log(`找到 ${records.length} 筆資料`);

        // 使用 batch write 提升效能
        const batches: any[] = [];
        let currentBatch = writeBatch(db);
        let operationCount = 0;
        const BATCH_SIZE = 500; // Firestore batch 限制

        for (const record of records) {
            // 資料清理和轉換
            const caseData = {
                name: record.name,
                gender: record.gender || '',
                age: parseInt(record.age.toString()) || 0,
                phone: record.phone,
                address: record.address,
                status: mapStatus(record.status),
                careLevel: record.careLevel,
                caregiver: record.caregiver,
                lastVisit: record.lastVisit,
                category: record.category || '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const docRef = doc(collection(db, 'cases'));
            currentBatch.set(docRef, caseData);
            operationCount++;

            // 當達到 batch 大小限制時，建立新的 batch
            if (operationCount === BATCH_SIZE) {
                batches.push(currentBatch);
                currentBatch = writeBatch(db);
                operationCount = 0;
            }
        }

        // 加入最後一個 batch
        if (operationCount > 0) {
            batches.push(currentBatch);
        }

        // 執行所有 batches
        console.log(`開始匯入 ${batches.length} 個 batch...`);
        for (let i = 0; i < batches.length; i++) {
            await batches[i].commit();
            console.log(`完成 batch ${i + 1}/${batches.length}`);
        }

        console.log('✅ 所有資料匯入完成！');
    } catch (error) {
        console.error('❌ 匯入失敗:', error);
        throw error;
    }
}

// 狀態對應
function mapStatus(status: string): 'active' | 'pending' | 'archived' {
    const s = status.toLowerCase();
    if (s.includes('活躍') || s.includes('服務中') || s === 'active') return 'active';
    if (s.includes('待評估') || s === 'pending') return 'pending';
    if (s.includes('存檔') || s.includes('archived')) return 'archived';
    return 'active';
}

// 執行匯入
const csvPath = process.argv[2] || path.join(__dirname, '../data/cases.csv');
console.log(`從 ${csvPath} 匯入資料...`);

importCasesFromCSV(csvPath)
    .then(() => {
        console.log('匯入完成');
        process.exit(0);
    })
    .catch((error) => {
        console.error('匯入失敗:', error);
        process.exit(1);
    });
