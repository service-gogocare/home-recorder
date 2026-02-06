import { initializeApp } from 'firebase/app';
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore';
import { createRequire } from 'module';
import * as path from 'path';
import 'dotenv/config';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

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

// Excel file path
const EXCEL_FILE_PATH = path.resolve('data/童庭居家員工資料.xlsx');

interface CaregiverRow {
    [key: string]: any;
}

// Schema Mapping
const FIELD_MAPPING: { [key: string]: string } = {
    '員工編號': 'employeeId',
    '現在狀態': 'status',
    '姓名': 'name',
    '性別': 'gender',
    '國籍': 'nationality',
    '身分證字號': 'idNumber',
    '手機號碼': 'phone',
    '年齡': 'age',
    '生日': 'birthday',
    '帳號': 'account',
    '角色': 'role',
    '主責督導': 'primarySupervisor',
    '副督導': 'secondarySupervisor',
    '居住地': 'address',
    '教育程度': 'education',
    '身心障礙者': 'disabilityStatus',
    '原住民': 'isIndigenous', // Needs manual conversion
    '原住民族別': 'indigenousTribe',
    '常用語言': 'preferredLanguage',
    '到職日': 'onboardDate',
    '離職日': 'resignationDate',
    '緊急聯絡人姓名': 'emergencyContactName',
    '緊急連絡人電話': 'emergencyContactPhone',
    '緊急連絡人關係': 'emergencyContactRelationship',
    '服務區域': 'serviceArea',
    '備註': 'notes'
};

// Value Converters
const STATUS_MAP: { [key: string]: string } = {
    '在職': 'active',
    '離職': 'inactive',
    '留職停薪': 'suspended'
};

function convertDate(excelDate: any): string {
    if (!excelDate) return '';
    if (typeof excelDate === 'number') {
        const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
        return date.toISOString().split('T')[0];
    }
    return String(excelDate);
}

async function importCaregivers() {
    try {
        console.log(`📂 讀取 Excel 檔案: ${EXCEL_FILE_PATH}`);

        // Read Excel File
        const workbook = XLSX.readFile(EXCEL_FILE_PATH);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const rows: CaregiverRow[] = XLSX.utils.sheet_to_json(worksheet);
        console.log(`✓ 找到 ${rows.length} 筆資料`);

        if (rows.length === 0) {
            console.log('⚠️ 無資料可匯入');
            process.exit(0);
        }

        const batch = writeBatch(db);
        let count = 0;

        for (const row of rows) {
            const docData: any = {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Map fields
            for (const [cnKey, enKey] of Object.entries(FIELD_MAPPING)) {
                let value = row[cnKey];

                // Specific Conversions
                if (enKey === 'status') {
                    const normalizedStatus = (value || '').trim();
                    value = STATUS_MAP[normalizedStatus] || 'active';
                }
                if (enKey === 'age' && value) {
                    value = Number(value);
                }
                if (enKey === 'isIndigenous') {
                    value = value === '是' || value === true || value === 'TRUE';
                }
                if (enKey === 'birthday' || enKey === 'onboardDate' || enKey === 'resignationDate') {
                    value = convertDate(value);
                }

                if (value !== undefined) {
                    docData[enKey] = value;
                }
            }

            // Use employeeId as Document ID to prevent duplicates if valid, otherwise auto-gen
            if (docData.employeeId) {
                // Ensure ID string is clean
                const docId = String(docData.employeeId).trim();
                const docRef = doc(db, 'caregivers', docId);
                batch.set(docRef, docData); // set() overwrites existing doc with same ID
            } else {
                const docRef = doc(collection(db, 'caregivers'));
                batch.set(docRef, docData);
            }
            count++;
        }

        console.log(`🚀 開始匯入 ${count} 筆居服員資料...`);
        await batch.commit();
        console.log('✅ 匯入完成！');

    } catch (error) {
        console.error('❌ 匯入發生錯誤:', error);
        if (error.code === 'ENOENT') {
            console.error('請確認檔案路徑是否正確');
        }
        process.exit(1);
    }
}

importCaregivers();
