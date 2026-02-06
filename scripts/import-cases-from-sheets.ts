import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { collection, writeBatch, doc, initializeFirestore, getDocs, deleteDoc } from 'firebase/firestore';
import XLSX from 'xlsx';
import * as path from 'path';
import { readFileSync } from 'fs';

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
const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

async function clearCollection(collectionName: string) {
    console.log(`正在清除集合 ${collectionName}...`);
    const colRef = collection(db, collectionName);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
        console.log('集合已空');
        return;
    }

    const total = snapshot.size;
    let deleted = 0;
    const batchSize = 500;
    let batch = writeBatch(db);

    for (const doc of snapshot.docs) {
        batch.delete(doc.ref);
        deleted++;

        if (deleted % batchSize === 0) {
            await batch.commit();
            batch = writeBatch(db);
            process.stdout.write(`已刪除 ${deleted}/${total}\r`);
        }
    }

    if (deleted % batchSize !== 0) {
        await batch.commit();
    }
    console.log(`\n已清除 ${deleted} 筆舊資料`);
}

async function importCasesFromExcel(filePath: string, sheetName?: string) {
    try {
        console.log(`讀取檔案: ${filePath}`);

        // ... reading file ...
        const fileBuffer = readFileSync(filePath);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const targetSheet = sheetName || workbook.SheetNames[0];
        const worksheet = workbook.Sheets[targetSheet];
        const records: SheetRow[] = XLSX.utils.sheet_to_json(worksheet);

        console.log(`找到 ${records.length} 筆資料`);

        if (records.length === 0) {
            console.log('⚠️ 沒有資料可匯入');
            return;
        }

        // 先清除舊資料
        await clearCollection('cases');

        // 改用 addDoc 逐筆新增
        const { addDoc, collection } = await import('firebase/firestore');

        console.log(`開始匯入 ${records.length} 筆資料...`);

        let successCount = 0;
        let skipCount = 0;
        let errorCount = 0;

        for (const record of records) {
            // 欄位對應 - 支援多種欄位名稱格式
            const name = record['姓名'] || record['name'] || '';

            // 跳過空白行
            if (!name || name.toString().trim() === '') {
                skipCount++;
                continue;
            }

            try {
                // 解析年齡
                let age = 0;
                if (record['年齡']) {
                    age = parseInt(record['年齡'].toString());
                } else if (record['出生年月日']) {
                    const birthDate = record['出生年月日'];
                    if (birthDate) {
                        const birth = new Date(birthDate);
                        const today = new Date();
                        age = today.getFullYear() - birth.getFullYear();
                    }
                }

                // 安全字串轉換函數
                const safeString = (value: any): string => {
                    if (value === null || value === undefined) return '';
                    return String(value).trim();
                };

                // 清理和驗證資料
                const caseData = {
                    name: safeString(name),
                    gender: safeString(record['性別'] || record['gender']),
                    age: isNaN(age) || age < 0 ? 0 : Math.floor(age),
                    birthDate: formatDate(record['出生年月日'] || record['birthDate']),
                    personalId: safeString(record['身分證字號'] || record['personalId']),
                    phone: safeString(record['電話'] || record['聯絡電話'] || record['phone']),
                    address: safeString(record['地址'] || record['個案居住地址'] || record['address']),
                    status: mapStatus(safeString(record['狀態'] || record['目前狀態'] || record['status'] || 'active')),

                    // Basic Info
                    caseNumber: safeString(record['案號'] || record['caseNumber']),
                    source: safeString(record['個案來源'] || record['source']),
                    language: safeString(record['常用語言'] || record['language']),
                    education: safeString(record['個案教育程度'] || record['education']),
                    height: Number(record['身高'] || record['height']) || 0,
                    weight: Number(record['體重'] || record['weight']) || 0,

                    // Contact & Living
                    city: safeString(record['個案居住縣市'] || record['city']),
                    district: safeString(record['鄉鎮區'] || record['district']),
                    village: safeString(record['里別'] || record['village']),
                    livingStatus: safeString(record['居住狀況'] || record['livingStatus']),
                    billingAddress: safeString(record['帳單地址'] || record['billingAddress']),

                    // Identity & Welfare
                    isIndigenous: safeString(record['原住民身份'] || record['isIndigenous']),
                    indigenousTribe: safeString(record['原住民族別'] || record['indigenousTribe']),
                    welfareStatus: safeString(record['福利身份別'] || record['welfareStatus']),
                    subsidyRatio: safeString(record['補助比例(%)'] || record['補助比例'] || record['subsidyRatio']),
                    pricingCategory: safeString(record['計價類別'] || record['pricingCategory']),
                    disabilityLevel: safeString(record['障礙等級'] || record['disabilityLevel']),
                    disabilityCategoryNew: safeString(record['身障類別(新制)'] || record['disabilityCategoryNew']),
                    disabilityCategoryOld: safeString(record['身障類別(舊制)'] || record['disabilityCategoryOld']),
                    disabilityItem: safeString(record['身障項目別'] || record['disabilityItem']),
                    dementiaStatus: safeString(record['失智症手冊/CDR'] || record['是否具備身心障礙失智症手冊/證明或CDR1分以上'] || record['dementiaStatus']),
                    foreignCareOrSubsidy: record['請外勞照護或領有特照津貼'] === '是' || record['foreignCareOrSubsidy'] === true,

                    // Health
                    careLevel: safeString(record['照顧等級'] || record['CMS等級'] || record['careLevel']),
                    diseases: safeString(record['罹患疾病'] || record['diseases']),
                    diseaseHistory: safeString(record['疾病史'] || record['diseaseHistory']),
                    behaviorEmotion: safeString(record['行為與情緒'] || record['behaviorEmotion']),

                    // Caregivers
                    caregiver: safeString(record['居服員'] || record['主責居服員'] || record['caregiver']),
                    primaryCaregiver: safeString(record['主要照顧者'] || record['primaryCaregiver']),
                    primaryCaregiverRelation: safeString(record['主要照顧者關係'] || record['primaryCaregiverRelation']),
                    primaryCaregiverAge: Number(record['主要照顧者年齡'] || record['primaryCaregiverAge']) || 0,
                    secondaryCaregiver: safeString(record['次要照顧者'] || record['secondaryCaregiver']),
                    secondaryCaregiverRelation: safeString(record['次要照顧者關係'] || record['secondaryCaregiverRelation']),

                    // Proxy
                    proxy: safeString(record['代理人'] || record['proxy']),
                    proxyPhone: safeString(record['代理人電話'] || record['proxyPhone']),
                    proxyMobile: safeString(record['代理人手機號碼'] || record['proxyMobile']),

                    // Service Team
                    supervisor: safeString(record['主責督導'] || record['supervisor']),
                    viceSupervisor: safeString(record['副督導'] || record['viceSupervisor']),

                    // A Unit
                    AUnitName: safeString(record['A單位名稱'] || record['AUnitName']),
                    ACaseManager: safeString(record['A個管姓名'] || record['ACaseManager']),
                    AUnitPhone: safeString(record['A單位聯絡電話'] || record['聯絡電話'] || record['AUnitPhone']), // Note: conflict with main phone? Check headers carefully
                    AUnitEmail: safeString(record['電子郵件'] || record['A單位電子郵件'] || record['AUnitEmail']),

                    // Service Admin
                    serviceTypeApplied: safeString(record['申請服務種類'] || record['serviceTypeApplied']),
                    serviceStartDate: formatDate(record['服務開始時間'] || record['serviceStartDate']),
                    suspensionDate: formatDate(record['暫停日期'] || record['suspensionDate']),
                    suspensionNotes: safeString(record['暫停備註'] || record['suspensionNotes']),
                    closingDate: formatDate(record['結案日期'] || record['closingDate']),
                    closingReason: safeString(record['結案原因'] || record['closingReason']),
                    closingNotes: safeString(record['結案備註'] || record['closingNotes']),
                    refusalCount: Number(record['拒絕次數'] || record['refusalCount']) || 0,

                    // Stats
                    lastVisit: formatDate(record['上次訪視'] || record['lastVisit']),
                    category: safeString(record['類別'] || record['category']),
                    serviceItems: safeString(record['服務項目'] || record['serviceItems']),
                    serviceCount: Number(record['服務次數'] || record['serviceCount']) || 0,
                    usageQuota: Number(record['使用額度'] || record['usageQuota']) || 0,
                    subsidyAmount: Number(record['補助金額'] || record['subsidyAmount']) || 0,
                    coPayment: Number(record['民眾負擔'] || record['coPayment']) || 0,
                    selfPayment: Number(record['自費'] || record['selfPayment']) || 0,
                    totalCost: Number(record['民眾總花費'] || record['totalCost']) || 0,
                    notes: safeString(record['備註'] || record['notes']),

                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                // 🧹 強制清理物件：透過 JSON 序列化移除所有隱藏的 undefined 或特殊物件
                // 這能解決大部份 "Invalid resource field value" 錯誤
                const cleanData = JSON.parse(JSON.stringify(caseData));

                // 寫入資料
                await addDoc(collection(db, 'cases'), cleanData);
                process.stdout.write('.'); // 進度顯示
                successCount++;

            } catch (itemError: any) {
                process.stdout.write('X');
                console.error(`\n❌ 寫入失敗: "${name}"`, itemError.code || itemError.message);
                // console.error(JSON.stringify(record, null, 2)); // 視需要開啟詳細日誌
                errorCount++;
            }
        }

        console.log('✅ 匯入程序結束');
        console.log(`成功: ${successCount} 筆`);
        if (errorCount > 0) console.log(`失敗: ${errorCount} 筆`);
        if (skipCount > 0) console.log(`跳過: ${skipCount} 筆`);
    } catch (error) {
        console.error('❌ 匯入失敗:', error);
        throw error;
    }
}

function mapStatus(status: string): 'active' | 'pending' | 'archived' {
    if (!status) return 'active';
    const s = status.toString().trim();

    if (s === '服務中' || s === 'active') return 'active';
    if (s === '暫停' || s === 'pending') return 'pending'; // Map "Suspended" to Pending
    if (s === '已結案' || s === 'archived') return 'archived';

    // Fuzzy match fallback
    if (s.includes('服務中')) return 'active';
    if (s.includes('暫停')) return 'pending';
    if (s.includes('結案')) return 'archived';

    return 'active';
}

function formatDate(dateValue: any): string {
    if (!dateValue) return new Date().toISOString().split('T')[0];

    // 處理 Excel 日期序號
    if (typeof dateValue === 'number') {
        const date = XLSX.SSF.parse_date_code(dateValue);
        return `${date.y}/${String(date.m).padStart(2, '0')}/${String(date.d).padStart(2, '0')}`;
    }

    // 處理字串日期
    return dateValue.toString();
}

// 執行匯入
const filePath = process.argv[2] || path.join(__dirname, '../data/cases.xlsx');
const sheetName = process.argv[3]; // 可選的工作表名稱

console.log(`準備從 ${filePath} 匯入資料...`);

importCasesFromExcel(filePath, sheetName)
    .then(() => {
        console.log('🎉 匯入程序完成');
        process.exit(0);
    })
    .catch((error) => {
        console.error('匯入失敗:', error);
        process.exit(1);
    });
